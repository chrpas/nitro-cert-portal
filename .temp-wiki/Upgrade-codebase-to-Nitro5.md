This guide is intended for Nitro projects upgrading to .NET and Nitro5. Before starting, see the prerequisites etc on [How to upgrade to Nitro5](https://github.com/avensia/nitro5/wiki/How-to-upgrade-to-Nitro5). Also make sure you have read the [Changes in Nitro5](https://github.com/avensia/nitro5/wiki/Changes-in-Nitro5) documentation.

- [Step 1: Prepare folders](#step-1-prepare-folders)
- [Step 2: Prepare solution](#step-2-prepare-solution)
- [Step 3: Run upgrade assistant](#step-3-run-upgrade-assistant)
- [Step 4: Run filefixer](#step-4-run-filefixer)
- [Step 5: Fix build errors](#step-5-fix-build-errors)
- [Step 6: Migrate dependencies](#step-6-migrate-dependencies)
- [Step 7: Migrate configuration](#step-7-migrate-configuration)
- [Step 8: Migrate buildsystem](#step-8-migrate-buildsystem)
- [Step 9: Migrate frontend build](#step-9-migrate-frontend-build)
- [Step 10: Runtime stabilizations](#step-10-runtime-stabilizations)

## Step 1: Prepare folders

Assuming your code is located in `c:\dev`, the following folder structure is recommended. _Your code root doesn't have to be c:\dev, it is just an example._

```
c:\dev\nitro             (branch: develop)
c:\dev\nitro5            (branch: develop)
c:\dev\myproject         (branch: develop)
c:\dev\myproject-nitro5  (branch: nitro5)
```

1. `nitro`: Clone [nitro](https://github.com/avensia/nitro) and make sure you are on the latest commit. This will be used as a reference to determine what changes have been made in the project.
1. `nitro5`: Clone [nitro5](https://github.com/avensia/nitro5) and make sure you are on the latest commit. This will be used as source when copying new files into the solution.
1. `myproject`: This is your usual repo. It is helpful when comparing your project with "old nitro", to find project-specific changes.
1. `myproject-nitro5`: Clone the latest from your project repo into this folder. Create a branch `nitro5` which will carry the actual work of the migration.

> Note: In addition to having nitro5 cloned, we recommend having a [working Nitro5 environment](https://github.com/avensia/nitro5/wiki/How-to-set-up-Nitro5-dev-environment) available if you want to compare and test things against your project - _although not strictly neccessary for the migration_.

## Step 2: Prepare solution

We are now preparing the solution for running the automated upgrade scripts. To do so, switch to the `nitro5` branch in the `myproject-nitro5` folder.

1. Remove `Avensia.Jobs` and `Avensia.Tests` from the solution. Delete the `src\Avensia.Jobs` folder, `Avensia.Tests` will be re-added later.
1. If you have a model project, you need to convert this to .NET and upgrade the modelmaster dependencies.
1. Now is a good time to commit

## Step 3: Run upgrade assistant

Upgrade assistant is a tool from Microsoft that will change your target framework to .NET and then try to fix build errors in your solution using Roslyn code analyzers and code fixes. There are some fixes from Microsoft and some specifically developed for the Nitro5 migration by the product team.

1. Clone the [Nitro5 Upgrade Assistant Extension](https://github.com/avensia/nitro5-upgrade-assistant-extension)
1. See its `README.md` on how to run it. Run it on `Avensia.Common`, and then on `Avensia.Shop`, and then on any project specific \*.csproj you might have. For standard Nitro this takes ~60 minutes to run. Note that the project will fail build after this step. This is expected!

   Example:

   ```console
   upgrade-assistant upgrade --skip-backup "C:\dev\myproject-nitro5\src\Avensia.Shop\Avensia.Shop.csproj" --extension "C:\dev\nitro5-upgrade-assistant-extension\Avensia.Nitro5.UpgradeAssistant\bin\Debug\net6.0\ExtensionManifest.json" --ignore-unsupported-features --non-interactive  --target-tfm-support LTS
   ```

1. Now is a good time to commit

> From now on, try to avoid switching to the old `develop` branch in the `myproject-nitro5` folder, as the folder structure have changed. If you need to compare with your old project code, use the `myproject` folder instead.

## Step 4: Run filefixer

Filefixer is a tool that keeps track of changes between nitro and nitro5 - filewise. It will add, move and replace files that are required for nitro5 to run. It will also mark some files as obsolete and list it for manual migration.

Be sure to use the `-features` flag to avoid getting irrelevant files copied to your repo. See the [list of features](https://github.com/avensia/nitro5-upgrade-assistant-extension?tab=readme-ov-file#features).

1. Run [MigrationFileFixer](https://github.com/avensia/nitro5-upgrade-assistant-extension/tree/main/Avensia.Nitro5.MigrationFileFixer) with parameters `<project-path> <project-nitro5-path> <nitro-path> <nitro5-path> -replaceIdentical -features=<features>`

   Example:

   ```console
   Avensia.Nitro5.MigrationFileFixer c:\dev\myproject c:\dev\myproject-nitro5 c:\dev\nitro c:\dev\nitro5 -replaceIdentical -features=esales,inriver,klarna,blog,wishlist,googleproductfeed
   ```

1. Commit and push

## Step 5: Fix build errors

> Tip: This step can be performed in parallel with step 6 and 7

When you open the migrated solution in Visual Studio you will have hundreds of build errors. Many errors can be fixed by pressing <kbd>Alt</kbd> + <kbd>Enter</kbd> to add a missing using. Other errors can be fixed by search/replace (see suggestions). And then there's probably a bunch of errors that needs a little more love.

The `NITRO5-MIGRATION-FILEFIXER-TODO.txt` in the `myproject-nitro5` folder contains a report of files that require special attention after the filefixer has run. To identify the project-specific changes in these files, kdiff can be used as previously shown.

It's recommended to follow some kind of structure when fixing the build errors: try to attack one problem at a time instead of going all over the place. This also allows for better parallelisation. When you have fixed e.g. all logging-related errors, commit and push.

At this stage, there is both the old and new `CommonInitialization.cs`. In order to better separate the build errors, it is recommended to rename the old init to `CommonInitializationOld.cs`.

See the [backend upgrade tips & tricks](https://github.com/avensia/nitro5/wiki/Backend-upgrade-tips-&-tricks) for a list of common things that needs to be fixed!

## Step 6: Migrate dependencies

> Tip: This step can be performed in parallel with step 5 and 7

Go through each third-party nuget in package.config that is _still relevant_, and add the corresponding dependency with .NET support to the new `Avensia.Common.csproj` or `Shop.csproj`. This is a good moment to clean out any old/obsolete dependencies.

> Tip: .NET uses transitive dependencies which means that you should strive to keep the direct dependencies at a minimum.

Typically, each dependency requires some configuration and some initialization code. This also needs to be migrated, package by package.

### RCs of Avensia packages
If you have RCs of any Avensia packages, make sure that you get them merged in suite and then incorporated into the corresponding package in Nitro5.

## Step 7: Migrate configuration

> Tip: This step can be performed in parallel with step 5 and 6

All existing xml-based configuration files have been replaced with one single `appsettings.json`. After the filefixer has run, we will have the default Nitro5 `appsettings.json` in `Avensia.Shop`. There is no longer any configuration in `Avensia.Common`.

So we need to migrate the project-specific configuration changes in `commonConfiguration.config`, `appsettings.config`, `Web.config` or any of the related transforms - into `appsettings.json`.

It's advised to use a comparison tool to differ changes between your project and nitro. To see a list of project-made changes to `commonConfiguration.config` you could do the following:

```console
"c:\program files\KDiff3\kdiff3.exe" c:\dev\nitro\src\Avensia.Common\commonConfiguration.config c:\dev\myproject\src\Avensia.Common\commonConfiguration.config
```

### Launchsettings

Edit `src/Avensia.Shop/Properties/launchSettings.json` and replace `ASPNETCORE_URLS` and `applicationUrl` with your domain(s). If you have multiple, `ASPNETCORE_URLS` is be the primary launch url while `applicationUrl` can contain a semi-colon separated list of secondary urls.

### Connection strings

Copy from `connectionStrings.Debug.config` and add to `appsettings.json`. Contrary to before, connection strings should now live in the shared appsettings file.

### csproj
Double-check your old csprojs to make sure any custom rules are migrated, such as copying of static resources

### Transforms

Although still supported, there is less need for environment-specific transforms (use Octopus structured configuration variables), but if you do, the convention is to name the file `appsettings.<env>.json`.

There is also an `appsettings.Development.json` that contain local overrides and is gitignored.

### Octopus

Sensitive values should be moved into Octopus instead of stored in the repo. This typically includes api keys for production environments.

We don't use Octopus variables anymore. Instead we use [structured variables](https://octopus.com/docs/projects/steps/configuration-features/structured-configuration-variables-feature#StructuredConfigurationVariablesFeature-VariableReplacement) that can perform replacement of any section/value in appsettings - by convention.

### Options

Any configuration values that are consumed in the application should use the [options pattern](https://github.com/avensia/nitro5/wiki/Upgrade-guide#how-to-migrate-to-the-options-pattern)

## Step 8: Migrate buildsystem

In Nitro5 the bulk of the buildsystem has moved into the `@avensia/nitro5-buildsystem` package. This means that the only things that should remain is `index.ts` and some configs.

To see if you have made any customisations from nitro, run the following:

```console
"c:\program files\KDiff3\kdiff3.exe" c:\dev\nitro\buildsystem\index.ts c:\dev\myproject-nitro5\buildsystem\index.ts
```

1. Delete all other .ts files in buildsystem
1. Sync `buildsystem\index.ts` with nitro5 but keep the project-specific changes. Do note that everything that is not explicitly specified in nitro5 has moved as defaults into the package. Don't forget to set new values for `nuGetId` and `octopusDeploy.projectName` (e.g. by suffixing them with a `5`) so that they won't clash with the existing package and project
1. Sync `buildsystem\package.json` with nitro5
1. Delete the `buildsystem\debugconfigs` folder
1. Sync `package.json` (in the root) with nitro5
1. Run `yarn` to update the lockfile
1. Make sure you can start the build system by executing `nitro` in a console
1. Commit

## Step 9: Migrate frontend build

1. Sync `src\package.json` with nitro5
1. Open Visual Studio Code and search replace `'@avensia/scope` => `'@avensia/nitro5-scope` (notice the initial apostrophe) and run it for `*.ts,*.tsx`
1. Do the same for `'@avensia/avensia-checkout` => `'@avensia/nitro5-checkout`
1. Run `yarn` to update the lockfile
1. Try to run `nitro frontend:build` and fix any additional errors
1. Commit

## Step 10: Runtime stabilizations

When the solution builds - both backend and frontend - it is now time to try running the site.

Make a copy of the devdatabase with a new name so you don't mess up the existing devdatabase. Update the connectionstrings in `appsettings.json`

Run the migrations (`nitro run-migrations` in a command prompt) and then start the solution by pressing "Play" in Visual Studio.

You will be prompted to run Optimizely's Commerce migrations when starting the first time in the browser, but after that you should see the site.

> When using StructureMap we didn't have to register any concrete ctor dependencies, but with the new DI in .NET, all dependencies must be explicitly registered. Failing to do so will render a runtime error.

Navigate on the site and try different features/functions to verify they work as expected.

See the [troubleshooting section](https://github.com/avensia/nitro5/wiki/How-to-set-up-Nitro5-dev-environment#troublehooting-setup) if you have problems getting into the site.

## Step 11: Migrate tests

We recommend replacing your entire old Avensia.Tests with `Avensia.Common.Tests` and `Avensia.Integration.Tests` in nitro5.

Compare Avensia.Tests in your 4.7.2 version of your project (the `myproject-old` folder) with the one in old `nitro`. If there are any project specific tests or changes that you want to migrate, make a note on your TODO-list about this.
