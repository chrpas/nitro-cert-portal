There are 2 different ways of sending emails in Nitro:
1. For the "internal emails" feature, Nitro uses the SendGrid SMTP account included in DXP
2. For all other emails, emails are sent using either the Voyado integration or the SendGrid integration.

## How to set up internal emails (SendGrid SMTP)

1. Update the SMTP settings in `appsettings.json` (`Nitro:InternalEmail`). Credentials can be generated in the Paasportal here:
![image](https://github.com/avensia/nitro5/assets/998359/b7d177c5-8a59-47f8-a2e5-f740a1c63881)
The SMTP host in appsettings should be set to `smtp.episerver.net`, the username to `apikey` and the password to `SG.<Id>.<key>` from the generated key in Paasportal. 
2. Ask support@optimizely.com to add a "Sender authentication" for SendGrid SMTP for the e-mail address you are using as sender address. Otherwise no emails will be delivered!

Also see https://docs.developers.optimizely.com/digital-experience-platform/docs/configuring-the-email-server#dns-configuration

## How to set up SendGrid

Note: If you are using Voyado, you wont be using SendGrid, since you'll be sending emails through Voyado instead. 

1. Ask customer to create a SendGrid account. Customer can start with a free account during development and upgrade later before go-live. (Note: If you got account info from Episerver for SendGrid, you can probably use that account to setup the "internal emails" feature, but you cannot use it for the SendGrid integration in Nitro, since you cannot login to https://app.sendgrid.com/login with this account.)
2. Ask customer to invite you.
3. Log in to SendGrid: https://app.sendgrid.com/login
4. Set up a “sender” in SendGrid
5. Create an API key and add to configs (it’s a critical NITROFIX)
6. Copy mail html templates and test data from htmltemplates folder to SendGrid, add the ids to configs

Note that Nitro startersite uses the same SendGrid account for all environments.