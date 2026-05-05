In DXP, logs are found in [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview?tabs=net).

## Getting access
1. You need access to the project DXP management portals first. This can be requested via the [Service request form](https://world.optimizely.com/service-request-forms/access-to-dxp-portal/). Here you need to provide the name of the integration environment for the customer. You also need to be logged in to your World account.
2. When you have been granted access, go to https://portal.azure.com/ and login with your Avensia account.
3. Navigate to your **customer's subscription**. If you can login but you can't find the customers subscription, then first make sure that the subscription isn't hidden because Azure by default hides new subscriptions for some reason. If you still can't find it then ask the Solution Architect or Project Manager for access.
4. Navigate to **Application Insights**, either by:
   - Go to All Resources and then filter on Type being Application Insights. That'll list all Application Insights instances you have access to. 
   - or, go from the subscription to a resource group and then find the Application Insights service in the resource group. Each environment (integration, preprod, prod) has a resource group that holds all resources for that environment.
5. Bookmark ☝️  :) 

## Checking logs
Once you navigated to Application Insights, you'll find link **Logs** in the left menu (in the Monitoring section). This will give you a text input where you can write queries to find logs:

1. **Write a query**, for example `traces` or `exceptions` or `traces | union exceptions`
2. Adjust the **Time range** dropdown to the time range you need (it's default Last 24 hours, but running a query on such a time range can take quite a long time). Or append time range to your query: `| where timestamp  > now() - 1h` or `| where timestamp between (datetime("2021-11-30 15:10") .. datetime("2021-11-30 15:25"))`
3. Append `| order by timestamp desc` to your query to sort by time

## traces vs exceptions
All logs that happen without a corresponding `System.Exception` (such as `logger.LogInformation("...")` are sent to `traces`. All logs that have a `System.Exception` (such as `logger.LogError(e, "...")` are sent to `exceptions`. So sometimes you risk missing logs if you don't check both of them.

## Filtering log queries
You can filter on all properties of the log messages, for example to _filter on a specific job name_:

```kql
traces | union exceptions
| where timestamp  > now() - 15m
| where customDimensions.JobName == 'IncrementalEsalesIndexJob'
| order by timestamp desc
```

It's also possible to use other operators than == such as startswith. Use auto completition in the text input to discover what you can do.

To get a list of log messages for a _specific namespace_:

```kql
traces | union exceptions
| where timestamp  > now() - 15m
| where customDimensions.SourceContext startswith "Avensia.Nitro5.Jobs"
| order by timestamp desc
```

To get a list of log messages for jobs:

```kql
traces | union exceptions
| where timestamp  > now() - 15m
| where isnotempty(customDimensions.JobName)
| order by timestamp desc
```

To remember query for later, you can use the "Share" link and "Copy link to query" and add a bookmark to this link.

## Logging locally to Application Insights
Logging to AI is by default only enabled in DXP. You can enable logging to AI also locally, if you need to:

1. Find the **connectionstring** to your AI for **Integration** environment. It's on the **Overview** page in AI.
2. Add environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING` to your `launchSettings.json`, like:
```json
"Avensia.Shop": {
      "commandName": "Project",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "APPLICATIONINSIGHTS_CONNECTION_STRING": "YOUR-CONNECTIONSTRING-TO-AI-INTEGRATION"
      },
      "applicationUrl": "https://dev.nitro5.com"
    }
```

Your logs will end up in the Integration AI, mixed toghether with all the logs from the integration site. You can filter on your machine name to only see logs from your machine (replace machine name with your machine name):

```kql
traces | union exceptions
| where customDimensions.MachineName == "AVEN-75B0HK3"
| where timestamp  > now() - 15m
| order by timestamp desc

```


## Read more
- [Stream: Application Insights Walkthrough by Elias Lundmark (Optimizely)](https://web.microsoftstream.com/video/47f67062-a4d3-4198-96f8-34746269a96d)
- [Onboarding: Troubleshooting](https://github.com/avensia/nitro5/wiki/Troubleshooting)
- Docs in Excite on [Investigating Performance](https://github.com/avensia/excite/blob/main/docs/application-insights.md#investigating-performance) using Application Insights

