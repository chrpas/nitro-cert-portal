> Note: "stock" and "inventory" are often used interchangeably

## How to manually set stock for a variant
1. Find the variant in Epi Commerce Catalog UI
2. Go to tab **Inventory**
3. Click "**Edit inventory**" in the bottom of the page
4. Update the inventory! 
5. (No need to publish the variant - stock is updated immediately)
5. Run incremental index

## Stock API endpoint
There is an API endpoint to update stock, `api/stockimport`. See the [Integration specification](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Documents.aspx) and docs on [Integrations in Nitro](https://github.com/avensia/nitro/blob/develop/docs/INTEGRATIONS.md) on how to use Postman to test API endpoints.

1. Use Postman to send request to `api/stockimport`
2. Run `StockImportJob`
3. Run incremental index

## IInventoryService
There is an **Inventory subsystem** in EpiFoundation package, which replaces Optimizely's default implementation of `IInventoryService` with our own `AvensiaInventoryService`. This uses the same database table as Optimizely's implementation (`dbo.InventoryService`) but adds the following features:
1. Reliable events - you can listen to the `InventoryUpdated` event in `IAvensiaInventoryEventHandler` (see for example `MonitorBackInStockEventListener`)
2. Transaction safety - it takes proper locks to ensure that if two customers try to purchase the last item of a product (through `IInventoryService.Request`) at the same time, only one of the requests will succeed (using the Optimizely `TransactionScope`).

## Indexing when inventory is updated
The change tracking subsystem of `EpiFoundation` will track when inventory is updated, if the change of inventory is _significant_. The exact logic for when a change is considered significant can be changed by the project. This logic lives in [SiteSpecificChangeTrackingService](https://github.com/avensia/nitro5/blob/develop/src/Avensia.Common/Stock/SiteSpecificChangeTrackingService.cs).

> This is not to be confused with whether the inventory is "significant enough" for sending back-in-stock emails, see [Sending back-in-stock email when change is significant](https://github.com/avensia/nitro5/wiki/Back-in-stock-notifications#sending-email-when-change-is-significant)

## Features related to stock
- [Back in stock notifications](https://github.com/avensia/nitro5/wiki/Back-in-stock-notifications)
