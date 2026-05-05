# Setting up Slack

1. Create Slack channels for your team, for example #yourproject, #yourproject-backend, #yourproject-frontend, and #yourproject-integration.
2. Connect Github to your integrations channel, see howto below.

### How to connect Github to the integrations Slack channel

1. Click "Add an app" in the channel header
2. Find Github and add it
3. Connect to your repo:

```
/github subscribe avensia/yourreponame
```

4. Follow instructions to connect your Github account
5. Subscribe to reviews/comments/branches/commits:

```
/github subscribe avensia/yourreponame reviews
/github subscribe avensia/yourreponame comments
/github subscribe avensia/yourreponame branches
/github subscribe avensia/yourreponame commits:*
```