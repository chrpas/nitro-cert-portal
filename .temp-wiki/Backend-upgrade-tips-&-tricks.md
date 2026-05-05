This document contains tips & tricks when upgrading the backend to Nitro5.

## Dependency injection / init

- StructureMap has been replaced by [Microsoft Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) along with some extension methods in [Scrutor](https://github.com/khellang/Scrutor)
- The IOC container is configured in the `ConfigureServices` method in `Startup.cs` in the web shop project in nitro5. Logic in `Avensia.Shop/InitializationModule.cs` in nitro has been moved to `Avensia.Shop/Startup.cs` in nitro5. We suggest you add `Startup.cs` from nitro5 to your project and then migrate all changes that has been done in your project's old `Avensia.Shop/InitializationModule.cs`.
- All `Initialize*` methods in all `*Initialization.cs` files in nitro has been renamed to `Add*` (like `AddCatalog` or `AddGoogleOptimize`) in nitro5. We suggest you do corresponding changes in your project. See help on Feature initialization below.
- All StructureMap-init has to be replaced with Microsoft DI init instead. While doing it, use the Options pattern for constructor params. See help on migrating init below.

### Migrating StructureMap 
Init of **classes (not implementing any interface)**:

```c#
// nitro:
// no registration needed

// nitro5:
services.AddTransient<ProductImportService>();
```

Init of **transient interfaces** (the default one to use if unsure)

```c#
// nitro:
c.For<ISiteResolver>().Use<SiteResolver>();

// nitro5:
services.AddTransient<ISiteResolver, SiteResolver>();
```

Init of **singleton interfaces**:

```c#
// nitro:
c.For<IPhoneNumberConverter>().Use<PhoneNumberConverter>().Singleton();

// nitro5:
services.AddSingleton<IPhoneNumberConverter, PhoneNumberConverter>();
```

Replacing StructureMap´s **.GetInstance(...)**

```c#
// note: this example uses Singleton, could also be Transient or Scoped

// nitro:
c.For<IContentLoader>().Use(ctx => new DependencyTrackingContentLoader((IContentLoader)ctx.GetInstance(contentLoaderClass.BaseType), ctx.GetInstance<IDependencyTracker>())).Singleton();

// nitro5
services.AddSingleton<IContentLoader>(s =>
  new DependencyTrackingContentLoader(
    s.GetRequiredService<IContentLoader>(),
    s.GetRequiredService<IDependencyTracker>()));
```

Replacing StructureMap´s **.DecorateAllWith(...)**:

```c#
// nitro
c.For<IInventoryService>().DecorateAllWith((ctx, inner) => new AvensiaCachingInventoryService(inner, ctx.GetInstance<ISynchronizedObjectInstanceCache>()));

// nitro5: Use Scrutor extension method
services.Decorate<IInventoryService, AvensiaCachingInventoryService>();
```

Replacing StructureMap's **.Forward(...)**:

```c#
// nitro:
c.Forward<ICheckoutService, IInteractivePaymentGatewayCallback>();

// nitro5: Use extension method in EpiServer.Framework
using Microsoft.Extensions.DependencyInjection;
services.Forward<ICheckoutService, IInteractivePaymentGatewayCallback>();
```

Replacing StructureMap´s **.ConfigurationComplete += ...**

```c#
// nitro5: Rewrite so logic happens in a method called after configuration is done. See NitroStartupService for example. You can inject services as usual, no need to fetch from service container.
```

How to **inject a list of all registered instances of an interface**:

```c#
// nitro:
public CmsMenuItemsProvider(IList<IQueueMonitorService> queueMonitorServices)

// nitro5: Inject as IEnumerable<T> instead of LList<T>
public CmsMenuItemsProvider(IEnumerable<IQueueMonitorService> queueMonitorServices)
```

### Feature initialization
Due to the removal of StructureMap, the following patterns for initialization are obsolete:

```c#
// OBSOLETE REGISTRY PATTERN
namespace Avensia.Common.Features.MyFeature
{
    public class MyFeatureRegistry : Registry
    {
        public MyFeatureRegistry()
        {
            ...
        }
    }
}
```

```c#
// OBSOLETE INITIALIZATION PATTERN
namespace Avensia.Common.Features.MyFeature
{
    public static class MyFeatureInitialization
    {
        public static void Initialize(ServiceConfigurationContext context)
        {
            ...
        }
    }
}
```

Instead, use the following pattern:

```c#
namespace Avensia.Common.Features.MyFeature;

public static class MyFeatureInitialization
{
    public static void AddMyFeature(this IServiceCollection services)
    {
        // TODO: Configure services here
    }
}
```
The call to the `Add()`-method should then be placed from `CommonInitialization`.

### How to migrate to the **Options pattern**

1. If there are any constructor parameters besides services registered in the IoC container (everything that is of type `int`, `string`, `TimeSpan` etc), add an options class and add all these params as properties in your new options class. If you need default values of the params, set default values of your properties in your options class. If the params had comments, move these to the options class. Ex:

```c#
internal class ChangeTrackerOptions
{
    public string TableName { get; set; } = "dbo.DefaultTableName";
    public TimeSpan TimeToKeepChanges { get; set; }
}
```

2. Init your option class (just above the init of your service) and either set values explicitly, e.g:

```c#
services.Configure<ChangeTrackerOptions>(options =>
{
  options.TableName = tableName;
  options.TimeToKeepChanges = timeToKeepChanges;
});
services.AddSingleton<IChangeTracker, ChangeTracker>();
```

...or connect the options class to a config section:

```c#
services.Configure<ChangeTrackerOptions>(configuration.GetSection("Nitro5:EpiFoundation:ContentProcessing:ChangeTracking"));
```

...and add a section for this option class in `appsettings.json`:

   ```json
   "Nitro5": {
     "EpiFoundation": {
       "ContentProcessing": {
         "ChangeTracking": {
           "TableName": "dbo.Nitro5_PendingChanges",
           "TimeToKeepChanges": "0.00:10:00.0000"
         }
       }
     }
    },
   ```

3. Modify constructor of the service needing the params, by injecting e.g. `IOptions<ChangeTrackerOptions> options`)instead of the previous params. You'll need to add `using Microsoft.Extensions.Options;`. Also modify constructor logic so it uses `options.YourNewProperty.Value` instead of the previous params.

