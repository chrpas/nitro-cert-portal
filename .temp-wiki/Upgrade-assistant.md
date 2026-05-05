

## After running the Upgrade assistant
* "Package downgrade detected" -> upgrade nuget package (eg. `System.Threading.Tasks.DataFlow` till 6.0.0)
* Replace `System.Data.SqlClient` with `Microsoft.Data.SqlClient`


## Optimizely extension
When we migrated nitro to nitro5, we used the extension from Optimizely instead. Just making a note here of how to do it, if we need to remember it for some reason:

1. Download the extension (source files) from Optimizely:  https://github.com/episerver/upgrade-assistant-extensions/releases
2. Rebuild extension in VS 2022, follow readme: https://github.com/episerver/upgrade-assistant-extensions/blob/main/src/EpiSourceUpdater/README.md
3. Run upgrade-assistant (towards .NET6):
```
upgrade-assistant upgrade --skip-backup C:\kod\nitro5-packages\packages\checkout\src\Avensia.Checkout\Avensia.Checkout.csproj --extension "C:\kod\EpiSourceUpdater\upgrade-assistant-extensions-1.0.31\src\EpiSourceUpdater\bin\Debug\net6.0\ExtensionManifest.json"
```