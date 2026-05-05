:bulb: Klarna is moving to Kustom permanently, and this change must be done before 2026-03-31.

Ever since Klarna sold its Klarna Checkout (KCO) to Kustom, there has been work going on with switching their environments.

Some, if not all, customers have been migrated over the year to use the new portal.kustom.co (previously portal.klarna.com), and at the end of March 2026 it's time to send our best wishes to the api.klarna.com domain as well as it's moving to api.kustom.co.

## What do the customer need to do
The customer needs to access their portals, and generate new credentials for the API.
Specifically they log on to https://portal.kustom.co and go to Integrations and click the `Generate New` button.
Then they will have to pass the API credentials on to the developer team.

Repeat the procedure for the Playground account.

## What do the developers need to do
### Nitro5
Update to Avensia.Nitro5.Payments.KlarnaCheckoutV3 6.1.0 and change the configuration like [this](https://github.com/avensia/nitro5/pull/845).

See [original PR](https://github.com/avensia/nitro5-packages/pull/668)

### Nitro classic
Update to Avensia.Payments.KlarnaCheckoutV3 10.9.0 and in `PaymentInitialization`, modify the call to `KlarnaCheckoutV3Initialization.InitializeKlarnaCheckout()` to provide new parameters `KlarnaCheckoutV3Endpoints.KustomEuTestBaseUrl` and `KlarnaCheckoutV3Endpoints.KustomEuProdBaseUrl`.

See [original PR](https://github.com/avensia/suite/pull/586)

These versions are backwards compatible and will by default still use the Klarna-API Url (api.klarna.com).

## References:

[Kustom Switch Guide](https://help.kustom.co/en/articles/454956-kustom-api-endpoint-switch-guide)

[Klarna news article in Swedish](https://www.klarna.com/international/press/nya-agare-ska-ta-klarna-checkout-till-nasta-niva/)