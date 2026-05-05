## Three months before go-live
1. Ask in #ask-qualityteam about measuring performance before and after go-live

## Before start of UAT
1. Contact Nitro core team for a sync with product team before go-live. We'll do an audit/check of the site to make sure you are not going live with any problems there are known fixes for. 
1. Verify you are running the latest stable version of all Nitro packages. If not, update to latest stable version.
2. Verify you are **not** running any rc-versions of the Nitro packages. If you are, get them merged!
3. Ask in #accessibility about doing a  "Accessibility audit" of the site, to make sure the site is WCAG compliant (also see doc on [Accessibility in Nitro](https://github.com/avensia/nitro/blob/develop/docs/ACCESSIBILITY.md))
4. Verify you have modified `500.cshtml` with customer layout and languages, see [Error pages](https://github.com/avensia/nitro5/wiki/Error-pages)
5. Verify that you have set the `PageNotFoundPage` property on SiteSetting and that it contains customer content

## A week before go-live
1. **Prime eSales** with prod data
1. Verify all **synonyms** are updated in eSales
1. Let Episerver support know about your go-live date and verify that Episerver does their pre-go-live checks. 
1. Verify that access to backoffice is only allowed from the **whitelisted IPs**
1. Verify **SSL certs**
2. If you are going to do redirects from e.g. nitrofashion.com to www.nitrofashion.com (which is done in Nitro OOTB by `CustomRedirectToWwwRule`):
    1. Verify there is **SSL cert installed for the root domain** (apex domain)
    2. Customer needs to add the **A record** in their DNS. Check with Epi.
3. Ask customer to **lower TTL in DNS** (time-to-live) to mimimun value e.g. 10 minutes. This is so the host name change will take effect quickly during go-live. You can verify value of TTL with: 
    ```
    nslookup -type=cname -debug nitrofashion.com
    ```
4. Verify all **old product URLs have permament 301 redirects** (use Avensia.Redirector)
5. Remove the general **admin account** and verify that everyone uses personal accounts to log in to backoffice
6. Verify email setting **InternalEmailsMailTo** in Octopus so it points to a valid address at customer
7. Verify `GenerateSitemapJob` is scheduled and run at least once
8. Verify all **Site Settings** on startpage
9. Truncate the AR* tables (except ARManualRedirects and AROldSiteUrls if you have manually populated records here), since they may contain tons of "development redirects", after having done several pim imports etc. Then verify that the FullRedirectorUrlBuilderJob can run successfully, filling the tables correctly. (Also see docs on [Redirector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/redirector))
9. Verify that **jobs** are scheduled OK and running OK
   - Run Optimizely's "Search & Navigation Content Indexing Job" once to enable backoffice search
   - Enable Optimizely's "Collect orders per promotion statistics" to get order statistics on discounts
   - Enable Optimizely's "Remove expired carts" to cleanup carts (default it removes carts older than 30 days)
10. Verify **Image cache works** as expected on DXP CDN (Check that there is a reponse header `cf-cache-status` with value HIT for images)
11. Verify that JavaScript sourcemaps are not accessible in production (unless you are logged in)
15. Import customers from old system (if applicable)
16. Verify all e-mail templates look OK
17. Verify that pim connector has "image configuration" setting in inriver set to "EPI" (NOT "original"!)
18. If you are going live on a domain which is **not** "www.*", you need to configure which domains should be public when it comes to [robots.txt](https://github.com/avensia/nitro5/wiki/Robots)
19. Verify you have secured backoffice using customer's IPs.

## The day before go-live
11. Run **full promo cache** and **full index** (disable the incremental jobs first)
12. Verify that full promo cache and full index ran successfully, **enable the incremental jobs** and verify it runs correctly
13. Configure **production host names** in epi site settings
14. Verify all **payments** uses production settings, and set `Nitro:Payments:UseTestEnvironments` to false in appsettings. Verify you can place orders using all payment providers.
14. Verify all **delivery methods** uses production settings
15. Double check **all config** for production settings only
16. **Cleanup database** - empty carts, orders, queues. See template scripts in https://github.com/avensia/nitro5/tree/develop/buildsystem/templates DO NOT USE PROD FOR ANY TESTING AFTER THIS.

## Go-live day
17. Remove **[site PIN](https://github.com/avensia/nitro5/wiki/Pin-code)** for production and deploy to prod
18. Ask customer to do the actual **DNS change** (from prod.nitrofashion.com to www.nitrofashion.com)
19. Update **host names in epi** (www.nitrofashion.com as primary url - put the host you want to be used in Google feed etc as the first one in list)
    1. When [this PR](https://github.com/avensia/nitro5-packages/pull/793) is merged, we will use the primary host, configured in backoffice > manage websites, as the primary url, regardless of the sort order. Note! All images will stop working until the DNS provider has configured the www host to point to the Nitro site.
20. Update **Google Analytics ID** to correct value for prod
21. Verify **GTM** works
22. Run the FullRedirectorUrlBuilderJob once, then disable it and schedule the incremental one. (Also see docs on [Redirector](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/redirector))
23. Verify old product **urls redirect correctly** to new urls
22. Verify that **Google Feed** has correct urls (www.nitrofashion.com instead of prod.nitrofashion.com)
24. Update **PIM connector** to send requests to www.nitrofashion.com (instead of prod.nitrofashion.com) + restart service
25. Update **ERP** so it sends requests to www.nitrofashion.com (instead of prod.nitrofashion.com)
26. Remove prod.nitrofashion.com from Epi hostdefinition
27. Remove prod.nitrofashion.com from DNS <-- DO NOT SKIP THIS! or Google might index stuff for prod.nitrofashion.com

## When it's calm again
28. Set TTL in DNS back to normal value again
28. Celebrate!
29. Update this checklist with everything you learned during go-live :)
30. Take a moment to think about all the awesome stuff you built in this project. What would be useful to bring back to Nitro? Let us know!