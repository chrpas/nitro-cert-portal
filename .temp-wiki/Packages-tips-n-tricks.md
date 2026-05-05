## Including *.cshtml views
To include  `*.cshtml` Razor views in your package, change in the `*.csproj` file:
1. Use project type `<Project Sdk="Microsoft.NET.Sdk.Razor">` (see [docs](https://learn.microsoft.com/en-us/aspnet/core/razor-pages/sdk?view=aspnetcore-6.0))
2. In `<PropertyGroup>` add `<AddRazorSupportForMvc>true</AddRazorSupportForMvc>`

In suite: Also see `AdminPluginVirtualPathProvider`

Troubleshooting: 

 - If you are getting odd compilation errors in the `.cshtml` file, and/or the warning `Detected Razor language version downgrade. This is typically caused by a reference to the Microsoft.AspNetCore.Razor.Design package. Consider removing this package reference.` - remove reference to `Microsoft.AspNetCore.Mvc`!

## Including CMS blocks in a package
To include the definition of a CMS block, including the frontend component (the `*.tsx` file), in your package, you need:
1. A reference to the Nitro.Core package where the `IContentBlock` interface is defined
2. Generate TypeScript definitions (on your block viewmodel), see docs on [tstypegen](https://github.com/avensia/nitro5/wiki/tstypegen) 
3. An `index.ts` where you export your block component (the `*.tsx` file), like `export * from "./Form/HubSpotFormBlock";`
4. Include the full namespace of the viewmodel in the @Component.For directive in your block component (and with correct capitalization of the namespace)
5. Create a npm package
6. Add the `ImageUrl` attribute to your block to get the same preview thumbnail as the other blocks in nitro5:
   ```c#
   [ImageUrl("~/ClientResources/Avensia/Editors/ContentThumbnails/New-contentblock.png")]
   ```

To make it work in nitro (or any other project consuming your package), you need to:
1. Create an rc of the npm package
2. Install this to nitro
3. Set the path to your `*.tsx` component in node_modules to the `componentsRootPaths` variable in `buildsystem/index.ts`, like:
    ```js
   path.join(rootDir, 'node_modules/@avensia/nitro5-hubspot-connector'),
    ```

## Use `internal` in your package without getting "parameter less accessible than method" compilation error
- Make your outward facing interface `public`
- Make the implementation of that interface `internal`
- Now you can have all interfaces below this layer internal, as they are being injected into an internal class!