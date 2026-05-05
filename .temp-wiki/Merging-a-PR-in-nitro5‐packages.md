Prerequisites before merging a PR in nitro5-packages:
1. The PR is **code reviewed** 
2. The rc **has been tested** either in a project or by the product team in nitro5

Then it's time to **merge your PR to nitro5-develop**! 

1. First verify that no new stable releases has been created for this package since you created your rc. If there are, you should rebase your branch on develop and create a new rc and re-test this before you merge it.
2. Checkout **your branch** branch from git (not develop)
3. Go to the package you want to create a release for, something like: `cd packages/checkout`
4. Rebase your branch on develop. While rebasing, squash the commits into one commit (unless there is a reason to keep specific commits separately)
5. Run `garn build` and verify no errors
6. If package contains a `garn test` task, run it and verify all tests still pass.
7. Force push with lease
8. Go to Github and click the merge-button on your PR

## Creating a stable release

1. Checkout the `develop` branch and pull latest
1. Go to the package you want to create a release for, something like: `cd packages/checkout`
1. Run `garn tag-version`:
   1. Garn will let you know which is the current version number of the package, and ask which version number you want to create. You need to bump some digit from the current version number for your new release, see [Picking the next version number for a package](https://github.com/avensia/nitro5/wiki/Picking-the-next-version-number-for-a-package)
   2. When promped, open the RELEASE_NOTES.md in a text editor and edit it so it makes sense. There should be **one** heading per stable release. 
   1. Answer "y" on question if you want to push
1. Add a comment on the merged PR stating which version number you tagged, e.g "Included in `mypackage@1.0.1`"
1. Verify that TeamCity built and pushed your package correctly
1. Update your project so it uses your new release instead of the rc
1. Celebrate your contributions to Nitro packages! :)

## Creating new major releases
If you are creating a new **major** release of a package (like `X.0.0`), and there are other packages with a dependency of your package, you need to also create releases of these packages. This is to update the allowed version range of the dependency (see for example [dependencies for Redirector 2.0.0](https://packages.avensia.com/feeds/nuget/Avensia.Nitro5.Redirector/2.0.0/dependencies)).

1. Install your new major in nitro5, try building and see if it results in any version conflicts
2. Create new stable releases for each package with a conflict. Usually creating a patch version is enough (use checklist on [Picking the next version number for a package](https://github.com/avensia/nitro5/wiki/Picking-the-next-version-number-for-a-package) to decide if you need a patch, minor or major).
