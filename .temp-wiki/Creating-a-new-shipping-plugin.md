## How to implement a new shipping plugin

1. Create a new package (use namespace `Avensia.Nitro5.Shipping.*`)
2. Create a viewmodel class which inherits from `ShippingMethod` in EpiFoundation
3. Create a frontend component (in the package) that renders the shipping widget.
4. Create a corresponding frontend component in the site with a `@Component.For`  your viewmodel, that renders the component in your package. This frontend component should use the checkout action `setShippingMethodId()` when it is rendered to set the id of this shipping plugin as the selected shipping method id (nitro shipping plugins assumes that checkout page only renders one single shipping plugin)
5. Implement `INitroShippingPlugin`, with methods:
   - `GetShippingMethodViewModel()` which should return an instance of your new viewmodel (this method is not async and you should not do any external calls here - more on this below)
   - `ApplyAdditional()` which should store data from your frontend component on the cart (see more below on this)
   - `IsAvailable()` should return true if the widget should be available on checkout page. If the TSP is temporarily unavailable, you can return false here and checkout will display any non-plugin shipping methods you have enabled instead.
   - `ValidateAndPrepareCartForCheckoutAsync()` which should validate that shipping has been correctly selected and customer can continue to complete purchase. This is async so you are allowed to make external calls if you need to.
   - `FinalizeCompletedPurchaseAsync()` which is called after cart has been converted to purchase order. Here you can finalize the shipping session ("book" the actual shipment at the TSP).



### The viewmodel
The `GetShippingMethodViewModel()` is called every time checkout is updated, so this method is **not async** because you should not do any external calls here. The recommended approach is instead to add a "callback url" property to your viewmodel, and have your frontend component call this endpoint to get data async from the TSP when it it initialises. 

When you create your viewmodel you need to:
- Set property `HasAddressForm` to true if your plugin contains a form where customer enters her address. 
- Set the price properties `PriceInclVat`, `PriceExclVat`, `OriginalPriceInclVat` and `OriginalPriceExclVat `. There is an extension method `SetPrices()` on `ShippingMethod` which sets all four price properties in one go. 

### Storing data on the cart
You'll probably want to store some data on the cart - e.g. a session id, the shipping cost etc. However, you should **never** call `cart.Save()` yourself in backend. It can be tempting to e.g. store the session id on the cart when the session is created and then save the cart, but this will not work very well. All updates of the cart must come from frontend, so we recommend passing the session id on to frontend, and have your frontend component store it on the cart by using checkout's action `setShippingPluginAdditionalData()`. This will trigger a call to the `ApplyAdditional()` method of INitroShippingPlugin where you can set data on the cart. This will ensure both frontend and backend "agree" on the cart data and that the cart is saved in the correct way and frontend updated accordingly.