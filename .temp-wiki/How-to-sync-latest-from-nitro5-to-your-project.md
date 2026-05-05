1. Add nitro5 as remote (only needs to be done once!)
   ```console
   git remote add nitro5 https://github.com/avensia/nitro5
   ```
2. Fetch latest from nitro5
   ```console
   git fetch nitro5 nitro5-develop --no-tags
   ```
3. Make sure you are on nitro-develop branch
   ```console
   git checkout nitro5-develop
   ```
4. Merge from nitro5 (or cherry-pick specific commits)
   ```console
   git merge nitro5/nitro5-develop
   ```
5. `nitro build`, smokte test and then git push
