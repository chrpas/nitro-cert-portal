Structured Data Markup (JSON-LD) is used to help search engines better interpret the meaning of content on a webpage. 

Info from Google about Structured Data Markup:
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/search-gallery

In the startersite, the following pages emit JSON-LD: (see the `JsonLdFactory` class)
- Start page ([WebSite](https://schema.org/WebSite), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization))
- Product pages ( [Product](https://developers.google.com/search/docs/appearance/structured-data/product-snippet), [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb))
- Product listing pages ([Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb))


## Testing JSON-LD

1. Run validation on https://validator.schema.org/. If the page you want to test is reachable you can use the url, if not you can paste the JSON-LD. Example of validation of a PDP on demosite: https://validator.schema.org/#url=https%3A%2F%2Fnitro5-demo.avensia.com%2Fen-gb%2Ftableware%2Fbowls-serving-dishes%2Fserving-bowls%2Fle-creuset-signature-snack-bowl%3Fauth_code%3D2016
2. In dev it's easier to use a browser extension like the **[Structured Data Testing Tool](https://chromewebstore.google.com/detail/aohmciehgjboidolkmoaofcbnejmokan)**. It lets you grab the JSON-LD from the page's source.


## JSON-LD example
Example from the startersite: 
```
<script type="application/ld+json">
   {
      "logo":"https://dev.nitrox.com/contentassets/3b5d1f7feb5e4c8894a4782933ba483a/cute-kitten.jpeg?ref=30766748A0",
      "url":"https://dev.nitrox.com/sv-SE",
      "@context":"http://schema.org/",
      "@type":"Organization"
   }
</script>
```
