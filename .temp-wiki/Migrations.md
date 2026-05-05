The purpose of migrations is to be able to programatically do model changes or to programatically create/update data in all environments. 

An example: If you are working on a feature where you add a new field to database, you need a way to create this new field in all environment's databases. That is, your fellow co-developers local environment´s databases also need this field, and the Integration/Preprod/Production databases also need it. Otherwise they will get either build errors or run time errors when they get your latest code from Git.  

Other examples of when you need a migration is:
- Adding a new custom table or modifying an existing table
- Adding meta fields to order or cart
- Adding CMS content that is required for your new feature (like a new settings page)

You can also use migrations to avoid manual work after a deploy, which can be error-prone and also easy to forget. 

The migration system in Nitro5 is in the `Avensia.Nitro5.Migrations` package (was [previously](https://github.com/avensia/nitro5-packages/pull/812) part of the EpiFoundation package) in nitro5-packages.

Migrations are run in DXP during startup of the shop when a new version has been deployed. Migrations are only run when a new version is detected by the `DeployDetector`. The `DeployDetector` stores the current assembly file version (which corresponds to the version tag you create in Git when you do `nitro tag-version`) in Episerver DynamicDataStore in the Episerver CMS database:

```sql
SELECT String01 FROM tblBigTable WHERE StoreName = 'Avensia.Common.Infrastructure.CurrentVersionNumberItem'
```

Migrations exists both in the Nitro Starter Site and in some of the Nitro Packages. For the starter site, you'll find the migrations in the Migration folder in the Avensia.Common project, grouped into folders per year. They all inherit from base class [IMigration](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/packages/epifoundation/src/Avensia.EpiFoundation/Migrations/IMigration.cs). Note that there is no registration needed for migrations, like for instance we do for [Jobs](https://github.com/avensia/nitro5/wiki/Jobs) and Queues. The migration system will find all classes inheriting from `IMigration` in assemblies which names start with "Avensia" (see [MigrationInitialization](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/packages/epifoundation/src/Avensia.EpiFoundation/Migrations/MigrationInitialization.cs)). (If you, for some reason, add a migration in an assembly not named Avensia.*, it wont automatically be discovered by the migration system.)

The migrations are run in sequential order, sorted by their names, which is why there is a naming convention for migrations. They are always prefixed with an M and includes the date and time of creation of the migration, for example `M20161215_0900_Initial`. 

The migration system uses the Episerver DynamicDataStore in the Episerver CMS database to store the run history:
```sql
SELECT [DateTime01], [String01]  
  FROM [dbo].[tblBigTable]
  WHERE [StoreName] = 'Avensia.EpiFoundation.Migrations.MigratedSteps'
  ORDER BY [DateTime01] DESC
```


## Idempotent migrations
The standard behaviour of a migration is to run only once, so each deploy will only run the migrations that were added since last deploy. But there are also **idempotent migrations**, which are always executed, every time migrations are executed. These inherit from base class [IIdempotentMigration](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/packages/epifoundation/src/Avensia.EpiFoundation/Migrations/IIdempotentMigration.cs). 

Some of Nitro's idempotent migrations are:
* [SyncMarkets](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Migrations/Idempotent/SyncMarkets.cs) - imports content from `countries.json` about markets, payments and shipping options, see [Sync markets feature](https://github.com/avensia/nitro5/wiki/Sync-markets)
* [UploadEsalesConfigurationAndPanels](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Migrations/Idempotent/UploadEsalesConfigurationAndPanels.cs) - syncs configuration from `panels.xml` to [eSales](https://github.com/avensia/nitro5/wiki/eSales)

Note! A migration should be idempotent only when there is an explicit need for it to run every time migrations are executed. See the [Coding guidelines](https://github.com/avensia/nitro5/wiki/Coding-guidelines#migrations).

## Early migrations
Early migrations were [introduced in 2026](https://github.com/avensia/nitro5-packages/pull/809), enabling creating migrations that runs _before_ idempotent migrations. This is useful when you are e.g. modifying a database table schema, that affects an idempotent migration. 

Create an early migration by inheriting from `IEarlyMigration` instead of `IMigration`.

Running order is now early migrations first (runs only once), followed by the idempotent migrations (runs every time migrations run), followed by the "regular" migrations. 

## How to run migrations locally
To run all migrations, execute `nitro run-migrations`.

To run a specific migration, execute `nitro run-migration <MigrationName>` (for example `M20230919_1200_MigrationName`) (this will force execute the migration even though it has already been run before).

## How to run/debug migrations from Visual Studio

To run or debug a specific migration via **Visual Studio** (this will force execute the migration even though it has already been run before):
1. Open Properties for Avensia.Shop project (double click it in Solution Explorer)
2. Debug -> General -> Open debug launch profiles UI
3. Add Command Line Arguments `migrate=all`
3. To run only a specific migration, use `migrate=M20230101_010101SomeMigration`
4. Start with F5

![image](https://github.com/user-attachments/assets/d5757cc8-b907-4343-91fa-5d2dac53669f)

## Migrations admin UI
In the migrations admin UI (Nitro Tools -> Nitro Admin -> Migrations) you will get a list of migrations and if/when they have run.

This can be a useful hint to know if some migration has failed.

![image](https://user-images.githubusercontent.com/6929325/236151851-332e9016-c311-48c1-965f-18fa412b7e88.png)

## How to run migrations in DXP
Migrations are automatically run when a new version has been deployed to DXP. But if you need to, you can also manually run migrations in the migrations admin UI. 

If you for some reason want to force a re-run of a specific migration in DXP, here is how to:

1. Delete that specific history row from the database (see SQL above on where to find it)
2. Re-run migrations using the "Run migrations" button in the Migrations admin tool in Nitro Tools.

<details>
<summary>
If you want to do the reverse (skip running of a specific migration in DXP), you can use the following sql:
</summary>

```sql
DECLARE @Guid UNIQUEIDENTIFIER
DECLARE @pkId BIGINT
SET @Guid = NEWID()
INSERT INTO tblBigTableIdentity (Guid, StoreName) VALUES (@Guid, 'Avensia.EpiFoundation.Migrations.MigratedSteps')
SELECT @pkId = pkId FROM tblBigTableIdentity WHERE Guid = @Guid
INSERT INTO tblBigTable (pkId, Row, StoreName, ItemType, Integer01, DateTime01, String01)
VALUES (@PkId, 1, 'Avensia.EpiFoundation.Migrations.MigratedSteps', 'Avensia.EpiFoundation.Migrations.MigratedSteps, Avensia.Nitro5.EpiFoundation, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null', 1, GETDATE(), 'M20230101_010101SomeMigration')
```
</details>

## How to run a migration again
Sometimes when you develop a migration it can be useful to try it out several times. You can reset the migration status by executing the following SQL in the Commerce database:
```sql
DELETE FROM tblBigTable WHERE String01 = '20230101_010101SomeMigration'
```

## How to create new migrations
To add a new migration, let the buildsystem create it for you:
```console
nitro create-migration
```
This will give you a new class for your migration in the correct year folder in the Migration folder in the Avensia.Common project, following the naming convention for migrations.

## Read more
* [Avensia.Foundation docs on Migrations (in Suite)](https://github.com/avensia/suite/blob/master/packages/epi-foundation/docs/migrations.md)


