* Url to Episerver backoffice is `/backoffice` in Nitro5. See below on how to change to a project specific backoffice url.
* Access to backoffice is OOTB restricted to Avensia's IPs. See below on how to allow also customer IPs.
* Menu for **Nitro Tools** is created in `CmsMenuItemsProvider`.
* Menu item for Episerver´s **Order UI Management** is removed in `CustomMenuAssembler`, so customers don't accidentally use Epis built-in order UI instead of ours in Nitro Tools.
* Several middleware skips execution if backoffice request, e.g. `LanguageAndMarketMiddleware`, `NoCacheAttribute`, and `RedirectToCleanUrlMiddleware`
* Redirect from `/backoffice` to `/backoffice/cms` is configured in `Startup.cs`
* It's possible to enable Opti ID for backoffice access, see https://github.com/avensia/nitro5/pull/602

## On page editing
`Avensia.Scope.Episerver` contains logic for enabling the **On Page Editing** feature for editors. 

Always enable On Page Editing for properties, if possible! Use the `EpiProperty` component, like:
```tsx
import EpiProperty from '@avensia/scope-episerver';

<EpiProperty for={props.page.mainBody} />
```


If you only need the value of a property, you can use `epiPropertyValue()`
```tsx
import epiPropertyValue from '@avensia/scope-episerver';

const headerValue = epiPropertyValue(props.header);
```

Also see [Documentation in Scope on On Page Editing(nitro classic)](https://github.com/avensia/scope/blob/master/docs/ON_PAGE_EDIT.md)

## How to change url to backoffice
1. Update value of `Nitro:Backoffice:RootPath` in `appsettings.json`

If you still have service worker enabled you need to update service-worker-entry.tsx with the following:
```javascript
// NITROFIX: Change url to backoffice here. Use something project specific!
pathsToByPassServiceWorker.push(/backoffice/i);
```
> ⚠️ The [service worker has been discontinued](https://github.com/avensia/nitro5/pull/413) and we don't recommend projects to continue using it

## How to restrict access to backoffice to specific IPs
By default, only Avensia's IPs are allowed to access backoffice. You should add customer's IPs as well. There is a placeholder setting `Nitro:Backoffice:AllowList` in `appsettings.json` that is expected to be populated by Octopus. Check [Nitro5 in Octopus](https://octopus.avensia.se/app#/Spaces-1/projects/nitro5/variables) for the default setting.

![image](https://github.com/avensia/nitro5/assets/6929325/6a423196-3049-493f-9bad-19c229a86a61)

If you don't want to restrict the access, you can remove registration of the `BackofficeAllowListMiddleware` in `Startup.cs`.

## The backoffice search
The search in backoffice is built-in by Optimizely and it uses a Find index (even though you might be using some other content index, like esales, for the site). Run the Optimizely **Search & Navigation Content Indexing Job** once to enable the backoffice search.

For catalog entries, you can search using `Code` and `Name`. To customize this, see `CatalogEntryDataQueryProvider`.

More details on the backoffice search in https://github.com/avensia/nitro5-packages/pull/170

## Permissions to admin tools
Permissions to backoffice tools should be set using "Permissions for functions". Use the `[AuthorizePermission]` attribute on your admin controller and use "NitroTools" as group name. Example:
```c#
[AuthorizePermission("NitroTools", "MyAdmin")]
public class MyAdminController : Controller
...
```

More info:
- https://github.com/avensia/nitro5/pull/329

## IContentBlock
The interface `IContentBlock` is defined in Nitro.Core package and should be used to restrict which block types that are available to editors, like this:
1. Let all CMS blocks that should be available to editors implement interface `IContentBlock`:
```c#
public class VideoBlock : IContentBlock
{
   // ...
}
```
2. Restrict all contentareas to only allow blocks of type `IContentBlock`:
```c#
[AllowedTypes(typeof(IContentBlock))]
public virtual ContentArea MainBody { get; set; }
```
This will hide all block types that editors should **not** in contentareas.
