This is the common file structure for a Nitro5 package:

```console
<package folder>
    buildsystem
        index.ts
        package.json
        tsconfig.json
    src
        <backend project folder>
            Properties
                AssemblyInfo.cs
            package.json
        <backend project test folder>
        SharedAssemblyInfo.cs
    README.md
    RELEASE_NOTES.md
    garn
    garn.cmd
```
- `<package folder>` is always lower case and a "short form" of the package name, stripped of any Avensia or Nitro5 prefix. For example, the package Avensia.Nitro5.Checkout has a package folder simply called `checkout`. The name is significant as it is used when tagging versions of the package, e.g. `checkout@1.2.0-rc0001`. A connector folder is called `<external_system>-connector`, e.g. `inriver-connector`. Multiple packages related to the same concept are prefixed, e.g. `esales-connector`, `esales-indexbuilder`.

- `buildsystem\index.ts` contains the meta data for the package. What backend projects should be built, dependencies, nuget id and all the build tasks. The build tasks are more or less similar across all packages. If the package contains frontend code, then there will be build tasks for frontend, otherwise there are only backend tasks.

- `buildsystem\package.json` contains the definition of the npm package for this package's buildsystem. 

- `buildsystem\tsconfig.json` contains the configuration for the TypeScript compiler. This file often only extending the configuration file that is stored in the repository root. There might be another `tsconfig.json` in the backend project folder too which contains specific rules for that project.

- `src\<backend project folder>` contains the .NET project with csproj and .cs files. A package can consist of multiple project folders (e.g. inriver-connector).

- `src\<backend project folder>\package.json` contains the definition of the npm package. Only used for packages that publish frontend code.

- `Properties\AssemblyInfo.cs` contains metadata for the assembly. The build server updates the version of the assembly when building but the changes are intentionally not checked in, so version should always be 0.0.0 in the repo. If the project generates typescript types, the namespace can be set by the `GenerateTypeScriptNamespace` instruction. Also see https://github.com/avensia/nitro5/wiki/AssemblyInfo

- `SharedAssemblyInfo.cs` used in multi-project packages to make sure we get the same version across all dlls.

- `<backend project test folder>` if there are tests associated with the backend project, they are usually placed in a separate folder next to the project.

- `README.md` is the starting page for this package on GitHub, that is automatically shown when navigating to the package.

- `RELEASE_NOTES.md` contains the changes for each version of the package. This file is automatically updated when tagging a new version but it's always a good idea to manually review it before comitting the changes.

- `garn` and `garn.cmd` are the exact same versions in all packages. It is used to interact with the buildsystem (compare with `scope` in Nitro). To build a package you do a `garn build` in the package folder.


## Read more 
* [Upgrading Nitro5 packages](https://github.com/avensia/nitro5/wiki/Upgrading-Nitro5-packages) on how to update to the latest version of a nitro package
* [Debugging Nitro5 packages](https://github.com/avensia/nitro5/wiki/Debugging-Nitro5-packages) on how to replace the nuget/npm-reference with the actual source code so you can debug it
* [Modifying an existing Nitro5 package](https://github.com/avensia/nitro5/wiki/Modifying-an-existing-Nitro5-package) on how to add features or fix bugs in our packages
* [Creating a new Nitro5 package](https://github.com/avensia/nitro5/wiki/Creating-a-new-Nitro5-package) on how to create a brand new package
