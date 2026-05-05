Esales4 is the default [Content index](https://github.com/avensia/nitro5/wiki/Content-index) in nitro5 (since 2023-03).

## Clusters
Nitro5 is using the **E4 Nitro cluster** with each environment represented by two markets:
- SWE-Development and USA-Development (dev.nitro5.com)
- SWE-Integration and USA-Integration (nitro5-integration.avensia.com)
- SWE-Preprod and USA-Preprod (nitro5-preprod.avensia.com)
- SWE-Production and USA-Production (nitro5-demo.avensia.com)

## Markets and languages
A **market** in Esales4 is a container for products, variants, content, and behavioral statistics.

See [list of supported locales in Elevate 4](https://docs.apptus.com/elevate/4/integration/data-feed/format-specification/?h=market#supported-locales)

Also note that Esales4 supports max 5 languages per market.

Markets are resolved using `IContentIndexMarketProvider` that can have different implementations. Nitro comes with 4 standard market providers: `EsalesMarketProvider`, `OneMarketPerLanguageMarketProvider`, `OneMarketPerEnvironmentAndLanguageMarketProvider` and `SingleMarketProvider`.

> Note: `IContentIndexMarketProvider` changed in https://github.com/avensia/nitro5-packages/pull/499 because multisite-support was implemented for Esales4: https://github.com/avensia/nitro5/pull/465. Scenarios below has not yet been updated, you can know base your Elevate markets also on epi site (not only market and language).

### Scenario 1: One market, one language
Supported by Nitro

### Scenario 2: One market, multiple languages
Example: an "international" market containing France and Germany (that is, the french and german languages).

Supported by Nitro

### Scenario 3: Multiple markets, one language per market
Supported by Nitro 

### Scenario 4: Multiple markets, multiple languages per market
Supported by Nitro but requires a custom market provider implementation.

## Known limitations
Currently (2023-03-21) known limitations of the esales4 implementation in nitro5:
- Not implemented yet: related products on PDP, sitemap, Google feed, 

Known limitations of esales4:
- Max 5 languages per market
- Recommendations do not work unless there are some orders in the market

## Gotchas
**Displaying more than 1 product image on PLP**: Change the "Hover effect" setting inside E4 to "Show image gallery on hover"  + set the "Gallery size", otherwise you will always only get one image.

**"Everything" that you index is publicly available!**: There is no api key in use in the storefront api (which we use to load data for `product-page` for example). This means that if you know the cluster id you can get all information that we have indexed for a product, with the exception of `cost` and maybe some other fields. There is no list of which fields are being excluded from `product-page` even if they are indexed, so you'll have to compare the fields you send in the import feed to the ones you actually get back in the `product-page` request. Everything you add as custom properties are exposed. So please don't add sensitive data to Elevate4! 

## Read more

- [Content index](https://github.com/avensia/nitro5/wiki/Content-index)
