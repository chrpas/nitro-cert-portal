The **content processing** concept in Nitro (EpiFoundation) consists of three subsystems that work together:
- <a href="#processing-engine">Processing engine</a>
- <a href="#change-tracking">Change tracking</a>
- <a href="#dependency-tracking">Dependency tracking</a>

## Processing engine
All content processing jobs are based on the `ContentProcessingJob` and `ContentProcessingEngine` classes in EpiFoundation to process content.

Built-in content processing jobs in Nitro:

- Promo cache (`FullPromoCacheJob`, `IncrementalPromoCacheJob`, `CustomPromoCacheJob`)
- esales indexing (`FullEsalesIndexJob`, `IncrementalEsalesIndexJob`, `CustomEsalesIndexJob`)
- esales4 indexing (`FullEsales4IndexJob`, `IncrementalEsales4IndexJob`, `CustomEsales4IndexJob`)
- Find indexing (`FullFindIndexJob`, `IncrementalFindIndexJob`, `CustomFindIndexJob`)
- Redirector (`FullContentUrlBuilderJob`, `IncrementalContentUrlBuilderJob`)

> Read more about how [content index](https://github.com/avensia/nitro5/wiki/Content-index) works.

You can also implement your own custom content processing job.

There are three _types_ of content processing jobs:

- **Full processing** will process all content in the system (either by using Episerver API to get all content, or in later versions of EpiFoundation using SQL to select all content).

- **Incremental processing** will process only changed content since job last's execution. And this is the tricky part, how to know which content has changed? For this, we use the **change tracking** and **dependency tracking** subsystems.

- **Custom processing** will process only specific entities, that you supply as parameter to the job. This is useful during debugging and developing.


## Change tracking
The change tracking subsystem tracks changes in the system, by listening to Episerver events that are raised when content is modified. It uses the `Nitro_PendingChanges` table to store a log of all changes. For example, when you publish a content page in Epi CMS UI, a row will be added to the `Nitro_PendingChanges` table with columns `TimeUtc` set to `Now()`, `ChangeType` set to `"Data"` and `ContentId` set to the specific content id. 

There are 9 different`**change types** defined in EpiFoundation:
* **Data** - is written when content is created or updated (see `ChangeTrackingCatalogEventListener` and `ChangeTrackingContentEventListener`)
* **Children**, **RelationsParents**, **RelationsChildren** - is written when catalog nodes or content is moved or deleted
* **Association**, **AssociationsByTarget** - is written when associations are created or updated
* **Pricing** - is written when prices are updated (see `ChangeTrackingPriceEventListener`)
* **Inventory** - is written when inventory is updated (see `ChangeTrackingInventoryEventHandler`)
* **Promotions** - is written when promotions are updated (see `ChangeTrackingContentEventListener`)

Nitro adds 2 more change types:
* **PromotionCache** - is written when the promo cache job discovers that the price for a variant has changed (either because it simply got a new price, or because it was included or exluded in a campaign that modifies the price - see `PromotionEvaluationCache`).
* **ProductGroups** - is written when product groups are updated (see `ProductGroupsService`)

You can also add custom change types if you are developing a new content processing job, they are just string constants (see static class `ChangeTypes`). 

You can think of the `Nitro_PendingChanges` table as a log table of all changes in the system that are relevant for the incremental content processing jobs. The **incremental jobs** use the `Nitro_PendingChanges` table to find content that **has changed since last execution of the job**. Note that the incremental jobs won't delete any rows from this table, since there are multiple jobs listening to the same changes. The naming of `Nitro_PendingChanges` table is therefore a bit unfortunate - it is not really changes that are _pending_, it's simply a log of _all_ changes. Job `DeleteOldChangeTrackingDataJob` will delete rows older than 7 days from the table (see param `timeToKeepChanges` in `AddChangeTracking`) and should be scheduled to run weekly at least. 



## Dependency tracking
The change tracking system is pretty straightforward, it simply stores all changes in system so that the incremental jobs can process these changes. Now, reality is as bit more complex than this. First of all, not all processing jobs are interested in all kinds of changes. The redirector jobs are for example completely uninterested in price updates, since a price update will not cause an URL to change. But more importantly, if a promotion is updated, it is not enough to process the promotion that was updated, we also need to process all variants included in this promotion, and also the variants that previously were included in the promotion but became excluded by this update. For this, we use the **dependency tracking** subsystem.

When the full processing jobs run, they will track **dependencies between the content it is currently processing and all other content that it fetches during processing of that entity**. So for example, when processing a promotion, it will fetch all content that is included in this promotion, and register dependencies between the promotion and the content included in the promotion. Dependencies are always of a specific type, meaning they are connected to a specific change type. So in our example with the promotion, it will register a dependency of type `"Promotion"`. Because of these dependencies, next time a change of type `"Promotion"` is tracked by the change tracking system, the incremental job will not only process the content that had the `"Promotion"` change tracked, but also process the variants that are registered as `"Promotion"` dependencies to that promotion.

While all processing jobs share a single `Pending_Changes` table for the change tracking, each processing job has its own table for dependency tracking. It's usually called `*_Dependencies`, so we have e.g. `ESales_Dependencies` table for esales indexing and `ARContentUrls_Dependencies` table for the redirector. 

This registration of dependencies might seem like magic. For example, have you seen any registrations of dependencies in the converters for the esales indexing? The converters simply use `IContentRepository` to get content it depends on, so where is this registration of dependencies hidden? The "magic" here is a technique called "the decorator pattern". Using the decorator pattern, we are replacing some of EPi's built-in services (like the `IContentRepository`) with our own services (like `DependencyTrackingContentRepository`) during initialization:
```c#
services.Decorate<IContentRepository, DependencyTrackingContentRepository>();
```
If you debug e.g. the converters in the esales indexing, you´ll now notice that when the converter uses `IContentRepository`, it is actually using an instance of `DependencyTrackingContentRepository`.

Our `DependencyTrackingContentRepository` does exacly what the built-in default implementation of `IContentRepository` does, except that it also tracks dependencies. This is achieved by using the default implementation from Epi internally in `DependencyTrackingContentRepository`, so don't worry - we are not replacing Epis default implementation, we are only adding logic on top of it. Like:
```c#
public T Get<T>(ContentReference contentLink) where T : IContentData
{
  var result = _inner.Get<T>(contentLink);
  RegisterDependency(result);
  return result;
}
```
One thing to note is that we are doing something "unorthodox" here: in a Get*-method, we are not only getting stuff, we are also writing stuff to database. The writing to database is however queued/batched and happens after the processing of content is done.

This decoration of classes is of course global, so everywhere where `IContentRepository` is referenced, it will in fact use `DependencyTrackingContentRepository` instead. But only the content processing jobs should register dependencies. This is achieved by letting the content processing job set dependency tracking as **active** for a specific content when it starts to process that content, leaving it inactive for all other usages (see method `ProcessContent` in `ProcessingContentEngine`). So when registering a dependency, first check if the tracking is active, see for example how `ProductGroupsService` registers dependencies:
```c#
if (_dependencyTracker.IsTrackingActive)
{
   foreach (var productOrVariation in productsOrVariations)
      _dependencyTracker.RegisterDependency(productOrVariation, "ProductGroups");
}
```


The dependency tracking decorates the following classes from Epi: `IPromotionEngine`, `IContentLoader`, `IContentRepository`, `IAssociationRepository`, `IRelationRepository`, `IPriceService`, `IPriceDetailService` and `IInventoryService`.

### Time dependency tracking
There is a second type of dependency tracking: time dependency tracking. This is simply registering a specific point in time when a content should be re-processed by the incremental job. This is done using the `RegisterTimeDependency` method of `IDependencyTracker`, for example when a price is updated we do this in `DependencyTrackingPriceDetailService`:
```c#
_dependencyTracker.RegisterTimeDependency(value.ValidFrom);
if (value.ValidUntil.HasValue)
  _dependencyTracker.RegisterTimeDependency(value.ValidUntil.Value);
```

Each processing job has its own table for time dependencies, it's usually called `*_ReindexTimes`, so we have e.g. `ESales_ReindexTimes` table for esales indexing and `ARContentUrls_ReindexTimes` table for the redirector. 

When a row from the `*ReindexTimes` table has been processed, it will be deleted. 

## Summing it up - what the incremental jobs process


To sum it up, the incremental content processing jobs process:
1. All rows from the `Nitro_PendingChanges` table with change type `Data` registered since last time the job run successfully 
2. Plus rows from its `*_ReindexTimes` table where `TimeUtc` is in the past 
3. Plus rows from its `*_Dependencies` table, joining it with the `Nitro_PendingChanges` table on change type (where change is registered since last time job run successfully).

Some things to note here:

1. When an incremental job has executed successfully, it stores the datetime of this last execution in table `Avensia_ContentProcessingJobs`. You'll find for instance one value for when the incremental promo cache job last run and one value for when the incremental esales indexing job was last run. This value is used in the next execution of the job, to decide which rows from the `Nitro_PendingChanges` table to process.

2. All incremental jobs always process changes of type `Data`, which means that when you publish a variant all incremental jobs will react and process this change. So if you are unlucky, the esales indexing will pick up this `Data` change before the promo cache picks it up, and then the same content will be processed first by esales indexing, then by promo cache, and then again by esales indexing if the promo cache registered a `PromoCache` change for the content.

3. The content processings job never queries any specific change type explicitly. For example, the promo cache job never query `"Pricing"` changes anywhere in code. Instead it joins between its dependency table and the `Nitro_PendingChanges` table. The only hard-coded change type that the jobs process are `Data` changes, which all incremental jobs always processes. 

4. You need to run the full processing job at least one time initially, to populate the `*_Dependencies` and `*_ReindexTimes` tables. Otherwise there will be no dependencies registered and the incremental job will react on `Data` changes but nothing else. 

