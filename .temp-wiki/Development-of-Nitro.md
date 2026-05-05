## Nitro Core Team
There is a team that work permanently 100% with Nitro, we call this the **Nitro Core Team**. The core team consists of a few "fixed" roles: the **Director of Products**, a **Product Owner** and a couple of **Product Architects** and **Product Developers**. In addition to the core team, there is usually one or two developers that we lend from the project organization, that work with the Nitro Core Team for a few weeks or months and then go back to working in a Nitro project again. Talk to your manager if you are interested in working with the Nitro team!

The current core team can be found on [Sharepoint](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro---Organisation.aspx).

## "Virtual" Nitro Team - all of Avensia

Although there is a Nitro Core Team with time allocated to Nitro, a lot of Nitro development is done in our Nitro projects. 

The process works both ways:

- Nitro projects can merge (or cherry pick) updates **from** Nitro 
- Nitro projects submit new features and bug fixes **to** Nitro 

![Nitro wheel of features](https://github.com/user-attachments/assets/aa4a229a-71f0-4e64-959f-9817c5a99d36)

This way, we all collaborate on the development of Nitro. Think of it like this: If 10 projects submit one bugfix each to Nitro, then for each bug you fix, you get 9 fixes from other projects!

Also, Nitro project's can borrow features from other Nitro projects, by cherry picking commits or copy/paste of the code. A feature can initially be developed by one project, then improved by a second project, then further improved by a third project. Then finally, submitted to Nitro and available for all.


## Nitro releases

At the end of each month we release a new version of Nitro:

1. A new version is tagged. 
2. The [CHANGELOG.md](https://github.com/avensia/nitro5/blob/develop/CHANGELOG.md) is updated. The changelog is for developers - it links to the PRs that include technical details and instructions on how to pick this particular PR to your project. 
3. [Release notes](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Documents.aspx) are published. The release notes are for customers - it describes customer value of all PRs included in the release. Please share it with your customer and decide which PRs to pick to your project!
3. Nitro Core Team holds a [Nitro Live](https://avensiaab.sharepoint.com/sites/nitrolive) presentation where we go through the highlights of the release.
4. Updated versions of the [Functional Specification](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Documents.aspx) (descrdibing all features included in the Nitro startersite) and [Integration Specification](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Documents.aspx) are published,.
5. The new version is deployed to the [Nitro demo site](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Demo-sites.aspx).

## Nitro code base

The Nitro code base consists of:

- The Nitro site code (in the [nitro5](https://github.com/avensia/nitro5) repository)
- The Nitro packages (in the [nitro5-packages](https://github.com/avensia/nitro5-packages) repository)
- 3rd party packages

### The Nitro site code

The site code base is located at https://github.com/avensia/nitro5. It's this code that we clone into a new customer repository when we start a new Nitro project, and it's from here Nitro projects can merge or cherry pick updates and/or bug fixes from Nitro.

It contains a Visual Studio solution file (Nitro5.sln) with four projects:

- **Avensia.Shop** - the web application. Here are `Program.cs`, `Startup.cs`, some middleware, the lang files and the Razor views (\*.cshtml) for Nitro Tools.
- **Avensia.Common** - the class library used by `Avensia.Shop`. Here is basically everything. (It's called "Common" because in Nitro classic we had both `Avensia.Shop` and `Avensia.Jobs` that used `Avensia.Common`, and to facilitate upgrading projects from classic to nitro5, we kept this name and all namespaces unchanged)
- **Avensia.Tests** - the unit tests.

The code is mostly structured inside of the Features folder in `Avensia.Common`. We follow a standard MVC pattern, with controllers, models and view models. There are no Razor views though (except for Nitro Tools), instead there are React components. 

### The Nitro Packages

Nitro also include a lot of code as packages. We call them the "Nitro packages" and they are included in the site code via Nuget (for backend) and/or npm (for frontend).

All Avensia packages are published to https://packages.avensia.com/. Their source code can be found in repository [nitro5-packages](https://github.com/avensia/nitro5-packages).

All packages use [Semantic versioning](https://semver.org/), meaning each version of a package has a specific version number (e.g. "v7.2.3"), following the MAJOR.MINOR.PATCH pattern:

- Major version = breaking changes
- Minor version = new features
- Patch version = bug fixes

We strive towards packaging more of Nitros code base, because:

- It's much easier to upgrade a package than merging code
- It's much easier to enable/disable a feature by installing a package than copy/paste of code
- It makes the maintenance of the specific components easier, because the code is clearly isolated in the package
- It makes it easier to collaborate between projects - we can easily share packages

The downside of using packages are:

- It complicates reading/debugging the code slightly - luckily there is a Scope task to help with this and it's really not complicated. See the guide [Debugging nitro5 packages](https://github.com/avensia/nitro5/wiki/Debugging-Nitro5-packages)
- It complicates modifying the code, e.g. adding customer/project specific logic. We try to build packages in a way so it enables modifying project specific behaviour, using the "Template method" (see our [Packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines). Also see [How to modify an existing nitro5 package](https://github.com/avensia/nitro5/wiki/Modifying-an-existing-Nitro5-package)

### 3rd party packages

The site code uses lots of 3rd party packages, for example the Optimizely packages.

## Nitro databases

There are two databases in Nitro: `Nitro5.CMS` and `Nitro5.Commerce`. This is the standard setup for an Optimizely site. Custom tables added for Nitro are in the Commerce database. Most of them are prefixed with "Avensia\_".