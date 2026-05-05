# Checklist for PR reviews in nitro5/nitro5-packages

## The basics
1. Rebase on develop
1. Both backend and frontend builds correctly (run `nitro build`)
2. There are no new build warnings
3. Migrations runs successfully (run `nitro run-migrations`)
4. PR conforms to our [coding conventions](https://github.com/avensia/nitro5/wiki/Coding-conventions) (TODO: lista rubriker som kom-ihåg här)

### Options
1. Options pattern is used 
2. Options have helpful comments 
3. Options have default values, where applicable
4. Required options are marked with `[Required]` and an `OptionsBuilder` is used to validate required attributes

## Feature switching
1. Customers not needing this feature are not affected (e.g. it's possible to turn off/on the feature, and when turned off no outgoing requests are made, no extra logic is running unnecessarily, no frontend-scripts are downloaded unnecessarily, etc) 

## Multisite
1. How about multisites? Will this work both for single sites and multisites?

## Performance
1. This feature does not affect page load performance (e.g. the feature uses contentindex, dynamic data, queues, caches etc)
2. Correct usage of partial vs full viewmodels

## Documentation
1. PR describes the **problem solved** in a non-technical way - not only the solution! Describe to customers why they should pick this PR into their project. Make the customer value clear in the PR (examples: new feature, bugfix, performance improvement, developer efficiency improvement). This info is needed for Release Notes which are sent to customer.
3. **Title of PR** describes problem solved (or feature introduced) - not the technical solution or "what you did". Try to give a title that a customer can understand the value of. The title is used in Changelog and Release notes. Do not include the Jira ticket nr. 
2. PR describes the **solution** on a high-level - this if often most efficently done using the "how to test" heading.
3. Packages `README.md` is up-to-date and includes:
   - All necessary interfaces to implement (with comments on their purpose)
   - Link to options class
   - Example of init code
4. For 3rd party integrations, PR includes links to the official docs (e.g. link to Hubspot developer docs)
5. If PR is a follow up fix from another PR, add a heading "Follow-up fixes" to the original PR linking to this fix
4. If PR will be released as a major version of a package, the package includes an `UPGRADE_GUIDE.md` with a section on how to upgrade to this new major version

# Checklist for merging PR
1. Code review using checklists above
2. Verify that the PR has been sufficiently tested (either by you or someone else the Nitro core team, or if PR is from a project verify that the project has tested it) - remember if you made any changes during code review to re-test before merge!
3. Double check documentation checklist above (especially title and description of PR and `UPGRADE_GUIDE.md` for major versions)
5. Squash and re-word commits if necessary (to make commits pickable by projects)
6. Update relevant info on wiki, that now might be outdated.
7. If you are merging a PR picked from suite/nitro - add label `migrated-to-nitro5` on PR in nitro/suite
8. If you are merging a PR in suite/nitro5-packages - add a comment on PR which version you tagged (that this PR is included in)

# Migrating PRs from suite/nitro to nitro5
1. Cherry pick commits or manually copy/paste code from suite/nitro to a new branch in nitro5/nitro5-packages
2. Reword commits from suite so it is clear this is a commit taken from suite, like:
   ```
   From suite#407: Fix endless loop of polling pending payments
   ```
3. Open a PR in nitro5/nitro5-packages. Do not include "migrated from suite" in PR title - PR title should describe features added or problems solved as usual (in the changelog it's irrelevant that this was originally from suite).
4. Have PR reviewed as usual. 
5. When PR is merged - add label `migrated-to-nitro5` on PR in nitro/suite

# Picking PRs from projects to nitro5
1. Cherry pick commits or manually copy/paste code from customer project to a new branch in nitro5/nitro5-packages. 
2. Make sure to **not** include customer name in commits.
3. Open a PR in nitro5/nitro5-packages and have it reviewed as usual



