
# Voyado integration
By default Nitro has Voyado enabled as [CRM](https://github.com/avensia/nitro5/wiki/HubSpot). When Voyado is enabled, Nitro will store contact info in Voyado instead of in Epi. Voyado will also be used instead of SendGrid for the transactional emails (like order confirmation email).

When Voyado is enabled, Nitro uses the [VoyadoCrmService](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/CRM/Voyado/VoyadoCrmService.cs) implementation of `ICrmService` instead of the [EpiCrmService](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/CRM/Epi/EpiCrmService.cs) implementation.

To enable Voyado, set the `Nitro:Crm:Provider` setting in `appsettings.json` to "voyado".

## Functional description
* When new members are registered on site, a contact is created in Voyado as well as in Epi.  The contact in Epi references the Voyado contact, by the CrmId and CustomerNumber fields in table `cls_Contact` table in commerce database.
* When members log in, credentials are validated against Epi
* When displaying member data on My pages, data is fetched from Voyado
* When updating member data on My pages, data is updated in Voyado
* Order emails are sent via Voyado (not SendGrid, see the [VoyadoEmailSender](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/CRM/Voyado/Order/VoyadoEmailSender.cs))

## Avensia & Voyado Slack
There is a Slack for communicating with Voyado, ask a collegue to invite you!

## Whitelisting addresses for dev/stage
In dev/stage, Voyado will only send e-mail and sms to addresses that are whitelisted in Voyado. To test e-mail or sms, ask in the Voyado slack to have your e-mail address and/or phonenumber whitelisted.

## Email templates
Voyado has a standard "Nitro email config" that you can ask them to add to your Voyado instance. 
You will need to create HTML templates according to your customer requirements.

For product images to work in the e-mails, Voyado needs to be able to access the site's Google product feed.

## Customer specific API
Each customer has a unique API provided by Voyado. For example, the Voyado instance used by Nitro demosite can be found at: https://storefrontnitro.staging.voyado.com/api/v2/ui/index

## The Voyado UI
Each customer has as unique URL to login to the Voyado UI. For example, the Voyado instance used by Nitro demosite can be found at: https://storefrontnitro.staging.voyado.com. Ask in the `#avensia-voyado-engage` slack channel for credentials.
