For config values that has **one global value** in the entire solution, we are using the [options pattern](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-6.0) and Microsoft's `IOptions<T>`.

For config values that need **site and/or market specific values**, you can use `INitroOptions<T>` instead of `IOptions<T>`. This enables you to set unique config values in `appsettings.json` for each site/market, without writing any additional code of getting the site/market specific value other than injecting `INitroOptions<T>` instead of `IOptions<T>`, and providing the specific site/market when you need the value. More details on how to use `INitroOptions` can be found in the docs of [Avensia.Nitro5.NitroOptions](https://github.com/avensia/nitro5-packages/tree/develop/packages/options).

# Using IOptions
Since everything you inject as constructor params has to be registered in the container, you cannot simply add constructor params of type `int`, `string`, `TimeSpan` etc. Instead you should add an options class for these parameters and inject it to the service(s) using it. 

## The options class

Guidelines:
- Options should be named `<Subsystem>Option` with a corresponding section in appsettings 
- Options should have XML comments to describe their purpose
- Options should have default values ín code wherever possible (e.g. timeouts, batch sizes)
- The option class should be in its own separate file (rather than putting it in the same file as the service that consumes it)
- For timeout options, use a `TimeSpan` and name the option `<xxx>Timeout` (rather than e.g. `CacheTimeoutInMinutes` or `ExportDelayDays`)
- Use `[Required]` attribute to denote a mandatory prop that should be validated
- Options that should be transformed in Octopus must be specified in appsettings (even with default values), since Octopus cannot _insert_ new options.

Example of an options class:
```c#
public class StockReservationOptions
{
    /// <summary>
    /// The name of the table to store stock reservations in
    /// </summary>
    public string ReservationTableName { get; set; } = "dbo.Avensia_StockReservation";

    /// <summary>
    /// Amount of time to keep reservation
    /// </summary>
    public TimeSpan StockReservationTimeout { get; set; } = new TimeSpan(0, 20, 0);
}
 ```

## Injecting options
Guidelines:
- Inject your options as `IOptions<>`, preferrably as the first parameter

Example:

```c#
using Microsoft.Extensions.Options;

public class HubSpotClient : IHubSpotClient
{
    private readonly string _accessToken;
    private readonly string _baseUrl;

    public HubSpotClient(IOptions<HubSpotOptions> options, ISomeService someService)
    {
        _accessToken = options.Value.AccessToken;
        _baseUrl = options.Value.BaseUrl;
    }

    // ...
}
```

## Binding of options against appsettings
Guidelines: 
- Binding of options against `appsettings.json` should be done in the site, not in the package
   - Do not pass `IConfiguration` to the initialization method in the package
   - Use `Action<T>` to enable developers to define options both in appsettings and in code
   - Packages should use one single "external" options class - which can be mapped to a single section in appsettings.json

Example init in nitro5:
```c#
services.AddStockSubsystem(o => configuration.GetSection("Nitro:StockReservations").Bind(o));
```

... or to bind some options using appsettings and some in code:
```c#
services.AddCheckout(o =>
{
    configuration.GetSection("Nitro:Checkout").Bind(o);
    o.UseHttpsForAllCallbacks = true
});
```

Example in packages:
```c#
public static void AddStockSubsystem(this IServiceCollection services, Action<StockReservationOptions> configureOptions)
{
    services
        .AddOptions<ElevateOptions>()
        .Configure(configureOptions);
}
```

## Validation of required attributes
Guidelines:
- Required options should be marked as `[Required]` and validated via an `IOptionsBuilder`

Example of options class with a required option:
```c#
public class HubSpotOptions
{
    /// <summary>
    /// Access token found in the HubSpot portal, used to retrieve authentication token
    /// </summary>
    [Required]
    public string AccessToken { get; set; }
}
```

To validate the required attributes, use an OptionsBuilder:
```c#
public static void AddHubSpot(this IServiceCollection services, Action<HubSpotOptions> configureOptions)
{
   services.AddOptions<HubSpotOptions>()
      .Configure(configureOptions)
      .ValidateDataAnnotations()
      .ValidateOnStart();

   // ...
}
```

If your options class is nested (like the `VoyadoOptions` class which contains a property with a list of `VoyadoEnvironmentOptions`), use extensionmethod `ConfigureAndValidate` in `Microsoft.Extensions.DependencyInjection` to validate everything recursively:
```c#
public static void AddVoyado(this IServiceCollection services, Action<VoyadoOptions> configureOptions)
{
   services.ConfigureAndValidate(configureOptions);
   
   // ...
}
```

## Reading options in init metod
If you need to _read_ the options after it's been bound, you have to create and register it manually, like so:
```c#
public static void AddElevate(this IServiceCollection services, Action<ElevateOptions> configureOptions)
{
    var options = new ElevateOptions();
    configureAction.Invoke(options);
    services.AddSingleton(Options.Create(options));
    // Do stuff with options
}
```

In addition, if you need to validate it before using it, you can use this pattern:
```c#
public static void AddElevate(this IServiceCollection services, Action<ElevateOptions> configureOptions)
{
    var options = new ElevateOptions();
    configureAction.Invoke(options);
    Validator.ValidateObject(options, new ValidationContext(options), true);
    services.AddSingleton(Options.Create(options));
    // Do stuff with options
}
```
