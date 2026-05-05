## Content index
Esales is one of multiple different types of [content indexes](https://github.com/avensia/nitro5/wiki/Content-index) in Nitro5.

It is built using the [Avensia.Nitro5.Esales.IndexBuilder](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/esales-indexbuilder) package.

## On-prem and Cloud
Locally we are using the "on-prem" version of Esales, meaning you have your own esales server installed on your machine. This is started by `nitro start-esales`. In DXP we are using the cloud version instead.

## Debug tools
There is an admin UI available in Nitro Tools / Nitro Admin / Voyado Elevate 3 (or simply on `/esalesadmin`), see https://github.com/avensia/nitro5-packages/tree/develop/packages/esales-debugtools

It will default connect to your local on-prem esales, but you can connect to a cloud cluster instead using "Connect cloud cluster" on the admin page. You can find connection settings as Octopus variables.

Use "Querystats" to e.g. see the most recent queries sent to esales.

## eSales Manager
Can be found locally on http://localhost:35350/. Login with username "esales" and password "manager1".

For the manager in the cloud (that nitro demo site uses): https://manager.esales.apptus.com/avensia/ Note that we all share the same account, and if someone else is already logged in, you will log that person out when you log in.


## Indexing jobs
Esales indexing produces xml files, which locally are stored on disk in `src\Avensia.Shop\ESalesExport\ESales` (this path can be changed with appsetting `OutputDirectory` - note that for nitro the path is instead `src\Avensia.Jobs\bin\Debug\ESalesExport\ESales`). In DXP the xml files are stored in Azure Blob Storage. By default, these files are kept on disk (or in blob storage) until you run `PurgeEsalesIndexingFilesJob` which will delete files older than 30 days.

When debugging, it's less confusing if you set the appsetting `NumberOfThreads` to 1 (there is one setting for the esales indexing jobs, and one for the promo cache jobs).

**Full index** will process all content in the catalog. Start with `job=FullEsalesIndex` (also remember to first run `job=FullPromoCache`).

**Incremental index** will process only changed content since last execution. Start with `job=IncrementalEsalesIndexing` (also remember to first run `job=IncrementalPromoCache`).

**Custom index** will process a specific entity, that you specify as parameter to the job. Start with e.g. `job="CustomEsalesIndex index=68719510025"` to index only variant with code 68719510025.

## Presentation attributes
Esales has a notion of "presentation attributes", and that just means "don't give me _all_ attributes in the response, just give me these". For the partial models, we generate the list of these attributes automatically from the partial models, like this:
[`GeneratePresentationAttributes<EsalesPartialProduct>()`](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/ContentIndex/Esales/EsalesContentIndexService.cs#L232). This ensures that we only load the attributes defined on `EsalesPartialProduct` and not the attributes defined on `EsalesProduct`.


## How to add/modify panels
1. Modify panels in your local eSales Manager
2. Use the "Save" feature in eSales Manager and save your new `panels.xml` in `Avensia.Common/panels.xml`
3. Run migrations, and idempotent migration `UploadEsalesConfigurationAndPanels` will upload this new `panels.xml`

## eSales configuration
Idempotent migration `UploadEsalesConfigurationAndPanels`:
1. Uploads the panels from `panels.xml` file to the eSales connector. 
2. Creates a `configuration.xml` file using the `Avensia.EsalesConfigGeneration` package and uploads this configuration to the eSales connector. The configuration is created based on the product model defined in Nitro, see classes decorated with the `EsalesEntityAttribute`, for instance the `EsalesProduct` class:
```c#
[EsalesEntity(ESalesEntityType.Product)]
public class EsalesProduct {
  // ...
}
```




## Troubleshooting eSales
* Verify your project has picked this fix https://github.com/avensia/nitro/pull/753 which fixes a bug in `scope start-esales`. Otherwise make sure you stopped esales in your current project before switching to another project.
* Logs from **eSales Manager** are in `\esales\manager\logs`
* To check if manager is started: 
   ```
   java -jar esales/manager/status.jar
   ```
* To start manager:
   ```
   java -jar esales/manager/start.jar
   ```
* If eSales manager cannot start due to port already in use, either reboot computer, or find which process is using the port:
   ```
   netstat -ano | findStr 35350
   netstat -ano | findStr 35810
   ```
   Then either open task manager and find the processes that uses these PIDs 
   ![image](https://user-images.githubusercontent.com/38249038/170197713-de7dfb0d-72b5-4474-952d-1a96e806ad4c.png)
   or use taskkill (replacing the id with the id you found above):
   ```
   taskkill /f /pid 1253
   ```
* If eSales server cannot start due to error _com.google.gson.JsonSyntaxException: java.lang.IllegalStateException: Expected BEGIN_ARRAY but was STRING at line 1 column 1 path $_ :
  1. Delete everything in `esales/server/data`
  2. Run `scope define-esales-cluster`
  3. Run `scope run-migrations && scope full-index`

This essentially empties everything in the esales server and starts up an empty one. The `define-esales-cluster` is necessary to configure the esales cluster (in our case this consists of a single server, but the cluster still needs to be defined).

---
## Read more
* [Content index](https://github.com/avensia/nitro5/wiki/Content-index)

