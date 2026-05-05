When finalizing the base upgrade, please use the following checklist before going into customer-specific upgrade/UAT testing:

## Code

- Verify that there is no [by the upgrade] commented-out code that is not mentioned in a handover document/list

## Files and dependencies

- Verify that there are no leftover files from the upgrade (*.config, modules/, *.log, etc)
- Verify that there are no build warnings *
- Verify that there are no dependencies to packages that are not used (e.g. payment methods, content indexers)
- Verify that no windows-specific packages are referenced (should yield build warnings)
- Verify that any package RC logic from suite has been migrated to nitro5-packages

<sup>* Build warnings related to package versions might be difficult to fix completely but should at least be considered</sup>

## Development environment

- Verify that it is possible to start the nitro5 version on an existing database without having to do manual interventions (like running SQL etc)
- Verify that it is possible to set up the project from scratch, that `nitro setup-dev-env` is working as expected
- Verify that it is possible to run `nitro run-migrations` without issues
- Verify that it is possible to run `nitro full-index` without issues
- Verify that it is possible to start the site without issues

## Site

- Verify that the start page works as expected
- Verify that the menu/header works as expected
- Verify that category pages work as expected and that filtering/sorting works as expected
- Verify that product pages works as expected and any variant selection works as expected
- Verify that breadcrumbs works as expected
- Verify that search works expected
- Verify that it is possible to add to to cart and change quantity
- Verify that it is possible to checkout and complete a purchase
- Verify that it is possible to login to my pages
- Verify that there are no console errors (both backend- and frontend) when browsing around the site (other than those that might already have been there pre upgrade)
- In a multi-language/multi-market/multi-domain scenario, verify that switching languages/currencies/markets works as expected
- In a multi-site scenario, ocularly verify that each site is working as expected (e.g. catalog)

## Backoffice

- Verify that backoffice loads without problems
- Compare with the old site and verify that all **customer specific tools** (under Cms -> Admin) have been migrated and still work as expected.
- Verify that the standard Nitro tools works as expected, e.g. country admin

## Configuration

- Verify that all existing configuration has been migrated, either to appsettings.json (as default values) or Octopus/Azure KeyVault

## DXP

- Verify that TeamCity has been set up [according to guidelines](https://github.com/avensia/nitro5/wiki/Setting-up-TeamCity)
- Verify that Octopus has been setup according to guidelines
- Verify that Cloudflare image resizer has been [enabled for the zone/domains](https://github.com/avensia/nitro5/wiki/Image-resizing#enabling-the-image-resizer-in-dxp)
- Verify that the new integration env (02) has been provisioned (with database and blobs copied) *
- Verify that DNS has been set up for integration env (e.g. integration-nitro5.<customer-domain>) *

<sup>* Some projects does not use the integration env. Please check with the customer team whether to set up preprod instead.</sup>