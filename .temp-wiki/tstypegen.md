Nitro uses [tstypegen](https://github.com/avensia-oss/tstypegen) to generate frontend TypeScript definitions from backend C# classes.

## How to decorate your C# classes
The most common attribute to use is `[GenerateTypeScriptDefinition]`, which is usually placed on the c# viewmodels that will be consumed by frontend.

You can use the definition of the `GenerateTypeScriptDefinition` attribute in Scope, but this will require you to add a dependency to the Scope package. If this attribute is the only reason for a dependency to Scope from your package, we recommend that you instead invent your own definition of the attribute in your package, like in [Avensia.Checkout](https://github.com/avensia/nitro5-packages/tree/develop/packages/checkout/src/Avensia.Nitro5.Checkout/TypeScriptAttributes/Attributes.cs). tstypegen looks for classes decorated with an attribute named "GenerateTypeScriptDefinition" regardless of its namespace, so this way you don't need a dependency to Scope.

See [tstypegen docs](https://github.com/avensia-oss/tstypegen#controlling-types-with-attributes) for a list of all available attributes to use.

## How to run tstypegen
tstypegen is distributed as a node module, and since version 9 of Scope it is run as a part of the backend build (it was previously part of the frontend build instead). 

tstypegen runs automatically during build of `Avensia.Common` in Visual Studio and by `nitro backend:build` and `nitro:build`, because of the `<Import Project="..\TSTypeGen.targets" />` directive in `Avensia.Common.csproj`. The  `src/TSTypeGen.targets` file contains the actual command to run tstypegen:

```console
dotnet node_modules\@avensia-oss\tstypegen\bin\tstypegen.dll -c src\tstypegen.json
``` 

If you want to run tstypegen separately without building `Avensia.Common`, you can run ☝️ (assuming you are in the nitro root).

## Setting up tstypegen in a nitro5-package

1. Install [@avensia-oss/tstypegen](https://github.com/avensia-oss/tstypegen) to your package:
   1. Add `@avensia-oss/tstypegen` to your package's `buildsystem/package.json`
   2. Run yarn in root of nitro5-packages

2. You need a `TSTypeGen.json` file. This is the [config file](https://github.com/avensia-oss/tstypegen#config-file) for tstypegen and it specifies which `*.dll` files to look in (like all dll's named `Avensia.*`), some type mappings from Episerver backend types to Scope frontend types (like `EPiServer.Core.IContent` to `Scope.IContent`).

3. You need a `TSTypeGen.targets` file with the command to run tstypegen.

4. You need `<Import Project="TSTypeGen.targets" />` in your `*.csproj` to run tstypegen during build.

5. You need `<CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>` in your `*.csproj`) to get all dlls out into bin directory so tstgypegen can scan them.

6. If you need TypeScript definitions from another nitro5-package: Add BE references in the csproj file to the projects that contain the C# classes that you need TypeScript definitions for. Sometimes you don't need to use the package in BE, but as the generation of TypeScript definitions is a BE responsibility they still need to be added. One example of this is when you need `NitroCore.AmountWithVat` in FE. When adding BE dependencies, also remember to [also add this dependency to buildsystem/index.ts](https://github.com/avensia/nitro5/wiki/Specifying-dependencies-to-other-packages)

> It's also possible to add a relative path to the *d.ts file in the package's `tsconfig.json`, but in this case the consumer of the package is actually required to have the Nuget package installed, which is not declared in any way on your NuGet package. Therefore best practice is to add the reference to the csproj so that the project get its own declarations. 

If your project contains no C# classes marked with `[GenerateTypeScriptDefinition]` attribute, you're done here. Else continue with the last steps for these classes to be exposed. 

7. You need a `[assembly: GenerateTypeScriptNamespace("Checkout")]` in `AssemblyInfo.cs`. This tells tstypegen to create a file `Checkout.d.ts` from this assembly.
   - Note! Add it to `AssemblyInfo.cs`, not to `AssemblyVersionInfo.cs`
   - Note! If you are using the typescript attribute definitions in Scope (instead of defining your own), you also need a `using Avensia.Scope;` in `AssemblyInfo.cs`

8. If you need to generate any definitions using `BlockData` or `ContentArea`, you need to either add a reference to the Scope.Episerver package, or add this to your `AssemblyInfo.cs`:
   ```c#
   [assembly: DefineTypeScriptTypeForExternalType(typeof(BlockData), "Scope.BlockData")]
   [assembly: DefineTypeScriptTypeForExternalType(typeof(ContentArea), "Scope.ContentArea")]
   ```