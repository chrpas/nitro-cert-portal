This guide details the steps for provisioning new DXP environments (Linux), based on the existing DXP environment (Windows).

In Optimizely terms this is called _"Project migration"_.

> :bulb: The new environment will live in parallell to the existing one, so it has no effect on existing site.

This process is carried out in the [paasportal](https://paasportal.episerver.net/) and a prerequisite is that you have access to the existing DXP environment. If you don't have, you can request access [here](https://world.optimizely.com/service-request-forms/access-to-dxp-portal/).

## Start migration
1. Go to [paasportal](https://paasportal.episerver.net/), choose project and go to `Project Migration` tab
2. Click `Start Migration` and then `OK` in the certificate warning modal. This will start the provisioning of the new project as well as the integration environment in the new project.
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/ed2c67ac-905d-4d97-a8e3-c19278ed080c" />
<br/>_Certificate warning when starting the project migration process_<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/e4436eee-f5df-4101-8bb8-37d871a6edfb" />
<br/>_Provisioning has started_

## Copy content from existing integration
When provisioning is done click `Copy Content` and choose `Integration` to copy Integration database and assets to the Integration environment.<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/4ac8d995-10ad-4bc8-bb57-f3020c48f2bf" />
<br/>_Provision done, now copy content_<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/0a5f8b83-838c-4c3b-8220-e4551bc0953c" />
<br/>_Select existing integration environment as source_<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/889cc2a3-f304-471c-8d7c-3ef3f9f22264" />
<br/>_Databases and blobs have been copied successfully_

## Provision Preprod and Production
1. Go to `Deployments` tab in the **new project**. Click `Deploy to` and deploy Integration to Preprod. Select the integration application. Leave `Include Blobs & DB` unchecked. Provisioning of Preprod will start and the deploy will fail due to not having deployed any custom code to the Integration environment. This is expected as our goal is to have the Preprod environment provisioned, code package deploys will be done later through Octopus Deploy.<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/d6916241-acd7-4137-ab17-ec67cd690367" />
<br/>_Provision preprod by cloning integration_<br/>
<br/><img src="https://github.com/avensia/nitro5/assets/63298385/1976b5f4-55c0-414a-a8ab-d675f9497774" />
<br/>_Preprod provisioning done - error is expected_
2. When deploy to Preprod is done, start a deploy to Prod like above but instead choose Production as the application in the modal. Note! This is for the _new_ DXP environment, it does not affect the existing environment.

## Copy content for Preprod and Prod
Once preprod and prod has been provisioned, we can now copy content from the existing environments.<br/>
<br/><img src="https://github.com/user-attachments/assets/ddb716ac-e629-4b2c-a49c-7a36c1478abd" width="500" />
<br/>_All environments are now provisioned and we can continue copying content for preprod and prod_

1. In the `Project Migration` tab, click on `Copy content` for `Preproduction`. Then click `Copy` in the dialog. Wait.<br/>
<br/><img src="https://github.com/user-attachments/assets/8b790e2b-c688-441d-ad7a-bfcd7c27835f" />
<br/>_Copy content from existing preprod to new preprod_
2. In the `Project Migration` tab, click on `Copy content` for `Production`. Then click `Copy` in the dialog. Wait.<br/>
<br/><img src="https://github.com/user-attachments/assets/29998ab6-368a-4deb-979c-f2c9aeb33a4c" width="50%" />
<br/>_Copy content from existing prod to new prod_

## Notes
- It is possible to `Copy Content` for each environment as many times as needed until migration is completed.
