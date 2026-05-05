## Step 1: Add Nitro as another remote origin

If you dont already have nitro5 as a remote origin, then open git bash and run:

```
git remote add nitro5 https://github.com/avensia/nitro5.git
```

Or if you are using Git extensions: Repositories -> Remote repositories
-> Add -> enter the values -> Save

You now have two remote repositores, your origin/develop and also nitro5/develop

## Step 2: Fetch latest from all remotes

```
git remote update
```

## Step 3: Make sure you are on the correct branch

Usually it's a good idea to create a new branch so you can create a PR from it.

## Step 4: Cherry pick commit from Nitro

Cherry pick with `git cherry-pick`, or if you are using Git extensions: Right click on the commit you want to cherry pick, select _Cherry pick this commit..._

## Step 5: Remove Nitro as remote repository (optional)

You can keep Nitro as a remote origin, or you can choose to remove or inactive it.

First remove/inactive the remote origin, then to get rid of all tags you got from it:

```
git tag -l | xargs git tag -d
git fetch --tags
```