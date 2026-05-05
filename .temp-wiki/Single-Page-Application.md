Nitro is a **Single Page Application**. The only full page load is done on the first page visit. On subsequent requests we only replace content on the page.

In Nitro, the HTML is rendered in frontend by [React](https://reactjs.org/) components. Communication between frontend and backend is done using JSON. 

The SPA behaviour in Nitro is implemented using the [Scope](https://github.com/avensia/nitro5-packages/tree/develop/packages/scope) package. The `ScopeAsyncActionFilter` is an MVC action filter which takes the result from the action method in the controller, serializes this result into JSON and returns JSON as the response of the request. React then uses this JSON to render the HTML in the browser

![The Scope processing pipeline](https://github.com/user-attachments/assets/7b57d567-0cdd-48cd-9d25-8f1a71e904c9)

## Is it a Scope request?
The serialization to JSON will only happen if the request if a "Scope request", meaning the return type of the action method is a  `ReactViewComponentResult`. 

> Use the Scope `Component.For()` method to turn your view model into a `ReactViewComponentResult`

Like so:

```c#
public class StartPageController : PageController<StartPage>
{
    public ActionResult Index(StartPage currentPage)
    {
        var model = new StartPageViewModel(...);
        return Component.For(model);
    }
}
```

If the action method does not return a `ReactViewComponentResult`, the result is handled as a standard Razor action result. This means that it is possible to also use Razor views if you need it. You should only do that for legacy purposes or if you're integrating third-party code that you don't control.

Also the backoffice Nitro Tools are standard MVC Razor views.

## The first page load: The server side rendering
The very first page load, when user visits the site for the first time, differs from the subsequent requests. 

A common approach with Single Page Applications is to return an empty HTML for the first page load and let React render the HTML in the browser. This is a valid approach for some cases but it doesn't work for e.g. search engine crawlers that don't execute JavaScript.

In Scope, instead of returning an empty HTML, the HTML for the first page load is rendered on the server using the "Server-side rendering" feature in Scope (the "ssr"). This is done using [ClearScript](https://github.com/microsoft/ClearScript), a .NET wrapper for the V8 JavaScript engine (the same engine running in Chrome). It uses  `_Layout.cshtml` and the `renderDocument()` function in `server-entry.tsx` to render the HTML. The HTML is returned as the response of the request. 

During server side rendering, the server guesses the client's breakpoint.  When the HTML have reached the browser, we verify if the guess was correct. If it is, we simply do a **hydration** process, meaning that event handlers are attached making the page interactive and buttons etc clickable. (Hydration is a faster alternative to a full render, since it skips the verification step).

If the server guess of breakpoint turns out to be incorrect, the browser does a full render. This means that a **second render** happens but this time it's executed in the browser instead of on the server. The browser uses the `browser-entry.tsx` file and it essentially takes the server rendered HTML, verifies it and hooks up event listeners.
 
![The Scope processing pipeline of the first page load](https://github.com/user-attachments/assets/93805569-ff66-403d-96d3-811a55c70a34)

As a developer, you need to be aware of that the same JavaScript code will be executed on both the server and in the browser. Since the APIs available in the browser aren't available on the server you cannot use those APIs unless you wrap it in a conditional to make sure the current environment is the browser:

> Use the Scope `isBrowser()` method (in `device-type.ts`) to wrap code that uses APIs that are not available on the server in a conditional.

Like so:
```js
import { isBrowser } from '@avensia/scope';

export function bindStuff(...) {
  if (isBrowser()) {
     ...
  }
}
```

 > Use the Webpack build environment variable `__BROWSER__` when importing modules not available on the server.

 Like so:
 ```js
if (__BROWSER__) {
    require('some-module-unavailable-on-server');
}
```

Also note that the serverside rendering is disabled for iPhones and iPads, because they actually render faster without the ssr.

## Subsequent page loads: AJAX and JSON
For the subsequent page loads to work as intended, all internal links must be rendered using the Scope `Link.tsx` component.

> Use the `Link.tsx` component to create internal links

Like so:
```js
import Link from 'Shared/Link';

function MyPage(...) {
    return <Link to={destinationUrl}>A simple internal link</Link>
}
```

The Link component captures when the user clicks on the link. This is what happens on a normal click (that is, not a click on the scroll wheel or a click on the right mouse button):

1. The browser is **prevented from making a full page load** for that click event
2. The **address bar in the browser is updated** to represent the clicked link (see the `pushState()` method in `history.ts`)
3. An **Ajax request** for the link the user clicked on is sent to the backend
4. The ScopeActionInvoker receives the request in the backend. Since it's not a full page load, there is no server rendering, it simply **serializes the view model into JSON**.
4. The **JSON is returned as the response** of the request
5. **React** uses the JSON to render the HTML in the browser

## "Fullstack" view models: TSTypeGen
The Nitro frontend is strongly typed using [Typescript](https://www.typescriptlang.org/). This means that for all backend C# view models that are serialized into JSON and returned as response of Scope requests, there must be corresponding frontend Typescript definitions, so that the JSON can be deserialized into objects.

In Nitro, Typescript definitions are automatically generated by [TSTypeGen](https://github.com/avensia-oss/tstypegen) from all C# classes that are decorated with the `[GenerateTypeScriptDefinition]` attribute. TSTypeGen vill be invoked as part of the normal build (the `nitro build` task), so it will happen automatically. There is also a separate `nitro frontend:update-tstypes` task if you want to run it separately. You'll find the frontend types in the `Backend.d.ts` file.

> Decorate your C# view models with the `[GenerateTypeScriptDefinition]` attribute

Like so:
```c#
[GenerateTypeScriptDefinition]
public class MyViewModel
{
    public string ExampleProperty { get; set; }
    ...
}
```
The above will result in the following type in `Backend.d.ts`:
```ts
declare namespace Backend {
  interface MyViewModel {
    exampleProperty: string;
    ...
  }
  ...
}
```

If there are properties in the view model that you for some reason do not want to serialise into JSON and send to frontend, you can ignore these with the [JsonIgnore](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonIgnoreAttribute.htm) attribute, like so:
```c#
[GenerateTypeScriptDefinition]
public class MyViewModel
{
    [JsonIgnore]
    public string PropertyNotRelevantForTheFrontend { get; set; }
```

## How React knows which component to render: The component registry
In Nitro/Scope, all routing is handled by Episerver. When navigating to a url, the frontend receives only a view model from backend. How does React know which component to render for this view model? 

The view models from backend always contain a `componentName` property (see `ScopeAsyncActionFilter`). It's the full .NET name of the view model. Scope uses this to look up the corresponding component in the Scope **component registry**.

The component registry (see `build-component-registry.ts`) maps names of components to actual components. You'll find the mapping in the `Avensia.Common/Features/Shared/component-registry.tsx` file. This file contains all .tsx files that include the `@Component.For` pragma.

> Include the `@Component.For` pragma in your React components

Like so:

```js
/**
 * @ComponentFor Avensia.Common.Features.Start.StartPageViewModel
 */
```

The component registry is created as part of the normal build (the `nitro build task`), so it will happen automatically. There is also a separate `nitro frontend:build-component-registry` task if you want to run it separately 

## Summary
<details>
<summary>Summary of above</summary>

### During build
1. **TsTypeGen** creates frontend types from the backend types for all C# types with the **GenerateTypeScriptDefinition** attribute (the view models)
2. The **component registry** is created from all .tsx files with the **@ComponentFor** pragma

### The very first HTTP request
1. Server-side: `ScopeAsyncActionFilter` intercepts the request. If the controller returns a view model using **Component.For**, the response will be **HTML created by the server side rendering**.
2. Client-side: The browser does either a **second render**, or simply a hydration process.

### Subsequent requests
1. Client-side: Scope creates **AJAX requests** for clicks on internal links.
2. Server-side: `ScopeAsyncActionFilter` intercepts the request. If the controller returns a view model using **Component.For**, the response will be the **view model serialized into JSON**.
3. Client-side: The view model is **deserialized** into a TypeScript type, and Scope uses the **component registry** to find the corresponding component to render.
</details>
