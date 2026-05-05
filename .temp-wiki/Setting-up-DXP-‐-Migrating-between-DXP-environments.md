This section is not about migrating classic environments to Nitro 5, but between existing agreements.

This has happened exactly once, but in case anyone should experience it here is the basic layout.

Go through the guide in the [Setting-up-DXP](https://github.com/avensia/nitro5/wiki/Setting-up-DXP) page, this is just that with extra steps.

You will get a new environment with only integration available, at minimum scaling levels.

1. Get access to Paasportal.
2. Create API keys for the environments
3. Update Octopus with the new keys, or create a new project. (Project Id, ApiKey ApiSecret ).
4. Deploy to each environment to spin up the AI, SQL, Webservices, Blobstorages.
5. Ask Optimizely to create the scheduler instances for preprod and production respectively
6. Ask Optimizely to scale the SQL DTU usage to their old environments
7. Update the Web site configurations on the old site to allow the new https://example.dxcloud.episerver.net address.
8. Ask Optimizely to make DB-copies for each environment, but be careful with the production copy as it will keep the state of the jobs as it was on the old environment.
9. Visit https://example.dxcloud.episerver.net to make sure the environments are responding.
10. Ask Optimizely to copy the hostnames from the old services in Cloud Flare ( It will say DUPLICATE and be yellow )
11. Update the DNS with the new TXT asuid records. This will be new so the old one should be replaced.
12. Ask Optimizely to activate the DNS records in one by one as you are ready to use them. This will make integration.example.com point to the new host.
13. Visit the site and double check that you are visiting the right service by checking the name in diagnosticsadmin.
14. Double check that no-one is using the old service name https://example-old.dxcloud.episerver.net by checking the old application insights. Make these sites change the url to the public address. ( In case someone has decided to direct traffic to the scheduler instance ).
15. Verify that the scheduler is running.
16. If you are on FIND , then you will need to recreate everything. Full index, Synonyms, Keywords etc.

If you made it this far, preferably on your first read through. Congratulations.