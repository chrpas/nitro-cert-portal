In nitro5, we use **[Microsoft Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection)** (replacing StructureMap that was used in nitro classic) along with some extension methods in [Scrutor](https://github.com/khellang/Scrutor). 

The IOC container is configured in the `ConfigureServices` method in `Startup.cs` in the web shop project in nitro5, which calls `AddNitroCommon` method in `Avensia.Common/CommonInitialization` where you can find the majority of init for your project. 

Initialisation that needs to run after the IOC container is configured (corresponding to the `ConfigurationComplete` event in StructureMap) is done in `NitroStartupService.cs`. 

## Retrieving instances in static context
Although it is possible to still use `ServiceLocator.Current.GetInstance<T>()` to retrieve an instance in a static context, it is recommended to avoid this if possible.

## Accessing already registered services in startup

If you for whatever reason need to fetch an instance of a service already registered while still in Startup, you might be tempted to call `services.BuildServiceProvider()`. **We strongly advice against this!** 

Why? Calling `services.BuildServiceProvider()` opens a big ole can o' worms. For one, you're now relying on that every single dependency up to that point in the startup process has been fulfilled. So for example, if anyone ever adds a new dependency at any place in the graph as it exists at the call to ``BuildServiceProvider()``, Startup is going to fail, forcing them to rewrite your code. 

For two, any services registered as Singleton will get instantiated twice and just hang around doing who knows what.

What to do instead:
1. See method `ConfigureIoCDependentOptions(IServiceCollection services)` in Startup and the classes it calls, for guidance on how to register `IOptions` that needs stuff from the IoC container during init.
2. Have a look at how `Avensia.Scope.Serialization.SerializerOptions` are configured. You also have access to the ServiceProvider in the `services.Add*` extensions overloads.



