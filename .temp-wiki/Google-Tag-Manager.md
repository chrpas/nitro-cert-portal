## From Func spec
* Basic implementation of **GTM Enhanced Ecommerce** 
* **Google Analytics 4** (GA4) as well as **Google Universal Analytics** (until its end of life, 1st July 2023).

## Google Analytics
Nitro has implementations of both **Google Universal Analytics** (the old GA) as well as **Google Analytics 4** (GA4). These can coexist and Nitro pushes both GUA and GA4 events to the dataLayer.

The following GA4 events are tracked:
* `view_item`
* `add_to_cart`
* `add_to_wishlist`
* `remove_from_cart`
* `view_cart`
* `begin_checkout`
* `add_shipping_info`
* `add_payment_info`
* `purchase`

If you are using [Facebook Conversions API](https://github.com/avensia/nitro5/wiki/Facebook-Conversions-API) together with GUA/GA4, then add the `facebookEventId` to the GA4 events as well as the GUA. However the customer should only map data from either the GUA or the GA4 event to Facebook. 

## Developer notes
* See https://github.com/avensia/nitro/pull/776
* See https://github.com/avensia/nitro/pull/778
* See https://github.com/avensia/nitro/pull/794
* GA implementation guide (this is implemented in Nitro OOTB): [Nitro-ga-enhanced-ecommerce.pptx](https://github.com/avensia/nitro5/files/9926511/Nitro-ga-enhanced-ecommerce.pptx)
* The dataLayer events: [GA4_r2 excite_nitro.pptx](https://github.com/avensia/nitro5/files/9926512/GA4_r2.excite_nitro.pptx)

## Read more
* [GA4 events reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
* [Google Support: How to set up and install Tag Manager](https://support.google.com/tagmanager/answer/6103696?hl=en)

