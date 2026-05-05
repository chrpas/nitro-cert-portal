## URLS to bookmark
* [Episerver support](https://support.episerver.com/) for all tickets sent to support@episerver.com
* [Azure portal](https://portal.azure.com/) with Application Insights
* [Episerver PaaS portal](https://paasportal.episerver.net/)

## Step 0: Verify you are ready for first deploy to DXP

Before deploying to Integration for the first time:
* Fix all critical NITROFIXES (or TeamCity won’t build)
* Set up Esales/Elevate (if applicable)
* Set up SendGrid (if applicable)
* Set up TeamCity and verify that TeamCity builds the project successfully (the continuous integration build)
* Set up Octopus

Also recommended, but optional:
* [Make the backoffice url customer-specific](https://github.com/avensia/nitro5/wiki/Backoffice#how-to-change-url-to-backoffice)
* [Make the the pin code customer-specific](https://github.com/avensia/nitro5/wiki/Pin-code)

## Step 1: Technical contact receives an mail from Episerver with details for the environments
The mail will include the url for Integration, which is important going forward

## Step 2: Upload database and assets to integration
See https://github.com/avensia/nitro5/wiki/Uploading-a-database-to-DXP

See https://docs.developers.optimizely.com/digital-experience-platform/docs/storage-containers#get-epistoragecontainersaslink
Use AzCopy 

## Step 3: Deploy/provision environments

1. Do a deploy with Octopus to integration
2. When integration is done, deploy to Preprod via PaaS portal (by copying code + data from integration)
3. When deploy in PaaS portal is done,  deploy to Preprod via Octopus (so you get the correct Octopus variable transforms for Preprod)
3. When Preprod is done, deploy to Prod via PaaS portal (by copying code + data from preprod),
4. When deploy in PaaS portal is done, deploy to Prod via Octopus (so you get the correct Octopus variable transforms for Prod)

Done! Now we can deploy to any env directly via Octopus. 

> Note: Going forward, only deploy via Octopus are supported. PaaS portal will not do the variable transforms we have setup in Octopus, rendering incorrect configuration.

## Step 4: DNS
A prepreq for setting up DNS is that the environment has been deployed at least once, so it is recommended to get all three environments deployed before the work with DNS is started.

1. Notify Managed Services (managedservices@episerver.com) that you want to setup DNS for customer. Clearly state for each instance which your desired DNS entry should be (e.g. cust01mstr8ut85inte => integration.customer.com)
2. Support will return a list of verification records that should be forwarded to the customer. These records needs to go into the DNS to verify the ownership of the domain (e.g. TXT  cloudflare-verify.customer.com  →  191229913-193525480)
3. When customer has confirmed that the verification records have been setup, reply to Managed Services and have them comple the setup
4. In return you will get CNAME records from Managed Services that should be forwarded to the customer (e.g. CNAME  integration.customer.com  →  integration.customer.com.dxcloud.episerver.net) and have them update the DNS.

Note: When you are adding a subdomain (like `integration.example.com`) to a root domain that has an active site (like `www.example.com`), you should first investigate with the client if they already have an active CloudFlare account. If they do, be very clear in the request to Optimizely when you ask them to add the subdomain that they should only set up partially liberated zones for the requested subdomains and not take over the full zone. Otherwise, Optimizely might hijack the whole `example.com` domain by taking over the full zone in Cloudflare, making the *production site `www.example.com` unreachable.

> Note: Switching prod to www should be done by customer when going live.

> Note: There is a redirect from `*.example.com` to `www.example.com` in `CustomRedirectToWwwRule`, which redirects all requests for `*.example.com` to `www.example.com`, except requests for `www.example.com` and `prod.example.com`. If you are not using `prod.*` as url to your prod site before go-live, you will need to modify this logic.

> Note: The asuid.example.com records should not be removed. They are used by Optimizely & Cloud Flare throughout the life cycle of the entire application.

## Step 5: Certificates
There are two options regarding certificates: either the customer already has a wildcard certificate for the domain (e.g. *.customer.com), then this certificate can be handed from the customer to Optimizely Managed Services who will import it into Cloudflare. 

The other option is to have Optimizely generate certificates for the domains. This is the recommended approach since this way Optimizely will automatically renew the cert and you don't have to worry about expired certs in the future.

## Step 6: Image resizer
You need to ask Optimizely to enable the image resizer, see https://github.com/avensia/nitro5/wiki/Image-resizing#enabling-the-image-resizer-in-dxp. Otherwise you'll get 404 for all images on the site.

## Step 7: Scheduler instances for preprod and prod
Ask Optimizely support to provision scheduler instances for preprod and prod. They won't be fully active until the next deploy (where the scheduler transform kicks in).

Once they have been provisioned, verify that you can see the sch-instance in PaaS portal.

## Step 8: Configure integration, preprod and prod
1. Change password of the Episerver admin user for Prod (so it is not the same as in migration `20180518_1400_CreateAdminUser.cs`), and create personal accounts for everyone that needs to access Episerver in Prod. 

For Integration, Preprod and Prod:
1. Verify hostname/url is correct for each environment in Epi CMS Admin / Config / Manage website 
2. Run full promo cache
3. Run full index
3. If you have GTM and GA setup already, update `Google Tag Manager Source URL` and `Google Analytics Key` in Epi CMS / Startpage / Site Settings

## Step 9: Give your fellow backenders access to PaaS portal
Ask your colleagues to request access to PaaS portal, see [Getting access to PaaS portal](https://github.com/avensia/nitro5/wiki/Troubleshooting#getting-access-to-paas-portal)

Also verify that you get access to Application Insights. Sometimes this fails in the provision process.
> Note: What this will look like is that you can't see anything but the integration environments wrt. Application Insights, SQL database and so on.
This can be very confusing and stressful.

## Step 10: Database access (optional)
Request database access for you and your fellow team members: See [How to access databases in DXP](https://github.com/avensia/nitro5/wiki/Accessing-databases-in-DXP)