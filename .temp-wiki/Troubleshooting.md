## Checklist when troubleshooting things in DXP
1. Anything in the [Application Insights logs](https://github.com/avensia/nitro5/wiki/Application-Insights-&-Logging)?
1. Has all migrations run successfully?
2. Check network response, is it a 400? a 500?
3. Any JavaScript console errors?
4. Check Raygun for backend errors
5. Check Raygun for frontend errors - we usually have a separate Raygun for frontend!
6. Try turning server side rendering off with `?ssr=off`
7. Try bypassing the service worker with `?ssw=1` (if you still use it)
8. See what JSON is sent from BE with `?scope` (in combination with `&ssw=1`)
8. Check logs in the PaaS portal

> ⚠️ The [service worker has been discontinued](https://github.com/avensia/nitro5/pull/413) and we don't recommend projects to continue using it

## Database access
See [Accessing databases in DXP](https://github.com/avensia/nitro5/wiki/Accessing-databases-in-DXP)

## Logging

Logging uses [Serilog](https://serilog.net/) as provider, both locally and in DXP. Log settings are defined in `appsettings.json` and initialized in `Program.cs` with `.AddSerilog(...)`.

### Viewing logs
Locally, log files can be found in `src\Avensia.Shop\app_data` by default, one file per day. 

In DXP, we use Application Insights and Raygun.

See [Application Insights](https://github.com/avensia/nitro5/wiki/Application-Insights-&-Logging) on how to view logs in Application Insights.

All exceptions are sent to [Raygun](https://app.raygun.com/) - both frontend and backend. Don't forget to check both the FE and BE errors in Raygun if you are investigating an issue. To get started with Raygun, first make sure your project has setup Raygun correctly according to [Setting up Raygun](https://github.com/avensia/nitro5/wiki/Setting-up-Raygun) and then ask in #raygun if you need to be granted access to your project in Raygun.

### Writing logs
See [Coding guidelines: Writing logs](https://github.com/avensia/nitro5/wiki/Coding-guidelines#writing-logs)

## The Paas Portal
In the [Paas portal](https://paasportal.episerver.net/) there is a tab for Troubleshooting. Here you can restart the web app and open the Log Stream. The Log Stream in Paas is really helpful for troubleshooting if your site does not even start because something during startup crashes. Open the Log Stream, then restart the web app, and you should be able to see the startup logs in the Log Stream.

There are also logs to download from Paas - but note that Paas only contains logs of **unhandled** exceptions. 

### Getting access to PaaS Portal
To get access to the PaaS Portal:
1. Request access on https://world.episerver.com/documentation/developer-guides/digital-experience-platform/creating-an-episerver-cloud-account/. You need to log in and fill in the form yourself. You need to provide the URL to the integration environment for the customer you request access for (your SA should be able to provide you with this URL).
2. Optimizely will send an email to your customers technical contact (usually your SA), to approve your request.
3. When technical contact has approved your request by repondeding to this email, Optimizely will grant you access.

## Raygun
See https://github.com/avensia/nitro5/pull/405

To see messages only in the latest version, you can add a version filter:

![image](https://github.com/user-attachments/assets/47d6fede-823d-4d85-b6b3-ee7b0b9c35db)

## Diagnostics admin
There is a "secret" admin tool, not linked from any menu, but still accessible if you know the url to it: `/diagnosticsadmin`. Here you can see all appsettings the application is using (e.g. after the replacement of Octopus variables during deployment). 

You can also trigger an Exception with the "Bomb" button, which is useful for troubleshooting logging.

## Optimizely support
You can also contact the Optimizely support team if you need assistance. You can reach them on support@optimizely.com. 

Avensia and Optimizely also have a Slack so we can communicate more efficiently, have a friend invite you! Usually your SA has access and there is probably a dedicated channel for your project where you can ask questions.

## Investigating performance
See docs in Excite on [Investigating Performance](https://github.com/avensia/excite/blob/main/docs/application-insights.md#investigating-performance) using Application Insights.

## App Service Log Stream in Azure Portal
1. Log in on portal.azure.com 
2. Among the resources, find the correct *App Service* 
3. You'll find the Log Stream in the left menu under "Monitoring"

## DXP - Kudu
There are some useful information in Kudu (https://avst02mstrwvx06inte.scm.azurewebsites.net/)

From there you can ssh to the host directly (https://avst02mstrwvx06inte.scm.azurewebsites.net/webssh/host)

See what files are deployed
```console
cd /app/
ls
```

See contents of file
```console
cat web.config
```