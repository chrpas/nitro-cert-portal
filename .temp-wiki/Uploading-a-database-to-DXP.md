1. Open a Powershell administrator prompt and install the EpiCloud powershell module (see [docs](https://docs.developers.optimizely.com/digital-experience-platform/docs/deploy-using-powershell))
1. Go to [paasportal](https://paasportal.episerver.net/), select your project -> API -> Add API Credentials and check e.g. Integration and name the credentials according to your username
1. Copy the Project id, API key and API secret
1. Authenticate to DXP by running the following in a Powershell prompt:
   ```powershell
   Connect-EpiCloud -ClientKey <key> -ClientSecret <secret> -ProjectId <projectid>
   ```
1. Export the databases to .bacpac by right-clicking the database and selecting Tasks-> Export Data-tier Application
1. Name the bacpacs something like `<project>.cms.sqldb.<version>.bacpac` and `<project>.commerce.sqldb.<version>.bacpac` (this is significant for Optimizely to know which database to restore)
1. Upload the bacpacs by running the following in the Powershell prompt:
    ```powershell
    $saslink = Get-EpiDeploymentPackageLocation
    Add-EpiDeploymentPackage -SasUrl $saslink -Path "C:\MyDatabaseFiles\nitro5.cms.sqldb.20250331.bacpac"
    ```
    <sub>(Replace the path to the file with your actual file)</sub>
1. Repeat for the commerce database
1. Restore the bacpacs by running the following in the Powershell prompt:
    ```powershell
    Start-EpiDeployment -DeploymentPackage ("nitro5.cms.sqldb.20250331.bacpac","nitro5.commerce.sqldb.20250331.bacpac") -TargetEnvironment "Integration" -DirectDeploy
    ```
    <sub>(Replace the name of the bacpacs to your actual file names)</sub>
1. The restore will start async and leave control back to the Powershell prompt. You can follow the progress in the paasportal just like any regular deploy! 