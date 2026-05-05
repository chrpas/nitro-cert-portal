
Misc notes on the different parts of the EpiFoundation package:

## Catalog
The **catalog** subsystem in EPiFoundaton contains one interface/service, the `IAvensiaAssociationRepository`, which extends the Optimizely `IAssociationRepository` with one method: `GetAssociationsByTarget`. It provides a way to load associations by TargetId and is used in the esales `ProductConverter` in Nitro.

## Locking
The **locking** subsystem handles generic locking of resources, and is used in Nitro to make sure that e.g. multiple jobs do not operate on the same purchase order at the same time. 

This only works as long as everyone is using the locking subsystem. So, instead of simply loading a purchase order like:
```c#
 _orderRepository.Load<IPurchaseOrder>(orderId)
```
you should load it using the locking subsystem:
```c#
using (var purchaseOrderWithLock = _lockManager.LoadWithLock(CommonLocks.ForPurchaseOrder(orderId), () => _orderRepository.Load<PurchaseOrder>(orderId)))
{
  // do stuff
}
```
When creating a lock, you need to specify a name of the lock. The `CommonLocks` class helps by creating names for the most common types of locks, for instance for purchase orders: `CommonLocks.ForPurhcaseOrder(orderId)`. It will simply return a string `PurchaseOrder_{orderId}`.

## State
The **state** subsystem can be used to look up states (regions) based on a country, using the `IStateService` (e.g. Alaska, Alabama, Arkansas.. in USA). The states are stored in table `dbo.Avensia_CountryState` in the commerce database. The table contains states for USA and Canada, but feel free to update the table depending on your project requirements.

## Inventory
Replaces Optimizely's default implementation of `IInventoryService` with our own `AvensiaInventoryService`. See [Stock & Inventory](https://github.com/avensia/nitro5/wiki/Stock-&-Inventory#iinventoryservice)

## Stock (stock reservations)


## Misc stuff in EpiFoundation

### EpiEnvironment
Use `EpiEnvironment.TryGetDxcEnvironmentType` to determine which DXP environment code is currently running in (Integration, Preprod or Production). Also see `EnvironmentHelper` in Nitro.Core (which will return null if code is not running in any of the DXP environments).


