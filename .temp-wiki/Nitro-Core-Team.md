The current Nitro Core Team:
- Malin Gurenius (Product Owner)
- Johan Book (Product Architect, BE)
- Andreas Olsson (Product Architect, FE)
- Arthur Grimmensson (Product Developer, BE)

You'll reach us in #nitro or #nitrodev!

## Useful links for Nitro team
- [Nitro Jira board](https://avensia.atlassian.net/jira/software/c/projects/NITRO/boards/200?useStoredSettings=true)
- [PR-review checklist](https://github.com/avensia/nitro5/wiki/PR-checklist)

## Way of working for Nitro team

### Branch names etc
**Branch names**:
- Prefix with JIRA-ticket number (if there is a JIRA ticket associated with your change)
- Keep it short!
- Avoid special characters
- Use _ as separator
- Avoid the `/bug` and `/feature` prefix

**Commit messages**:
- Do not include JIRA-ticket number (it's already in the branch name)
- "Bump X" - when updating a package and nothing else
- "Update X to 2.0.0" - when updating a package which required/caused code changes
- "From suite#123: PR title in suite" - when syncing a PR from suite to nitro5
- Also see [The seven rules of a great commit message](https://chris.beams.io/posts/git-commit/)


Example: 
- JIRA issue `NITRO-1038` with title `Update export to using new esales4 API (fix sitemap + Google Feed)`
- Branch name: `NITRO-1038_esales4_export`
- Commit message: `Update esales4 export to use new API`

