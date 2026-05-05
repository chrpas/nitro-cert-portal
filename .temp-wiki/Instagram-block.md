There is an **Instagram block** that editors can use to display a feed of images and/or videos from Instagram.

## From Func spec
* Web editors can use the Instagram block to display images or videos from a public Instagram account. 
* Web editors can choose to display only images or only videos.
* Web editors can choose to limit the number of Instagram posts to show.
* Web editors can choose to hide or show image captions.
* The Instagram posts are cached for performance reasons. There can be a delay of up to an hour before new posts from Instagram are displayed because of this.
* A background job will periodically refresh the required Access Token from the Instagram API.

Note: Block can also display Instagram carousel albums. This will simply list all media allowed by the checkboxes "Display Image" and "Display Video" included in the carousel - you will probably want to modify the UX/frontend of this before using it on a site.

## How to use the Instagram block

Prerequisites:
* A public Instagram account
* A personal Facebook account
* A Meta for Developers account

How to setup:
1. Go to **Episerver CMS -> Admin -> [Avensia] Instagram Access Tokens** to create a valid access token for your Instagram account. (This step requires a personal Facebook account, a Meta for Developers account and Instagram account.)
2. **Create an Instagram Block**, use the access token created in previous step. Add block to a CMS page. Publish.
3. Verify job **Instagram Refresh Token** is enabled and scheduled properly. Access tokens expires after 60 days so job should run at least monthly.

## The Instagram Refresh Token job
Instagram access tokens are valid for 60 days after creation and will then expire, causing the InstagramBlock to fail unless the access token is refreshed. The [InstagramRefreshTokenJob](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/InstagramAdmin/InstagramRefreshTokenJob.cs) will find all currently published InstagramBlocks and refresh their tokens using the Instagram API. 

Note that Instagram will in fact not *refresh* the current access token, but instead create a *new* access token valid for another 60 days. The InstagramRefreshTokenJob will replace the old access token with the new one on the InstagramBlock and publish the block. 

The job will include InstagramBlocks that are published, even though they are not included on any page. Job will ignore InstagramBlocks that are not published, in trash or deleted.

## The Instagram admin tool
You'll find the admin tool on **Nitro Tools -> Admin -> Instagram**. It will guide you through the initial creation of an Instagram access token.

## Setup accounts
* Login to https://developers.facebook.com/apps/ and click create app. Choose to create business app
* Add Instagram to your app
* You will be prompted to "API setup with Instagram business logic". Here you can see the **app ID** and **app secret.** Click on generate access tokens to add an Instagram business account.
* You can either generate a token here and paste it to the instagram blocks
* Or you can click setup instagram business login and add https://dev.nitro5.com/instagramadmin/auth as OAuth redirect URIs. Then go to https://dev.nitro5.com/instagramadmin and paste the app secret and app ID in order to generate the token
* Try running the refresh token job and verify it works

## Developer notes
* See [InstagramBlock.cs](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Shared/Blocks/Instagram/InstagramBlock.cs)
* See https://github.com/avensia/nitro/pull/758
* See docs from Facebook on [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
* See this [PR](https://github.com/avensia/nitro5/pull/450) on how to setup accounts