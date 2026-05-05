When you need to localize strings, you have two main options. You can either:
1. Add **string properties** on your CMS pages or blocks. This gives editors the opportunity to edit strings using on-page-editing, and this approach works well for phrases that only exists on one page. It is however less suited for phrases that are shared between pages.
2. Use **XML files** for translations. This centralizes the translations into one place: the Nitro Localization admin. It also enables customer to send a list of all of their phrases to an external company to do the translations. One disadvantage of using XML files is that all translations are added to the app shell data, which means that the more strings you have, the heavier the app shell data object will get.

## Using string properties on CMS pages/blocks
For an example, see the `CompletePurchaseText` property on [CheckoutPage](https://github.com/avensia/nitro/blob/5ae06d16528d0a1087e80f5892f5c7ca2edf88f0/src/Avensia.Common/Features/Checkout/CheckoutPage/CheckoutPage.cs#L60):

```c#
[CultureSpecific]
[Display(
  Name = "Button to complete a purchase",
  Description = "Text inside the button to complete a purchase",
  GroupName = SystemTabNames.Content,
  Order = 110)]
public virtual string CompletePurchaseText { get; set; }
```
...which is rendered on [CheckoutPage.tsx](https://github.com/avensia/nitro/blob/5ae06d16528d0a1087e80f5892f5c7ca2edf88f0/src/Avensia.Common/Features/Checkout/CheckoutPage/CheckoutPage.tsx#L278) using the `<EpiProperty>` component:

```tsx
<EpiProperty component="span" for={props.content.completePurchaseText} />
```

## Using XML files
This uses Episerver's [localization service](https://world.optimizely.com/documentation/developer-guides/CMS/globalization/Localization-service/).

Default values of all localizations are set in the XML files, but editors can override these values by the Nitro Localization admin tool, which is included in the `Avensia.Nitro5.Localization` package.
	
Localizations are stored in the `lang` folder of `Avensia.Shop`, there is one language file for each site language, e.g. `shop_en-US.xml` for `en-US` and `shop_sv-SE.xml` for `sv-SE`.

Translations in the language files are synced to database table `Avensia_Localization` by the idempotent migration `SyncLocalizationStrings`. The default mode of this migration is that it only adds **new** strings in the XML files to the database, it wont update already existing strings in database as we do not want to overwrite any translations editors have made in the localication UI. Locally, you can choose to let `SyncLocalizationStrings` use the `UpdateAll` mode instead which means it will replace all translations in database with the values in the XML files every time the migration runs (and as it is an idempotent migration, this means every time migrations are run). The startersite uses this setting locally, as it is often useful during development.

### How to add new translation 
1. Add value in all lang XML files in `Avensia.Shop/lang` - or you can use `nitro add-translation` to automatically add value to all your language files (and translate it using Google Translate), see https://github.com/avensia/nitro5-packages/pull/294
2. Run `nitro frontend:build` to generate a new `assets/language-keys.json` (which will ensure your new translation is included in APP_SHELL_DATA) and a new `TranslatedKeys.d.ts` (which will ensure intellisense in frontend will find your new translation).
2. Run migrations. This will run the `SyncLocalizationStrings` migration and add your new strings to database table `Avensia_Localization`, which will enable editors to change your default translation using Localization admin.

### How to change existing translations
Locally, if the `SyncLocalizationStrings` runs in `UpdateAll` mode: update your translation in the XML files and run migrations.

In DXP, if you need to change an already existing translation that has been synced to the database in a prior deploy, you can either:
- Manually update the value using the Localization admin tool (remember to do it for all your environments + sites), or...
- Update your XML files, delete the value from database table and run migration again, or...
- Create a migration that uses method `UpdateByKeyAsync()` in `IAvensiaLocalizationService` to update the value in database. 

To reset all translations to their default value, do a `TRUNCATE TABLE [Avensia_Localization]` and then a `nitro run-migrations`. 

### How to use translations in backend
Use the `GetStringByCulture` method in Episerver's `LocalizationService`, and pass a CultureInfo object as language parameter:
```c#
var resetPasswordString = _localizationService.GetStringByCulture("/Email/ResetPassword/ResetPasswordSubject", language);
```

### How to use translations in frontend
To display a translated string in frontend, you can either use the `translate()` function or the `Translate` component. Both of these are defined in [Translate.tsx](https://github.com/avensia/nitro5-packages/blob/develop/packages/scope/src/Avensia.Nitro5.Scope/Translate.tsx) in Scope:

```tsx
import {translate} from '@avensia/nitro5-scope/translate';
const translatedValue = translate('/Some/Path/To/Xml/Value');`
<Translate phrase="/Some/Path/To/Xml/Value" />;
```

### Only translations used in frontend are sent in AppShell
During `nitro frontend:build`  the file `assets/language-keys.json` is created, by a custom built webpack plugin. This file contains all the keys used by the frontend. This file is read by `LanguageStrings.cs` in backend, causing only the keys used in frontend to be included in the AppShell. The benefit from this is that we won't bloat frontend with translations that are unused or only used by backend.

This means that you cannot dynamically construct translation keys in frontend, they have to be static. For example, the following string will not work: `translate(‘/Shared/ProductStatus/’ + product.stockStatus)`.

### How we achieve intellisense of available translation keys in frontend
Task `frontend:generate-translation-keys-type` (which is automatically invoked during `nitro build` or `nitro frontend:build`) will create the file `TranslatedKeys.d.ts`. This file contains all the keys found in the translation XML files, and it's included by `Translate.tsx`, giving us intellisense and typechecking when typing `translate('yadda/yadda')`. 

`nitro frontend:generate-translation-keys-type` will also give you a warning if you added new translation keys in the XML files, but forgot to add them in all language files.

### Translations of dropdowns in Epi backoffice
It's possible to translate a dropdown connected to a enum. See `EnumSelectionFactoryBase` and for example the `DefaultSortOrder` property on `ProductListingPage`:

```c#
[EditorDescriptor(EditorDescriptorType = typeof(EnumStringEditorDescriptor<ProductSortBy>))]
public virtual string DefaultSortOrder { get; set; }
```

## Features in Avensia.Localization package
The `Avensia.Nitro5.Localization` package extends the built in Localization of episerver, and adds the following features:
* An admin tool where editors can change the default translations defined in the XML files
* Possibility to define cultures as "hidden", meaning the culture is enabled in Episerver and hence available for editors to create content, but the culture is unavailable on the public site. Only logged in editors (with a specific role) can preview the content on the site.

