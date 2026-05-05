**Found a bug in nitro or in a nitro package?** First verify that bug has not already been solved in a later release of the package, by checking the changelog for the package. Otherwise, see below on how to create a PR where you fix the bug. If you are unable to solve it yourself, please let Nitro team know about the bug, we might be able to help. You can either DM someone in the core team or add an issue describing the bug on [GitHub issues](https://github.com/avensia/nitro5/issues).

**Want to add a feature to an existing package**? Just go ahead! See below on how to create a PR. Feel free to reach out to the Nitro team if you want to discuss your idea or your solution before starting. 

> If you want to create a brand new nitro5 package, see [Creating a new Nitro5 package](https://github.com/avensia/nitro5/wiki/Creating-a-new-Nitro5-package).

## Prerequisites
We advice you to verify that your project is running the latest stable release of the package you want to change. If it's not, you should update to the latest stable relase before adding your changes. If you for some reason you cannot update to the latest stable release, you need to create your new branch in nitro5-packages from the release of the package you are running. Find the corresponding version tag and branch from there. Note that we highly recommend updating to the latest release of the package if possible.

If your project is running an rc of the package, and for some reason this cannot be merged to master, you can continue on this rc branch and create new rc:s from it. Note that we highly recommend getting rc:s merged as soon as possible.

## Set up debugging
See https://github.com/avensia/nitro5/wiki/Debugging-nitro5-packages

## Create a branch
1. Create a new branch off the `develop` branch in the nitro5-packages repo
1. Commit and push your changes. Please read [The seven rules of a great commit message](https://chris.beams.io/posts/git-commit/) on how to write commit messages.
1. Note that TeamCity won't automatically build your branch, unless you either create a PR for it, or create a release candidate

## Create a release candidate (rc)
See https://github.com/avensia/nitro5/wiki/Creating-a-release-candidate

## Open a PR
1. Go to https://github.com/avensia/nitro5-packages and open a PR for your branch
1. Please prefix the title of the PR with the name of the package folder, like _[checkout] New cool feature_
1. Please use labels to describe the state of the PR:
    * **work in progress** or **ready for review**
    * **Pre-release testing** if you are testing this as an rc in a project
1. Have someone **code review** your PR. It can be someone in your project, or someone else who is familiar with this specific package. Reach out to the Nitro team if you need help finding someone who can code review your changes.

## Test your rc
1. Update your customer project so it [uses your new rc release of the package](https://github.com/avensia/nitro5/wiki/Upgrading-Nitro5-packages). We are thankful if you add a corresponding PR in the nitro5 repo as well, since this will make it easier for the product team to review and test your changes.  
2. Now let's test it! If your change is small, it might be enough to do a bit of local testing. If it's a bigger change, testing in preprod is a good idea. For even bigger changes you should deploy the change to prod and verify it behaves correctly not only in a test environment but also in a live environment.

## Getting your PR merged
Usually PRs in nitro5-packages are merged by the Nitro core team. Let them know that you are ready with testing and poke them to merge your PR.

Nitro team tries to merge PRs as soon as possible, to make your changes available to other Nitro projects, but also to enable your project to easily upgrade to new stable releases of this package that others might create. The sooner you the PR is merged, the less of a risk of running into merge conflicts when others are also adding to the same package. 

See [How to merge a PR in nitro5-packages](https://github.com/avensia/nitro5/wiki/Merging-a-PR-in-nitro5%E2%80%90packages)

## Update your project to your new version
When your PR is merged and a new version as been tagged, remember to [update your project](https://github.com/avensia/nitro5/wiki/Upgrading-Nitro5-packages) so it uses your new version.

## Also see
* [Packaging guidelines](https://github.com/avensia/nitro5/wiki/Packaging-guidelines)
* [Specifying dependencies to other packages](https://github.com/avensia/nitro5/wiki/Specifying-dependencies-to-other-packages)
* [Creating a new package](https://github.com/avensia/nitro5/wiki/Creating-a-new-Nitro5-package)
* [Picking the next version number for a package](https://github.com/avensia/nitro5/wiki/Picking-the-next-version-number-for-a-package)

