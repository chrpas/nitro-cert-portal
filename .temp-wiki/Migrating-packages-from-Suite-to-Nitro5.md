<sup>[Nitro5](https://github.com/avensia/nitro5/wiki) / [Contributing](https://github.com/avensia/nitro5/wiki/Contributing) / How to migrate packages from suite to nitro5 packages</sup>


## How to migrate a package from suite to nitro5-packages
1. Create new branch in nitro5-packages repo, e.g. `upgrade-epifoundation`
2. Make sure that the latest code from suite exists in nitro5-packages. (Since it's been a while since nitro5-packages was cloned from suite, a lot has happened in suite since then and these changes are not present in nitro5-packages. So just do a copy of all the files for your package in suite, paste them into nitro5-packages and commit this in a separate commit.) If your new project dosen't exist make a new folder for it.
3. Make a note on https://github.com/avensia/nitro5/wiki/Migrated-packages that migration is IN PROGRESS
4. Fix the name of the folders for your project so it matches previous packages e.g. ..\nitro5-packages\packages\project-name\src\Avensia.Nitro5.Project.Name
5. Run upgrade assistant on the package: see https://github.com/avensia/nitro5/wiki/Upgrade-codebase-to-Nitro5#step-3-run-upgrade-assistant. In step 3.2 just run it on your-package.csproj and skip Common and Shop.
6. Commit result from upgrade assistant in a separate commit (yes even though it does not build)
7. Change the name of the .csproj e.g. Avensia.Nitro5.Project.Name.csproj and commit
8. Fix build errors so that the project builds and then commit.
9. If the package should be included in the starter site of Nitro5 then create a new branch in the nitro5 repo, e.g. `upgrade-epifoundation` then add your package to nitro5 solution file and commit.
10. Update `buildsystem/index.ts` This file can be taken from a previous package and then adjusted (project names/paths etc) to match your project.
11. Update `RELEASE_NOTES.md` with a "baseline" stating which version of the Suite package this initial version was created from (see other already migrated packages)
12. Remember to push commits in both repos, `nitro5` and `nitro5-packages` :) and then create PR's.
13. Announce in #nitro-team when you are done and we'll review, merge, tag 1.0.0 and update https://github.com/avensia/nitro5/wiki/Migrated-packages :tada:


## Tips n trix about package migration
* If build complains about permissions to write the documentation xml-file: In .csproj, replace `<DocumentationFile>$(OutputPath)\Avensia.Nitro.Core.xml</DocumentationFile>` with `<GenerateDocumentationFile>true</GenerateDocumentationFile>`
* If there's an admin page included in a package getting migrated, the following changes need to be made in .csproj:
  1. change `﻿<Project Sdk="Microsoft.NET.Sdk">` to `<Project Sdk="Microsoft.NET.Sdk.Razor">`
  2. add `<AddRazorSupportForMvc>true</AddRazorSupportForMvc>` to a `<PropertyGroup>`
  3. remove the `<ItemGroup><EmbeddedResource Include="[file].cshtml" /></ItemGroup>` tag(s)
* Place views in `/Views` folder and they will be found

## Func params
If you find a func param that you find confusing, convert it to an interface instead:

1. Create a new interface with methods corresponding to all Func<> params
2. Change logic of the service needing the Func<> params - inject your new interface instead and use this in logic
3. Implement this interface in startersite, add the default logic as implementation of the methods
3. Please add comments on the methods (on both interface and implementation - so its easy for projects to understand purpose of method)
4. Add init of this interface in ServiceExtensions.cs in startersite (the one corresponding to the old CommonInitialization)

## Checklist when reviewing a new/migrated package
1. Correct package name in the package's README.md (from Avensia.* to Avensia.Nitro5.*)
2. Correct history in the package's RELEASE_NOTES.md (with "based on paket X version x.x.x")
3. Update docs in the package (especially any code/config references that probably has changed)
4. Remember the '../../../buildsystem/common'; in `buildsystem/index.ts`
5. Add link to package from nitro5-packages README.md
5. Tag manually the first tag 1.0.0 - after branch is merged, verify it builds and ends up as 1.0.0 on packages.avensia.com
6. Update https://github.com/avensia/nitro5/wiki/Migrated-packages to DONE and with correct version numbers

## List of migrated packages
Update 2023-02-16: Packages below that are NOT STARTED will be migrated upon request. If you need one of these packages, let the product team know and we'll help you. 

## NuGet packages

| Nitro package     | Nitro 5 package | Folder name | Status
| ------------- | ------------- | ------------- | ------------- |
| Apptus.Esales.ConnectorApi | Avensia.Nitro5.Esales.Connector | [esales-connector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales-connector) | MIGRATED |
| Avensia.Checkout          | Avensia.Nitro5.Checkout | [checkout](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/checkout) | MIGRATED |
| Avensia.DXCIndexBuilder   | Avensia.Nitro5.Find.IndexBuilder | [find-indexbuilder](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/find-indexbuilder) | MIGRATED |
| Avensia.ESales4IndexBuilder | Avensia.Nitro5.ESales4.IndexBuilder | [esales4-indexbuilder](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales4-indexbuilder) | MIGRATED |
| Avensia.ESalesIndexBuilder | Avensia.Nitro5.Esales.IndexBuilder | [esales-indexbuilder](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales-indexbuilder) | MIGRATED |
| Avensia.EpiFoundation    | Avensia.Nitro5.EpiFoundation | [epifoundation](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/epifoundation) | MIGRATED |
| Avensia.EpiFoundation.TestUtilities     | Avensia.Nitro5.EpiFoundation.TestUtilities | [epifoundation-testutilities](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/epifoundation-testutilities) | MIGRATED |
| Avensia.Esales.DebugTools | Avensia.Nitro5.Esales.DebugTools | [esales-debugtools](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales-debugtools) | MIGRATED |
| Avensia.EsalesConfigGeneration | Avensia.Nitro5.Esales.ConfigGeneration | [esales-configgeneration](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales-configgeneration) | MIGRATED |
| Avensia.Facebook.ConversionsApi | Avensia.Nitro5.Facebook.ConversionsApi | [facebook-conversionsapi](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/facebook-conversionsapi) | MIGRATED |
| Avensia.Forms.Core   | Avensia.Nitro5.Forms| [forms](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/forms) | MIGRATED  |
| Avensia.Forms.Web   | Avensia.Nitro5.Forms | [forms](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/forms) | MIGRATED  |
| Avensia.inRiverEpiserver | Avensia.Nitro5.inRiver.Connector | [inriver-connector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/inriver-connector) | MIGRATED |
| Avensia.Localization    | Avensia.Nitro5.Localization | [localization](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/localization) | MIGRATED |
| Avensia.Nitro.Core       | Avensia.Nitro5.Core | [core](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/core) | MIGRATED |
| Avensia.Payments.Adyen    | Avensia.Nitro5.Payments.Adyen | payments-adyen | ??? |
| Avensia.Payments.Bambora  | Avensia.Nitro5.Payments.Bambora | payments-bambora | NOT STARTED |
| Avensia.Payments.Collector| Avensia.Nitro5.Payments.Collector | payments-collector | NOT STARTED |
| Avensia.Payments.KlarnaCheckoutV3 | Avensia.Nitro5.Payments.KlarnaCheckoutV3 | [payments-klarnacheckoutv3](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/payments-klarnacheckoutv3) | MIGRATED |
| Avensia.Payments.NetsEasy | Avensia.Nitro5.Payments.NetsEasy | payments-netseasy | IN PROGRESS |
| Avensia.Payments.PayPal   | Avensia.Nitro5.Payments.PayPal | payments-paypal | NOT STARTED - should extract implementation in Sigvaris instead that uses the new PayPal API |
| Avensia.Payments.Paytrail | Avensia.Nitro5.Payments.Paytrail | payments-paytrail | NOT STARTED |
| Avensia.Payments.QliroOne | Avensia.Nitro5.Payments.QliroOne | payments-qliroone | NOT STARTED |
| Avensia.Payments.TestPayment | Avensia.Nitro5.Payments.TestPayment | [payments-testpayment](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/payments-testpayment) | MIGRATED |
| Avensia.Payments.Vipps    | Avensia.Nitro5.Payments.Vipps | [payments-vipps](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/payments-vipps) | MIGRATED |
| Avensia.PriceHistory | Avensia.Nitro5.PriceHistory | [pricehistory](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/pricehistory) | MIGRATED |
| Avensia.Redirector     | Avensia.Nitro5.Redirector | [redirector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/redirector) | MIGRATED |
| Avensia.RiversandEpiserver| Avensia.Nitro5.Riversand.Connector | riversand-connector | NOT STARTED |
| Avensia.Scope  | Avensia.Nitro5.Scope | [scope](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/scope) | MIGRATED |
| Avensia.Scope.EpiServer  | Avensia.Nitro5.Scope.EpiServer | [scope-episerver](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/scope-episerver) | MIGRATED |
| Avensia.Scope.Mvc  | Avensia.Nitro5.Scope.Mvc | [scope-mvc](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/scope-mvc) | MIGRATED |
| Avensia.SqlAdmin | Avensia.Nitro5.SqlAdmin | sqladmin | IN PROGRESS |
| Avensia.Voyado.ApiV2          | Avensia.Nitro5.Voyado.Connector | [voyado-connector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/voyado-connector) | MIGRATED |
| Avensia.Cision    | Avensia.Nitro5.Cision.Connector | cision-connector | IN PROGRESS |

## npm packages

> Note: Packages that don't contain frontend logic need not be published since types are built from backend (starting with Scope 9)

| Nitro package     | Nitro 5 package | Folder name | Status
| ------------- | ------------- | ------------- | ------------- |
| @avensia/avensia-checkout         | @avensia/nitro5-checkout | [checkout](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/checkout) | MIGRATED |
| @avensia/facebook-conversions-api | @avensia/nitro5-facebook-conversionsapi | [facebook-conversionsapi](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/facebook-conversionsapi) | MIGRATED |
| @avensia/avensia-forms | @avensia/nitro5-forms | [forms](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/forms) | MIGRATED |
| @avensia/avensia-forms-web | @avensia/nitro5-forms | [forms](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/forms) | MIGRATED |
| @avensia/interactive-payment-gateway-adapter |  @avensia/nitro5-interactive-payment-gateway-adapter | [interactive-payment-gateway-adapter](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/interactive-payment-gateway-adapter) | MIGRATED |
| @avensia/nitro-core    | (Not needed anymore) | - | - |
| @avensia/payments-adyen    | @avensia/nitro5-payments-adyen | payments-adyen | NOT STARTED |
| @avensia/payments-bambora  | @avensia/nitro5-payments-bambora | payments-bambora | NOT STARTED |
| @avensia/payments-collector| @avensia/nitro5-payments-collector | payments-collector | NOT STARTED |
| @avensia/payments-kcov3 | @avensia/nitro5-payments-kcov3 | [payments-klarnacheckoutv3](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/payments-klarnacheckoutv3) | MIGRATED |
| @avensia/payments-netseasy | @avensia/nitro5-payments-netseasy | payments-netseasy |  NOT STARTED |
| @avensia/payments-qliroone | @avensia/nitro5-payments-qliroone | payments-qliroone | NOT STARTED |
| @avensia/scope  | @avensia/nitro5-scope | [scope](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/scope) | MIGRATED |
| @avensia/scope-buildsystem | @avensia/nitro5-buildsystem | [nitro5-buildsystem](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/nitro5-buildsystem) | MIGRATED |
| @avensia/scope-episerver | @avensia/nitro5-scope-episerver| [scope-episerver](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/scope-episerver) | MIGRATED |

### Unsupported
The following packages/projects will not be migrated:

- Avensia.Payments.DIBS
- Avensia.Payments.Klarna
- Avensia.Payments.Qliro
- Avensia.Shipping.PostNord
- Avensia.Shipping.Instabox
- Avensia.Shipping.BestTransport
- Avensia.Shipping.Bring
- Avensia.PmcFoundation
- Tstypegen
- TODO
- Avensia.HttpClientFactory