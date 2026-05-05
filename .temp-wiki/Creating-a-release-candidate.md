A **release candidate** or shortly an **rc** (or sometimes referred to as a **prerelease**), is a version created to enable testing of a new release of a package.

## Prerequisites
Before creating your rc, please verify that all backend dependencies on other nitro5-packages as well as dependencies on external nugets are specified in your package's `buildsystem/index.ts`. See https://github.com/avensia/nitro5/wiki/Specifying-dependencies-to-other-packages. Otherwise the resulting nuget of your package will have incorrect dependencies.

## How to create an rc
An rc corresponds to a **version tag** in git. A version tag is a standard git tag, but in a specific format. Example: tag `v2.3.4-rc0001` will be created for the first rc including only bug fixes on currently stable release `v2.3.3`. Second rc will have version tag `v2.3.4-rc0002` and so on.

You can either tag a version manually by adding a tag in git, or let Garn help you:
1. Make sure you are on your branch (not on nitro5-develop).
2. Open a command prompt as administrator and go to the package you want to create an rc for, something like: `cd packages/checkout`
3. Perhaps do a final `garn build` and `garn test` (if implemented in package) to verify you did not break anything.
3. Run `garn tag-prerelease`. Garn will let you know which is the current version number of the package, and ask which version number you want to create. You need to bump some digit from the current version number for your rc, see [How to know which is the next version number of a Nitro package](https://github.com/avensia/nitro5/wiki/Picking-the-next-version-number-for-a-package). `garn tag-prerelease` will add a tag in git for you (for example `v2.3.4-rc0001`).
4. The new tag in git will trigger TeamCity to build your new nuget and/or npm package and make it available on https://packages.avensia.com. Wait for your package to be built. Verify you have no build errors on TeamCity.
5. Please also [Open a PR](https://github.com/avensia/nitro5/wiki/How-to-open-a-PR-for-your-changes) describing your changes, so Nitro Core team knows what's going on :)

## Troubleshooting garn tag-prerelease
If you get the following errors when you do `garn tag-prerelease` or `garn tag-version` it's because you have tags not in sync with the remote. 
```
Task git:tag failed with Error: Git failed:fetch --tags --quiet
! [rejected] scope-episerver@1.0.4 -> scope-episerver@1.0.4  (would clobber existing tag)
```

Solve by running: 
```
git tag -l | xargs git tag -d && git fetch --tags && git fetch origin --tags --force
```
Or with the Powershell version:
```
git tag -l | ForEach-Object { git tag -d $_ }
git fetch --tags
git fetch origin --tags --force
```

## Tagging the very first version of a new package
Until you've tagged the first **stable** release of your new package (e.g. 0.0.1 or 1.0.0), you need to tag your first rc-versions manually (not using garn):

1. Try `garn build` and `garn package` locally and fix any problems (note: make sure that versions are 0.0.0.0 in AssemblyVersionInfo.cs before committing this file in git). If you run into errors, see https://github.com/avensia/nitro5/wiki/Creating-a-new-Nitro5-package#getting-started-creating-a-new-project-from-scratch for some tips
2. Make sure there is an `import '../../../buildsystem/common';` in your buildsystem/index.ts - otherwise it will create version 0.0.0 no matter what tag you push.
3. Add a tag in git e.g. `inriver-connector@0.0.1-rc0001` (do this manually - not using garn)
4. Wait for TC to build it.
5. Verify on https://packages.avensia.com/ that your nuget and/or npm package was published 
6. [Install it to nitro5](https://github.com/avensia/nitro5/wiki/How-to-update-Nitro5-packages).

After the first **stable** release is tagged (also manually), you can continue tagging subsequent releases using garn. When tagging 1.0.0, remember to add this version manually to RELEASE_NOTES.md.

## Troubleshooting builds on TC
1. You can verify locally that the build on TC will work before pushing and tagging rc:s by running `garn backend:package` locally (or with verbose logging: `garn backend:package --log-level=verbose`. This task will update the `properties/AssemblyInfo.cs` file with version numbers, so you need to remember to reset these to `0.0.0.0` before committing.
2. If build succeeds locally but fails on TC, try "Delete all files in the checkout directory before build"
![image](https://github.com/user-attachments/assets/c40f4918-c6f4-427a-a906-d4fa69b91173)

3. If it still does not build and you cannot figure out why, ask if anyone in #devops can help you out

4. Build on TC will not automatically build dependent npm-packages, so if you e.g. depend on a rc of another npm package that built successfully on TC, try running your build on the same agent as that rc built on.