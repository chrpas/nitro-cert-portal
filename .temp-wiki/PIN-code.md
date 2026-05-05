The PIN code feature in Nitro makes sure the site cannot be reached without entering a PIN code. This should always be enabled for integration and preprod, and for prod - until going live. PIN code is active by default for DXP environments in Nitro.

If the PIN code is active, the visitor/bot will see this screen when they try to access the site:

![image](https://github.com/avensia/nitro5/assets/6929325/3be758c9-9cef-4391-a682-69718d452e4c)

The PIN code screen can be customized via inline html in `PinCodeMiddleware`.

Once the correct PIN code is entered, this will be stored in a cookie so that all subsequent requests are allowed through the PIN code verification.

> In order to reset a successful PIN code login, simply remove the cookie called `auth` in your browser

## How to setup
1. Change `Nitro:PinCode:Pin` in `appsettings.json` to your your desired PIN code. Nitro uses 2016 by default. Projects often use the year the company was founded.
1. Locally PIN code is not active, but there is an Octopus transform that enables it for the DXP environments. Make sure it is enabled for all environments, until going live when it can be inactivated for prod (www).
1. Certain _user agents_ are let through the PIN code verification, such as Screaming Frog, Lighthouse, Facebook and Optimizely's agents. This is to be able to do a test crawl or healtcheck even though PIN code is active. The list of user agents (`Nitro:PinCode:AllowedUserAgents`) can be updated as needed.
1. Certain _paths_ are automatically let through the PIN code verification, mainly in order to be able to test integrations even if the site protected by a PIN, for example the PIM connector, Klarna or the CloudFlare image resizer. The list of paths (`Nitro:PinCode:AllowedPaths`) can be updated as needed.
1. Certain _domains_ are automatically let through the PIN code verification, in order to enable the PIN code on one of the sites but not the other sites in a multisite setup. The list of domains (`Nitro:PinCode:AllowedDomains`) can be updated as needed.

## How to remove PIN code during go-live
1. Set `Nitro:PinCode:Active` to `false` in Octopus for the prod environment
1. Create a new release (to get the updated variable value). This can be done using the same binaries in Octopus, doesn't have to go through a version tag in git and a TeamCity build.
1. Deploy!
