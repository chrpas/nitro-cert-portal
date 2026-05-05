In order to be able to query elements in the DOM we have added a base setup of test-ids. This list can always be expanded by the project. The attribute we are using for these is `data-test-id`.



### Query element from test-id
If you want to query any element from a test-id you use the following for example to query the minicart button element

**Single element, the first element with the id found**
```javascript
document.querySelector('[data-test-id="minicart-button"]')
```

**A list of elements. In this case the list only have one element but some test-ids occur multiple times on the same page**
```javascript
document.querySelectorAll('[data-test-id="minicart-button"]')
```


## List of all test-ids in nitro5
```console
checkout-page

mypages-link
product-link

open-login-button
forgot-password-button
login-button
login-failed-element
login-email-input
login-password-input

register-button
register-failed-element
register-email-input
register-password-input
register-accept-terms-input

minicart-button
increase-quantity-button
decrease-quantity-button
quantity-input
minicart-element
minicart-item-element
remove-minicart-item-button

complete-purchase-button
select-shipping-method-input
select-payment-method-input

variant-selector-element
add-to-cart-button
open-monitor-back-in-stock-button
monitor-back-in-email-input
monitor-back-in-stock-button
toggle-wishlist-item-button

productlist-sorting-dropdow
```

## Read more
- https://github.com/avensia/nitro/pull/385
