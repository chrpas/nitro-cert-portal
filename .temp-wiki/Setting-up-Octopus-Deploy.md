## Prerequisites
### nitro5-buildsystem
Make sure you are using nitro5-buildsystem version 3.4.0 or higher in buildsystem/package.json (to get the scripted Octopus support).

### Setup parameters
Project settings are defined in buildsystem/index.ts.
- Update `octopusDeploy.projectName` in `buildsystem/index.ts` to e.g. "MyProject Nitro5"
- Update `projects.nuGetId` in `buildsystem/index.ts` to e.g. "MyProjectNitro5.Shop"

## Setup Octopus

1. Run `nitro setup-octopus` (append `--log-level=verbose` for verbose logging)
2. Enter the Octopus Deploy Api Key. This key can be obtained from IT via the #devops channel.
3. Verify the parameters to be used before answering _y_.

![image](https://github.com/avensia/nitro5/assets/63298385/7c7ae90f-4025-4c07-8cc7-aab47b594700)

4. Clone is now successful.

## All parameters
| Parametes             | ProjectSetting            | Environment variable           | Default value              | Note |
| --------------------- | ------------------------- | ------------------------------ | -------------------------- | ----- |
| Project name          | octopusDeploy.projectName | OD_SETUP_PROJECT_NAME          |                            | Must be set |
| Nuget Id              | projects.nuGetId          | OD_SETUP_NUGET_ID              |                            | Must be set. First object in projects is used |
| Api Url               | octopusDeploy?.serverUrl  | OD_API_URL                     | https://octopus.avensia.se |
| Api Key               | octopusDeploy?.apiKey     | OD_API_KEY                     |                            | Must be set. Prompted upon execution |
| Space name            |                           | OD_SETUP_SPACE_NAME            | Default                    |  |
| Project to clone name |                           | OD_SETUP_PROJECT_TO_CLONE_NAME | Nitro5 Template            |  |

## Setup Octopus variables
Go to "Project variables" in Octopus. You need to add `Deploy.ProjectId`, `Deploy.ClientKey`, `Deploy.Deploy.ClientSecret` - you'll find these in the DXP Management Portal (tab API, secdtion Deployment API Credentials).

There are also a couple of NITROFIXES here where you should add values in Azure Keyvault (see [Appsettings](https://github.com/avensia/nitro5/wiki/Appsettings)) (You can remove the Octopus variable when you've added it in Azure Keyvault)
