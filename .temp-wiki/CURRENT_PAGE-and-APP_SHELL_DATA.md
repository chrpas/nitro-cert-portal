There are two important global variables in frontend: the `window.APP_SHELL_DATA` and `window.CURRENT_PAGE` variables. These are set by Avensia.Scope, by `@Html.RenderScopeBottom(Model)` in your `_Layout.cshtml` and are used to set the initial state in the Redux store. To access them in frontend, use `useSelector()` like:

```ts
const checkoutPageUrl = useSelector(state => state.appShellData.siteSettings.checkoutPage);
```

Note that there is a typed `useSelector()` exported from `Shared/State` which you should use instead of the one directly from react-redux.

To debug the **initial** values (set in `_Layout.cshtml`) of `APP_SHELL_DATA` or `CURRENT_PAGE`, you can either open Developer Tools (F12) and type `window.CURRENT_PAGE` in the console, or append `?scope` to your request, which will give you the entire json sent from backend. 

To debug the **current** values of `APP_SHELL_DATA` or `CURRENT_PAGE` in the Redux store, use the Redux devtols browser extension. 


## CURRENT_PAGE
`CURRENT_PAGE` is a JSON object with stuff that is specific to the current page. This is the JSON representation of the view model you pass to `Component.For(...)` in your backend controller. You can inspect its value by running window.CURRENT_PAGE in the javascript console or by appending ?scope to our url, e.g. navigate to https://dev.nitro5.com/?scope (see `ScopeAsyncActionFilter`.) `CURRENT_PAGE` is refreshed on each page load.

CURRENT_PAGE contains the name of the React component that should be used to render this page.

## APP_SHELL_DATA
`APP_SHELL_DATA` is a JSON object with stuff that are not specific to any page, but common to the entire application - like the main menu, the cart, the footer, etc. It stays between page loads, and will only be refreshed when something actively triggers a refresh (like a full page load - but more on this below). AppShellData also contains the SiteSettings (with e.g. links to known pages like the checkout page).

In backend, there is a base class for app shell data in Avensia.Scope, the `AppShellDataBase`. It contains a few properties like `Culture`, `CurrentTheme` and `LanguagePhrases` , and you are supposed to extend this base class with the data your app shell needs in your project. See `AppShellData` and `AppShellDataFactory` in startersite.

### Caches of APP_SHELL_DATA
APP_SHELL_DATA is kept in memory in frontend when navigating between pages on the site. It's refreshed:
- on **full** page loads, e.g. the first page load when visiting the site, when switching language/market, when logging in/out
- every 5 minutes (see `initUpdateAppShellDataOnSchedule` in your `browser-entry.tsx`) by calling `/appshell/data` (which routes to `AppShellController` in Scope.Mvc)

Some parts of APP_SHELL_DATA is cached in backend and hence kept also between full page loads. `AppShellCacheService` caches the parts of APP_SHELL_DATA that are connected to settings on the start page. It uses `ISynchronizedObjectInstanceCache` and is refreshed every 30 minutes, or when the start page is published (see `AppshellContentEventsRegistration`).  This cache is "contextual" meaning that there are separate caches for each combination of language/site/ecom-context (see `ContextualCacheService`). 

Frontend can instruct backend to refresh APP_SHELL_DATA by setting the `X-IncludeAppShellData` header on a request to backend (see https://github.com/avensia/nitro5-packages/blob/develop/packages/scope/src/Avensia.Nitro5.Scope/ScopeConstants.cs#L17). This can be useful to e.g. reload the appshelldata when user logs in/out or after a time of inactivity.
 