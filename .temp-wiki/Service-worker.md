> ⚠️ The [service worker has been discontinued](https://github.com/avensia/nitro5/pull/413) and we don't recommend projects to continue using it

For projects still using the service worker:


The service worker is a piece of resident code that sits in the browser, and is installed on the first visit to the site. 

The main benefit of using a service worker is decoupling the user experience from the quality of the network. By going offline-first the load time is constant and that obviously enables a much better user experience than always having to wait for the network.

## Enabling/disabling serviceworker
The service worker is normally enabled only on production builds, meaning it is disabled locally and enabled in DXP. This is because during development we do not want things to be fetched from a cache.

You can disable the serviceworker completely by setting property `hasServiceWorker` on variable `scopeConfig` in `buildsystem/index.ts` to **false**.

You can enable the serviceworker locally by setting buildvariable `serviceworker` to **enabled** (note that the `hasServiceWorker` property also needs to be **true**):

```console
scope -sy frontend:build serviceworker=enabled
```

See function `withServiceWorker()` in [nitro5-buildsystem/src/index.ts](https://github.com/avensia/nitro5-packages/blob/f1f5723287d243443b6de7dd36358513f6f9cdbc/packages/scope-buildsystem/src/index.ts#L660)

Note: If you have installed the service worker locally, you need to explicitly remove it from the browser to get rid of it. In Chrome this can be done via Developer tools -> Application -> Service workers -> Unregister. Then reload the page to finalize the removal.

To disable the service worker for specific urls, you can append query string param `skipserviceworker` or `ssw` (like `?ssw=1`) to the url. This is useful for when you need to have the server respond to the request instead of letting the service worker do it.

You can also disable entire paths from the service worker, see `pathsToByPassServiceWorker` in [`service-worker-entry.tsx`](https://github.com/avensia/nitro5/blob/9b2182a47e27148fc10937c1a742c81e7fbd2f7b/src/Avensia.Common/Features/service-worker-entry.tsx#L10).

--- 
Read more
* https://developer.mozilla.org/en/docs/Web/API/Service_Worker_API
* [Docs in Scope (nitro) on the Service worker](https://github.com/avensia/scope/blob/master/docs/SERVICE_WORKER.md)