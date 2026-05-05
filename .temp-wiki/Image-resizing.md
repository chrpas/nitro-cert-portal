The built-in image resizing is a central component in Nitro. For Nitro5 we have retired [ImageResizer](https://imageresizing.net/) and instead replaced it with a two-part solution:

- **Locally** we use [SkiaSharp](https://github.com/mono/SkiaSharp) which is a free, cross-platform API based on Google's Skia Graphics Library. It's implemented as `ImageResizingMiddleware` which intercepts resizing parameters, fetches the blobs and transforms them using Skia.
- **In DXP** we use [Cloudflare's image resizer](https://developers.cloudflare.com/images/image-resizing/url-format/). This means that the site no longer needs to deal with CPU intensive resizing work. Enabling the Cloudflare resizer is something that needs to done by Optimizely support - per project.

Example of a local resize url:<br/>
https://dev.nitro5.com/globalassets/9631246198.jpg?ref=A52C1C3CF5&width=320&format=jpeg

The same url, using Cloudflare's resizer:<br/>
https://www.nitro5.com/cdn-cgi/image/width=320,format=jpeg/globalassets/9631246198.jpg?ref=A52C1C3CF5

This difference in syntax is taken care of by the [image component](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Shared/Image/index.tsx) automatically.

Note: The local image resizer implementation is not intended to be a full-fledged resizer with a ton of options. As such, you should not depend on it to tweak out different resizer settings. It pretty much covers basic resizing. To get more control of the images, please use the [Cloudflare resizer](https://developers.cloudflare.com/images/image-resizing/url-format/), which you can test directly in the browser (via any of the DXP environments) before implementing it in code.

### Image domain
Image urls in nitro5 are generated with the full domain, and for this a new prop `ImageDomain` has been introduced to the appshell. By default it will be the same as for the site, but in case of multiple country domains (e.g. www.nitro5.se, www.nitro5.no, www.nitro5.fi), it might be beneficial to implement a _static domain_ that all sites use (e.g. static.nitro5.com). This way, images won't have to be resized _per domain_ and less-visited domains will already be "warm" from the traffic to the more busy domains.

### Ref parameter
The `ref` parameter, which is appended to all image urls, is a so-called _cache buster_ and it is calculated as a hash from the blob data (in `OptimizedUrlResolver`). This is the reason we can cache images heavily: if the binary data changes, the ref-parameter will change and the url will be considered as new, and hence it will "bust" the cache.

> Note: Never emit an image url without the ref-parameter. It makes it impossible to change it by reusing the same filename.

### Formats and conversion
With the Cloudflare image resizer we don't really need to worry about image formats anymore. Use `format=auto` (which is the default) to enable automatic conversion to modern image formats [WebP](https://developers.google.com/speed/webp) and [AVIF](https://blog.cloudflare.com/generate-avif-images-with-image-resizing/). Cloudflare will be able to determine whether these formats can be used by looking at the http headers.

> Tip: To use automatic image conversion [to WebP and AVIF], make sure you don't explicitly specify a format to the resizer

In "old Nitro", Cloudflare would not _resize_ the image, but it would try to convert it to WebP - through a feature called [Polish](https://developers.cloudflare.com/images/polish/). This less-known feature would automatically kick in and "protect" us from serving bloated images. 

Since both WebP and AVIF supports transparency, there's no longer a need to enforce PNG format to achieve transparency.

> The local resizer does not support WebP and AVIF so don't be surprised if you don't see these formats during development.

### Caching
For the local resizer, there's a very simple memory cache store the resized images during the same session. Contrary to before there is no longer a disk cache.

Cloudflare will cache all images (just like before), using the combined url with parameters as a unique key. To tell if an image is cached or not, you can inspect the response headers. Upon first request, `cf-cache-status` will have the value `MISS`, but on subsequent requests it will have the value `HIT`.

Images are [by default cached 1 year](https://github.com/avensia/nitro5/pull/265).

### Enabling the image resizer in DXP
For the Cloudflare image resizer to work in DXP you need to do two things:
1. Set up the domains that should be used for the environment. Cloudflare image resizer won't work with the internal URLs (*.dxcloud.episerver.net).
1. Ask support to enable it for the selected zone (e.g. *.customer.com). The official way to do this is to [sign up for the beta program](https://www.optimizely.com/beta-signup/) and select "Image resizing at the edge". The inofficial way to do this is to ask support do it.
> Note: Cloudflare image resizer cannot be enabled per subdomain/host. It will be enabled for the entire _zone_ which is e.g. customer.com.
