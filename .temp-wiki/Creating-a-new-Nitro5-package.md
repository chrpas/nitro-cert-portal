See our [packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines) on what should be in a package and what should be in the starter site.

If you are creating a payment package, it 's a good idea to also see docs on [payments](https://github.com/avensia/nitro5/wiki/Payments) before starting.

## Getting started: Copy an existing package
We recommend you to start by copy an existing package, and choose a package that does "everything", e.g. creates Nuget package, npm package and outputs typesript definitions (a *.d.ts file) - for example the Avensia.Nitro5.Checkout package.

Then:
1. Remove all classes in your copied project and rename the project
2. Update `buildsystem/index.ts` so it suits your needs. If you certain you wont need to create an npm package, you can remove those tasks from `buildsystem/index.ts` - otherwise keep it until you are "done" with developing, chances are you'll discover you need an npm package after all in the end.
3. Update `buildsystem/package.json` so the name is unique for your package.
3. Verify dependencies are correct in your `buildsystem/index.ts` and your `.csproj`
4. Add your project to `Nitro5-packages.sln`

Also see [structure of a package](https://github.com/avensia/nitro5/wiki/Structure-of-a-package).

## Getting started: Creating a new project from scratch
If you did not follow our recommendation and copied an existing package, but instead created a new project manually, this is also OK. Just make sure to:
1. Create a proper package folder structure (with the src and buildsystem folders)
2. Verify that you have a PropertyGroup in your `*.csproj` similar to another package (e.g. that it includes `<GenerateAssemblyInfo>false</GenerateAssemblyInfo>`)
3. Verify that you have an `AssemblyInfo.cs` (see more: https://github.com/avensia/nitro5/wiki/AssemblyInfo)

## Running garn package locally
When creating a new package, it can be a good idea to test `garn package` locally before pushing and tagging the first rc:
1. Run `garn package` - it will create `SharedAssemblyInfo.cs` and then fail with error `did not match any file(s) known to git`.
2. Stage the created `SharedAssemblyInfo.cs` in git
3. Re-run `garn package`
4. Reset `SharedAssemblyInfo.cs` - it should not be committed to git.

## Nuget and/or npm?
If there are any C# files in your package, you need to create a **nuget** package and install this in your customer project (or nitro).

If there are any *.tsx files in your package, you need to create an **npm** package and install this in your customer project (or nitro). 

### How to create npm package
If there are any *.tsx files in your package:
1. You need a [tsconfig.json](https://github.com/avensia/nitro5-packages/blob/develop/packages/checkout/src/Avensia.Nitro5.Checkout/tsconfig.json) 
2. Include frontend build tasks in `buildsystem/index.ts`
3. You need a [package.json](https://github.com/avensia/nitro5-packages/blob/develop/packages/checkout/src/Avensia.Nitro5.Checkout/package.json) which specifies the npm package
4. Run `garn frontend:build`

Note: If you are creating a brand new npm package, make sure that you are in fact building an actual npm package before trying to debug it from nitro.


## Generating TypeScript definitions (*.d.ts)
If you need to generate typescript definitions using the `GenerateTypeScriptDefinition` attribute, see docs on [tstypegen](https://github.com/avensia/nitro5/wiki/tstypegen) on all configs etc required.

## Documentation
1. Update the README.md according to our [Packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines#package-documentation). Don't forget the **Usage** section where you describe interfaces that projects need to implement etc. See [README.md in Forms package](https://github.com/avensia/nitro5-packages/tree/develop/packages/forms#usage) as an example.
2. If this is a 3rd party integration, remember to include a link to their developer documentation.
3. Add a link to your new package from the main README.md in nitro5-packages.
4. When tagging the first stable release (which you have to do manually - see https://github.com/avensia/nitro5/wiki/Creating-a-release-candidate#tagging-the-very-first-version-of-a-new-package), add this version to RELEASE_NOTES.md manually


## Also see
- [Packaging guidelines](https://github.com/avensia/nitro5/wiki/Coding-guidelines#packaging-guidelines)
- [How to specify dependencies to other packages](https://github.com/avensia/nitro5/wiki/Specifying-dependencies-to-other-packages)
- [Tagging the very first rc of your new package](https://github.com/avensia/nitro5/wiki/Creating-a-release-candidate#tagging-the-very-first-version-of-a-new-package)