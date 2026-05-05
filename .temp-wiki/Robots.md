Nitro blocks bots/crawlers for non-public domains (since `siteinfra@1.8.0` and `scope-mvc@2.0.8`). This is done in three ways:

- `Robots.txt` will return `Disallow: /`
- The header `X-Robots-Tag` will be added to every response
- All pages will have `<meta name="robots" content="noindex, nofollow">` in the head section

## Configuration
By default only `www.*` is considered a public domain. _You only really need to configure this feature if you have any deviations from the default behavior._

There are two ways to configure the list of public domains:
1. `PublicDomains` - a list of fully qualified domain names (FQDN), e.g. `[ "www.mydomain1.se", "www.mydomain1.no" ]`
2. `PublicDomainFilters` - a list of regular expressions matching FQDNs, e.g. `[ "^www.domain\." ]`

You can configure it in code, like so:

```c#
services.AddRobots(o =>
{
    o.PublicDomainFilters = new [] { @"^dev\." };
});
```
...or by binding to a configuration section:

```c#
services.Configure<RobotsOptions>(_configuration.GetSection("Nitro:Robots"));
```

## Read more
- https://github.com/avensia/nitro5-packages/pull/251