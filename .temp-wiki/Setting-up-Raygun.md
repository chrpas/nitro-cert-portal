### Access

When you start working with a new project and Raygun hasn't been setup yet, please join #raygun on Slack and ask to have your project created.

Also use #raygun to ask for access for fellow developers.

Normally, we have one Raygun application per DXP environment, e.g.:
- <Project name> Integration
- <Project name> Preproduction
- <Project name> Production

### Configuration
1. Add Octopus variable `Nitro:Raygun:ApplicationKey` with the Api key (can be found in Application settings in Raygun)
1. To toggle the use of Raygun, change the setting `Nitro:Raygun:Active`
1. Set the `applicationId` under `raygunEnvironments` in buildsystem/index.ts to the application id (not the api key) for production. This is to make uploading of source maps work.

By default, both backend and frontend report to the same Raygun application. If required, it is possible to split it up into separate applications.

### Setting up Sourcemaps in Raygun
Nitro's buildsystem will automatically upload Javascript source maps to Raygun. See [Sourcemaps](https://github.com/avensia/nitro5/wiki/Sourcemaps) for more info on sourcemaps in Nitro.

Settings for this can be found in `buildsystem/index.ts`. See [nitro#777](https://github.com/avensia/nitro/pull/777/).

It is important to provide the **application id** of the Raygun application. Typically we have one application for Prod and one for Preprod.

It is also important to specify the **application domain** to the uploaded sourcemap in order for Raygun to be able to **resolve sources properly**. Nitro is by default configured for a single-domain, but it is possible to specify multiple domains per Raygun applicationId. [AJ Produkter has an example of this](https://github.com/avensia/ajprodukter/blob/develop/buildsystem/index.ts#L94).

By default source maps are stored for 365 days in Raygun but this value can be configured in `buildsystem/index.ts`. It is recommended to have a lower value for preprod.

![image](https://user-images.githubusercontent.com/6929325/176157648-c2d6af23-089c-4673-b044-a1928b64ccbc.png)
*JS source map center in Raygun*

### Read more
* [Sourcemaps](https://github.com/avensia/nitro5/wiki/Sourcemaps)
* [nitro#777](https://github.com/avensia/nitro/pull/777/) 