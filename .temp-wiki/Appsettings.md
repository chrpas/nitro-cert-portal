## Guidelines for appsettings

- All settings that are **sensitive** should be in <a href="#azure-keyvault">Azure KeyVault</a>
- Settings that are not sensitive but **varies between environments** (one value for Prod, another for Preprod etc), should be transformed using <a href="#octopus-variables">Octopus variables</a>
- Settings that are not sensitive and uses the same value for all environments can remain in `appsettings.json` (in Git)
- Developer-specific appsettings should be added to `Avensia.Shop/appsettings.Development.json` (which should be gitignored).

## Azure KeyVault
All settings that are **sensitive** should be in **Azure Keyvault**. Examples are SDK keys, passwords, PSP credentials.

Azure Keyvault is accessed using the **App settings** tab in the PaaS portal:
![image](https://github.com/avensia/nitro5/assets/38249038/06135f37-8f25-4dcd-8cb2-4cdd0f01d4f0)


![image](https://github.com/avensia/nitro5/assets/17123416/c522a82a-51f8-4b11-9d56-e43c7510bce2)

Note that the Azure Keyvault changes `:` to double underscore `__` in their UI - however, you should still use colon in configuration code.

You need to specify one value for each environment (even though you might want the same value for all environments).

The Octopus template that is used when setting up Octopus for new nitro5 projects includes dummy NITROFIX values for settings in the startersite that are sensitive and should be in Keyvault. 

Optimizelys documentation: https://docs.developers.optimizely.com/digital-experience-platform/docs/manage-app-settings

## Octopus variables
Settings that are not sensitive but **varies between environments** (one value for Prod, another for Preprod etc), should be transformed using **Octopus** variables.

> Note that the Octopus template that is used when setting up Octopus for new nitro5 projects includes dummy NITROFIX values for settings in the startersite that are sensitive and should be in <a href="#azure-keyvault">Azure KeyVault</a> instead of in Octopus.

To use Octopus variables:
1. Add value for development in `appsettings.json`. Note! Octopus requires the section to exist in `appsettings.json` as it only **replaces** values, it won't automatically insert any sections. 
2. Add variable (e.g. like `Nitro:PinCode:Active`) to Octopus variables and specify it's value for your different environments.

Example:
To transform an existing log setting:
`Serilog:MinimumLevel:Override:EPiServer` : `Information`

To modify more than one log setting or to add (or remove) settings:
`Serilog:MinimumLevel:Override` : `{ "EPiServer": "Warning", "Mediachase": "Warning", "Microsoft": "Warning", "System": "Warning", "Quartz": "Warning", "Avensia.Nitro5.Jobs": "Warning", "Avensia.Nitro5.Esales.ConnectorV2": "Information" }`

Also note: If you change a value of an Octopus variable and you want to re-deploy an existing deploy - make sure to hit the "Refresh variables" button before deploying, otherwise you'll deploy using the old values of the variables. 

> It is also possible to use a specific appsettings-file for each environment: `appsettings.Integration.json`, `appsettings.Preproduction.json` and `appsettings.Production.json`), but since we dont want to store sensitive data in git, we do not recommend this approach.