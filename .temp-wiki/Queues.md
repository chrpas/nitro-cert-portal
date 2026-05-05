The queue system in nitro is part of the [Avensia.Nitro5.Jobs](https://github.com/avensia/nitro5-packages/tree/develop/packages/jobs) package.

Queues enable us to process things asynchronously. This helps us ensure availability and scalability. 

A good example of when you want to process things asynchronously is a welcome email. When the user signs up we don't want to send that email as part of the signup process because the email could fail and we don't want that to stop the sign up.

Queues also help with error handling, since it's possible to retry processing of queue messages.

A queue is a list of queue messages. Some examples of queues in Nitro are the order export, the reset password email, price import and stock import.

All queues are registered during initialization in `QueuesInitialization`. Queues are stored in the Commerce database, one table per queue. The idempotent migration `CreateAllQueues` will create database tables for all queues, naming them using the queue name registered in `QueuesInitialization` prefixed with "Queue".

## Queues admin UI
You can see the state of the queues in the Queues admin UI by clicking on `Nitro Tools` and then `Overview`. That will list all queues and show how many messages the queues have. You can also click on the queues to see more details about the messages that are in the error state with the possibility to retry them.

## How to enqueue messages
> Use the `Enqueue` method in `IEnqueuer` to queue messages. Like so:
```cs
_enqueuer.Enqueue(message);
```

## Processing of the queues

Queues should always be processed by a [background job](https://github.com/avensia/nitro5/wiki/Jobs), never in any code executed in the site. 

### Processing one at a time or in batches
Nitro can either process one queue message at a time, or process messages in batches. 

**Processing one message at a time** is the most common approach. It's done by using a job that inherits from `QueueProcessingJobBase`.

**Processing messages in batches** can be done for efficiency reasons. It's done by using a job that inherits from `QueueBatchProcessingJobBase`, and specifying the ``batchSize`` (= number of messages in each call to ``ProcessBatch()`` method) when calling base constructor. An example is the price import queue, instead of asking Episerver to find every single variant one by one, we ask Episerver to find all variants in the current batch, which is a lot more efficient. 

### Processing all or only the most recent message
Nitro can either process all messages in the queue, or only process the most recent message for a specific id.

The first alternative is to have Nitro process **all the queue messages**. In this case, the order in which the messages are processed is somewhat irrelevant, for example it's ok that processing for some messages fail, they will simply retry later. This means that the processing might not be strictly chronological. An example of this is the internal email queue. Each queue message represents an email that should be sent internally and could be about an order that's broken and needs to be manually fixed. If two emails are queued with the same subject, body and address it's still likely that you want to send both emails because it'll signal that whatever went wrong happened more than once. For this alternative, the `MessageId` property of the `IQueueMessage` returns null, meaning no grouping by id will be made, all messages are considered unique.

The other alternative is to have Nitro process **only the most recent queue message** for a specific id. If a new message is added to the queue with the same id that is already in the queue, the new message will replace the old one. An example of this is the price import queue, where only the most recent price update for a specific variant is relevant to import. We should ignore the previous price updates for the same variant, partly because the import of the previous price update is unnecessary and its more efficient to ignore it, but also because there is a risk that some price updates otherwise end up in the error state and overwrites a newer price value when retried. For this alternative, you need to implement the `MessageId` property of the `IQueueMessage`, since the grouping of messages by id will be done using the `MessageId` property. Almost all queues in Nitro implements the `MessageId` property.

### The backoff
The jobs that process queues will by default process all messages in the queue in a single run. If there's one million rows in the queue table then the job will process all of those messages and won't exit until the queue is empty. But processing this many rows can be heavy on the resources (database resources, CPU, network, etc) so there's a builtin backoff, where the processing will be dividided into iterations and the job will sleep for a number of seconds before it continues processing again (see `SqlServerBackedQueue`). The default ``iterationSize`` is 100, but you can configure this when registering your queue in ``CommonInitialization``. Nitro will fetch ``iterationSize`` number messages from the queue, process these (possibly in batches if you chose to implement it as a batch job), then fetch the next `iterationSize` messages and process these. For every 10th iteration the job will sleep for 1 second locally, 5 seconds on Integration and Preprod, and 30 seconds in Production. 

> Note: A common confusion is about the difference between ``batchSize`` and ``iterationSize``:
> - ``batchSize`` is the number of messages you will receive in each call to ProcesBatch() method. ``batchSize`` is configured in your job (as a parameter to the base constructor).
> - ``iterationSize`` is the number of messages that the queue job will fetch in the SELECT from the queue table. Your queue job will do 10 iterations (= fetch `iterationSize` number of messages and process these) before sleeping X seconds. ``iterationSize`` is configured when registering your queue in ``CommonInitialization``.

### Request processing of a message immediately after adding to the queue
The jobs that process the queues are scheduled to run according to a specified schedule, for instance once every minute or every hour (see [Nitro5 onboarding: Jobs](https://github.com/avensia/nitro5/wiki/Jobs))

In some cases you want to start the processing of the queue immediately after adding a message to the queue. An example is any type of emails like reset password or order confirmation. For those types of scenarios you can send a request to the jobs service to start the job immediately, instead of waiting for the next scheduled start. 

> Use the `processImmediately` boolean parameter of the `Enqueue` method in `IEnqueuer` to signal that you want to start processing of the queue immediately. 

Like so:
```cs
_enqueuer.Enqueue(message, processImmediately: true);
```

This will send a message to the Nitro job scheduler to start the job immediately (on the scheduler instance). 

## Monitoring of queues
When a queue message has been in the error state for too long, the `InternalEmailStaleQueueErrorNotifier` will send an internal email about it, so someone can make sure that all messages are handled. 

How long errors linger in the error state before the warning email is sent is defined per queue in `QueuesInitialization`.


## How to create a queue
When you create a new queue you don't create a new queue class, you just define a queue message class. The reason being that all queues work the same way and the only difference is the data they hold, and that's where the queue message comes in.

1. Create a new class that implements `IQueueMessage`. Specifically, implement the `MessageId` property (see below).
2. Register your queue in `QueuesInitialization` (see below).
3. Run migrations, so that the idempotent migration `CreateAllQueues` creates a database table for your new queue.
4. Enqueue messages using the `Enqueue` method of `IEnqueuer`
3. Create a new job that processes your queue messages (see below)

### How to implement the MessageId property
If all messages in your queue are unique and should be processed, simply let the `MessageId` property return null:

```cs
public class MyQueueMessage : IQueueMessage
{
    public List<string> MessageId => null;
}
```

If you want to group the messages by some id, and process only the most recent queue message for a specific id, you need to implement the `MessageId` property. The id should be generated by the queue message class itself and not be set from the outside. Its value should be a combination of other properties that the queue message holds.

An example is the `StockQuantityQueueMessage` which looks like this:

```cs
public class StockQuantityQueueMessage : IQueueMessage
{
    public string SkuNumber { get; set; }
    public string Warehouse { get; set; }
    public int Quantity { get; set; }

    public List<string> MessageId => new List<string> { SkuNumber, Warehouse };
}
```

Its message id is composed of the SKU number and the warehouse. If we get two messages with the same SKU number and warehouse we want to consolidate them into one message.

Keep in mind that some properties might serialize differently depending on the culture of the executing thread, such as DateTime values. Be sure to serialize them using the same culture regardless if the thread culture is running in en-US or sv-SE, for example using `CultureInfo.InvariantCulture`.

> Use `CultureInfo.InvariantCulture` when converting a DateTime to a string in the `MessageId` property  

### How to register a queue
All queues are registered in `QueuesInitialization`. Like so:
```cs
services.AddSqlServerQueue<StockQuantityQueueMessage>("StockImport", "Stock import", TimeSpan.FromDays(14), iterationSize: 1000);
```
During registration you can specify these parameters:
* `queueName` - the internal name of queue, will be used as table name in database (prefixed with "Queue")
* `descriptiveName` - the descriptive name of the queue, will be used in the Queues admin UI
* `timeInErrorStateBeforeWarning` - how long messages stay in error state before the monitoring will send an internal email about it
* `iterationSize` - the number of messages to process in each iteration before backoff


### How to process the queue one message at a time

How to create a job that processes a queue one queue message at a time:

1. Create a new class that inherits from `QueueProcessingJobBase` and override the `Process` method, like so:
    ```cs
    public class MyQueueProcessorJob : QueueProcessingJobBase<MyQueueMessage>
    {
        public MyQueueProcessorJob(IQueue<MyQueueMessage> queue) : base(queue)
        {
        }

        protected override ProcessingResult Process(MyQueueMessage message)
        {
            // Add actual processing of message here
            return ProcessingResult.Ok();
        }
    }
    ```
    `QueueProcessingJobBase` inherits from `AbstractQueueProcessingJobBase`, which has the base implementation of the queue processing.
2. Return a `ProcessingResult` from the processor, using one of the following:
    * `ProcessingResult.Ok()` if processing was successfull, the message will get removed from the queue.
    * `ProcessingResult.Error()` if an error happened, the message will be placed in an error state.
    * `ProcessingResult.RetryAt()` to schedule a retry, for example if the processing relies on an external system that could be temporarily unavailable. By default we allow 10 retries, but you can pass an argument if you want a different max count.
3. Note that the `QueueProcessingJobBase` will catch exceptions in the `Process` method and put the queue message in an error state. You should not add any try-catch inside the processor, unless you want to take specific action if something fails. In that case you should most likely still return `ProcessingResult.Error()` since the message will otherwise disappear.
4. Apart from above, follow general instructions on [How to create a job](https://github.com/avensia/nitro5/wiki/Jobs) (e.g. set a default scheduling).

### How to process a queue in batches
If you want to process your queue in batches, inherit from `QueueBatchProcessingJobBase` instead, set the `BatchSize` to a number greater than `1` and override the `ProcessBatch` method, like so:

```cs
public class MyQueueProcessorJob : QueueBatchProcessingJobBase<MyQueueMessage>
{
    public MyQueueProcessorJob(IQueue<MyQueueMessage> queue) : base(queue, 50)
    {
    }

    protected override ProcessBatch(List<MyQueueMessage> messages, CancellationToken cancellationToken, Action<MyQueueMessage, ProcessingResult> reporter)
    {
        foreach (var message in messages)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                // Add actual processing of message here
            }
            catch (Exception e)
            {
                reporter(message, ProcessingResult.Error(e));
            }
        }
    }
}
```

### Initialization before starting processing

The base classes for queue processing has virtual methods called `Initialize`/`InitializeAsync` and `Cleanup`/`CleanupAsync` (see `AbstractQueueProcessingJobBase`). These gets called at the start and end of processing the queue, if there is something to process in the queue. You can override these and implement your own logic. This is a good place to call any data sources that are expensive that you don't want to call once for each queue message inside the processor. 

## Retry processing of queue messages
You can programatically retry processing of queue messages using the `RetryIfExists` method in `IQueue`).

This is useful for example when you import prices or stock on SKUs and you might get the price and stock messages from the ERP before you get the actual SKU from PIM. That'll cause the stock and price messages to be in an error state. Once a SKU is created in Episerver we can retry messages. You can see an example of this in `ItemTransformer`), like so:

```cs
_stockQueue.RetryIfExists(skuNumber);
```

In some cases you want to retry messages but you don't have the full id. In the case of stock import the `MessageId` is composed of SKU number and warehouse, but you can retry just by SKU number, which will retry messages for all warehouses for this SKU. This is why `MessageId` is a list of strings, and not just a string. To retry for a specific warehouse you would do:

```cs
_stockQueue.RetryIfExists(new List<string> {skuNumber, wareHouseCode});
```

