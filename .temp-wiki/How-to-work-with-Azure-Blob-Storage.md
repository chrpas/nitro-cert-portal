Some features in Nitro uses Azure blob storage to read/write files, for example the [Google feed](https://github.com/avensia/nitro5/wiki/Google-Feed).

## Azurite
To run or debug code that access Azure blobs locally, you need to have **Azurite** installed. 

Azurite is the new name of Azure Storage Emulator ([which is now deprecated](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-emulator)). Although blob emulation, for some scenarios, might still work with Azure Storage Emulator v5.10, it is recommended to use Azurite to get full feature support.

Azurite is bundled with Visual Studio 2022. It is located in 
`C:\Program Files\Microsoft Visual Studio\2022\Professional\Common7\IDE\Extensions\Microsoft\Azure Storage Emulator`. 

To emulate Azure blob storage:
1. Open a command prompt and cd to the Azurite path and run `azurite.exe` with no arguments
2. Set the `EPiServerAzureBlobs` connectionString to value `UseDevelopmentStorage=true` in `appsettings.Development.json`. If the connection string is not there, copy the section from `appsettings.json`. Avoid changing the value in `appsettings.json` directly, since this is shared among all developers.
3. Start site

To see the azurite help section for various options, run `azurite.exe -h`. Also see [Microsoft docs on how to use Azurite](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite).

### Troubleshooting Azurite
- If you get random 500 errors when saving files to the blob try restarting Azurite
- If you get _Azure.RequestFailedException: 'The API version 2023-08-03 is not supported by Azurite'_
Install latest Visual Studio patch or upgrade Azurite to latest version. You can also add `--skipApiVersionCheck` when you start Azurite [source](https://github.com/Azure/Azurite/issues/2313)
- If you get _Azure.RequestFailedException: 'The REST version of this request is not supported by this release of the Storage Emulator'_
Azure Storage Emulator is deprecated install Azurite
- If you get _Exit due to unhandled error: Error: EPERM: operation not permitted, open 'C:\Program Files\Microsoft Visual Studio\2022\Professional\Common7\IDE\Extensions\Microsoft\Azure Storage Emulator\__azurite_db_blob__.json~' Start Azurite from a console with admin privileges 

## Azure Blob Storage Explorer
To access files in Azure Blob Storage (emulated locally or in DXP), use Azure Blob Storage Explorer.

1. [Download and install Azure Blob Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
2. Start Azure Blob Storage Explorer

**To access blobs you emulated locally**:

3. Open Local & Attached / Storage Accounts / Emulator / Blob Containers. Here you'll find for instance one container "googleshopping" for the [Google feed](https://github.com/avensia/nitro5/wiki/Google-Feed).

**To access blobs in DXP**:

3. Right click Local & Attached, choose Connect to Azure Storage
4. Choose "Connect to storage account or service" (not blob container!)
5. Use account name and key from diagnostics admin

If you want to upload assets e.g. to Integration, they are stored in the `mysitemedia` folder, you can upload assets to this folder.