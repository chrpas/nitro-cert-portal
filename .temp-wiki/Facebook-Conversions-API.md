Implementation of **Facebook Conversions API** is done in Nitro using the [Facebook Conversions API](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/facebook-conversionsapi) package in nitro5-packages.

Event data that is sent to Facebok is collected in [FacebookEventNotifier](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Tracking/Facebook/FacebookEventNotifier.cs). User data that is sent to Facebook is collected in [FacebookEventUserDataFactory](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Tracking/Facebook/FacebookEventUserDataFactory.cs). To format phonenumbers correctly in the format Facebook accepts, Nitro uses 3rd party library [libphonenumber-csharp](https://www.nuget.org/packages/libphonenumber-csharp/).

## De-duplication with Facebook Pixel
For optimal ad performance, Facebook recommends that the Conversions API is implemented alongside the Facebook Pixel. This is called a "redundant setup", meaning events will be sent to Facebook both from the client using the Pixel and from server using the Conversions API. This is to ensure that the events reach Facebook even though the client might have blocked client-side tracking. 

In order to get correct statistics, Facebook needs to be able to identify which events are unqiue and which are duplicates (sent both from client and server). This is called de-duplication. We do this by sending an identical **event id** for both client and server events. 

If Facebook sees similar events within 5 minutes difference, Facebook will keep the client events and ignore the server events. This can be good to keep in mind, if you send more data with your server event  than you do client-side, that server data will be discarded in favour of the client data.

Read more about de-duplication:
* [Facebook docs on Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
* [Docs on the CAPI/Pixel deduplication in nitro5-packages](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/packages/facebook-conversionsapi/FACEBOOK_PIXEL.md)

## Single or multi account mode

The default mode of this package is to use the same Facebook account settings for all sites and markets. You can enable multi account mode if you want to use different Facebook accounts for different sites/markets:

1. Add `<add key="FacebookConversionsApiAccountType" value="market" />` to `commonConfiguration.config`
2. Pass the site id and market id to the various functions of `FacebookConversionsApiService`

## Events
The package in Suite supports sending notifications for any standard or custom event available in the API from Facebook. See full list of events available in API from Facebook here: https://developers.facebook.com/docs/facebook-pixel/reference#standard-events.

Nitro implements a subset of all available events in the API from Facebook, see below.  Feel free to implement more events in your project! 

Some events are initiated client-side, in [Features/TrackingInformation/index.tsx](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/TrackingInformation/index.tsx):

* **AddToCart** ("value" sent is the price of added variant multiplied by added quantity)
* **AddToWishlist** ("value" sent is the price of added product)
* **InitiateCheckout** ("value" sent is sum of items in cart)
* **PageView**

For the events that are initated client-side, the client is creating the de-duplication event id, and sends this to the [FacebookEventController](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Tracking/Facebook/FacebookEventController.cs) which will do the server-side notification to Facebook. The client also pushes the same event id to the datalayer.

Some events are initated server-side:

* **ViewContent** is initated in `CategoryController`, `ProductListingPageController`, `ProductController` and `BrandController`. 
* **Search** is initated in `SearchPageController`
* **CompleteRegistration** is initated in `NewsletterController` and the `RegisterController`
* **Purchase** is initated in `OrderConfirmationPageController` (Why is it not in `OrderFlowService]` like we do for the GTM server-side orderconfirmation tracking you might wonder? Because we need the de-duplication event id in the client). "value" sent is sum of items in cart.

For the events that are initated server-side, the server creates the de-duplication event id, and sends this to the client in the view model.

## Admin UI
There is an admin tool (see Nitro Tools / Settings / Facebook Conversions API) which enables you to:

* enable/disable the API (feature will be default disabled after installation of package in Suite, make sure to enable it!)
* set Facebook access token/pixel id
* enable/disable specific events to send
* enable/disable user data properties to send
* enable/disable test-mode

## Read more
Also see docs in nitro5-packages: [Facebook Conversions API package](https://github.com/avensia/nitro5-packages/tree/develop/packages/facebook-conversionsapi) 