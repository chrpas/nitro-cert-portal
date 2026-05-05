Sitemaps are generated in XML format by `SitemapGeneratorJob` which is default scheduled to run once every hour. The job generates sitemaps by extracting data from the [content index](https://github.com/avensia/nitro5/wiki/Content-index) (e.g. eSales or Find). It includes products, categories, brands and CMS pages in the sitemaps.  See implementations of `ISitemapSource`. You may need to modify how the sitemap is generated for your project.

The sitemaps are stored in Azure Blob Storage. See [How to emulate Azure Blob Storage locally](https://github.com/avensia/nitro5/wiki/How-to-emulate-Azure-Blob-Storage-locally) to generate sitemaps locally.

A list of all available sitemaps are available at `/sitemap` and `/sitemap.xml`. For each site there will be one sitemap for each language. 

If the number of entries in a sitemap exceeds 10000 entries (as specified in config setting `MaxEntriesPerSitemapFile`), the sitemap will be split into multiple files (called "batches") so that each file contains a maximum of 10000 entries. 

The link to `/sitemap.xml` is automatically included in `/robots.txt` by the `RobotsController` if appsetting `Nitro:Robots:AllowRobotsToIndexSite` is set to true.