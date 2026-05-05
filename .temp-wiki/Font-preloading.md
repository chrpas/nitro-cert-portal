Nitro5 supports preloading of local fonts. 

## Why preload fonts?
Without preloading the browser needs to parse parse the HTML, download the `global.css` file where the fonts are referenced and then down the rendering pipeline request the fonts. Fonts are a critical resource to load as early as possible to avoid [Flash Of Unstyled Text](https://css-tricks.com/fout-foit-foft/) and even [Cumulative Layout Shift](https://web.dev/cls/) issues. You can see how much earlier the fonts are loaded in the screenshots below. 

Without preloading of fonts:

![image](https://user-images.githubusercontent.com/2861562/189642958-a0621da7-90fb-42f3-97b7-63e91db0d021.png)

With preloading of fonts:

![image](https://user-images.githubusercontent.com/2861562/189652803-1e731c3f-b949-4012-bfe7-a065b358f2ef.png)

## Which fonts are preloaded?
By default **woff2** fonts are preloaded, see `Avensia.Scope.LayoutModelBase`. The reason we only preload woff2 is support in all modern browsers and that it is a format with good compression. 

We don't want to preload fonts that are never used. You can control which fonts to preload in your project by overriding the method `ShouldPreloadAsset()`. This may be interesting for example if you are running a multisite and only one of the sites are using the font.

## Developer notes
* See `Avensia.Scope.LayoutModelBase`
* See https://github.com/avensia/scope/pull/284
* Font preloading was introduced in Scope 8.27 and 9.3