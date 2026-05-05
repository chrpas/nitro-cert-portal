Dynamic Data (DD) is a framework-supported concept for handling asynchronous, cacheable, and batch-resolvable data in frontend-backend communication, aiming at improving performance and user exerperience, while providing a simple API for developers.

## Background
The idea for the Dynamic Data concept was born from a number of use cases that Scope didn't really have a good answer for:

1. Communicating back and forth between frontend and backend. Such as a block component that paginates results and needs to request filtered block data from the backend. Or a block that should periodically refresh it's data.
2. Minimizing content that we load upfront, but still make it discoverable for the frontend. An example is the main menu which often contains a lot of data that we don't display on initial load.
3. Enable backend caching by separating static/unpersonalized data from dynamic/personalized data. If an object contains 99% static/unpersonalized data and 1% dynamic/personalized data it becomes 100% uncachable.

All of these use cases was possible to solve, but you had to do it in your own ad-hoc, custom way. You'd get no support from Scope in solving this.

If you only have this need in one place on the entire site it might be more trouble than it's worth to use Dynamic Data, it might be more straight forward to implement a custom solution.

But if these situations and use cases keeps coming up it's worth using Dynamic Data for them. Dynamic Data comes with a number of benefits:

1. Static typing. If you remove the cart from app shell data because you want app shell data to be cachable, you still have a `cart` property on app shell data which points the frontend to where to load the users cart. It gives you discoverability and the frontend doesn't have to know anything about how to actually fetch the cart, it just does `await (resolveData(appShellData.cart)).items;` instead of `appShellData.cart.items`.
2. Caching. When you call `resolveData()` we'll cache that data in the browser cache. You're in control when you want to refresh it.
3. Batching. If your startpage consists of five blocks that all need to resolve dynamic data we'll gather those requests into a single HTTP request. That is, if you call `resolveData()` five times synchronously we'll batch those five calls into a single request.
4. Support from the framework. Instead of having to think about caching, batching and HTTP communication that's all setup for you.

# The basics

A good example is the cart on app shell data. The biggest reasons for using Dynamic Data for the cart is:

1. Don't make the initial load time depend on how fast we can load the cart
2. Making the initial load cachable
3. Since we don't show the content of the cart on initial load it's a good idea to not include it in the first response

The way to do it is to open your `AppShellData.cs` file and replace this:

```c#
public CartViewModel Cart { get; set; }
```

with:

```c#
public DynamicData<CartViewModel> Cart { get; set; }
```

and in `AppShellDataFactory.cs` replace this:

```c#
appShellData.Cart = _cartViewModelFactory.CreateMinicart(_cartService);
```

with:

```c#
appShellData.Cart = new DynamicData<CartViewModel>(DynamicDataResolveMode.Auto);
```

The arguments you pass here are the resolve mode, which tells Scope to either automatically resolve the data as soon as we run into it, or if you want to resolve it manually. The second argument is a preload version of the data. You shouldn't both set `Auto` as resolve mode _and_ set a preloaded version, since that'll trigger the same data to be loaded twice.

You now need to register a so called data resolver for that dynamic data. Create a class like this:

```c#
public class CartDataResolver : DynamicDataResolverBase<CartViewModel, JToken>
{
    private readonly CartViewModelFactory _cartViewModelFactory;
    private readonly ICartService _cartService;

    public CartDataResolver(CartViewModelFactory cartViewModelFactory, ICartService cartService)
    {
        _cartViewModelFactory = cartViewModelFactory;
        _cartService = cartService;
    }

    public override Task<CartViewModel> ResolveAsync(JToken context)
    {
        return Task.FromResult(_cartViewModelFactory.CreateMinicart(_cartService));
    }
}
```

and register it like this in StructureMap:

```c#
c.For<IDynamicDataResolver<CartViewModel>>().Use<CartDataResolver>();
```

If you update your TS types and then run a frontend typecheck you'll see that you get some type errors. That's because `DynamicData<CartViewModel>` and `CartViewModel` aren't the same. You'll need to go over these individually and determine what the best option is. In the case of the cart, what you should do is:

1. Initialize the Redux state with `appShellData.cart.preloaded` or an empty instead of `appShellData.cart`. The preloaded cart is a hard coded empty cart, but that's good enough for the initial load.
2. In `browser-entry.tsx` do:

```js
const cart = await resolveData(appShellData.cart);
const cartAction: CartAction = { cart, type: CART_LOAD_SUCCESS };
store.dispatch(cartAction);
```

This will update the cart state once we get the real cart data.

## Error handling

If you call `resolveData()` yourself that returns a promise, and you need to handle rejections of that promise. If you use the `<DynamicData />` component there's an `onError` prop which can be implemented like this:

