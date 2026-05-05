Visitors can subscribe to **Back in stock notifications** for variants that are out of stock but product is not yet discontinued. Visitors supply their e-mail address. For logged in members, e-mail address is prefilled in form.
* 
## How to setup
1. Enable job **[Nitro] Send back in stock emails**
2. Verify that the html template for the email is setup correctly in SendGrid, and has the correct id in `appsettings.json` (`Nitro:SendGrid:BackInStockTemplateId`)

## Sending email when change is "significant"
When variant is back in stock, **Back in stock notification emails** are sent to all subscribed e-mail addresses.  

The default behaviour in startersite is to send emails when purchase available quantity goes from 0 to at least 1. This logic is in `MonitorBackInStockEventListener` and you can modify this if your customer wants a different definition of when a inventory update is "significant enough" to cause back-in-stock emails to be sent.

Note: This is not to be confused with change tracking of inventory, which also has a concept of "significant enough", see [Indexing when inventory is updated](https://github.com/avensia/nitro5/wiki/Stock-&-Inventory#indexing-when-inventory-is-updated)


## Developer notes
* When visitor signs up for monitoring of a specific variant, a row is added to table `Avensia_BackInStockMonitoring`
* When inventory is updated, if the inventory change is "significant", `MonitorBackInStockEventListener` will:
   1. Enqueue notifications in table `QueueBackInStockNotification`
   2. Delete corresponding rows from table `Avensia_BackInStockMonitoring`. 
* Job `SendBackInStockNotificationJob` processes queued messages from table `QueueBackInStockNotification`
* See [Stock & Inventory](https://github.com/avensia/nitro5/wiki/Stock-&-Inventory) on how to update stock manually in backoffice. Set the "default warehouse" to quantity=0 to set a variant to "out of stock". 
* The invokation of `MonitorBackInStockEventListener` is handled by `AvensiaInventoryService` in package `EpiFoundation`