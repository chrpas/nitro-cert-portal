Jobs run in the background at preset time intervals, according to their specified scheduling. The main purpose of the jobs is to execute repeatable long-running tasks.

Nitro contains two types of schedulers and jobs:
- Episerver built-in scheduler and jobs (like emptying the trash and managing the scheduled publishing of content). Located at CMS -> Admin -> Scheduled jobs.
- Nitro scheduler and jobs (like price import, content indexing). Located at Nitro Tools -> Jobs

For more information on Episerver's jobs, se the [docs for scheduled jobs](https://support.optimizely.com/hc/en-us/articles/4413192306317-Scheduled-jobs).

## Nitro Job Admin UI
Nitro Job Admin UI is found in Nitro Tools > Jobs, where you can:
- Run jobs (will run on scheduler instance in DXP, but on your current instance locally)
- See if a job is running, and if so cancel it
- Disable/enable jobs
- Update a job's schedule (using cron syntax)
- Update a job's monitoring settings
- See result of the last run of a job
- See a log of the last runs of a job that performed any work (log excludes runs that "did nothing"). For each run, you can find a query to copy/paste into Application Insight to get all log messages for this particular run of the job
- See if a job is part of a job group (see more below on job groups)
- Locally, you'll find instructions on how to run the job command line

On the overview page where all jobs are listed, the jobs are categorized under headings. You can customize these headings and decide which jobs to include in each heading. See https://github.com/avensia/nitro5-packages/pull/496 for details on how.

## How to run Nitro jobs

### Run Nitro jobs from command line
Run using nitro and the job class name:
```console
nitro run IncrementalEsalesIndexJob
```

You can leave out the "Job"-suffix of job name, and also add -sy to skip yarn verifying frontend packages
```console
nitro -sy run IncrementalEsalesIndex
```
> Note: The job name is not case-sensitive

You can chain jobs (first run one job, then directly when its done start the next one):
```console
nitro run IncrementalPromoCache IncrementalEsalesIndex
```

To start job with parameter:
```console
nitro run "CustomEsalesIndexJob 68719510043"
```

To chain jobs with parameters:
```console
nitro run IncrementalPromoCache "CustomEsalesIndex 68719510043"
```

Some jobs have shorthands definfed in the buildsystem:
```console
nitro custom-index <parameters>
nitro incremental-index
nitro full-index
nitro pim-import
nitro custom-promo-cache <parameters>
nitro incremental-promo-cache
nitro full-promo-cache
```

You can also run jobs using dotnet run (which the nitro run is a shorthand for):
```console
dotnet run --no-build --no-restore --project src/Avensia.Shop/Avensia.Shop.csproj job=IncrementalEsalesIndex
```

### Run/debug Nitro jobs from Visual Studio
1. Open Properties for Avensia.Shop project (Right-click, select Properties)
2. Debug -> General -> Open debug launch profiles UI
3. For Avensia.Shop, add Command Line Arguments `job=JobName`, e.g. `job=IncrementalEsalesIndex`
4. Start with F5

