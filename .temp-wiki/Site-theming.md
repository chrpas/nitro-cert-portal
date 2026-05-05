Site theming is a technique to enable multiple sites use the same code base with as few changes as possible, yet providing support for a rich experience. The differences between the sites are not restricted to color and styling only but can also be entire React components and behavior.

For details on how to use themese, see [working with site themes](https://github.com/avensia/nitro5/wiki/Working-with-site-themes)

Basic concepts:

Theme name
- Nyckel i hela lösningen
- Nitro5 kommer som standard med två sajter, och således två theme names: nitro5 och nitrox

Bundle size
- All kod som är temaspecifik hamnar i egna bundles, vilket innebär att vi behöver aldrig ladda frontendkod för "de andra" sajterna, optimal laddning


See doc in Scope about theming: https://github.com/avensia/scope/blob/master/docs/THEMING.md

See https://github.com/avensia/ajprodukter/pull/638/ for an example of usage of themes. There are no themes OOTB in Nitro.

Register your implementation of `ICurrentTheme` like:
```c#
services.AddTransient<ICurrentTheme, MyCurrentThemeImplementation>();
```

