## 500
If server responds with 500, it will redirect to `/ErrorCode` (the `ErrorCodeController`). This uses `500.cshtml`, with no editorial content, and no logic other than parsing the language to display the page in from the host in the url. You should verify before go-live that `500.cshtml` is updated with customer layout and translations for all languages (OOTB it contains English and Swedish).

Note that you will only see the `500.cshtml` if the 500 happens during the first page load. AJAX/scope requests will display a snackbar "Page could not be loaded" instead. 

Also note that locally you will see the standard .NET developer exception page instead of `500.cshtml`, see `Startup.cs`:
```c#
if (env.IsDevelopment())
   app.UseDeveloperExceptionPage();
else
   app.UseExceptionHandler("/ErrorCode");           
```


## 404

The Redirector package tries to prevent 404s by:

* Automatically keeping track of urls when content is renamed or moved
* Storing a backup of all assets (*.js, *.css) that has ever been used by the site (aka "old assets")
* Editors can add manual redirects rules
* Editors can upload an Excel with product/category urls from their old site (Note: preferrably map `old_url` to `code` (instead of `old_url` to `new_url`), as this gives more flexibility and will handle moves/canonical changes etc. Ask customer to give you a list of `<old product url>` `<code>`!)

All current content urls are stored in table `ARContentUrls`, and all previous/historical urls are stored in table `ARPreviousContentUrls`. Job `FullRedirectorUrlBuilderJob` should be run once to initally populate the tables, and the `IncrementalRedirectorUrlBuilderJob` should be scheduled to keep it up to date.

All 404s end up in `PageNotFoundController` where it's processed. It will first try old assets, then redirector and if it cant find a redirect it will bail out with a 404. 

See more details in docs on [Redirector package](https://github.com/avensia/nitro5-packages/tree/develop/packages/redirector).

From func spec:
- Visitors will presented with a 404 error page when navigating to an url that does not exist (on HTTP response code 404).
- Web editors can use the Nitro CMS blocks to create rich content on the 404 error page.
- Nitro automatically creates redirect rules when content is renamed or moved in Episerver, avoiding 404s when content URLs changes.
- Administrators can add redirect rules to avoid 404s (e.g. from an old site to the new Nitro site). Rules can be added manually one-by-one, or imported using an Excel file.

## Old assets
Every time we make changes to the frontend code and run a production build with Webpack, the asset hashes will change (e.g. `0.chunk.2d5f87cf1208d33494e6.js`). So unless we only do backend changes in a deploy, there will always be new assets with a deploy.

When a browser comes back to the site that has been visited before, there will be references to the "last known" assets in the memory. If the deploy is a minor (not changing the major version) it might happen that this browser requests an "old asset" (which was replaced with the latest deploy). This would normally return a 404 since the "old asset" is not included in the most recent deploy.

To deal with this, we have an idempotent migration `UploadAssets` that will copy all assets right after deploy to a blob container called `oldassets`. This container will hence keep history of all versions of assets that has ever been used on the site - unless purged.

When the browser requests an "old asset", we get a 404 internally and end up in the `PageNotFoundController`, which will ask the `OldAssetsService` if the file can be located on the [historical] blob store. If the file is found there, the file is returned instead of a 404.

This can happen "once" per recurring browser, on the first page load after a non-major deploy 😅 As soon as the page has been rendered, the newly deployed assets will be active.