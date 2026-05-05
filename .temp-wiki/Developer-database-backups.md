Each nitro project uses two databases: one cms and one commerce database. For example, nitro5 uses the `Nitro5.Cms` and `Nitro5.Commerce` databases.

During the initial project start ("sprint 0"), the solution architect creates project specific developer databases and uploads these into a project specific folder on the Avensia Package Server (https://packages.avensia.com). The databases are then distributed to all developers in the team by the `scope setup-dev-env` task that will download the backups and create local databases by restoring these backups.

## How to create new database backups
1. **Prepare your databases**. Specifically, make sure all migrations are run and that the full promo cache job has been run before creating backups of your databases. The reason that promo cache job needs to have run, is because if promo cache is empty, all products will get discarded when indexing because as they'll be missing price. If you are taking a copy from production, you should run `nitro cleanup-databases` to delete users, orders etc (see https://github.com/avensia/nitro5-packages/pull/158).

2. **Backup your databases**. Open SQL Server Management Studio, right click on one of the databases you want to back up, select task -> backup. Set these configurations: 
   - On General page, add a file location to where the backup will be saved
   - On Media Options page, check "Overwrite all existing backup sets"
   - On Backup Options page, set backup compression to "Compress backup" as this will significantly reduce the size of the files

Confirm below:
| General page        | Media Options page  | Backup Options page |
| ------------------- | ------------------- | ------------------- |
| <a href="https://github.com/avensia/nitro5/assets/31730051/c05019bf-b9ca-499a-9d1d-52a6af3c06a8"><img width="420" alt="image" src="https://github.com/avensia/nitro5/assets/31730051/c05019bf-b9ca-499a-9d1d-52a6af3c06a8"></a> | <a href="https://github.com/avensia/nitro5/assets/31730051/07200156-ca5c-46fd-a2c8-bcd031b3e0d8"><img width="420" alt="image" src="https://github.com/avensia/nitro5/assets/31730051/07200156-ca5c-46fd-a2c8-bcd031b3e0d8"></a>  | <a href="https://github.com/avensia/nitro5/assets/31730051/efc03b15-f1b9-4ff1-8e90-df054fca4ce0"><img width="420" alt="image" src="https://github.com/avensia/nitro5/assets/31730051/efc03b15-f1b9-4ff1-8e90-df054fca4ce0"></a>  |

3. **Zip your files into backups.zip**. Once you have fresh .bak-files you will want to zip these into a folder and name it `backups.zip` as this is the file name that the download script will be looking for. To do this mark both your .bak-files, right click them and select "Compress to ZIP file" (Note: Do not create a new folder called backups and zip that folder, since that structure will be incorrect.) If you are using an external program for zipping such as 7zip, make sure to set "no compression" to save time.

4. **FTP credentials**. Each project have unique credentials with specific access to their database folder on the packages server. This folder gets created by IT when the project is initially set up. If you need access, talk to your project's solution architect or project manager. If they for some reason do not have the credentials, ask in the slack channel #ask-it-support.

5. Ensure that you are connected to the Avensia network/VPN.

6. **Upload your file to the server**. Use an FTP Client such as FileZilla or WinSCP to connect via FTP to `packages.avensia.com`. Replace the `backups.zip` file already in your project folder with your new `backups.zip` file and you are done. Note that it can be a good idea to save a copy of the old backups.zip-folder until you have verified that your file works correctly.

5. **Upload Assets**. The above mentioned steps will give you working database backups but they will be missing the correct assets. In order to get the correct assets you need to zip the assets folder located in your projects root folder using the same techique as mentioned above. Be sure to keep the same file structure when zipping. It is easily done as with the backups above that you get a double folder. A good tip if you want to save time when zipping this large folder is to set compression level to store in 7-zip.

## How to restore your developer database to the latest backup
Developer database backups are usually downloaded and restored when setting up the project initially as a part of the `setup-dev-env` flow (see [How to setup Nitro5 dev environment](https://github.com/avensia/nitro5/wiki/How-to-setup-Nitro5-dev-environment)). To restore databases later:

1. Make sure to connect to Avensia network/VPN before downloading databases.
2. Run `nitro download-backups` 
3. Run `nitro restore-databases`

The path to the database backups on the package server is configured in `buildsystem/config.defaults.json` as `commonBackupDbPath`. Your local config is in `buildsystem/config.local.json`. If you have trouble downloading, verify that the path in your `buildsystem/config.local.json` is correct.

The backup files will be downloaded, unzipped and placed in the `/downloads` folder. 