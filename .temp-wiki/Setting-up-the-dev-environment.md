This page describes how to set up the Nitro5 development environment so you can run Nitro5 on your local machine.

## Prerequisites
* Visual Studio 2022 (or later)
* [SDK for .NET 8.0](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks)
* SQL Server 2022/16 (or later) with mixed authentication mode enabled
* Access to Avensia networks via VPN or one of our offices
* (_Elevate 3 only_) [Java 64bit](https://www.java.com/en/download/manual.jsp) <br/>
  Add Java bin to the [PATH environment variable](https://www.java.com/en/download/help/path.html) (should be something like C:\Program Files\Java\jre1.8.0_301\bin)
* Visual Studio Code with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions

> If you have IIS installed, all sites that bind to port 443 must be stopped since it will conflict with [Kestrel](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel). Or you can stop IIS altogether by running `net stop w3svc` in an admin prompt.

## Setup dev environment 
> Clone all repos **to a non user folder (i.e. not under C:\Users\)**.

1. Verify you are on the Avensia network or VPN.
1. Clone the Nitro5 repo into a folder (`git clone https://github.com/avensia/nitro5`).
1. Start a command prompt in the root folder of nitro5 (_not as admin_)
2. If you want a default setup, run `nitro setup-dev-env`. This will download and restore database backups, download assets, setup eSales and setup SSL certs and hosts for Kestrel. If you need to deviate from default setup for some reason, run `nitro setup-dev-env interactive` and it will ask questions along the setup. See below for other available setup-dev-env params.
1. When `setup-dev-env` has run to completion, you should see a message saying that your machine is ready.
1. Open Visual Studio (_not as admin_) and start a debug session. Backoffice is available on https://dev.nitro5.com/backoffice/ with user=admin and password=store2017.

### Available setup-dev-env params
 * `interactive` will instruct setup-dev-env to ask you questions instead of assuming the default answer for all questions. 
 * `skipassets` will skip the time consuming step of downloading assets. Assets are optional, they are ~6.5 GB to download. If you have nitro setup with assets you can also copy paste assets from nitro to nitro5 instead of downloading them.

## Running nitro5 locally
You can start Nitro5 either by clicking "Avensia.Shop" in the toolbar or via the Debug -> Start debugging

![image](https://user-images.githubusercontent.com/6929325/224696679-197783c8-7c9b-4b44-9b56-99fbf552c80e.png)

You can specify command line arguments, url to navigate to when starting etc either by opening properties for Avensia.Shop and click "Open debug launch profiles", or by manually editing the `Avensia.Shop/properties/launchSettings.json` file.

You can also start it from command prompt:

```
nitro start-site
```

> Nitro uses the cross-platform web server [Kestrel](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel) to run



## Troublehooting setup
### System.Net.Sockets.SocketException: 'An attempt was made to access a socket in a way forbidden by its access permissions.'
IIS cannot run at the same time as [Kestrel](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel) since it binds exclusively to the 443 port. Either stop all sites that bind to port 443 or you can stop IIS altogether by running `net stop w3svc` in an admin prompt.

### TypeError
`"TypeError: Cannot read properties of undefined (reading 'call')"`<br />
Make sure you have "Disable cache" checked in the Chrome Network tab. "Clear site data" in the Application Storage is not enough

### ERR_CONNECTION_CLOSED
![image](https://user-images.githubusercontent.com/6929325/221805407-4011c317-bc06-4c75-b803-efee5729da9b.png)

If you get "This site can’t be reached" ERR_CONNECTION_CLOSED when you try to start from Visual Studio, then it's most likely a cert issue.

### Certificates
Certificates should be created in _user context_ and Visual Studio needs to run in the same context. If you run Visual Studio as admin then it won't be able to access the certs. Likewise, if you create the certs as admin and run Visual Stidiop in user mode, certificates wont work either.

> 💡 Our recommendation is to always run `setup-certificates` in user mode (it will elevate as needed) and Vistual Studio also in user mode.

Same goes for if you start the site on command line with `nitro start-site` or `dotnet run`, it should be in user mode.

After certs have been installed/updated, you need to restart Visual Studio in order to access the new certificates.

#### Multiple domains
If you have **multiple domains**, all certs will be grouped on the same cert. To make it work in Visual Studio, you need to set `NITRO_MAIN_CERT_CN` to point to the main cert domain.

![image](https://github.com/user-attachments/assets/af1251f7-d10c-4842-9845-29f7f69451cf)


### DNS_PROBE_FINISHED_NXDOMAIN

![image](https://github.com/avensia/nitro5/assets/6929325/4b4bac0f-f089-4af4-8891-ebfa3c7df764)

If you get "This site can't be reached" DNS_PROBE_FINISHED_NXDOMAIN then it's likely that the host has not been registered properly in `c:\windows\system32\drivers\etc\hosts`.

### TypeScript errors/warnings
Press CTRL+P type >TypeScript select "TypeScript: Select TypeScript Version", then select "Use Workspace Version" (without this you'll get errors and warnings if your TypeScript version differs from the project version)

![image](https://user-images.githubusercontent.com/6929325/224699713-0d394874-f21a-4411-aba7-f1d6bcc90e23.png)

### The command "dotnet...TSTypeGen.dll"
Have you installed all the SDKs? Try running for more information
```
dotnet "C:\dev\nitro5\src\..\node_modules\@avensia-oss\tstypegen\bin\TSTypeGen.dll" -c "C:\dev\nitro5\src\TSTypeGen.json
```
Depending on your tstypgen version you might need to install other framework versions as well.
- tstypegen 2.8 requires .NET Core 3.1
- tstypegen 3.0 requires .NET 6
- tstypegen 3.1.2 requires .NET 8 or higher

```
Avensia.Common failed with 1 error(s) (3.1s) → src\Avensia.Common\bin\Debug\net8.0\Avensia.Common.dll`
    `C:\dev\nitro5\src\TSTypeGen.targets(4,5): error MSB3073: The command "dotnet "C:\dev\nitro5\src\..\node_modules\@avensia-oss\tstypegen\bin\TSTypeGen.dll" -c "C:\dev\nitro5\src\TSTypeGen.json"" exited with code -2147450730.
```
