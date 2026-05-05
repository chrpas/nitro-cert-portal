The HTML for the first page load is rendered on the server, the "ssr" in Scope. This is done using [ClearScript](https://github.com/microsoft/ClearScript), a .NET wrapper for the V8 JavaScript engine (the same engine running in Chrome). It uses  `_Layout.cshtml` and the `renderDocument()` function in `server-entry.tsx` and to render the HTML. The HTML is returned as the response of the request. 

## Turning ssr on/off
See method `ShouldServerRender` in [`DefaultLayoutRenderer`](https://github.com/avensia/nitro5-packages/blob/develop/packages/scope-mvc/src/Avensia.Nitro5.Scope.Mvc/ServerSideRendering/DefaultLayoutRenderer.cs) in Scope.Mvc.

The server side rendering (SSR) is forced **on** in the following scenarios:
1. You apply query string param `?ssr=on` to your request
2. For user agents `googlebot` and `bingbot` (and optionally if you supply more user agents as param to `services.AddScopeMvc()`).
3. If the referrer (`httpContext.Request.Headers["Referer"]`) is from our site - this means that the user clicked on a link that wasn't caught by the frontend, so we err on the side of caution and server render

Server side rendering is turned **off** in the following scenarios:

1. You apply query string param `?ssr=off` to your request
2. If your project added any user agents that should skip ssr (as params to `services.AddScopeMvc()`) (previously "iphone" and "ipad" turned ssr off, but this was removed in https://github.com/avensia/nitro5-packages/pull/762))
3. The request is from the app
3. The reactrenderer is currently busy.

## Debugging SSR
If you run into errors during the serverside rendering (the "ssr"), usually the easiest way of debugging is to turn off serverside rendering by adding `?ssr=off` to your url. Then hopefully you'll get the same error in the browser! 

Also see https://github.com/avensia/nitro5-packages/blob/develop/packages/scope-mvc/src/Avensia.Nitro5.Scope.Mvc/ServerSideRendering/EnableSSRDebuggingController.cs