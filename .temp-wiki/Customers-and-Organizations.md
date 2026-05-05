## Definitions
* A **user** is someone who can log in, either on the site or as an editor/admin in backoffice, and has a **username** and a **password** and possibly some **roles**. 
* An **editor** or **admin** is a user with a specific **role** which allows her to log in to **backoffice**.
* A **contact** is a user who can log in on the **site**. 
* An **organization** is a group of contacts. 

In documentation and code, we try to stick to these definitions, but sometimes other words are used as well:
* An **account** is the combination of a **user** and it's **password**.
* A **customer** usually refers to the entire concept of **contacts and organizations** (most often used in B2B scenarios).
* A **member** usually refers to someone who can log in on the site - the combination of **user and contact** (most often used in B2C scenarios).

## CRM
Nitro supports three different CRM's: [Voyado](https://github.com/avensia/nitro5/wiki/Voyado), [HubSpot](https://github.com/avensia/nitro5/wiki/HubSpot) and Epi (Optimizely Commerce). Epi is always master of the **user** data but the CRM is master of the **contact** data.

## Users
* Nitro5 uses **ASP.NET Identity** as the authentication module for managing users and roles.
* To edit user accounts, use the **Administer Users** UI in Episerver CMS (Episerver CMS / Admin / Access Rights / Administer Users)
* All users are stored in table `AspNetUsers` in commerce database. (In nitro, table `Aspnet_Users` was used instead).
* The `NitroUser` class is an extension of `AspNetIdentity.ApplicationUser`, and adds a property `SiteId` to be able to connect a user to a specific site in a multisite solution.
 * If a user has a value in the `SiteId` column in database, then this is a user logging in on the site. If a user does not have a value for the `SiteId` column in the database, then this is an admin/editor logging in to backoffice.
 * Known limitation of users in Nitro/Nitro5: Admins/editors should not log in on the site, because the missing `SiteId` will cause problem with e.g. add-to-cart. We recommend using one browser (e.g. Chrome) for the site and another browser (e.g. Firefox) for logging in to backoffice, to not mix your users up.
* `NitroUser` is defined in package Nitro5.Core - if you need to extend it further with project specific properties, you can add your own `MyProjectUser` which extends `NitroUser`
* Use `NitroUserService` to create/update a `NitroUser`.
*  Email is not required to be unique in the `AspNetUsers` table (we set `options.User.RequireUniqueEmail = false` in Startup.cs) since the same email can be used for different users on different sites in a multisite solution. Instead, the combination of `Email` and `SiteId` is required to be unique (by an index on these columns in the database table).

