## Prerequisites
- Verify that all your relevant dependencies (nuget packages) have support for .NET 8
- Verify that you have a working devdatabase

## Upgrade steps
Upgrading to Nitro5 involves the following steps:

1. **[Upgrade frontend to Scope 9](https://github.com/avensia/nitro/blob/develop/docs/nitro_projects/SCOPE_UPGRADE.md)** _If you have already upgraded to Scope 9 in your project then this step can be skipped_.
1. **[Upgrade backend to Nitro5](https://github.com/avensia/nitro5/wiki/Upgrade-codebase-to-Nitro5)**
1. **[Configure CI/CD and DXP for Nitro5](https://github.com/avensia/nitro5/wiki/Configure-CI-CD-and-DXP-for-Nitro5)**
1. **Regression testing** - we recommend performing a full regression testing to verify that all features are working as expected, both frontend and backend.
1. **Go live**

> It is possible to continue development on the main branch even during the upgrade, as long as you rebase the upgrade branch regularly

## Useful links
* [Changes in Nitro5](https://github.com/avensia/nitro5/wiki/Changes-in-Nitro5)
* [Upgrade docs from Optimizely](https://docs.developers.optimizely.com/content-cloud/v12.0.0-content-cloud/docs/upgrading-to-content-cloud-cms-12)
* [Breaking changes CMS 12](https://docs.developers.optimizely.com/content-cloud/v12.0.0-content-cloud/docs/breaking-changes-in-content-cloud-cms-12)
* [Breaking changes Commerce 14](https://world.optimizely.com/documentation/developer-guides/archive/-net-core-preview/upgrading-commerce-14/breaking-changes-commerce-14/) (yes even though it says "archived" there is no other doc about it)
* [Optimizely CMS & Commerce .NET Core migration - Tips & Tricks](https://www.davidhome.net/blog/optimizely-cms-commerce-net-core-migration-tips-tricks)

## Questions?
Please reach out to the product team when you start to upgrade, we want to know and we are here to help you! 

Questions about the migration can be asked in #nitro5-migration.


