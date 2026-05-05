The very first time you want to debug a Nitro5 package, you need to clone the repository:

1. Clone the [nitro5-packages](https://github.com/avensia/nitro5-packages) repository into a folder "next to" your project, e.g. if you have nitro5 in `C:\code\nitro5` you should clone nitro5-packages into `C:\code\nitro5-packages`.
2. Open a command prompt in nitro5-packages and run `yarn`. This is to install frontend dependencies that are required during build.
3. Open `nitro5-packages.sln` in Visual Studio and build

## Debugging NuGet packages

Use `nitro local-nuget` to help debugging nuget packages. It replaces nuget references with project references, so you'll get the package's source code in your solution. 

You can use either the package name or package "slug" to identify the package:
```console
nitro local-nuget Avensia.Nitro5.Localization
```
...is the same as:
```console
nitro local-nuget localization
```

You can specify multiple packages like so:
```console
nitro local-nuget scope localization checkout Avensia.Nitro5.PriceHistory
```
If you are unsure of the name of the package, try running `nitro local-nuget` and it will list all packages that are installed in the site.

> Pro tip! Do commit changes made by `nitro local-nuget` separately, so you can easily drop that commit later on before pushing your other changes

Any transitive package dependencies will automatically be added to the solution as well.

See https://github.com/avensia/nitro5-packages/pull/58 for more details.

## Debugging npm packages

Use `nitro local-npm` to help with debugging of npm packages. It will modify both the site's [package.json](https://github.com/avensia/nitro5/blob/develop/src/package.json) and the package's [package.json](https://github.com/avensia/nitro5/blob/develop/src/package.json) so you can debug and develop without building the package for each change.

You can use either the package name or package "slug" to identify the package:
```console
nitro local-npm nitro5-scope
```
...is the same as:
```console
nitro local-npm scope
```

You can specify multiple packages like so:
```console
nitro local-npm scope checkout
```

> Pro tip! Do commit changes made by `nitro local-nuget` separately, so you can easily drop that commit later on before pushing your other changes

See https://github.com/avensia/nitro5-packages/pull/88 for more details.

### Troubleshooting
- If changes in the package aren't showing up, try removing `node_modules` directory in nitro5 root before running `nitro build`: `rd /s /q node_modules\ && nitro build`. 