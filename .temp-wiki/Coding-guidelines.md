These are backend coding guidelines that we strive towards when developing nitro5. 

> This is a living document which we continously update as our way of working evolves. It's purpose is **not** to be a complete/comprehensive guide on how to write code in Nitro. And of course you are always allowed to use whatever guidelines makes sense in your project! These are the guidelines that we currently use in Nitro startersite and Nitro packages.

Also see our [coding guidelines for frontend development](https://github.com/avensia/nitro5/wiki/Frontend-Guidelines).

### Config
- For config that has **one global value** in your entire solution, use Microsoft's `IOptions<T>`. More details on how: https://github.com/avensia/nitro5/wiki/Options
- For config that might need **site and/or market specific values**, use our `NitroOptions`. More details on how https://github.com/avensia/nitro5-packages/tree/develop/packages/options

See guidelines on [AppSettings](https://github.com/avensia/nitro5/wiki/AppSettings) (both `IOptions` and `NitroOptions` uses `appsettings.json`)

### Packaging
See our [packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines) on what should be in a package and what should be in the startersite.

### Dependencies
- Make use of the benefits of _transitive dependencies_: Strive to keep the number of direct dependencies as low as possible.
- Use [OpenXml](https://www.nuget.org/packages/DocumentFormat.OpenXml/) to import/export from Excel, if possible (which is free - latest version of EPPlus is not)

### IoC
- Init classes that resides in Shop in Startup.cs, init classes that resides in Common in CommonInitialisation.cs

Also see: [Dependency injection](https://github.com/avensia/nitro5/wiki/Dependency-injection)

### Writing logs
Although EPiServer.Logging is still around [for backward compatibility](https://docs.developers.optimizely.com/content-management-system/docs/logging), it's recommended that all new code use the logging API defined in .NET Core (Microsoft.Extensions.Logging). See [logging docs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-8.0)

```csharp
using Microsoft.Extensions.Logging;
private readonly ILogger<SomeClass> _logger;

// Instance injected via ctor
_logger.LogDebug(...);
```

Do note! that the order of parameters have changes, with emphasis on the exception.
In Microsoft.Extensions.Logging, the exception object should be passed as the first argument to the logging method. This ensures that the exception details are captured along with the log message.
```csharp
 - logger.LogDebug("Informative message",ex);
 + logger.LogDebug(ex,"Even more informative message");
```

### CMS Blocks
**Where to place files**:
- Feature-specific blocks that should be placed under the feature itself, e.g. `Features/Product`
- Generic blocks (often content blocks) should be placed under `Features/Shared`
- The name of the block folder should not contain the word `Block`, e.g. `Features/Shared/Hero`
- If a block consists of a "container block" and an "item block", where the item block cannot be used outside the container block, then they should be placed in the same folder.
- Place frontend components in the same folder as the block models
- Use the same naming rules for frontend components, e.g. `HeroBlock.tsx`

**Naming of files**:
- Blocks should be suffixed with `Block`, e.g. `HeroBlock`
- Block controllers no longer exist, they are now `Component`s. They should be suffixed with `BlockComponent`, e.g. `HeroBlockComponent`

**Viewmodels**:
- Block components should return view models, named `<BlockName>ViewModel`, e.g. `HeroBlockViewModel`
- Make sure to `[JsonIgnore]` any properties that are not used by frontend
- If a block requires OPE support, subclass `BlockViewModelBase`, where EPI parts of the block will be available through the `block` property.
- If you return e.g. content area items in the view model, make sure to `[JsonIgnore]` the property on the block object, in order not to emit the same data twice
- Block view models should really be disconnected from the block model itself, but when we need to support OPE we make use of the inherited `block` property (from `BlockViewModelBase`)

### Migrations
- Use **idempotent** migrations only when there is an explicit need for the migration to be idempotent. Creation of new db tables, setting of default values etc only needs to run once and hence should be done in standard migrations.

### Performance
- The `MinBy` and `MaxBy` constructs are faster than `OrderBy` followed by `FirstOrDefault`. So instead of `priceList.OrderBy(p => p.Amount).FirstOrDefault()` do `priceList.MinBy(p => p.Amount)`. See https://github.com/avensia/nitro5/pull/414

### Async
- All major user flows should be async, all the way from controllers
- Use analyzer in `Avensia.Nitro5.Analyzers` to help assist async issues
- Minimize usage of Nito `AsyncContext.Run()`. If you use it, follow this syntax (also see https://github.com/avensia/nitro5-packages/pull/432):
```c#
AsyncContext.Run(async () => await _client.SomethingAsync(...));
```

### JSON
- Use System.Text.Json (instead of Newtonsoft) if possible 
- If using Newtonsoft, make sure to prevent Newtonsoft from using **all** registered JsonConverters in the system when calling  `JsonConvert.SerializeObject()` by explicitly specifying which converter to use, like:

```c#
var RawSerializerSettings = new JsonSerializerSettings
{
	Converters = new List<JsonConverter>() // Ensures no custom converters are used
};

JsonConverter.SerializeObject(myObject, RawSerializerSettings);

```

### Backoffice
- Use `[AllowedTypes(typeof(IContentBlock))]` on contentareas and let all blocks that should be available to editors implement `IContentBlock`, to hide blocks that editors should not use.
- Set the `GroupName` property of the `[ContentType]` attribute on page types, to group page types nicely in the "Add new page" view. See https://github.com/avensia/nitro5/pull/469
- Create an `UIDescriptor<T>` for all commerce content types and set the `AllPropertiesView` as the default view. See https://github.com/avensia/nitro5/pull/474
