## Multisite
Sites are registered in Episerver under CMS / Admin / Settings / Manage Websites. If this list contains more than one site, we consider the solution to be multisite.

Each site:
- Has a unique startpage
- Has a unique set of site settings (as these are stored on the startpage in Nitro)
- Has a unique catalog (in Nitro - more on this below)
- Has at least one top level domain - (more on this below)
- Has unique user accounts - the same email can be registered as  different accounts on the different sites (as Nitro stores the siteId on both the user and the contact).
- Can use a different theme (see https://github.com/avensia/nitro5/wiki/Theming).
- Has a unique site name (as Nitro assumes site name is unique)

## Multi-language
- All CMS content can be translated to different languages, hence each language can contain unique content. So even if a site has one single startpage, this startpage can be translated to different languages (and each language can use a separate domain, like nitro5.se and nitro5.com)


### Current language
- Nitro detects the current language either by domain (if the site's host definition has a culture set, like nitro5.com and nitro5.se) or by url segment (if the site's host definition does not have a culture set, like nitroX.com/sv-se)
- Nitro stores current language in a `Culture` cookie
- Nitro supports creating and publishing content in "hidden" languages - meaning editors (with a specific role) can create and view content in this language, but it is hidden from other users.

## Catalogs
- Nitro assumes that each site has **1 single unique catalog**. Episerver allows you to use multiple catalogs per site, but note that Nitro assumes there is only one catalog per site. This is a setting on the Site Settings on start page. (In Epi Commerce there is also a property on each catalog which site this catalog belongs to, this property is not used in Nitro)
- If you need a subset of a catalog (some specific categories, for example) on your second site, we suggest you duplicate the products in a second catalog, prefixing their codes:s with catalog or site id (as product codes needs to be globally unique in Episerver). Example: https://github.com/avensia/dometic/blob/8cc9bdac0237549672967e0794805aa96f6be346/src/Avensia.Common/inRiverImport/Transformers/ItemTransformer.cs#L67

## Markets

- Nitro assumes that a **market is a country**. There is a `Countries` property on `IMarket` that Nitro does not use, since Nitro assumes only one country per market.
   - Market name is the country name (e.g. "Sweden")
   - Market id is the three letter country code (e.g. "SWE")
- Carts and purchases are connected to a market
- Nitro assumes 1 single currency per market, (see `IMarket.DefaultCurrency`). Episerver allows a market to have multiple currencies, but Nitro assumes 1 single currency per market.


## Current market/country and language
- Nitro determines current country by looking at a request header (see `CurrentCountry` and `CountryLocator`) and sets this in a `CurrentCountry` cookie. User can choose to select a different country.
- `LanguageAndMarketHttpModule` ensures that the current language and current country is set for every request (to valid values). So you can use `ContentLanguage.PreferredCulture` and `ICurrentCulture.GetThreeLetterCountryCode()` - they will always give you valid values.



## Top level domains
Each site has at least one top level domain, but it is possible to use multiple domains as well (one per language).

Note! A top level domain is not a market is not a culture is not a language is not a country!

# Adding a site to your solution
How to create a new site:
1. Modify `sites.json` to include your new site
2. Run `nitro setup-certificates` (it will create ssl certificates based on `sites.json`)
3. Use **InitialContent** feature to create your new site in a migration, see more below.
4. Run this migration (Tip: do a snapshot of db before testing migration)
5. Navigate to your new site!

## InitialContent
The purpose of the InitialContent feature is to assist you in creating a new site. See an example in `M20240130_1326_AddSiteNitroX.cs`.

1. Start by specifying which languages to create on your new site. First one in your list will be the master language.
2. Create a new (empty) catalog (you'll have to populate it with products later) and a folder for product images.
3. Create initial CMS content. See folder `Avensia.Shop/InitialContent` for json files namned `InitialContent-*.json` with translations. Modify the `CreateInitialContent` method so it creates the content you need for your specific customer. If you have any required fields on your startpage, dummy values for them will need to be added for them in InitialContentService.
    ```c#
   var startPage = _initialContentService.CreateInitialContent(siteName, languages, catalog, "ProductImages");
    ```
4. Create a site definition and set the startpage. Site definition should match what you entered in `sites.json`.
   ```c#
   var siteDefinition = new SiteDefinition
   {
      Name = siteName,
      SiteUrl = new Uri("https://" + GetHostName()),
      StartPage = startPage.ContentLink,
      Hosts = new List<HostDefinition>()
      {
        new HostDefinition {Name = GetHostName(), Type = HostDefinitionType.Primary},
      }
   };
   _siteDefinitionRepository.Save(siteDefinition);
   ```



## Read more
- [Checklist of things to consider before going multi-market](https://github.com/avensia/nitro5/wiki/Multisite-checklist)
- https://github.com/avensia/nitro5/pull/288