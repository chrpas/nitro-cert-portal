## How to add backend dependencies
Add dependencies to other nitro5-packages as **project references** in Visual Studio. Install any 3rd party nugets as usual. This will add `<PackageReference>` nodes to the `*.csproj` file.

## How to specify dependencies for the nuget package
Apart from adding references as `<PackageReference>` nodes in the `*.csproj` file, you also need to specify your dependencies in `buildsystem\index.ts`. This is so the nuget package will have correct dependencies. (The nuget package is created by `garn package`, which is part of the build on TC. You can try this locally if you need to troubleshoot a failing build on TC).

1. Add **all** your **direct** dependencies to the `dependencies` property of your project, like:
   ```js
   // ...
   projects: [
   {
      // ...
      dependencies: ['Avensia.Nitro5.EpiFoundation','Avensia.Nitro5.Core', 'Episerver.SDK'],
      // ...
   }
   ```
2. Add all **nitro5-packages dependencies** to the `projects` array, like:
   ```js
   projects: [
   {
      // ...
      dependencies: ['Avensia.Nitro5.EpiFoundation','Avensia.Nitro5.Core'],
      // ...
   },
   {
      nuGetId: 'Avensia.Nitro5.Core',
      gitTagName: 'core',
      projectName: 'Avensia.Nitro5.Core',
      files: ['Avensia.Nitro5.Core.dll'],
   },
   {
      nuGetId: 'Avensia.Nitro5.EpiFoundation',
      gitTagName: 'epifoundation',
      projectName: 'Avensia.Nitro5.EpiFoundation',
      files: ['Avensia.Nitro5.EpiFoundation.dll'],
   }
   ```

> garn will automatically create a version range for the dependency that is based on the current major of the package, up to but not including the next major.

Example:
You create a package that has a dependency to epifoundation. When you tag your release the current version of epifoundation is 4. Then your package will get an automatic version range according to Avensia.Nitro5.EpiFoundation <= 4 x < 5

Unless you depend on features in the current major of a package, it is also possible to specify a lower min version than the current. Continuing the example above, specifying a minVersion like the following:

```
   {
      nuGetId: 'Avensia.Nitro5.EpiFoundation',
      gitTagName: 'epifoundation',
      minVersion: 3,
      projectName: 'Avensia.Nitro5.EpiFoundation',
      files: ['Avensia.Nitro5.EpiFoundation.dll'],
   }
```
...would yield a version range according to Avensia.Nitro5.EpiFoundation <= 3 x < 5

In addition, it is also possible to specify an explicit version range. This is done on the dependency element:

```
dependencies: [{ id: 'Avensia.Nitro5.EpiFoundation', versionRange: '[3,5)' }],
```
(To learn about the version range syntax, see [NuGet package versioning](https://learn.microsoft.com/en-us/nuget/concepts/package-versioning))

### Dependencies to RC versions
If you create an RC that has dependencies to RC versions of other packages, this will be automatically handled by `garn`. Just make sure you have configured the relevant version ranges in `buildsystem\index.ts` (without the RCs).

### The .nuspec file
Inside each nuget package lives a file called `<package-name>.nuspec`, which contains the dependencies and version ranges. This information is then imported into our package server when the package is uploaded.

> The .nuspec file is automatically created by garn (via the production task `nuget:specdotnetcore`), using dependencies specified in `buildsystem\index.ts`

![image](https://github.com/avensia/nitro5/assets/6929325/3456de47-9e26-414b-9413-389adb99b76c)

## How to specify dependencies for the npm package
NOTE! THIS IS WIP! 

There are two types of npm dependencies:
- **dev-dependencies** are required to develop this package
- **peer-dependencies** are required to consume this package

Dependencies are specified in the package's [package.json](https://github.com/avensia/nitro5-packages/blob/develop/packages/checkout/src/Avensia.Nitro5.Checkout/package.json) (the one in `/src/Avensia.Nitro5...`, not the one in `/buildsystem`), like:
```
  "devDependencies": {
      "@avensia/nitro5-scope": "*",
      "@types/webpack-env": "*",
      "react": "^17",
      "react-dom": "*",
      "react-redux": "*",
      "redux": "*",
      "redux-batched-actions": "*",
      "redux-thunk": "*"
    },
    "peerDependencies": {
      "@avensia/nitro5-scope": "*",
      "react": "^17",
      "react-dom": "*"
    },
``` 

1. **Everything you import** needs to be specified as both dev-dependency and peer-dependency. Example: an `import { loadScript } from '@avensia/nitro5-scope';` means that a dependency to @avensia/nitro5-scope needs to be specified in package.json
2. For dependencies to other nitro5 npm packages: Specify dependencies as peerDependencies (not dependencies) and do not set a specific version! (npm version will follow the nuget version)
2. **Everything you explicitly include in [tsconfig.json](https://github.com/avensia/nitro5-packages/blob/55d91273c8246f12aa54a9760bb2c610af7df4e8/packages/checkout/src/Avensia.Nitro5.Checkout/tsconfig.json#L10)** needs to be specified as both dev-dependency and peer-dependency. Example: an include of `"../../../checkout/src/Avensia.Nitro5.Checkout/Additionals.d.ts"`  means that a dependency to `@avensia/nitro5-checkout` needs to be specified in package.json