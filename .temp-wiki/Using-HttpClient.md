With .NET comes a restriction that we should reduce the number of active connections to external resources. It's not that the code itself is limited to it, but rather the settings in the NET runtime configuration.
If we do not adhere to this, there is a significant possibility that we will run into SNAT Port Exhaustion.

This can be alleviated by reducing the number of active connections, caching, and other types of strategies, but we should also review all usages of `HttpClient` and apply the following methodology instead. Using `IHttpClientFactory` will help reduce the number of active and open connections.

What's provided below is not a blanket solution for every problem, and there will be exceptions to this if you look around in the code base.

## Guideline
* Create a constant name for your HttpClient.
* Initialize it `services.AddHttpClient(<name>)`
  * Set MaxHttpConnections
  * Set Timeout
  * Consider retry functionality.
* Create and use the HttpClient in place where you make the call, and dispose of the result.
  
  E.g. `await _httpClientFactory.CreateClient(<name>).GetAsync();`
* Use async*/await
* Use absolute URI:s in the code for readability

## Considerations

* Determine how many connections this is going to make.
  * Client side and/or Jobs only?
  * Once in a or while all the time?
* Determine the timeout for the `HttpClient`
  * How long will this take on average? A file upload will probably not be equal to a Http GET for instance.
*  Determine if the call can be made more than once with a retry strategy.

## Why?
Wait, that's a lot of things to consider! I did not have to do that in .NET Framework!

Reason for all these considerations is grounded in one single change between the `MaxHttpConnections` property, which is now unbounded.
This used to be set to `10` but is now `unlimited`. This means that any HttpClient will try to use as many ports as it's requested by it, but the DXC environment allow at most* 128 active* external connections at the time. Exceeding that will cause `SNAT Exhaustion`. This is not handled by the IHttpClientFactory unless you pass the MaxHttpConnections property, and this has profound consequences (none of them good) when it happens.

This is also why we should consider the `timeout` for each connection.   
Take for instance an call to the search feature. Is 100s a reasonable amount of time for it to complete? Didn't we fail already at the 3s mark? But an upload of a file might very well last into the hundreds of seconds. You might want to have more than one HttpClient with different settings to the same service.
 

## Setting it up

### Name client
```csharp
internal class MyPackageConstants
{
    internal const string HttpClientName = "mypackageclient";
    internal const string HttpClientNameLongRunning = "mypackageclient-long-running-tasks";
}
```

### Initialization 
Basic initalization of a client can be done in the `services`, likely in `Startup.cs` or your own `Initialization` class
```csharp
services.AddHttpClient(MyPackageConstants.HttpClientName);

```

Setting  maximum number of connections
```csharp
services.AddHttpClient(MyPackageConstants.HttpClientName)
    .ConfigurePrimaryHttpMessageHandler(() =>
    {
        return new HttpClientHandler()
        {
            MaxConnectionsPerServer = 128
        };
});
```

With timeout:
```csharp
services.AddHttpClient(
    MyPackageConstants.HttpClientNameLongRunning ,
    (client) =>
    {
        // This might take a while
        client.Timeout = System.Threading.Timeout.InfiniteTimeSpan; 
    });
```

And finally a complex setup using options with a Bearer token.

```csharp
services.AddHttpClient(MyPackageConstants.HttpClientWithRetryName, 
    (provider, client) =>
    {
        // Get data from the options provider // appsettings.json
        var options = provider.GetService<IOptions<MyPackageOptions>>();
                
        // Set the BEARER
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.Value.ApiBearerToken);
        client.DefaultRequestHeaders.Add("x-site-id", options.Value.SiteId);
                
        // Set the Timeout
        client.Timeout = options.Value.Timeout;
    })
    .ConfigurePrimaryHttpMessageHandler(() =>
    {
        return new HttpClientHandler()
        {
            MaxConnectionsPerServer = 128
        };
    });
```


## How to use the configured connection

Start by injecting the `IHttpClientFactory` into your class
```csharp
using System.Net.Http;

public class MyPackageService
{
    private readonly IHttpClientFactory _httpClientFactory;

    public MyPackageService(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }
}
```

Using the client should be created in place in this fashion.
Create the client in the method you're using it, and not in any constructor.

```csharp
public async Task MyMethod() {
  var httpClient = _httpClientFactory.CreateClient(MyPackageConstants.HttpClientName);
  var url = 'https://www.example.com/'
  using var response = await httpClient.GetAsync(url);
}
```

### Read more
* https://learn.microsoft.com/en-us/aspnet/core/fundamentals/http-requests

* https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests

* https://learn.microsoft.com/en-us/azure/app-service/troubleshoot-intermittent-outbound-connection-errors

* [SNAT with AppService](https://4lowtherabbit.github.io/blogs/2019/10/SNAT/)

## Real world examples:

* [Example initialization @ Voyado Nitro5](https://github.com/avensia/nitro5-packages/blob/2a97999856c25ae2c7a7096d979572793e881c8f/packages/voyado-connector/src/Avensia.Nitro5.Voyado.Connector/Initialization/VoyadoInitialization.cs#L15)

* [Ingrid Initialization @ Apohem ](https://github.com/avensia/apohem/blob/edb5938099767f01a7e0d1a196dd7c6f1820c07a/src/Avensia.Common/Features/Ingrid/IngridInitialization.cs#L41)
