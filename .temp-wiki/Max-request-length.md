How to specify a max request length in .NET 6:

```c#
// startup.cs:
services.Configure<FormOptions>(opt =>
{
   opt.MultipartBodyLengthLimit = 10000000000;
});

------
app.UseWhen(
   context => context.Request.Path.StartsWithSegments("/pimdatareciever"),
   appBuilder => appBuilder.UseMiddleware<SetPimDataReceiverMaxRequestBodySizeMiddleware>());

// SetPimDataReceiverMaxRequestBodySizeMiddleware.cs:
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace Avensia.Shop.Middleware
{
    public class SetPimDataReceiverMaxRequestBodySizeMiddleware
    {
        private readonly RequestDelegate _next;

        public SetPimDataReceiverMaxRequestBodySizeMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public void Invoke(HttpContext context)
        {
            var feature = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
            if (feature is not null)
                feature.MaxRequestBodySize = 314572800;
            
            _next(context);
        }
    }
}

// in Program.cs:
.ConfigureWebHostDefaults(webBuilder =>
{
   webBuilder.UseStartup<Startup>();
   webBuilder.ConfigureKestrel(options =>
   {
      options.Limits.MaxRequestBodySize = 52428800;
      options.Limits.MaxRequestLineSize = 2097151; // Kestrel can only set this globally, not for specific paths
      options.Limits.MaxRequestBufferSize = 52428800;  
   });
})
```