```js
<DynamicData
  data={someData}
  onError={retry => (
    <div>
      An error occured!<button onClick={() => retry()}>Retry</button>
    </div>
  )}
>
  {d => <p>...</p>}
</DynamicData>
```

## Batch resolving

In some cases you want to send out multiple Dynamic Data objects of the same type and resolve them in one single batch instead of resolving them one by one. An example is where each product gets a Dynamic Data object representing the price, and you want to batch all price lookups into a single call to your price service.

In that case you can extend the `DynamicDataBatchResolverBase` class instead of the `DynamicDataResolverBase` class. This lets you resolve multiple objects of the same type in one method call. An example:

```cs
public class PriceDynamicDataResolver : DynamicDataBatchResolverBase<Price, JToken>
{
    public override async Task<IList<Price>> ResolveAsync(IList<JToken> contexts)
    {
        var skuNumbers = contexts.Select(c => c.ToObject<string>()).ToList();
        // The price service must return prices in the same order as in the list of SKUs passed to it
        var prices = await _priceService.GetPrices(skuNumbers);

        // If you can't know which order the price service returns, you need to ensure the same order like this:
        prices = prices.OrderBy(price => skuNumbers.IndexOf(price.SkuNumber)).ToList();

        return prices;
    }
}

// In your configuration:
container.Configure(c =>
{
    c.For<IDynamicDataBatchResolver<Price>>().Use<PriceDynamicDataResolver>();
});
```

_Note!_ It's _incredibly_ important that the list you return has the same positions as the values that comes into the context list. So the first SKU in the context list should be the first in the list of prices, and the last SKU in the context list should be the last in the list of prices, etc. The position in the list is how we know which context matches which value.

## Using Dynamic Data for product recommendations

Another example is replacing the product recommendations on the product page to use Dynamic Data.

The first step is to replace this:

```c#
public IList<ProductListItemViewModel> Recommendations { get; set; }
```

in your product page view model with this:

```c#
public DynamicData<ProductPageRecommendations> Recommendations { get; set; }
```

and add a class called `ProductPageRecommendations` like this:

```c#
public class ProductPageRecommendations
{
    public IList<ProductListItemViewModel> Products { get; set; }
}
```

Just like for the cart you need to register a data resolver for it. It would look something like this:

```c#
public class ProductPageRecommendationsViewModelContext
{
    public string ProductKey { get; set; }
}

public class ProductPageRecommendationsDataResolver : DynamicDataResolverBase<ProductPageRecommendationsViewModel, ProductPageRecommendationsViewModelContext>
{
    private readonly EsalesService _esalesService;

    public ProductPageRecommendationsDataResolver(EsalesService esalesService)
    {
        _esalesService = esalesService;
    }

    public override Task<ProductPageRecommendationsViewModel> ResolveAsync(ProductPageRecommendationsViewModelContext context)
    {
        var viewModel = new ProductPageRecommendationsViewModel();
        var recommendationZone = _esalesService.ExecuteProductPageRecommendations(context.ProductKey);
        viewModel.Products = Mapper.Map<List<ProductListItemViewModel>>(recommendationZone.Recommendations);
        return Task.FromResult(viewModel);
    }
}
```

Your product page view model factory would be changed from this:

```c#
Recommendations = Mapper.Map<List<ProductListItemViewModel>>(productPageZone.Recommendations),
```

to:

```c#
Recommendations = new DynamicData<ProductPageRecommendationsViewModel>(new ProductPageRecommendationsViewModelContext { ProductKey = esalesProduct.ProductKey })
```

Now we introduced the context part of Dynamic Data. A context is just additional information that is needed to resolve the data. For the cart we don't need a context, we just load the cart. We don't need additional details. But when it comes to the product page we need to pass in which product to recommend based on.

By setting the context in the factory like the above, the frontend can just call `resolveData()` and doesn't have to know anything more than that. If you didn't pass the context in the factory the frontend would have to construct the context. Something like this:

```js
import { resolveData, createDataContext } from '@avensia/scope';
import RecommendationsContextType from './ProductPageRecommendationsViewModelContext.type';
const context: RecommendationsContextType = {
  productKey: props.productKey,
};
const recommendationContext = createDataContext(props.recommendations, context);
const products = await resolveData(recommendationContext).products;
```

You should include the context in the backend to make it easier for the frontend, but it's intended for the frontend to be able to create a context like this since the data might need to be resolved based on user input, like showing recommendations based on which product you click on. You chould of course pass out one Dynamic Data property per product with a prepopulated context, but it's not required.

In order to render the recommendations you don't have to use local state in your component to determine when the recommendations have loaded. Instead you can use the `DynamicData` component from Scope like this:

