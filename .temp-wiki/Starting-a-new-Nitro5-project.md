This guide is intended for SA's that are doing the "sprint zero" of a new project based on nitro5.

Before starting, we recommend that you first [setup the Nitro5 development environment](https://github.com/avensia/nitro5/wiki/Setting-up-the-dev-environment) on your machine, if you havn't already. Also we are very happy if you reach out to someone in the Nitro Core Team, letting us know that you are starting! We'll book a meet-and-greet meeting to get to know each other so we can help each other along the way. Also we want to add your new project to the [list of all nitro projects](https://github.com/avensia/nitro5/wiki/List-of-Nitro-Projects) :)

- [Step 1: Clone Nitro5 into a new customer repository](#step-1-clone-nitro5-into-a-new-customer-repository)
- [Step 2: Initial setup of the new solution](#step-2-initial-setup-of-the-new-solution)
- [Step 3: Setup languages, markets, sites and content](#step-3-setup-languages-markets-and-sites)
- [Step 4: Setup backoffice](#step-4-setup-backoffice) 
- [Step 5: Setup project dev environment](#step-5-setup-project-dev-environment)
- [Step 6: Adjust existing features](#step-6-adjust-existing-features)
- [Step 7: Prepare developer database backup](#step-7-prepare-developer-database-backup)

## Step 1: Clone Nitro5 into a new customer repository

1. **Clone nitro5 into a new local repository**. Create an new directory for your project, open Git Bash and change directory to your new project directory. Run the following to create a `develop` branch and pull Nitro5 into it, keeping all history from Nitro5, but without any tags and branches:
   ```bash
   $ # Change directory to the new project directory
   $ git init
   $ git checkout -b develop
   $ git pull https://github.com/avensia/nitro5.git develop --no-tags
   ```

2. **Push your new repository**. First create a new, empty Github repository on Github.com. Then set your remote Git repository and push the develop branch:
   ```bash
    $ git remote add origin https://github.com/avensia/[YOUR-NEW-REPO-NAME].git
    $ git push --set-upstream origin develop
    ```

3. **Give your team members access to the new repo.** 
   1. Go to your repo on Github
   2. Go to Settings / Manage access
   3. Click "Add teams"
   4. Search for group "avensia-employee"
   5. Give write access

4. **Update settings for your new repository**. Each project is free to choose whatever settings they want, this is a suggestion of settings to start with. 

   Go to your repository on Github.com, go to Settings/ General / Pull Requests. 
   * Disable **Allow squash merging**
   * Disable **Allow rebase merging**
   * Enable **Automatically delete head branches**
   
   Then go to Branches and click **Add branch protection rule**. Specify branch pattern name "develop".
   * Disable "Enable force pushes"
   * Enable "Require a Pull Request before merging" (disable "Require aprovals")
   * Enable "Require status check to pass before merging" (you can enable this when you have any status checks)

5. Add label `nitrospect` (Go to Issues, click Labels, click "New label" button) so you are ready to start tagging PRs with this label whenever you fix someething you think already should be fixed in startersite. Read more about nitrospects: https://github.com/avensia/nitro5/issues/766

## Step 2: Initial setup of the new solution
After you cloned Nitro5 into a new repository, let's do some initial setup to customize solution to your customer.

Remember as you fix NITROFIX comments to also remove the `// NITROFIX(critical)` comment. TeamCity will fail the build if there are any critical nitrofixes remaining, so you need to fix all critical nitrofixes in the solution before being able to deploy. You can list all remaining nitrofixes with `nitro validate-nitro-fixes`.

1. Rename the solution file `src/Nitro5.sln` to fit your project name.
2. Rename the Resharper settings file `src/Nitro5.sln.DotSettings` to match your solution file name
3. Update `buildsystem/index.ts`. Search for NITROFIX and update e.g. solution file name, nugetId for projects, Octopus projectname, slack channel name,  dev hosts (that needs SLL certs). (You can leave the [Raygun NITROFIX](https://github.com/avensia/nitro5/wiki/Setting-up-Raygun) for later). 
4. Update `buildsystem/config.defaults.json`. Change `dbUser` and `dbPassword` to something project unique (do NOT use default from nitro5!)
5. Update connectionstrings in `src/Avensia.Shop/appsettings.json` (according to values you specified in `buildsystem/config.defaults.json`).
6. Delete the `README.md` file, rename `README_PROJECT_TEMPLATE.md` to `README.md` and modify it to include your customer name.
7. Delete `CHANGELOG.md`
8. Verify `CONTRIBUTING.md` is according to your way of working.

## Step 3: Setup sites, markets and languages

1. Rename migration `M20161216_0100_AddNitro5Site.cs` to match your new site name (keep the date of 2016) and adjust it so it creates the initial site you need. You need to adjust catalog name, default currency, languages, markets and initial content. Make sure to get all urls correct when adjusting the sites!

2. Adjust `applicationUrl` and `ASPNETCORE_URLS` in `src/Avensia.Shop/Properties/launchSettings.json`

3. Adjust language files in `src/Avensia.Shop/lang` and in `src/Avensia.Shop/InitialContent`. Nitro comes with `sv-SE` and `en-US` out of the box. Use AI (e.g. ChatGPT) to translate these to the languages you need.

4. Set the `NitroDemoSiteContent` feature toggle to `false` in `FeatureTogglesInitialization` (you can adjust the rest of the feature toggles now or wait until step 6)

5. In `CurrentTheme.cs`, let method `GetCurrentThemeName()` return "nitro5" (this is temporary, until a frontender has setup your own theme)

### How to setup different vat rates on different parts of catalog
Example from Apohem: 
- ItemVAT is a CVL prop we have in PIM, see [VAT.cs](https://github.com/avensia/apohem/blob/develop/src/Avensia.Apohem.Pim.Model/Cvls/VAT.cs) and [Item.cs#L55](https://github.com/avensia/apohem/blob/develop/src/Avensia.Apohem.Pim.Model/Entities/Item.cs#L55)
- This is imported in [ItemTransformer.cs#L118](https://github.com/avensia/apohem/blob/develop/src/Avensia.Common/inRiverImport/Transformers/ItemTransformer.cs#L118) (Note that the index/id is different between PIM and EPI, which is why we map them in the transformer)
- And then the actual VAT rates are specified in [countries.json#L18](https://github.com/avensia/apohem/blob/develop/src/Avensia.Common/countries.json#L18)

## Step 4: Setup backoffice

1. Change password of the backoffice admin user to something project unique - update migration `20180518_1400_CreateAdminUser.cs`.
2. Decide (together with the customer) on a customer specific name for the backoffice url, see [How to change url to backoffice](https://github.com/avensia/nitro5/wiki/Backoffice#how-to-change-url-to-backoffice). By default it is `/backoffice` in Nitro5, and it is recommended to change this (security through obscurity). 
3. Collect outgoing IP-number(s) from the customer and add these to the allowlist: [How to restrict access to backoffice to specific IPs](https://github.com/avensia/nitro5/wiki/Backoffice#how-to-restrict-access-to-backoffice-to-specific-ips) 
4. Decide (together with the customer) on a customer specific PIN code for the site, see [How to setup PIN code](https://github.com/avensia/nitro5/wiki/Pin-code)

### Read more
* [Backoffice](https://github.com/avensia/nitro5/wiki/Backoffice)

## Step 5: Setup project dev environment

Time to setup your development environment for your new project!

Preferrably first setup the Nitro5 environment before continuing, see [Setting up the dev environment](https://github.com/avensia/nitro5/wiki/Setting-up-the-dev-environment). 

1. Verify you are on the Avensia network or VPN.
2. Start a command line with admin privileges in your root folder
3. Run **`nitro build`** and verify no build errors before you continue.
3. Run **`nitro setup-new-project`**. It will ask about the path to your global nuget packages folder. If you have not changed your global nuget settings, you'll find the folder in `%userprofile%\.nuget\packages`. You can also supply this as a param like `nitro setup-new-project packages=C:\Users\malgur\.nuget\packages`
4. When it succeeds, start your site. It will navigate you to backoffice and run Episerver migrations. Restart your browser if you get any certificate errors.

**Errors during setup-new-project?** Reach out to Nitro core team, we want to help and there might be known workarounds. If you need to re-run setup-new-project, we recommend deleting both databases, the database login and your `buildsystem/config.local.json` before running it again, like:

```SQL
DROP DATABASE [Najtro5.Cms];
DROP DATABASE [Najtro5.Commerce];
DROP LOGIN Najtro5;
```

## Step 6: Adjust existing features

Now, time to do some initial adjustments for your specific customer of the out-of-the-box features included in Nitro5. 

1. Set default values (enabled/disabled) for all **feature toggles** in `FeatureTogglesInitialization`. Feel free to delete the `NitroDemoSiteContent` toggle and remove all code that is dependent on it.

2. Search for `// NITROFIX` comments and fix these. Remember as you fix NITROFIX comments to also remove the // NITROFIX comment. TeamCity will fail the build if there are any critical nitrofixes remaining, so you need to fix all critical nitrofixes in the solution before being able to deploy. You can list all remaining nitrofixes with `nitro validate-nitro-fixes`.

3. Go through the code base and remove things that are irrelevant for your project. Uninstall packages, delete code and configs. For example:
   - Remove all payment providers that you won't be using, for performance and complexity reasons. It can be a bit tricky to remove all parts of a provider, please see [this PR](https://github.com/avensia/nitro/pull/531) as a reference.
   - Remove Find if you are using Elevate (see how to [here](https://github.com/avensia/nitro5/wiki/Find)) (although note that Find is used by the backoffice search in Epi). 

## Step 7: Prepare developer database backup
1. Create a folder for your project on the packages server and ensure you are given the credentials. This is done by emailing order@avensia.com or filling in the order form on Sharepoint.
2. Share credentials with the project's PM and store them somewhere for next time you need to update the developer databases.
3. Verify setting `commonBackupDbPath` in `buildsystem/config.defaults.json` is correct.
4. Follow guide on [Developer database backups](https://github.com/avensia/nitro5/wiki/Developer-database-backups) on how to create database backups.

Don't forget:
* Add a Quick order page, if you want one (and add to "Known pages" on Startpage)

Some tools to fill your new project with dummy data until you have real imports in place:

* **Excel product import** - available in Nitro Tools / Imports (url `/excelentryinfoimportadmin`)
* **Excel price import** - available in Nitro Tools / Imports (url `/bulkpriceimportadmin`)
* **Excel stock import** - available i Nitro Tools / Imports (url `/stockimportadmin`) - here you can also generate dummy stock data for multiple stores/warehouses
* **Excel store import** - available i Nitro Tools / Imports (url `/storeexcelimport`)

## Troublehooting
### The "path" argument must be of type string. Received undefined
Check `buildsystem/index.ts`. Search for NITROFIX and update solution file name in `solutionPath: path.join(baseDir, 'Nitro5.sln')`

```
C:\Source\Nitro5> .\nitro build
Running yarn. To show yarn output add --verbose or -v
TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
    at new NodeError (node:internal/errors:406:5)
    at validateString (node:internal/validators:162:11)
    at Object.dirname (node:path:658:5)
    at Object.exports.default (C:\Source\Nitro5\node_modules\@avensia\nitro5-buildsystem\dist\index.js:150:41)
    at Object.<anonymous> (C:\Source\Nitro5\buildsystem\index.ts:134:18)
    at Module._compile (node:internal/modules/cjs/loader:1241:14)
    at Module.m._compile (C:\Source\Nitro5\node_modules\ts-node\src\index.ts:1455:23)
    at Module._extensions..js (node:internal/modules/cjs/loader:1295:10)
    at Object.require.extensions.<computed> [as .ts] (C:\Source\Nitro5\node_modules\ts-node\src\index.ts:1458:12)
    at Module.load (node:internal/modules/cjs/loader:1091:32) {
  code: 'ERR_INVALID_ARG_TYPE'
}
```