## Logging

- Locally we still log to text files, but in DXP all logs are now in **Application Insights**. Logging is setup using **Serilog**, both locally and in DXP. Log settings are defined in `appsettings.json` and initialized in `Program.cs` with `.AddSerilog(...)`.
- All logging to Azure Tables is removed. Hence the following components are deleted, and we suggest you also delete these:
  - Admintool "Avensia Log Viewer"
  - `AzureTableAppender`
  - `DeleteAzureLogTableJob`
- All usings of `log4net`, `Common.Logging` or `EPiServer.Logging.Compatibility` needs to be replaced by using `EPiServer.Logging`
- `ILog` has been replaced with `ILogger` and calls to `Info()` and `Warn()` needs to be replaced with `Information()` and `Warning()`
> Note: EPiServer.Logging is kept for backwards compatibility. For new code it is recommended to use `Microsoft.Extensions.Logging` directly

### How to migrate logging
Nnote: when doing search & replace below, be sure to check "Case sensitive" and "Whole word only":

1. Search & replace `using log4net` -> `using EPiServer.Logging`
2. Search & replace `using EPiServer.Logging.Compatibility` -> `using EPiServer.Logging`
3. Search & replace `using Common.Logging` -> `using EPiServer.Logging`
4. Search & replace `ILog` -> `ILogger`
5. Search & replace `Log.Warn` -> `Log.Warning`
6. Search & replace `Log.Info` -> `Log.Information`
7. After this you may find a couple of cases where the `ILogger` object is called `Logger` (rather than `Log`). These cases also need to be adjusted.

## Jobs
- Some jobs are renamed in nitro5, and we suggest you do corresponding changes:
   - `IncrementalPromotionCacheEvaluationBuilderJob` -> `IncrementalPromoCacheJob`
   - `FullPromotionCacheEvaluationBuilderJob` -> `FullPromoCacheJob`
   - `IncrementalEsalesIndexingJob` -> `IncrementalEsalesIndexJob`
   - `FullEsalesIndexingJob` -> `FullEsalesIndexJob`
   - `CustomEsalesIndexingJob` -> `CustomEsalesIndexJob`
   - `IncrementalDXCIndexingJob` -> `IncrementalFindIndexJob`
   - `FullDXCIndexingJob` -> `FullFindIndexJob`
