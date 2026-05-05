We upgrade packages in our solution to get fixes or new features related to the package.

> Some packages consist of both nuget and npm, it's recommended to upgrade both so frontend and backend uses the same version.

If you are unsure if there is npm and/or nuget for the package, you can either check https://packages.avensia.com or see the [nitro5-packages README.md](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/README.md).

For the Scope package, there is a `nitro.cmd` task that updates both npm and nuget for you to the latest version of Scope:
```console
nitro.cmd update-scope
```

## How to update npm packages (frontend)
You can check the name of the package on https://packages.avensia.com. Click on the "Add with yarn" tab and you'll get an example of how to install (or update) the package. Note that since nitro5 uses **yarn workspaces**, you need to supply either `workspace nitro5-app` (for the site) or `workspace nitro5-buildsystem` (for the buildssystem).

To add latest version of a package **to the site**, open cmd in the root folder of your project and run:
```console
yarn workspace nitro5-app add @avensia/facebook-conversions-api
```

Followed by:
```console
yarn 
```
Running yarn a second time after installing your package will make sure that your `yarn.lock` file is in sync with your `packages.json` (if these are not in sync, it might be that `yarn.cmd` and `nitro.cmd` will be a lot slower than necessary because it has to do package resolutions every time)

To add a specific version, for example an rc, include the version number:
```console
yarn workspace nitro5-app add @avensia/facebook-conversions-api@2.0.0-rc0012
```

To update **the buildsystem**:
```console
yarn workspace nitro5-build add @avensia/nitro5-buildsystem
```

## How to update nuget packages (backend)
You can do this "manually" by editing the `*.csproj` file:
1. Double click `Avensia.Common` in Visual studio 
2. Modify/add a package reference line, specifing which version you want:
```xml
<PackageReference Include="Avensia.Nitro5.Checkout" Version="1.1.0-rc0001" />
```

Or use the **Nuget packages manager**:
1. Right click on solution in Visual Studio and choose "Manage Nuget packages for Solution"
1. Make sure to select "Avensia" as "Package source"
1. Verify you are connected to the Avensia network (e.g. VPN is connected if you are not at the office)
1. If you want to install an rc, make sure to select checkbox "Include prerelease"
1. Search for the package you want to update/install
1. Select projects to install to, select version, and click "Install"
1. If update fails - see error messages on the "Output" tab.

### Troubleshooting nuget updates
Sometimes when updating to a new version by manually editing the `*.csproj` file, you'll get error that the version you want to install is not found (like _warning NU1603: Avensia.Common depends on Avensia.Nitro5.Esales4.IndexBuilder (>= 3.2.0-rc0004) but Avensia.Nitro5.Esales4.IndexBuilder 3.2.0-rc0004 was not found. An approximate best match of Avensia.Nitro5.Esales4.IndexBuilder 4.0.0-rc0001 was resolved._). First make sure version you try to install actually exists on https://packages.avensia.com (perhaps build on TC failed?). Then you could try any of the following:
- Restart VS
- Run `dotnet nuget locals all --clear`
- Use Nuget package manager instead, first uninstall package and then install it again
