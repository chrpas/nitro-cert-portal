The Nitro starter site has basic support for the [Hubspot CRM system](https://www.hubspot.com/). Note however that this is in beta mode (not used by any customer in production yet).


# Setting up a developer account
When using HubSpot connector, an account has to be setup. Either use the existing account or create your own developer account. When working with CRM it's best to have your own account so that multiple developers don't send contacts and companies to the same CRM. 

## Option 1 (existing HubSpot account):
Use the following credentials. The account is a personal HubSpot developer account, ask any of the existing super users for access. Current super users are, among others:
- Malin Gurenius
- Martin Larsson
- Max Modesto Wallin

When using this account, the following parameters can be used:

Portal ID: `26876816`
Region: `eu1`
App key: `pat-eu1-a0c92c00-9c0d-4399-bbf4-6b22a4b870b3`

Example form:
Form GUID: `e8f8e260-979d-41fa-b6ff-c0237595f887`

Login on https://app.hubspot.com/login 

## Option 2 (create new account):
To have your HubSpot developer environment, first create a "App Developer Account", through this link https://developers.hubspot.com/get-started: 
<img width="886" alt="image" src="https://user-images.githubusercontent.com/31730051/215796605-2799c31d-51bc-4830-89ee-9183c9c81c5a.png">

When the "App Developer Account" has been created, create an `App test account`, as screenshot below:
<img width="944" alt="Screenshot 2023-01-31 151404" src="https://user-images.githubusercontent.com/31730051/215796884-5d6112a3-76d3-4cbe-93a1-a7a19ed99684.png">

After that `App test account` has been created, you can do all HubSpot has to offer. 

For example, CRM related things as contacts and companies:
<img width="643" alt="Screenshot 2023-01-31 151338" src="https://user-images.githubusercontent.com/31730051/215796655-4779d0e8-bd5f-4dea-afce-214388d86d82.png">

Add forms and CTAs.
<img width="628" alt="Screenshot 2023-01-31 151351" src="https://user-images.githubusercontent.com/31730051/215796679-b89f7e59-773d-4d46-b3c6-35f9147d1d94.png">

To access the `App test account` through code, you need to create a `Private App` to get a token. 
<img width="940" alt="Screenshot 2023-01-31 151815" src="https://user-images.githubusercontent.com/31730051/215796706-bf15422f-9752-41df-b6b4-f391e0f95c33.png">
