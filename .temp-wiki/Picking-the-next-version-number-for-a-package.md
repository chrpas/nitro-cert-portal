Nitro packages uses [Semantic versioning](https://semver.org/), meaning a version number has three digits in format MAJOR.MINOR.PATCH.

Here is an example. The current version of a package is 2.3.4. This package is on its second major (the **2**.X.X), third minor (the X.**3**.X), and fourth patch (the X.X.**4**). 

If you are adding any changes that are **breaking changes**, the next version needs to be a **major version**. Do a major if it's not possible to update to your new release of this package without also making some additional code changes. It could be that you are renaming or removing a public method, or adding a new interface that is required to be implemented by the consumer application.

Adding a new parameter to an _existing public method_ in a _public class_ requires a major - even if the parameter has a default value. Adding an overload of an existing method in a public class does not require a major.

For a major version, you **bump the first digit**. In our example the next major version will be **3.0.0**. 

If the API is still backwards compatible (no breaking changes), but you are adding **new features** to the package, he next version should be a **minor version**. Do a minor if you are adding features, but it's possible to update to your new version without any additional code changes. For a minor version, you **bump the second digit**. In our example the next minor version will be **2.4.0**. 

If you are adding  **bug fixes**, but no new features, the next version should be a **patch version**. For a patch version, you **bump the third digit**. In our example the next patch version will be **2.3.5**.

### RC numbers
When you are creating an rc, you should create an rc for the version number that your changes **will be released as**. A common mistake is to create the rc using the current version of the package. Example: If current release is 2.3.4, you should *not* create an rc for 2.3.4 - you need to bump some digit, either to 2.3.5 or 2.4.0 or 3.0.0. 

If you choose to create the version tag using `garn tag-prerelease`, it will give you the current version number of the package and ask what version number you want to create an rc for. Example: If current version number is 2.3.4, and you are only adding bug fixes, you should answer 2.3.5. Now garn will add a tag `v2.3.5-rc0001` in git. You can add more commits to your branch and run `garn tag-prerelease` again if you need to. Then state 2.3.5 again, and garn will add tag `v2.3.5-rc0002`.