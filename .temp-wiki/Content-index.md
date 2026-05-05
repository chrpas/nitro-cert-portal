The term "content index" in Nitro is defined as a place where we send content for fast retrieval. Sending content to that "index" is referred to
as "indexing". Nitro comes with out-of-the-box support for three types of content indexes:

- [Voyado Elevate 4](https://github.com/avensia/nitro5/wiki/Esales4) (previously known as "Esales4") 
- [Voyado Elevate 3 Enterprise](https://github.com/avensia/nitro5/wiki/Esales) (previously known as "Esales" or "Esales3")
- Optimizely Search & Navigation (previously known as "Find")

Nitro startersite/demosite uses Voyado Elevate 4.

The responsibility of the content index is:

* **Search** - all searches are executed against the content index. See https://github.com/avensia/nitro5/wiki/Search
* **Relevance/recommendations** - loading products that are relevant to the customer, sorting product listings according to relevance
* **Fast retrieval of content** - loading content directly from Episerver is somewhat slow, so we pre-calculate data and store it in the content index instead of fetching it directly from Episerver

### Relevance/recommendations
Nitro sends behavioural data to the content index, for example which products are viewed, searched for, added to cart and purchased. See implementations of `IContentIndexNotifier`. In turn, the content index gives Nitro product recommendations and sorts product listings according to relevance.

### Fast retrieval of content

It's somewhat slow to load content directly from Episerver, especially when the content isn't already loaded and placed in the Episerver cache.
But it's not only about slow loading, it's also about computing values beforehand. If we were to load a product to show to the customer and we
want to load it directly from Episerver there's a number of things we need to load. The product itself of course, but we'll probably have to load
at least one of its variants, the price of the variant(s), calculate current promotions for it, load one or more of the categories the product
is in, perhaps load the brand of the product, etc. Loading the product in itself _might_ be fast enough, but loading all of these extra things
that we also need is going to be too slow to do when the visitor is browsing the site.

Therefore, we run as much of that computation as possible when sending data to the index in the indexing jobs. By paying the computation cost
during indexing instead of when retrieving content we can serve content to the customer a lot quicker and with less resources.

When developing, always index the data instead of fetching it directly from Episerver. Both from a performance perspective but also because having the data in the index means that we can both search and filter on that data.

## Indexing content
The indexing process is split into two parts:
1. The **promo cache** - this calculates prices (and promotions) and stores the results in the `NitroPromotionCache` table
2. The **esales/find indexing** - this reads prices from the promo cache, and sends this along with all other relevant data to the content index.

For example, to do a "full index", you must start two jobs in sequence. First the `FullPromoCacheJob`, and when it's done, start the `FullEsalesIndexingJob`.

Indexing is based on the **content processing** features in **EpiFoundation** package. 

## Index models

In order to hide which type of content index Nitro uses we have a shared set of model classes such as `IndexProduct`. These are populated with data from the more low level content index models by the `EsalesModelMapper` and `FindModelMapper` model mappers.

These models doesn't just serve the purpose of hiding which content index we use, they also make it more convenient to use the index data than their
raw content index representation. A good example of that is in both `ProductFindEntity.cs` and `EsalesPartialProduct` we index product urls as
a list of strings, one string per category (since a product has one url per category it exists in). And a list of urls is less convenient to work with
than just a string since you have to know _which_ of the strings in the list to use. The model mappers are responsible for selecting which of these to use depending on the current context, and set that on the `Url` property of `IndexPartialProduct`.

The same goes for prices. Since our customers operate in multiple markets with multiple currencies, we have to index prices in all of those currencies and the raw content index models contain all those prices. But when you want to work with data from the index you're not interested in _all_ prices, you just want the price for the market in the current context. This is also managed by the model mappers.

## Partial models

We have the concept of an index model and a _partial index model_. An example is `IndexPartialProduct` and `IndexProduct`. `IndexProduct` inherits from
`IndexPartialProduct`, since the partial product is a subset of the data for the full product. An example of when this is practical is a product
listing vs a product page. On the product listing we show a subset of the product data, such as image, name and price. But on the product page
we want to display the full product information. So the `IndexPartialProduct` is used in listings whereas the `IndexProduct` is used when we need
the full data such as on the product page.

Another purpose of the partial models is to only fetch the data we need. If we want to show the category page we don't want to load the full data from the index and then discard most of it. For esales, we use [presentation attributes](https://github.com/avensia/nitro5/wiki/Esales#presentation-attributes) to only fetch the data we need. For Find, we use LINQ espressions to determine which properties to load from the index.
