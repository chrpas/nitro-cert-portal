This page describes, on a high level, differences between nitro classic and nitro5.

## Frameworks and dependencies
- Nitro uses .NET Framework 4.8 while Nitro5 uses .NET 8 (.NET Core)
- This means that some dependencies have been updated to new versions (that support .NET Core). We are now using Optimizely CMS 12 and Commerce 14.
- .NET Core uses _transitive_ dependencies, meaning we don't need to explicitly list all dependencies in every project
- All dependencies are specified in the *.csproj files, there is no `package.config`.

## Buildsystem
- `scope.cmd` has been renamed to `nitro.cmd`, as a result we now do `nitro build` instead of `scope build`
- The `@avensia/scope-buildsystem` package has been renamed to `@avensia/nitro5-buildsystem`
- Majority of the code in the buildsystem has been moved from the site code and into the package (to simplify upgrades)
- Buildsystem has been updated to use [dotnet build](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-build) instead of MSBuild. 
- The `local-nuget` task has been [greatly improved](https://github.com/avensia/nitro5/wiki/Debugging-nitro5-packages) and there is also a `local-npm` task

<details>
<summary>More details...</summary>

- `setup-dev-env` has been improved and will no longer give 3 confusing options for the database. It will simply ask if you want to restore your databases, as a YES/NO question.
- There is a new `setup-new-project` task to be used when starting new projects based on Nitro5.
- The maintenance tasks have been removed, but there is a new clean-databases task instead. All tasks available [here](https://github.com/avensia/nitro5/wiki/Buildsystem).
- `setup-dev-env` will also no longer run sync-content nor full promo cache (instead developer database [should be prepared](https://github.com/avensia/nitro5/wiki/Developer-database-backups) with content and promo cache run).

</details>

Also see [wiki on Buildsystem](https://github.com/avensia/nitro5/wiki/Buildsystem)

## Running nitro5
- Nitro is not using IIS anymore, instead [Kestrel](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-8.0) is used
- Nitro can be run either from Visual Studio (by pressing play) or from the command line via `nitro start-site` or `dotnet run`

Also see [wiki on Running nitro5 locally](https://github.com/avensia/nitro5/wiki/Setting-up-the-dev-environment#running-nitro5-locally)

## Configuration and settings
- Configuration has been greatly simplified. All existing config files (including `web.config`, `commonConfiguration.config`, `appSettings.config` and `connectionStrings.config`) has been replaced with a single `appsettings.json` in Avensia.Shop.
- There is no longer any release config in .NET, instead `appsettings.json` is intended to be "for all" as much as possible
- Local overrides can be specified in `appsettings.Development.json` and transforms per environment are still supported, if you need it. More on this [here](https://github.com/avensia/nitro5/wiki/Appsettings).
- *.csproj files are in "SDK style", meaning it only describes deviations. All files in the project root are included in project by default, there is no need to specify each file. 
- All settings that are sensitive should be in [Azure Keyvault](https://github.com/avensia/nitro5/wiki/Appsettings#azure-keyvault). Settings that are not sensitive but varies between environments (one value for Prod, another for Preprod etc), should be transformed using Octopus structured configuration variables. 
- Settings should be accessed in code via [Options](https://github.com/avensia/nitro5/wiki/Options) 
- You can also use [NitroOptions](https://github.com/avensia/nitro5-packages/tree/develop/packages/options) to do config that is site or market specific in `appsettings.json`.

Also see [wiki on Options](https://github.com/avensia/nitro5/wiki/Options) and [wiki on Appsettings](https://github.com/avensia/nitro5/wiki/Appsettings)

## Jobs and queues
- All jobs now run inside the scheduler site instead as in a separate webjobs process.
- The infrastructure for jobs and queues has been moved to new package *Avensia.Nitro5.Jobs* (`Avensia.Jobs` project has been removed)
- All jobs must implement from `INitroJob`  and be decorated with the `NitroJob` attribute.
- The `JobRegister` has been removed, there are no "job names", jobs are now started by using the class name.
- As Avensia.Jobs has been removed all the logic around copying shared configuration (and language *.xml files) from Common to Jobs and Shop has been removed.

<details>
<summary>More details...</summary>

- The general `QueueApiController` has been removed. The customer and organization import API endpoints have gotten specific API controllers instead.
- Jobs can be started command line using the job class name, like `nitro run IncrementalEsalesIndexJob`.
- Some jobs are renamed so its easier to type job names correctly. New names are `IncrementalPromoCacheJob`, `FullPromoCacheJob`, `IncrementalEsalesIndexJob`, `FullEsalesIndexJob`, `CustomEsalesIndexJob`, `IncrementalFindIndexJob` and `FullFindIndexJob`.
- Some jobs has moved into packages: 
   - To `esales-indexbuilder` package: `CustomEsalesIndexJob`, `FullEsalesIndexJob`, `IncrementalEsalesIndexJob`, `PurgeEsalesIndexingFilesJob`
   - To `esales4-indexbuilder` package: `CustomEsales4IndexJob`, `FullEsales4IndexJob`, `IncrementalEsales4IndexJob`
   - To `find-indexbuilder` package: `FullFindIndexJob`, `IncrementalFindIndexJob`
   - To `redirector` package: `FullRedirectorUrlBuilderJob`, `IncrementalRedirectorUrlBuilderJob`
   - To `inriver-connector` package: `PimImportJob`, `PimPullAssetsJob`
   - To `core` package: `PurgeOrphanPropsJob`, `RebuildDatabaseIndexesWhenNeededJob`
- Running jobs with `nitro.cmd` will no longer implicitly do a `nitro build` before starting the job (meaning it will be faster, but you have to make sure to build backend before running jobs).
- The scheduler instance is still responsible for running the jobs in DXP. 
- Registration of queues has moved from QueuesRegistry to QueuesInitialization
- Removed because Avensia.Jobs is gone: 
   - Idempotent migration `SetDefaultJobSchedules`
   - All init of Episerver in EpiFoundation package
   - `LogicalCallContextObjectInstanceCache`
    - Registration of job heartbeats in Azure Blob storage 
</details>

Also see [wiki on Jobs](https://github.com/avensia/nitro5/wiki/Jobs) and [wiki on Queues](https://github.com/avensia/nitro5/wiki/Queues)

## Logging
- log4net has been removed in favor of [native ASP.NET Core logging](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/), using [Serilog](https://serilog.net/) as provider
- Locally we still log to text files, but in DXP [all logs are now in Application Insights](https://github.com/avensia/nitro5/wiki/Application-Insights-&-Logging) (and errors are in Raygun as before).
- Logging to Azure tables has been removed and hence the `DeleteAzureLogTableJob` and the `LogViewer` admin tool as well

Also see [wiki on Troubleshooting](https://github.com/avensia/nitro5/wiki/Troubleshooting).

## Dependency injection and init
- StructureMap has been replaced by [Microsoft Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) along with some extension methods in [Scrutor](https://github.com/khellang/Scrutor)
- The IOC container is configured in the `ConfigureServices` method in `Startup.cs` in the web shop project in nitro5, which calls `AddNitroCommon` method in `Avensia.Common/CommonInitialization` where you can find the majority of init for your project. 
- Logic in `Avensia.Shop/InitializationModule.cs` in nitro has been moved to `Avensia.Shop/Startup.cs` in nitro5.
- All `Initialize*` methods in all `*Initialization.cs` files in nitro has been renamed to `Add*` (like `AddCatalog` or `AddGoogleOptimize`) in nitro5. 
- Initialisation that needs to run after the IOC container is configured (corresponding to the `ConfigurationComplete` event in StructureMap) is done in NitroStartupService.cs
- We use [Options](https://github.com/avensia/nitro5/wiki/Options) to pass settings to constructors
- Concrete types that are used in dependency injection must be explicitly registered in the container, contrary to before where this was handled automatically by Structuremap. Failing to register a concrete dependency will cause a run-time error.
- Most func params, like `Func<VariationContent, bool> canItemBeBackordered` in the old StockInitialization in EpiFoundation in Suite, has been extracted to interfaces instead that are implemented by Nitro5. See more on the "Template method" in our [Packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines).

Also see [wiki on Dependency Injection](https://github.com/avensia/nitro5/wiki/Dependency-injection)

## Controllers and routing
* A `PageController` needs to be `public` and concrete, otherwise EPi can't register their route, resulting in 404.
* Modelbinding has changed in .NET, you need the `[FromBody]` attribute on action method parameters that are posted to server from client. 
* You need to specify the `SiteAPiKey` as Authorization header for all api controller requests (also locally, not only in DXP).
* Partial controllers are gone from .NET, hence also block controllers are gone from CMS 12. Instead there are block components, which do not have any endpoints.
* All API controllers now inherit from `ApiControllerBase` (in Nitro.Core) instead of `ApiController`. See [API controllers](https://github.com/avensia/nitro5/wiki/Backend-upgrade-tips-&-tricks#api-controllers) 

## Authentication
- Owin has been replaced by [ASP.NET Identity](https://docs.developers.optimizely.com/content-cloud/v12.0.0-content-cloud/docs/aspnetidentity).
- Old `aspnet_*` tables have been removed and replaced with `AspNet*` tables

Also see [wiki on Customers and Organizations](https://github.com/avensia/nitro5/wiki/Customers-and-Organizations)

## Cache
* Output cache is gone from Scope (it was rarely used)
* All backend cache config from `web.config` is removed, we are using defaults. Except:
   * Caching of static files is set to 365 days, see `ConfigureStaticFileOptions`
   * We prevent CloudFlare from caching non-200-responses, see `SetNoCacheHeaderOnFailedRequestsMiddleware`

## Migrations
- Migrations are now grouped into folders per year in `Avensia.Common/Migrations`

<details>
<summary>More details...</summary>

- For startup performance reasons, the automatic discovery of classes implementing `IMigration` and `IIdempotentMigration` during startup now only scans assemblies which names start with "Avensia". 
- Logging of "Running migration..." is now done when migration starts, not after it's done.

</details>

Also see [wiki on Migrations](https://github.com/avensia/nitro5/wiki/Migrations).

## Backoffice and Nitro Tools
- The default url to backoffice has changed from `/episerver` to `/backoffice`
- `Avensia Tools` has been renamed to `Nitro Tools`
- All custom backoffice tools are now found in `Nitro Tools` (no tools in the CMS Admin view).
- Permissions to backoffice tools is set using "Permissions for functions"

<details>
<summary>More details...</summary>

- There's a new extension method `IsBackofficeRequest()` that can be used in situations where you want a different behavior.
- Whitelisting of IPs allowed to access backoffice is now done in `BackofficeAllowlistMiddleware` using IPs in `appsettings.json`.
- The possibility to override the background image of the login to backoffice has not been migrated to nitro5 - feel free to try to migrate this feature if you need it.
- `SearchAdmin` no longer automatically scans for implementations of `IDataQueryProvider`, all implementations has to be added explicitly during initialization.

</details>

Also see [wiki on Backoffice](https://github.com/avensia/nitro5/wiki/Backoffice)

## Error pages
- 404 and 500 errors are configured in Startup (was: `Avensia.Shop/Web.Release.config`)
- 500 errors are configured via `UseExceptionHandler("/ErrorCode")` (in Startup) and handled by `ErrorCodeController` that returns the static 500 view
- 404 errors are configured via `UseStatusCodePagesWithReExecute("/404")` (in Startup) and handled by `PageNotFoundController` that works similar to Nitro
- `OptimizedUrlContentResolver` is renamed to `RedirectorUrlResolver`. 
- Redirector now also handles the old assets feature (`UploadAssets` and `OldAssetsService` has moved into the package).

Also see [wiki on error pages](https://github.com/avensia/nitro5/wiki/Error-pages).

## Avensia.Tests
- NUnit has been replaced by [MSTest](https://learn.microsoft.com/en-us/visualstudio/test/using-microsoft-visualstudio-testtools-unittesting-members-in-unit-tests?view=vs-2022)
- `Avensia.Tests` is now `Avensia.Common.Tests` (unit tests) and all tests that required epi-context (meaning they were actually integration tests) has been removed.

<details>
<summary>More details...</summary>

- Instead of decorating your test classes with `[NUnit.Framwework.Test]` you should decorate them with `[Microsoft.VisualStudio.TestTools.UnitTesting.TestClass]`.
- Attribute `[Category("EPiContext")]` is removed. This was previously used to avoid running time consuming integration tests on TeamCity on each build.

</details>

Also see [wiki on Tests](https://github.com/avensia/nitro5/wiki/Tests).

## Nitro5 packages
- Nitro uses repositories [suite](https://github.com/avensia/suite) and [scope](https://github.com/avensia/scope) for its packages, while Nitro5 uses  [nitro5-packages](https://github.com/avensia/nitro5-packages), meaning scope no longer has its own separate repo. 
- To distinguish between suite and nitro5 packages, the nitro5 packages all have a ".Nitro5" added to their names, e.g. `Avensia.Checkout` in suite corresponds to `Avensia.Nitro5.Checkout` in nitro5. Packages will live in parallell in suite and nitro5-packages, and PRs merged in suite will continuously be migrated to nitro5 by the product team. 
- The folder structure for the packages has been standardized, making it easier to find the files for a specific package. E.g. folder `/packages/avensia-checkout` in suite corresponds to `/packages/checkout` in nitro5-packages (dropping the avensia- prefix). See [package structure](https://github.com/avensia/nitro5/wiki/Package-structure)

## License
- Optimizely CMS 12 does not need a license locally so no need to generate license files any longer 🎉 
- ...officially they still suggest that there should be a license file, but the only issue we've found is a "nag screen" if you go to CMS -> Admin -> Manage websites

## HttpModules and Middleware
- HttpModules are no longer available in .NET Core, instead there is Middleware. All Nitro http modules has been converted into middleware.
- `AuthModule` has been converted into `PinCodeMiddleware`. Also see [PIN code](https://github.com/avensia/nitro5/wiki/PIN-code)

## API changes
- The custom `ISqlConnectionFactory` has been replaced by Optimizely's `IConnectionStringHandler`
- Microsoft has replaced `System.Web.HttpContextBase` with `Microsoft.AspNetCore.Http.HttpContext`, `System.Web.HttpException` with `System.Net.Http.HttpRequestException` and `System.Web.HttpUtility.UrlEncode()` with `System.Net.WebUtility.UrlEncode()` (to name a few) resulting in quite a few code changes regarding HttpContext etc.
- The `SerializeRequestsForAccountAttribute` in EpiFoundation is gone
- The general `IPhoneNumberConverter` in EpiFoundation is gone, as well as its default implementation `PhoneNumberConverter` in nitro (which did nothing) - if a payment package need to convert phone numbers, a payment specific converter should be created.
- Nitro5 now uses .NET OOTB response compression (instead of custom built logic in Scope)
- The static `HttpClient` is replaced with `IHttpClientFactory` - see [wiki on Using HttpClient](https://github.com/avensia/nitro5/wiki/Using-HttpClient)
- The `purchaseOrder.SiteId` property has been marked obsolete by Episerver - use `GetSiteId()` and `SetSiteId()` in our `OrderGroupExtensions` instead.
- `IPHelper` in Nitro.Core is gone, use Episerver's `IClientIPAddressResolver` instead to get IP of client
- `OrderGroupExtensions` has moved from `Avensia.EpiFoundation.Payments.Extensions` to `Avensia.Nitro.Core.Extensions`
- `AmountWithVat` has moved from `Avensia.Checkout.Models` to `Avensia.Nitro.Core.Models` (causing Checkout to be dependent on Core, instead of as previously Core being dependent on Checkout)
- Some methods in `CheckoutServiceSiteSpecificCallbackBase` has been moved into a new class `CheckoutServiceSiteSpecificCartCallbackBase` to avoid a circular dependency problem during init.
- The base implementation of `CheckoutServiceSiteSpecificCallbackBase` and `CheckoutServiceSiteSpecificCartCallbackBase` has moved from the Checkout package to the site. See [PR](https://github.com/avensia/nitro5/pull/628).

## Image resizing
- The old [ImageResizer](https://imageresizing.net/) component has been replaced with a "dual" solution. Locally we use [SkiaSharp](https://github.com/mono/SkiaSharp), but in DXP we are using [Cloudflare's built-in image resizer](https://developers.cloudflare.com/images/image-resizing/url-format/). Also see [wiki on Image resizing](https://github.com/avensia/nitro5/wiki/Image-resizing).

## Inriver
- EntityLinkers now supports handling multiple link types with the same instance, so no need to configure separate `LinkTypeId` per instance
- EntityLinkers have support for the standard link naming conventions by default, so unless you have custom naming you don't need to specify anything else

## Modules folder
- Modules folder contains UI gadgets and plugins to the Optimizely backoffice
- Modules folder is no longer version-controlled and should not live in the repository. An upgrade should therefore delete everything under modules.
- Modules will be recreated during build (via the .targets file in each package), e.g. `%userprofile%\.nuget\packages\episerver.commerce.ui\14.12.0\build\net6.0\EPiServer.Commerce.UI.targets`. The targets file for a dependency is automatically called upon when building.

## Content index
- Elevate 4 is now the default content index in Nitro
- The content index type of "DXC" (Find+Perform) has been renamed to "Find" in code (also see [Content index: Find](https://github.com/avensia/nitro5/wiki/Find)).

Also see [wiki on Content Index](https://github.com/avensia/nitro5/wiki/Content-index)

## Other
- Swagger has not been migrated. As a replacement of Swagger, we recommend using the the [Postman collection](https://github.com/avensia/nitro5/blob/nitro5-develop/postman_collection.json) we have prepared for all API endpoints. Also see the Integration specification. However, there's nothing stopping you from installing Swagger in your project if you find it useful.
- Miniprofiler has been removed from Nitro5. As a replacement of Miniprofiler, we recommend using Application Insights. See docs in Excite on [Investigating Performance using Application Insights](https://github.com/avensia/excite/blob/main/docs/application-insights.md#investigating-performance). However, there's nothing stopping you from installing Miniprofiler in your project if you find it useful.
- `CultureInfo.LCID` is not reliable in Linux and should be replaced with `CultureInfo.Name`