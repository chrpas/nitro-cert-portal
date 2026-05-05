You can use Nitro **Feature Toggles** to enable/disable features either **globally** on the site, or enable/disable features on a specific **site** or a specific **market**.

The toggles can either be readonly (as in hardcoded in code) or editable by editors in the admin UI in Nitro Tools. All toggles are listed in the admin UI with a description and a list of the values (e.g. the current value for each site for site specific toggles).

<img src="https://github.com/user-attachments/assets/2a03f086-5695-4a5f-9b65-5f00bff37054" />

## How to add a new feature toggle

1. Startersite uses the `NitroFeatureToggles` enum. Add a new value for your feature in this enum.
2. Initialize your new toggle in `RegisterFeatureToggles()` in `FeatureTogglesInitialization`. You need to decide:
   1. If your toggle should be a **global** toggle (enabled or disabled in the entire solution), **site specific** (enabled on one site but disabled on another site), market specific (enabled on one market but disabled on another market), or site-and-market specific (enabled on a specific market on a specific site).
   2. If it should be possible to enable/disable the feature using the Admin UI or not
   3. The global default/initial value (if toggle should initially be enabled or disabled) and any site/market specific deviations to this.
    
Example (which enables discount codes on all sites except NitroX):
```c#
_featureToggleService.RegisterFeatureToggle(NitroFeatureToggles.CheckoutDiscountCodes,
   FeatureToggleType.SiteSpecific,
   allowEditorsToUpdateValue: false, 
   initialValue: true, // Default enabled on all sites...
   "Enables customer to enter discount codes on checkout page");
_featureToggleService.RegisterSiteSpecificInitialValue(NitroFeatureToggles.CheckoutDiscountCodes, "NitroX", true); // ... but disabled on NitroX
```

## How to check if a feature is enabled

To check value of a feature toggle in **backend**:

1. Inject an instance of `IFeatureToggleService<T>` where T is your enum (in startersite it's `IFeatureToggleService<NitroFeatureToggles>`).
2. Use the `IsEnabled()` method:
   - For global toggles: use the `IsEnabled()` overload without any parameters. 
   - For site/market/site-and-market specific toggles: use the `IsEnabled()` overload with the corresponding parameters (`siteId` and/or `marketId`).
   - Note! If you use the incorrect overload, you'll get an error logged informing you of your error and your feature toggle will be considered **disabled** until you use the correct overload.

Example:
```
 if (_featureToggleService.IsEnabled(NitroFeatureToggles.CheckoutDiscountCodes, siteId))
 {
     // Do stuff with discount codes
 }
```

In **frontend** you have all feature toggles in appshell data (assuming you are in startersite or that your project has followed the setup guide in https://github.com/avensia/nitro5-packages/tree/develop/packages/feature-toggles). You can use the `FeatureToggle.tsx` component to display stuff only if the feature is enabled. First `import FeatureToggler from 'FeatureToggles/FeatureToggler'` and then use it like:

```ts
<FeatureToggler featureName="checkoutDiscountCodes">
  <span>Discount form stuff goes here</span> 
</FeatureToggler>
```

If you want the value in a variable instead, you can `import { useIsFeatureToggleEnabled } from 'FeatureToggles/is-enabled'` and use it like:

```ts
const displayDiscountCodeForm = useIsFeatureToggleEnabled('checkoutDiscountCodes');
```

## Read more
More details on how to use Feature toggles: https://github.com/avensia/nitro5-packages/tree/develop/packages/feature-toggles