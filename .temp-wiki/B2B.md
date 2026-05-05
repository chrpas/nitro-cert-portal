## Customer unique products
You can limit specific products/variants so only specific users can see them. By default all products/variants are "public" (property `IsPublic` is true), meaning that everyone can see the products/variants. 

To restrict access to products/variants, you need to do three things:
1. Group products/variants into **product groups**, using the product group import endpoint, `api/ProductGroupImport` (or manually inserting to table `Avensia_ProductGroups`)
2. Connect customers to product groups. This can be done either by connecting **specific customers** to product groups, or by grouping customers into **organizations** and then connecting organizations to product groups. See [Customers and Organizations](https://github.com/avensia/nitro5/wiki/Customers-and-Organizations) for more info on how to add and edit customers and organizations.
3. Hide the products/variants from customers not connected to this product group. This is done by setting flag `IsPublic` to false on the products/variants (e.g. from Epi Commerce UI) 

## Customer unique prices
To add customer unique prices, you need to do two things:
1. Add customer unique prices to variants. This is done by adding prices where you specify a **PriceGroup**. You need to use the price import API endpoint `api/PriceImport` and set `PriceType="PriceGroup"` and `PriceGroup="YOUR_PRICE_GROUP"` - it's not possible to add price groups using Commerce UI.
2. Connect customers to price groups. This can be done either by connecting **specific customers** to pricegroups, or by grouping customers into **organizations** and then connecting organizations to price groups. See [Customers and Organizations](https://github.com/avensia/nitro5/wiki/Customers-and-Organizations) for more info on how to add and edit customers and organizations.

If you need to modify how promotions work with customer unique prices, see `CustomerPricePromotionRules`. 

## Realtime prices
In situations where different customers might have different prices (according to contract), there is a mechanism that allows us to resolve prices when products are viewed.

To enable realtime prices, change the logic in `ProductModelMapper.RequiresRealtimePrice()` and make to implement a dynamic data resolver for price batches. The default implementation in Nitro, `PriceBatchResolver`, resolves prices from Optimizely (taking customer unique prices into account). Here it would be appropriate to call the ERP or a custom middleware instead.

## Developer notes
* The connection between products/variants and product groups are stored in table `Avensia_ProductGroups`.
* More docs in Nitro on [Customer unique products](https://github.com/avensia/nitro/blob/develop/docs/features/customer-unique-products.md)
* More docs in Nitro on [Customer specific prices](https://github.com/avensia/nitro/blob/develop/docs/pricing.md#customer-specific-prices)
* See https://github.com/avensia/nitro/pull/375
* See https://github.com/avensia/nitro/pull/369
* See https://github.com/avensia/nitro/pull/416