## Contacts
* Contacts are stored in table `cls_Contact` in commerce database. 
* A contact is connected to a user by field `cls_Contact.UserId` which contains the corresponding user's `AspNetUsers.Username` (however this is not a proper FK, `UserId` is like `string:XXXXXXXX`) (so you can ignore the `AspNetUsers.Id` and `cls_Contact.ContactId` fields...)
* Field `CrmId` is a reference to the contact created in Voyado or Hubspot. This will be null if CRM is "epi".
* Field `CustomerNumber` is the customer's "external id", and is used in CustomerImport to identify which contact to update.
* C# class `CrmContact` is Nitro5's representation of a contact (was `Customer` in nitro). 
* C# class `CustomerContact` is Optimizely's representation of a contact. 
* You'll find the current contact in `CustomerContext.Current.CurrentContact`. If the user is not connected to a contact, it will automatically be created when accessing the site. Hence, there will always be contacts for editor/admins that access the site when logged in to backoffice.
* See `ContactEventListener` (`ContactEventHandler` in Nitro) for logic that runs when contact is created/updated/deleted. For instance, it sets the `FullName` and `CustomerNumber` properties on the contact if they are not already set.
* Use `IContactService` to create/update contacts.
* To edit contacts, there are two different admin UIs:
  * **Customers** UI in Episerver Commerce (Episerver Commerce / Customers). Here you can edit contacts and organizations.
  * **Customers** admin UI in Nitro Tools (requires role `CustomerAdmins`). Here you can e.g. connect contacts to [product groups](https://github.com/avensia/nitro5/wiki/B2B#customer-unique-products).
* You can use the customer import API endpoint to import existing customers (=user+contact) into nitro5. See docs in nitro about the [Customer and Organization Import](https://github.com/avensia/nitro/blob/develop/docs/features/CUSTOMER_IMPORT.md), although note that URL to api endpoint has changed to `/api/customerimport` in nitro5. You also need to run `CustomerImportJob` after posting to the endpoint.

## Organizations
* Organizations are stored in table `cls_Organization` in commerce database
* A contact is connected to its primary organisation by field `cls_Contact.OwnerId` which references `cls_Organization.OrganizationId`.
* Nitro supports multiple organisations per contact, these are stored in table `Avensia_ContactSecondaryOrganizations`
* When a user logs in on the site, the current selected organisation is set in a cookie.
* Since Nitro supports multiple organisations per contact, you cannot use the built in `CustomerContext.Current.CurrentContact.CurrentOrganization`, you should instead use our extension method `CustomerContext.Current?.CurrentContact?.GetCurrentOrganization`, that respects the cookie of currently selected organisation.
* To edit organizations, there are two different admin UIs:
   * **Organizations** UI in Episerver Commerce (Episerver Commerce / Customers / Organizations)
   * **Customers** admin UI in Avensia Tools (requires role `CustomerAdmins`). Here you can e.g. connect organizations to [product groups](https://github.com/avensia/nitro5/wiki/B2B#customer-unique-products).
* You can use the organization import API endpoint to import existing organizations into nitro5. See docs in nitro about the [Customer and Organization import](https://github.com/avensia/nitro/blob/develop/docs/features/CUSTOMER_IMPORT.md), although note that URL to api endpoint has changed to `/api/organizationimport` in nitro5. 
 
## Registration
When a visitor registers a new account on the site:
* A user is created in `AspNetUsers` (holding the password)
* A contact is created in `cls_Contact`. Properties `Email`, `SiteId` and `TermsAccepted` are set in `cls_Contact`.

When Epi CRM:
* Field `cls_Contact.CustomerNumber` is set by `ISerialNumberService` (a "C" followed by next number of `dbo.CustomerNumberSequence`), see `ContactEventListener`.

When Voyado CRM:
* A contact is also created in Voyado. 
* Field `cls_Contact.CrmId` is set to contact id in Voyado
* Field `cls_Contact.CustomerNumber` is set to member number generated by Voyado.

Use `IAuthenticationService` to login/logout users.

## Login
* You can display the login flyout on specific pages by adding queryparam `?login=required` on the url. (see method `openLoginBoxIfUrlSaysSo` in `Avensia.Common\Features\Account\action-creators.tsx`).
* The login flyout will also be displayed on respone 401 from server (see method `openLoginBoxOn401` in `Avensia.Common\Features\Account\action-creators.tsx`).

## Displaying and updating contact info
* When displaying contact info on My Pages, info is fetched from the CRM.
* When updating contact info on My Pages, contact is updated in CRM.
* CRM is the master of contact info. Our recommendation is that the only place where you should update contact info in CRM is from My Pages. That is, do not update the contact from e.g. checkout (it is of course ok to update the order and it's addresses etc from checkout using e.g. info from Klarna - but do not update the contact in CRM).

## GDPR
- "Download user data" button in Customer admin will create a `json` file with all data connected to this user in Nitro. See `UserDataRegistry.cs`.
- "Delete user data" button in Customer admin will anonymise the user and all its orders, as well as delete all its addresses, cart, wishlist and “back in stock” monitorings and remove connection to the CRM for this user. See `UserDataRegistry.cs`.

## Read more
* https://docs.developers.optimizely.com/commerce/v14.0.0-commerce-cloud/docs/customers
* https://docs.developers.optimizely.com/content-cloud/v12.0.0-content-cloud/docs/aspnetidentity