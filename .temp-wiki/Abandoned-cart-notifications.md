## From Functional spec
* Member that abandons a cart will get an abandoned cart notification email. 
* A cart is considered abandoned if it is not changed and not purchased for X days. X is configurable by web editors.
* Nitro sends 1 notification per cart.
* Members can unsubscribe from the notifications from My pages. New members are automatically subscribed.
* The email contains:
   * The five most recently added variants to cart. Each variant links to its product detail page.
   * A link to the cart. Visitor will be prompted to log in before being redirected to cart. 

## How to setup
1. Set Site settings:
   1. "**Number of days until a cart is considered 'abandoned'**" - default vaule is 0, meaning carts will be considered abandoned immediately. 
   2. "**Well known pages / Abandoned Cart Page**" - create a new page of type `Abandoned Cart Page`
2. Enable jobs:
   1. "**Find abandoned carts and enqueue for mail**" 
   2. "**Send abandoned cart emails**"
3. Verify that the html template for the email is setup correctly in SendGrid, and has the correct id in appsettings.json (`Nitro:SendGrid:AbandonedCartTemplateId`)

## Developer notes
* Job `FindAbandonedCartsJob` will find abandoned carts (by checking the modification date of the cart). It uses the Nitro queue system and enqueues abandoned carts in table `QueueAbandonedCartEmail`.
* Job `AbandonedCartEmailSenderJob` will process the queue messages queued in table `QueueAbandonedCartEmail`, add them to table `Avensia_AbandonedCarts` (which will prevent `FindAbandonedCartsJob` from finding the cart again), and if user has subsribed to abandoned cart notifications (there is a checkbox on **My pages** to subsribe/unsubscribe), send an email.
* See [nitro#444](https://github.com/avensia/nitro/pull/444)