- Delete the entire `Avensia.Jobs` project
- Delete Jobs admin UI
- Delete `SetDefaultJobSchedules` migration
- Delete `JobsRegistry` (there is no need to register jobs anymore). 

Jobs now implement `INitroJob` intead of `IJob`. The schedule and name is set in the same attribute `[NitroJob]`.

Before:
```c#
[DisplayName("Release stock reservations")]
[DefaultSchedule(Schedule.EveryMinute)]
public class ReleaseStockReservationsJob : IJob
{
  ...
}
```

After:
```c#
[NitroJob("Release stock reservations", Schedule.EveryMinute)]
public class ReleaseStockReservationsJob : INitroJob
{
  ...
}
```

## Owin / Users

- Owin is replaced by [ASP.NET Identity](https://docs.developers.optimizely.com/content-cloud/v12.0.0-content-cloud/docs/aspnetidentity) in nitro5.

- `NitroUser` has moved from `Avensia.Nitro.Core.Infrastructure.Owin` to `Avensia.Nitro.Core.Infrastructure.Identity`. You need to update your usings.

- The migration of users from nitro to nitro5 did not need any custom migrations. If you've made any project specific customizations this is of course untested territory.

- Projects using the older Membership provider (pre .NET 4.5) will need to do some migrating themselves. See
  https://docs.microsoft.com/en-us/aspnet/core/migration/proper-to-2x/membership-to-core-identity?view=aspnetcore-6.0#migrate-the-schema

- Merging of carts during login has moved from `Global.asax` (which no longer exists) to `AnonymousCartMergingMiddleware`. We suggest you add `AnonymousCartMergingMiddleware` from nitro5.

- `EPiServer.Security.PrincipalInfo.CurrentPrincipal` no longer has a setter, and is now a wrapper around `IPrincipalAccessor` (for legacy purposes). You can inject `IPrincipalAccessor` directly and use it instead.

## Migrations

- Migrations are now grouped into **folders per year** in `Avensia.Common/Migrations` in nitro5, we suggest you also group your migrations into folders by year (but this is highly optional). You can keep namespaces as is when you move the migrations.

## Avensia Tools / Nitro Tools

- **Avensia Tools** is renamed to **Nitro Tools**, we suggest you also rename it in your project (see `CmsMenuItemsProvider`).

- `OverRideLoginImagesModule` has not been migrated to nitro5, so we suggest you delete this file (or give the migration of this feature a try!)

- `SearchAdmin` no longer scans for implementations of `IDataQueryProvider`. You need to add implemetations explicitly in `CommonInitialisation`.

- To set your project specific url to backoffice:

  1.  Set `Nitro:Backoffice:RootPath` in `appsettings.json`
  2.  See NITROFIX in `service-worker-entry.tsx`

- To whitelist IP for backoffice access:

  1.  Add `BackofficeWhitelistMiddleware`
  2.  Set IPs in `appsettings.Prod.json` etc.

- All custom backoffice tools has to be included in **Nitro Tools** (it is no longer possible to have custom tools in CMS Admin):

  1. Remove the `[GuiPlugin]` attribute from your controller
  2. Add menu item for your tool in `CmsMenuItemsProvider` (we suggest using a new menu item "Nitro admin").

- To check if page is in on-page-editing-mode, inject `IContextModeResolver` and use `if (_contextModeResolver.CurrentMode.EditOrPreview())` (the `if (PageEditing.PageIsInEditMode)` is gone)

- Replace all `@Html.Partial()` with `@await Html.PartialAsync()` or `await Html.RenderPartialAsync()` if already in code block

- Tip! You can now inject dependencies into .cshtml razor pages like this: `@inject ISerializer _serializer`, meaning you no longer need to extend various framework classes (like `HtmlHelper`) and use ServiceLocator in them.

Also see [wiki on Backoffice](https://github.com/avensia/nitro5/wiki/Backoffice).

## Buildsystem

- We recommend replacing your entire `/buildsystem` folder with the one in nitro5, and then migrate all changes that has been done in your project's old buildsystem folder.

## Avensia.Tests

- nUnit in nitro is replaced by [MSTest](https://learn.microsoft.com/en-us/visualstudio/test/using-microsoft-visualstudio-testtools-unittesting-members-in-unit-tests?view=vs-2022) in nitro5, so instead of decorating your test classes with `[NUnit.Framwework.Test]` you should decorate them with `[Microsoft.VisualStudio.TestTools.UnitTesting.TestClass]`
- `Avensia.Tests` in nitro has been split into `Avensia.Common.Tests` (which contains unit tests for Avensia.Common) and `Avensia.IntegrationTests` (which contains integration tests) in nitro5
- We recommend replacing your entire old `Avensia.Tests` with `Avensia.Common.Tests` and `Avensia.Integration.Tests` in nitro5 and then migrate all changes that has been done in your project's old `Avensia.Tests` project.
- Attribute `[Category("EPiContext")]` is removed. This was previously used to avoid running time consuming tests on TeamCity on each build, so if you are using this you need to remove it.
- Note that there are still some tests that are not yet migrated, these are marked as TODO.

Also see [wiki on Tests](https://github.com/avensia/nitro5/wiki/Tests).

## Error pages

- 404 and error handling has been rewritten for Nitro5.
- Redirects are made by `PageNotFoundController` (similar to Nitro).
- Init of 500 error handling is done in Startup.cs (previously in `Avensia.Shop/Web.Release.config`).
- `OptimizedUrlContentResolver` is renamed to `RedirectorUrlResolver`. - Redirector now also handles the old assets feature (migration `UploadAssets` has moved into the package).

Also see [wiki on error pages](https://github.com/avensia/nitro5/wiki/Error-pages) and the docs in the [Redirector package](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/redirector).

**How to migrate error pages**

1. Replace your `PageNotFoundController` with version from Nitro5.
2. We also recommend you to rename your `OptimizedUrlContentResolver` to `RedirectorUrlResolver`.

## HttpContext, HttpRequest, HttpResponse, HttpUtility

- Microsoft has replaced `System.Web.HttpContextBase` with `Microsoft.AspNetCore.Http.HttpContext`, you need to do corresponding changes. Note that if you are in a service you can inject `IHttpContextAccessor`.
- Microsoft has replaced `System.Web.HttpRequestBase` with `Microsoft.AspNetCore.Http.HttpRequest`, you need to do corresponding changes. Note that members have changed slightly:
  - `HttpRequest.UserAgent` has been replaced by `HttpRequest.Headers.UserAgent`
  - `httpRequest.RequestContext.HttpContext` has been replaced with `httpRequest.HttpContext`
  - `httpRequest.InputStream` has been replaced with `httpRequest.Body`
  - `request.HttpMethod` has been replaced with `request.Method`
  - `request.Url` has been replaced with `request.Uri()`
- Microsoft has replaced `System.Web.HttpException` with `System.Net.Http.HttpRequestException`
- Microsoft has replaced `System.Web.HttpUtility.UrlEncode()` with `System.Net.WebUtility.UrlEncode()`.
- Microsoft has replaced `System.Web.HttpUtility.HtmlDecode()` with `System.Net.WebUtility.HtmlDecode()`.
- Microsoft has replaced `HttpUtility.ParseQueryString(blabla)` with `QueryHelpers.ParseQuery(blabla)` (in `Microsoft.AspNetCore.WebUtilities`)
- To check for the existence of an http header that's not in a standard property on `Headers`, you can use: `HttpContext.Request.Headers["myHeader"] != StringValues.Empty`
- Replace `HttpNotFound()` with `new NotFoundResult()`
- To return 400 bad request with a message: `return BadRequest("Must specify count");`
- `HttpResponse.Redirect` has had a sneaky change to one of its signatures: `Redirect(string url, bool endResponse)` is now `Redirect(string url, bool permanent)`. You should verify your calls to Redirect using the overload with a bool.

## Queues
- Registration of queues has moved from `QueuesRegistry` to `AddJobsAndQueues()` in `CommonInitialization`

## Controllers
* All `PageController` need to be `public` and concrete, otherwise EPi can't register their route (and you'll get 404).
* In Nitro5, we've added an explicit `CampaignPageController` since the routing did not find action methods in the abstract base class `ProductListingControllerBase`. We also added an index action method in `SearchPageController`. 

### Model binding

The custom `ModelBinder` has been removed (was used in `ProductListingControllerBase`).

How to read Json object sent from FE to BE (using POST):
1. Use `[HttpPost]` attribute on the method
1. Add `[FromBody]` attribute on the parameter, example:
```csharp
[HttpPost]
public ActionResult CreateShippingMethod([FromBody]CreateShippingMethodRequest request)
{
    // ...
}
```
If you have multiple params in a Json object in FE, add corresponding model class in BE. Example:<br/>

Before:<br/>
`public ActionResult CreateSomething(string param1, int param2)`

After:<br/>
`public ActionResult CreateSomething([FromBody] CreateSomethingRequest request)`

Try to name the model object `<method>Request` so that it is easy to see that they belong together.

If there is only one single param being sent from FE to BE, don't bother creating a model class in BE. Change FE instead to send this param in the query string. Example:<br/>
Before: `postJson('/wishlist/save', { productCode: productCode }`<br/>
After: `postJson('/wishlist/save?productCode=' + productCode, { }`. This way you dont need the `[FromBody]` thingie in BE.

### API controllers

API controllers should inherit `ApiControllerBase` in Nitro.Core package. This will make sure they are protected by auth token and that they are routed to `/api/[controller]`.

```c#
public class PriceImportController : ApiControllerBase
{
   // ...
}
```

:bulb: The name of your action method does not matter as long as you're not using explicit routes.

```c#
public class ShipmentController : ApiControllerBase
{
   [HttpPost]
   public ActionMethod Import([FromBody] ShipmentImportRequest)
   {
     // ...
   }
}
```

The above example can be invoked with a POST to `/api/shipment`. Do note that there is no action method specified. If you try to invoke it with `/api/shipment/import`, you will get a 404.

When you invoke an API controller with the name of the controller (omitting the method name) it will try to invoke the "first best" public method in the controller.

If you want to be able to specify the name of the action method, you need to add a Route attribute to the method, like so:

```c#
public class ShipmentController : ApiControllerBase
{
   [HttpPost]
   [Route("import")]
   public ActionMethod Import([FromBody] ShipmentImportRequest)
   {
     // ...
   }
}
```
Now we can POST to this endpoint using the url `/api/shipment/import`.

> There's no need to specify explicit routes for methods unless you have more than one public method in a controller.

#### HTTP method attributes
In ASP.NET Core when using attribute routing, method name does not have any affect in which HTTP options are routed to a method. If no `HttpMethodAttribute` is set on the method, all HTTP options will be accepted.
```c#
// This will accept all http methods. In ASP.NET MVC, only POST would be accepted due to the method name being prefixed with Post.
public ActionResult Post() {}

// This will only accept POST as http method. 
[HttpPost]
public ActionResult Post() {}
```

> It is good practice to specify the allowed HTTP method for each action method - even though this is not consistently done throughout the Nitro codebase.

Read more about routing: https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing?view=aspnetcore-8.0

### BlockControllers
In Nitro5, there is both a `NearestStoreBlockComponent : BlockComponent<NearestStoreBlock>` as well as a `NearestStoreBlockController : Controller`. The `GetNearestStore` endpoint is moved from `StoreListPageController` to `NearestStoreBlockController`. 

### Url and path
If you need to return the url/and or the host in a view model, use this:
   ```csharp
   using Microsoft.AspNetCore.Http;
   using Microsoft.AspNetCore.Http.Extensions;

   var url = _httpContextAccessor.HttpContext.Request.GetEncodedPathAndQuery();
   var host = _httpContextAccessor.HttpContext.Request.Host.ToUriComponent();
   ```

## Localization
* Localization admin UI has moved to Nitro Tools in nitro5.
* The `LocalizeAttribute` in Scope has been removed. 
* The language xml-files `shop_en-US.xml` and `shop_sv-SE.xml` has moved from `Avensia.Common/lang` to `Avensia.Shop/lang`.

## ISqlConnectionFactory
- `ISqlConnectionFactory` has been removed, replace any usages with `IConnectionStringHandler` instead
- Avoid reading the connectionstring like so: `ConfigurationManager.ConnectionStrings["EcfSqlConnection"].ConnectionString`. Instead use `_connectionStringHandler.Commerce.ConnectionString`

## Checkout
* To avoid a circular dependency problem, some methods have been extracted from `CheckoutServiceSiteSpecificCallbackBase` into a new `CheckoutServiceSiteSpecificCartCallbackBase`. You need to create a `CheckoutServiceSiteSpecificCartCallback` class and move some methods from your `CheckoutServiceSiteSpecificCallback` to it.