```js
<DynamicData data={recommendations} fallback={<LoadingProductCardList />}>
  {recs => <ProductCardList products={recs.products} />}
</DynamicData>
```

This will render `<ProductCardList />` once the products are loaded, and render `<LoadingProductCardList />` until they've loaded. The `<DynamicData />` component deals with data fetching, cachning and batching for you.

Try to make sure that `<LoadingProductCardList />` renders product cards very similar to real products to get the best user experience. It should feel like the real data just fades into already existing product cards.

If you don't want to split the rendering into a `<ProductCardList />` and `<LoadingProductCardList />` you can use the `fallbackData` prop instead, like this:

```js
<DynamicData
  data={recommendations}
  fallbackData={{
    products: [
      { name: 'My product', price: 100 },
      { name: 'My other product', price: 200 },
    ],
  }}
>
  {recs => <ProductCardList products={recs.products} />}
</DynamicData>
```

This will render `<ProductCardList products={recs.products} />` even if we don't have any data, either cached or from the server. Instead the first render will use the data passed to `fallbackData`.

# A note about `Preloaded`

The `Preloaded` property exists for a couple of reasons. You might have different use cases for the same type of data where in some cases it's important for it to load as fast as possible, and in other cases it's fine for it to load later. The `Preloaded` property lets us have both of those cases without having to work with the data in different ways depending on use case.

In the frontend you shouldn't directly access the `preloaded` property unless you know what you are doing. Instead you should be using `resolveData()`, `resolveDataSync()` or `<DynamicData />`. The reason being that what's in `preloaded` won't automatically change.

If you in one part of the application do this:

```js
onClick() {
  alert('You have ' + appShellData.cart.preloaded.items.length + ' items in your cart!');
}
```

and in some other part of the application you do:

```js
addToCart(code: string) {
  sendAddToCartRequest(code);
  invalidateAndResolveData(appShellData.cart);
}
```

By using the `preloaded` property in the first example you'll always only get that version of the cart. When the cart is later updated the new version of the cart will be stored in the Dynamic Data cache, but not on the `preloaded`. So the `alert` will result in an old version of the cart. If you do like this instead:

```js
async onClick() {
  alert('You have ' + await resolveData(appShellData.cart).items.length + ' items in your cart!');
}
```

You'll always get the correct result. In this case `resolveData()` is going to return the `preloaded` value unless we have a newer one.

# Implementing an auto refreshing block

The first thing to do is to create the block. Once you have a block, a React component that renders the block, and a block controller it's time to define what data should be presented to the user. It could be anything but let's take the latest reviews as an example.

Start by defining a class that will represent the latest reviews, something like:

```c#
[GenerateTypeScriptDefinition]
public class LatestReviewsViewModel
{
    public IList<ReviewViewModel> Reviews { get; set; }
}
```

And a data resolver for it, something like:

```c#
public class LatestReviewsDataResolver : DynamicDataResolverBase<LatestReviewsViewModel, JToken>
{
    private readonly IReviewsService _reviewService;

    public LatestReviewsDataResolver(IReviewsService reviewsService)
    {
        _reviewService = reviewService;
    }

    public override Task<LatestReviewsViewModel> ResolveAsync(JToken context)
    {
        return _reviewService.GetLatestAsync();
    }
}
```

Once you've added `LatestReviewsViewModel` to your block view model you'll set it in the block controller like this:

```c#
blockViewModel.LatestReviews = new DynamicData<LatestReviewsViewModel>(DynamicDataResolveMode.Manual, _latestReviewsDataResolver.Resolve());
```

Here we use the data resolver to set preloaded data to include in the initial response. If you use output caching and have a relatively low cache time it can be better for the user experience to include data to render immediately than to always have to resolve it asynchronously.

Now it's time to render the data. We use `<DynamicData />` just like before, but we also set up an interval to refresh the data:

```js
componentDidMount() {
  this.refreshInterval = setInterval(() => {
    resolveData(this.props.latestReviews);
  });
}
componentWillUnmount() {
  clearInterval(this.refreshInterval);
}
render() {
  return (
    <DynamicData data={this.props.latestReviews} fallback={<LoadingReviewList />}>
      {r => (
        <ReviewList reviews={r.reviews} />
      )}
    </DynamicData>
  );
}
```

Note that `<DynamicData />` itself keeps track of when data updates. It will trigger a re-render without the need for local state in the component or force an update. The cool thing about that is also that you can render the same dynamic data in multiple places and update it some other place and that'll trigger a re-render everywhere that it's rendered. Note that it only happens if you use `<DynamicData />` though. If you render a value you got from `resolveData()` or `resolveDataSync()` you'll have to manage changes/updates yourself.