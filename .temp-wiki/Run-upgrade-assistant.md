<sup>[Nitro5](https://github.com/avensia/nitro5/wiki) / [How to migrate to Nitro5](https://github.com/avensia/nitro5/wiki/How-to-migrate-to-Nitro5) / Run upgrade-assistant</sup>

This guide is intended for nitro projects when starting the upgrade to .NET 6 and nitro5. Before starting, see the prerequisites etc on [How to migrate to Nitro5](https://github.com/avensia/nitro5/wiki/How-to-migrate-to-Nitro5). Also make sure you have read the [Changes in Nitro5](https://github.com/avensia/nitro5/wiki/Changes-in-Nitro5) documentation. We recommend reading these docs carefully as it will help a lot during migration.

You goal here is to get your solution to **build** towards target framework .NET 6 (and not necessarily to **run** correctly yet), by commenting out everything that causes build errors and adding "migration TODOs" to fix later. 

### Step 1: Prepare folders
Assuming your code is located in c:\dev, you recommend setting up the following folder structure:

```
c:\dev\nitro  (branch: develop)
c:\dev\nitro5   (branch: nitro5-develop)
c:\dev\myproject  (branch: develop)
c:\dev\myproject-nitro5  (branch: nitro5)
```

1. `nitro`: If you haven't set up nitro on your machine, at least clone https://github.com/avensia/nitro in a local folder and verify you are on latest nitro (get latest from git).
1. `nitro5`: Setup [Nitro5 dev environment](https://github.com/avensia/nitro5/wiki/How-to-setup-Nitro5-dev-environment) on your machine, if you havn't already. Get latest and check out tag `1.0.0`.
1. `myproject`: This is your usual repo. It is helpful when comparing your project with "old nitro", to find your project specific changes. This will further on be regarded as the "4.7.2 version" of your project.
1. `myproject-nitro5`: Clone the latest from your project repo into this folder

### Step 2: Prepare your solution
Step into the `myproject-nitro5` folder and create a branch for the upgrade, e.g.
```
git checkout -B nitro5
```

In your new branch for the migration (in the `myproject-nitro5` folder):
1. Remove all installed nuget-packages that you are **not using** which are [not yet migrated to .NET 6](https://github.com/avensia/nitro5/wiki/Migrated-packages) e.g.:
   - `Avensia.Payments.Adyen`
   - `Avensia.Payments.Bambora`
   - `Avensia.Payments.Collector`
   - `Avensia.Payments.PayPal` + `PayPalMerchantSDK` + `PayPalCoreSDK`
   - `Avensia.Payments.NetsEasy`
   - `Avensia.Payments.Paytrail`
   - `Avensia.Payments.Qliro`
   - `Avensia.Payments.QliroOne`
   - `MiniProfiler`, `MiniProfiler.Shared` (Miniprofiler is removed from Nitro5 and will not be migrated by the Nitro team, it's replaced by profiling using AI)
   - `Swashbuckle`, `Swashbuckle.Core` (Swagger is removed from Nitro5, and will not be migrated by the Nitro team)
1. Remove `Avensia.Jobs` and `Avensia.Tests` from the solution. Delete the `src\Avensia.Jobs` folder, `Avensia.Tests` will be re-added later.
1. Make sure the solution still builds (FE + BE) and starts. 
1. Now is a good time to commit and push.

### Step 3: Run upgrade assistant
1. Clone the **Nitro5 Upgrade Assistant Extension** from https://github.com/avensia/nitro5-upgrade-assistant-extension
2. See its `README.md` on how to run it. It will change your target framework to .NET 6 and then try to fix build errors in your solution using Roslyn code analyzers and code fixes. There are some fixes from Microsoft and some specifically developed for the Nitro5 migration by the product team. Run it on `Avensia.Common`, and then on `Avensia.Shop`, and then on any project specific *.csproj you might have. For standard Nitro this takes ~60 minutes to run. Note that the project will fail build after this step. This is expected! 
3. Now is a good time to commit and push.

> From now on, try to avoid switching to the old `develop` branch in the `myproject-new` folder, as the folder structure have changed. If you need to compare with your old project code, use the `myproject` folder instead.

### Step 4: Some initial adjustments

> Tip: Use a comparison tool to be able to differ changes between your project and nitro, e.g. kdiff3 or BeyondCompare 

1. Compare the csprojs between `nitro` and `myproject` to identify if you have any significant deviations from nitro standard. Take a note of the deviations in a todo list that can be processed later.
1. Replace `Avensia.Common.csproj` and `Avensia.Shop.csproj` in `myproject-nitro5` with the ones from `nitro5`
1. Copy `Avensia.Shop\appsettings.*` in `myproject-nitro5` with the one from `nitro5`
1. Edit the connection string section in `appsettings.json`, copy existing connection strings from `myproject`.
1. Replace `Avensia.Shop/Properties/launchSettings.json` in `myproject-nitro5` with the one from `nitro5`. Edit the file and replace the host names with your project's host names.
1. Commit and push.

### Step 5: Make it build in Visual Studio
Now, your first goal is to make the solution **build** - but don't start fixing stuff immediately! We recommend working like this:
- Comment out anything that causes the solution not to build, while adding comments `// TODO: NITRO5-MIGRATION` on everything you comment out.
- Keep commenting out until solution builds in Visual Studio.
- This will give you (and your fellow team mates) a nice TODO-list in the "Task" panel in Visual studio. You also probably want to group your TODOs like `// TODO: NITRO5-MIGRATION - yotpo`, this way you can search for all TODOs regarding "yotpo" in the "Task" panel.

If you need to comment out a return statement, don't be tempted to replace it with a `return null;` statement. We recommend instead throwing an exception, like `throw new Exception("not yet migrated to nitro5");`. This is to avoid time consuming debugging later on to find the cause of weird run time errors caused by something somewhere being null.

Remember to commit and push when everything builds.

### Step 6: Make it build using `scope build`
When backend builds in Visual Studio, it's time to fix the buildsystem and the frontend build as well:

1. We recommend replacing your entire `buildsystem` folder with the one in nitro5, and then migrate all changes that has been done in your project's old `buildsystem` folder, if any. All projects have project specific settings in `index.ts` (solution file name, nugetId for projects, Octopus projectname and slack channel name) that you need to fix now immediately. There might also be other differences in other files if you've e.g. added some project specific build tasks, you can add TODOs for migrating these later. 
2. Try building backend with `scope backend:build`, fix any backend errors (by commenting out as before).
3. Try also building frontend with `scope frontend:build`, fix any frontend errors (by commenting out as before).
4. Try `scope run-migrations`, fix any errors.
5. Commit and push.

By now it **might** be possible to start your solution. Give it a try :)

### Step 7: Add TODOs for project specific changes in **Avensia.Jobs**
Compare **Avensia.Jobs** in your 4.7.2 version of your project (the `myproject-old` folder) with the one in old `nitro`. If there are any project specific changes that you want to migrate, make a note on your TODO-list about this. 

### Step 8: Add TODOs for project specific changes in **Avensia.Tests**
We recommend replacing your entire old **Avensia.Tests** with `Avensia.Common.Tests` and `Avensia.Integration.Tests` in nitro5.

Compare **Avensia.Tests** in your 4.7.2 version of your project (the `myproject-old` folder) with the one in old `nitro`. If there are any project specific tests or changes that you want to migrate, make a note on your TODO-list about this. 