![image](https://github.com/avensia/nitro5/assets/6929325/2a64f7ad-5c13-40d6-bade-beb8745bbbf6)

> Note: The modifications made to `launchSettings.json` should not be checked in, so make sure to reset this file when you're done with testing.

![image](https://github.com/avensia/nitro5/assets/6929325/b8dd9c5c-c3ba-46f5-a274-d12b3fb38512)

### Run Nitro jobs from backoffice
1. Navigate to Nitro Tools -> Jobs
2. Click on button "Run now"

## How to create a new job
Nitro jobs implement `INitroJob` and are decorated with the `[NitroJob]` attribute. Jobs that are processing a queue (which most Nitro jobs are) inherit from `QueueBatchProcessingJobBase`. 

> Note: While the scheduler by default is enabled in Optimizely, we disable it locally in `DevelopmentInitialization.AddDevelopmentOptions()`

1. Create a new class that implements `INitroJob`
   - If your job is **processing a queue**, inherit `QueueProcessingJobBase` or `QueueBatchProcessingJobBase`
   - If your job should **run async**, inherit from `AsyncJobBase` and override the `RunAsync()` method
2. Add the `NitroJob` attribute on the class.
   1. Specify the display name of the job
   1. Set default scheduling using the `Schedule` enum, or set a Cron expression directly. Use `Schedule.None` for jobs that should only be run manually (e.g. PurgeOrphanProps).

### Job groups
Jobs can be arranged in "job groups", which means they cannot run at the same time. For example, this will prevent incremental index to start if full index is already running. It's also possible to specify that a job should try to cancel other jobs in its group before starting (so that e.g. full index will cancel incremental index). Grouping of jobs is done using the `JobGroup` and `ShouldCancelOtherJobsInJobGroup` properties of the `NitroJob` attribute.

Note that the job groups are not the same as the "job headings" that you can use to categorize jobs in the Admin UI. (However, you can use the job group name in the config of the headings to display all jobs in a job group under the same heading without listing all jobs explicitly).

## Jobs in packages
Some jobs are defined in packages. If you for some reason want to remove a job that is included in a package, there is an extension method on `IServiceCollection` to remove a job:

```c#
services.RemoveJob<Esales4NavigationImportJob>();
```

## Controlling the scheduler(s)
There are two settings that ultimately control whether the schedulers are active or not:

### EPiServer:CMS:Scheduler:Enabled
Controls whether the **Episerver scheduler** is enabled or not. This is set to true by default in Episerver.

_Locally_ this is disabled by default (via `AddDevelopmentOptions()`, but it can be enabled by configuring the value in code.

For integration, the default value will be used (unless explicitly changed).
For preprod and prod, there is a special transform during deployment that will make sure the scheduler is enabled only on the scheduler instance and disabled for the other instances.

> We don't need to worry about this setting unless we want to run the Episerver scheduler locally.

### Nitro:Jobs:NitroSchedulerDisabled
Controls whether the **Nitro scheduler** is disabled or not. This is set to true by default in Nitro.

The reason for the odd naming is that enabling the Nitro scheduler _alone_ won't cause it to run, since it also depends on the corresponding setting for the Episerver scheduler. The reason for this is because in DXP we only want to run the Nitro scheduler on the instance where the Episerver scheduler runs, and since we don't deploy to the scheduler instance specifically, there is no way for us to transform/control this value once in DXP.

However, what we can do with this setting is to disable the scheduler for all instances in an environment. This can be particularly useful when we are migrating from Nitro classic and we don't want jobs to run on production data.

> Under normal circumstances `NitroSchedulerDisabled` should be set to `false` in Octopus for all environments.

## DXP considerations

### Scheduler instance
Each environment has a dedicated _scheduler instance_ (prefixed with sch-) which is responsible for running jobs. This means that no front servers run jobs, except from integration where there is no scheduler instance.

### How to access logs for a job
Logging of a specific run of a job is not stored in database and displayed in job admin, however there is an Application Insights query to copy-paste into AI to retreive the logs for a specific run of a job. (There is an API to query AI logs, so if you've got time on your hands, you know what to do!)

![269979689-d273e147-9eae-4824-8206-82f21f20ba80](https://github.com/avensia/nitro5/assets/6929325/f4d103c5-379b-4309-8b4b-3ced259a1564)

See [Application insights](https://github.com/avensia/nitro5/wiki/Application-Insights-&-Logging) for some more ideas on how to filter logs.

### Monitoring of jobs
Set up monitoring of jobs by having something (e.g. Niteco) ping the `/JobHealthCheck` endpoint regularly.

The `JobHealthCheckController` will return server error 500:
* If any job failed (last execution resulted in error)
* ~If any job ran "too long"~ (not yet implemented)

By default, all jobs that are scheduled will be included in the health check. To only monitor specific jobs, add query param `includeJobs` (comma separated list of job names, e.g. `https://dev.nitro5.com/jobhealthcheck/index?includeJobs=InstagramRefreshTokenJob,GoogleProductFeedExportJob`). To exclude specific jobs from monitoring, add query param `excludeJobs` (comma separated list of job names, e.g. `https://dev.nitro5.com/jobhealthcheck/index?excludeJobs=InstagramRefreshTokenJob,GoogleProductFeedExportJob`)

