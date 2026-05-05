Ngrok can be used to test e.g. callbacks from a PSP to your local environment, or if you want to test your local environment using your mobile phone.

1. Go to https://ngrok.com/
1. Sign-up (for free) e.g. with your google account or github account
1. Use the authenticator app on your mobile to confirm the sign-up
1. Download the app via the ngrok portal (once logged in)
1. Unzip the archive and place ngrok.exe in a folder that is included in your PATH variable, e.g. c:\windows\system32
1. Copy the authtoken from the ngrok portal:
![image](https://github.com/user-attachments/assets/4ffcd070-7546-455c-873f-94f12544717d)
1. Run the following command to add your authtoken to the default ngrok.yml
   ```
   ngrok config add-authtoken <your-auth-token>
   ```
2. Start ngrok (replace dev.nitro5.com with your project url):
   ```
   ngrok http dev.nitro5.com:443
   ```
   For Nitro classic you may need to use:
   ```
   ngrok http --host-header=rewrite dev.nitrofashion.com:443 --region eu
   ```
3. Navigate to your local environment using the url ngrok gives you (something like *.ngrok-free.app):
   ![image](https://github.com/avensia/nitro5/assets/38249038/a43c3ce6-83a0-47f0-82da-0ad84a5b9f60)
1. Accept the warning
![image](https://github.com/user-attachments/assets/70b85b53-a5e0-41f3-9b15-13122f1466a8)

4. If you are working in a multisite solution, and you need to test something on your non-default site, you need to add the url ngok gives you as a host for the site you want to test. Edit your site in backoffice:
   ![image](https://github.com/avensia/nitro5/assets/38249038/bc709ff6-a248-4d5f-8412-43eae39a9dcc)

If you are testing checkout callbacks, you can navigate to your usual url (like `dev.nitro5.com`) if you set `Nitro:Checkout:UseNgrok` to true in `appsettings.json`. This will cause callbacks to be made to the url ngrok gave you (even though you browse the site via your local address).

> 💡 If you have `UseNgrok` enabled, ngrok must be started _before_ your start Nitro (or you will get an error)

<sup>Setting `UseNgrok` to true will cause the `NgrokHelper` in Nitro.Core to set the `Nitro:Checkout:ExternallyAccessibleProtocolAndHost` setting to your ngrok url. This setting is used by method `GetCallbackActionAbsoluteUrl(...)`, which is used when generating URLs that a PSP will use to callback into nitro. This method's param `isForServerToServerCommunication` controls whether to use the `ExternallyAccessibleProtocolAndHost` for urls or not (meaning: if it should use the `*.ngrok-free.app` url that is publicly available or use your internal `dev.nitro5.com` url). So a requirement for all this to work, is that `GetCallbackActionAbsoluteUrl(...)` is used to generate callback urls and setting the `isForServerToServerCommunication` parameter to `true` (for urls that are used by PSPs to callback into nitro - method can also be used to generate urls that will be used by a frontend component to callback into nitro backend, but we do not need ngrok for that).</sup>
## Validate callback
If the paymentmethod has logic for callbacks they need to be activated.

For the Klarna package the `UseValidateCallback` prop must be set to true in `KlarnaCheckoutV3Settings`.

## Troubleshooting

### Checkout fails even if validate callback returns success
Be aware that if you have a breakpoint in the validate callback, and you step/debug the code, it might be that it takes too long for the callback to finish and the order may fail for this reason.

### ERR_NGROK_8012

If you get the error below when trying to access the ngrok url, the problem is probably that the site isn't started.
![image](https://github.com/avensia/nitro5/assets/31730051/bfc798ef-584d-4acc-905a-c6eead0807b6)

If you get the error below when trying to access the ngrok url, the problem is probably that you need to use the classic way to access the site with `--host-header=rewrite`
![image](https://github.com/avensia/nitro5/assets/1759545/4e8d1991-bbfc-496b-bcc1-63bf021b5818)

If you instead of keeping the ngrok url gets redirected to the site url when accessing the classic way. Then you probably have a site that needs `/sv` for language/culture after the ngrok url like this `https://cd1b-83-250-97-149.ngrok-free.app/sv`
