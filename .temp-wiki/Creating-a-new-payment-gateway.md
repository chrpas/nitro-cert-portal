#### In this article

<sub>- [Create a package](#create-a-package)</sub><br/>
<sub>- [Create a gateway](#create-a-gateway)</sub><br/>
<sub>- [Create a viewmodel](#create-a-viewmodel)</sub><br/>
<sub>- [Create a frontend component](#create-a-frontend-component)</sub><br/>
<sub>- [Gateway parameters](#gateway-parameters)</sub><br/>
<sub>- [Complete purchase when HasBuyButton == false](#complete-purchase-when-hasbuybutton--false)</sub><br/>
<sub>- [Complete purchase when HasBuyButton == true](#complete-purchase-when-hasbuybutton--true)</sub><br/>
<sub>- [Order management](#order-management)</sub><br/>
<sub>- [PaymentCart and PaymentOrder](#paymentcart-and-paymentorder)</sub><br/>
<sub>- [Pending payments](#pending-payments)</sub><br/>
<sub>-[How to get correct language on callbacks from PSPs](#how-to-get-correct-language-on-callbacks-from-psps)</sub><br/>

## Create a package
First thing is to create a new package in nitro5-packages for your payment gateway. More on this in [How to create a new Nitro5-package](https://github.com/avensia/nitro5/wiki/Creating-a-new-Nitro5-package)

## Create a gateway
Then create a class for your gateway in your package. It should inherit from `AvensiaPaymentGatewayBase` and implement `IAvensiaPaymentGateway`. This base class provides dummy implementatons for the methods that are required for all payment gateways in Episerver. (Note however that these methods are not used by the payment infrastructure in nitro, but are still required by Episerver).


## Create a viewmodel

Create a viewmodel class in your package. It should inherit from the abstract `PaymentMethod` (in EpiFoundation), in its simplest form it could look something like this:

```c#
public class AvardaPaymentMethodViewModel : PaymentMethod
{
}
```

Implement the `GetPaymentMethodViewModels()` method in your gateway and return an instance of your viewmodel. 

You can modify the behaviour of your gateway by setting these properties on the viewmodel before returning it in `GetPaymentMethodViewModels()`:

- `HasBuyButton` - Whether your gateway provides its own "Complete purchase" button. If this is true, the "complete purchase" button on Checkout page will be hidden. And essentially, this will decide which "complete purchase" flow your gateway will use, more on this below.
- `HasAddressInput` - Whether your gateway provides an input where the customer can enter their address. If this is true, the address input section on Checkout page will be hidden.
- `HasShippingMethodSelection` - Whether your gateway provides the possibility for the customer to select shipping options. If this is true, the shipping method section on Checkout page will be hidden.


## Create a frontend component 

Create a frontend component for your viewmodel (e.g. in `Avensia.Common/Features/Checkout/PaymentMethod/YourPSP/YourPSPaymentMethod.tsx`) in nitro (or your customer project), including the `@ComponentFor` pragma. In its simplest form, it could look something like this:

```js
/**
 * @ComponentFor Avensia.Nitro5.Payments.Avarda.Models.AvardaPaymentMethodViewModel
 */
import React from 'react';
import PaymentMethodBase from '../PaymentMethodBase';

export default function (props: AvensiaCheckout.PaymentMethod) {
  return <PaymentMethodBase {...props}></PaymentMethodBase>;
}
```
This will render your payment method as one of the options in the radiobutton list of payment options on checkout page (assuming that you also add an instance of your gateway e.g using Country Admin).

### Interactive gateway
If your gateway will display some kind of user input (like a widget provided by the PSP), you are creating an "interactive gateway" and you should create a frontend component `index.tsx` in your package and export a component:
```js
export const AvardaPaymentComponent = ({
   // ...
}: AvardaPaymentComponentProps) => {
    // ...
    return <div id={ROOT_ELEMENT_ID} />;
};
```
Add logic as necessary to display the PSP's widget etc.

> Note: The interface `IInteractivePaymentGateway` is obsolete in nitro5 and repaced by creating a frontend component in the package, you should still implement `IAvensiaPaymentGateway`

You also need to export your viewmodel. You can install [tstypegen](https://github.com/avensia/nitro5/wiki/tstypegen) and let tstypegen generate a `*.d.ts` file including your viewmodel, or you can simply "hard code" the viewmodel in your `index.tsx`, like:
```js
export interface AvardaPaymentMethodViewModel
  extends AvensiaCheckout.PaymentMethod {
     // all properties goes here... 
  }
```

Then update your component in nitro so it displays the component from your package, something like:
```js
/**
 * @ComponentFor Avensia.Nitro5.Payments.Avarda.Model.AvardaPaymentMethodViewModel
 */
import React from 'react';
import PaymentMethodBase from '../PaymentMethodBase';

import {
  AvardaPaymentMethodViewModel,
  AvardaPaymentComponent,
} from '@avensia/nitro5-payments-avarda';

export default function (props: AvardaPaymentMethodViewModel) {
  return (
    <PaymentMethodBase {...props}>
      <AvardaPaymentComponent paymentMethod={props} />
    </PaymentMethodBase>
  );
}
```

Lastly, remember to update your package's `buildsystem/index.ts` so it builds an npm package in addition to your nuget package (see https://github.com/avensia/nitro5/wiki/How-to-create-a-new-Nitro5-package).



## Gateway parameters
If you need any settings on your gateway, which value could differ between each instance of your gateway, you should use gateway parameters. These parameters can be edited either in the Commerce UI or in Nitro Tools Country Admin (and also included in `countries.json`).

Implement `GetAvailableParameters()` in your gateway, like so:

```c#

IReadOnlyCollection<EpiFoundation.Payments.PaymentMethodParameter> IAvensiaPaymentGateway.GetAvailableParameters()
{
   return new[]
   {
      new EpiFoundation.Payments.PaymentMethodParameter(MyConstants.UseB2B, "Use B2B", typeof(bool))
   };
}
```

To use the value, you can use extension method `GetStringParam(MyConstants.UseB2B)` of `PaymentMethodRow`.


## Complete purchase when HasBuyButton == false
This is the standard complete purchase flow:

1. Customer clicks on "Complete purchase" button on Checkout page
2. A `POST` is made to the `CompletePurchase()` action in `CheckoutPageController`, which will call `CompletePurchaseAsync()` method in `ICheckoutService`.
3. Cart is converted to a purchase order (assuming all updates and validations succeed).
4. The `HandleInitial()` method of the payment method that customer selected is called. The purpose of the `HandleInitial()` method is to create an **initial payment transaction** during order creation and then return the next step for the customer.
5. Depending on the result of `HandleInitial()`, customer will be sent to order confirmation, to a page hosted by the PSP or back to checkout with an error message.


### HandleInitial
The purpose of the `HandleInitial()` method is to create an **initial payment transaction** during order creation and then return the next step for the customer.

The most common scenario in `HandleInitial()` is to make an initial request to the PSP, and if that request is successful, add a payment transaction with status "Processed" on the order. 

Sending this initial request to the PSP usually means sending a list of line items to the PSP. Note that you should use the `PaymentOrder` parameter of `HandleInitial()` instead of the `PurchaseOrder` parameter whenever possible to get this kind of data - more on this below. 

#### The initial payment transaction
To add a transaction on the order:
```c#
orderForm.Payments.Add(new Payment(...));
```

For the initial transaction, you face three decisions:
1. Which **`Payment` class** to use for your transaction. You can use one of the concrete implementations of the abstract base `Payment` class from Episerver for your transactions (e.g. `OtherPayment`), or you can create your own custom payment class for your gateway. Add a custom payment class if you need any custom data on your payment transaction (an example can be found in `KlarnaCheckoutV3Payment`). Note that if you need any payment gateway specific properties, it is recommended to add these to a custom payment class, instead of adding it to e.g. the order form, since that would bloat all orders also those that does not use this gateway. 
2. Which **transaction type** to use for your transaction, See enum `Mediachase.Commerce.Orders.TransactionType`. Use `Authorize` if you want to reserve money now, but will wait to transfer any money until order has been shipped. Use `CaptureOnly` if you want to transfer money now. 
3. Which **status** to use on the payment transaction, usually `Processed`. Set status to `Pending` if the initial request to PSP is in a pending state (you made the request but the PSP has not yet confirmed that payment was successful). 

#### Next step for the customer
Your implementation of `HandleInitial()` needs to return the next step for the customer, see enum `InitialPaymentResultAction`.

Possible next steps:

- **Failed**: choose this if something failed during `HandleInitial`. The purchase order that was created will be cancelled and customer will be sent back to checkout page with an error message. 
- **NoAction**: choose this if payment is to be considered "complete" and you just need to send customer to order confirmation page. Cart will be deleted.
- **Redirect**: choose this if you need to send customer to a page hosted by the PSP to complete the payment. The PSP will redirect the customer back to your site when payment is complete, see more on "the callback controller" below.
- **PostForm**: (Not used by any gateway)
- **NeedsClientProcessing**: (Not used by any gateway)

### The callback controller
If your `HandleInitial()` method returns either `Redirect` or `PostForm`, you need to supply the PSP with an url that the PSP can redirect the user back to when the payment has been completed (see more below in section "Creating callback controller URLs" on this). So you need to create a controller that the PSP can redirect the customer back to. This controller is usually referred to as a "callback controller" but it is technically not different from any other controller. 

To help you with your callback controller, there is an interface `IPaymentGatewayCallback` you can use. 

If **everything is successful at the PSP**, the callback controller should:
1. Use `IPaymentGatewayCallback` to save the purchase order (see methods `SavePurchaseOrderAfterPaymentsProcessed()` and `GetOrderConfirmationUrlAndPrepareForRedirect()`)
2. Return a 302 redirect to order confirmation page. 

If **payment fails at the PSP**, the callback controller should:  
1. Redirect user back to checkout page with a proper error message (see methods `GetUnexpectedErrorMessage()` and `GetCheckoutPageUrlForCurrentRequest()`)

## Complete purchase when HasBuyButton == true
If HasBuyButton is true, the standard "Complete purchase" button on Checkout page will be hidden. There won't be any call to `CompletePurchase()` action on `CheckoutPageController` and your gateway's `HandleInitial()` method will never be called. You can just return `NoAction` from `HandleInitial()`.

Usually the PSP will do a callback back to your site when purchase is completed, so you need to supply the PSP with an url that the PSP can use when the payment has been completed (see more below in section "Creating callback controller URLs" on this). 

To help you with your callback controller, there are interfaces `IPaymentGatewayCallback` and `IInteractivePaymentGatewayCallback` you can use. 

If **everything is successful at the PSP**, the callback controller should:
1. Validate the cart by calling `ValidateAndPrepareCartForCheckout()` method in `IInteractivePaymentGatewayCallback`
2. Create a purchase order from the cart by calling `ConvertCartToPurchaseOrder()` method in `IInteractivePaymentGatewayCallback`
3. Add a payment transaction (see more above about the initial payment transaction)
4. Possibly also add an order note about what just happened
5. Get url to order confirmation page by calling `GetOrderConfirmationUrlAndPrepareForRedirect` in `IPaymentGatewayCallback`
6. Save the purchase order by calling `SavePurchaseOrderAfterPaymentsProcessed()` in `IPaymentGatewayCallback`
7. Return a 302 Redirect to order confirmation page

If **payment fails at the PSP**, the callback controller should:
1. Redirect user back to checkout page with a proper error message by using methods `GetUnexpectedErrorMessage()` and `GetCheckoutPageUrlForCurrentRequest()` in `IPaymentGatewayCallback`

## Creating callback controller URLs
To create the URL to send to the PSP, use `GetCallbackActionAbsoluteUrl()` in `IPaymentGatewayCallback`, like:
```c#
_callback.GetCallbackActionAbsoluteUrl(
   nameof(AvardaCallbackController),
   nameof(AvardaCallbackController.PaymentRequestCallbackFallback),
   isForServerToServerCommunucation: true,
   new Dictionary<string, string>
   {
      ["orderId"] = orderId
   });
```                
Note that you should set parameter `isForServerToServerCommunucation` to `true` for all URLs that will be accessed from a third party (you can set it to `false` if you use this method to generate URLs used by your own frontend component). Setting it to `true` will enable you to use ngrok to debug these callback calls locally - more on this in [Using ngrok](https://github.com/avensia/nitro5/wiki/Using-ngrok).


## Order management
Whenever an order has an update that might affect the PSP, the payment processor will call your gateway's `HandleOrderUpdate()` method. This could be because the order was shipped (partly or fully delivered), customer has returned the order or customer services added a rebate in Order admin (also known as "order adjustment"). 

You need to implement the `HandleOrderUpdate()` method covering all these scenarios, for instance handling the capture of money when order is shipped as well as refunding money if order was returned by customer. 

Use existing payment gateways as inspiratation and mimic their flow.

Add payment transactions to your purchase order whenever there is any kind of transaction with the PSP going on. This could be:
- A `Capture` transaction if order is now shipped (and you did an `Authorize` when order was created)
- A `Credit` transaction (with a negative amount) if customer has returned the order or for any other reason will be getting a refund of money from the PSP
- An `Authorize` transaction (with a negative amount) is fully delivered but you authorized more than you ended up delivering

Note that you should use the `PaymentOrder` parameter instead of the `PurchaseOrder` whenever possible - see more on this below. 

## PaymentCart and PaymentOrder
The `HandleInitial()` and `HandleOrderUpdate()` methods has, apart from the `PurchaseOrder` parameter also a parameter of type `PaymentOrder`. The `PaymentOrder` is a version of the purchase order specifically prepared for communicating with PSPs, hence usually easier to work with in payment gateways. So you should avoid using the `PurchaseOrder` parameter and when possible instead use the `PaymentOrder` parameter. 

Likewise, in your callback controllers, you should not operate directly on the Episerver cart, but instead request a `PaymentCart` using the `GetPaymentCart()` method in `IInteractivePaymentGatewayCallback`. 

In conclusion: Whenever you need to send e.g. a list of order items to the PSP, use the line items in `PaymentCart` or `PaymentOrder` instead of fetching the data from the `PurchaseOrder` or `Cart`!

The payment order and the payment cart is created by the `PaymentOrderFactory` in nitro. 

## Pending payments
If you ever add a payment transaction with status "Pending" to your purchase order, you should probably also register a "next polling date", so that the `ProcessPendingPaymentsJob` will process your order.

1. Use the `RegisterPaymentPolling()` extension method `PurchaseOrderExtensions` to register a date/time when to poll for updates.
2. Implement the `PollForUpdateOnPendingPayments()` method in your gateway. Here you should communicate with the PSP and possibly update the payment transaction's status to either Successful or Failed. Note that you do not need to save the purchase order after updating your transaction - the `ProcessPendingPaymentsJob` will call the `SavePurchaseOrderAfterPaymentsProcessed()` method for you.


## How to get correct language on callbacks from PSPs
1. Exclude the callback url from `LanguageAndMarketMiddleware` (e.g. `/klarnacheckoutv3callback`)
2. Include the `?lang` param in all callback urls
3. In `GetCheckoutPageUrlForCurrentRequest` in your `CheckoutServiceSiteSpecificCallback`, fetch the lang param from current http context and use it to fetch checkout page on correct language.
4. In `GetErrorMessage` in your `CheckoutServiceSiteSpecificCallback`, use the culture and siteId params to fetch error message for correct language.