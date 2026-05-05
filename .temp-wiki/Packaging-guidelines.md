We strive towards packaging more code, using these guidelines:

1. All "**nitro infrastructure**" should be packages (examples: jobs, content-processing, ...). This is code that is required for nitro to run, and seldom changed by projects.
2. All **3rd party integrations** should be packages (examples: Instagram, Voyado, Google Optimize, ...)
3. Everything else can be kept in startersite and NOT be packaged.

## The Template Method
If you need an extension point for projects to customize the package logic, use the **Template Method**:

1. Create an interface (e.g. `IFormsBlockViewModelFactory`) in the package.
2. Create an abstract base class (e.g. `FormsBlockViewModelFactoryBase`) in the package which implements your interface.
3. Internally in package, use the **interface** in your services (never the base class).
4. Create a reference implementation of the interface in nitro5, inheriting from the base class.

This makes it possible for projects to customize the package logic, either by:
* Inheriting from the abstract base class (which is the recommended approach, using the reference implementation in nitro5 as a start)
* or implementing the interface from scratch (which is the recommended approach if a project needs to stray from the default
functionality of the package in a very significant way)

It is also possible to further extend the package, either by:
* Adding more methods to the interface (which will be breaking changes)
* Or, add new optional "hooks" in the abstract base class (virtual methods with default implementations) (which won't be a breaking change)

## Package Documentation
Each package should include a README.md which describes the purpose of the package, links to 3rd party documentation (if applicable) and a section **Usage** in README.md which contains the following info:
1. Which nuget/npm to install
2. Which interfaces to implement, including:
   - Purpose of the interface
   - Any base implementation (according to Template pattern, see above) in the package 
   - Link to example implementation in nitro5
3. Link to options class
3. Example of IoC registration

See [README.md in Forms package](https://github.com/avensia/nitro5-packages/blob/develop/packages/forms/README.md#usage) as an example.

## Package versions
We follow [Semantic Versioning](https://semver.org/).

For the very first version of brand new packages: use **1.0.0** as the initial first version of a package. If it has never been tested/used by any customer project, add "BETA" to the package number in package's RELEASE_NOTES.md.

For major versions, we always add a section in the package's UPGRADE_GUIDE.md which describes how to upgrade to this major version. 

> Don't be afraid of major versions! It's better to do a major version than try to avoid it by adding code that really is unnecessary and just there to prevent the major. Keep it simple! Just remember to describe how to update to your new major in UPGRADE_GUIDE.md before merging.

