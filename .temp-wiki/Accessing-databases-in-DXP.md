Note! When you connect to the integration/preprod/production databases in DXP using SQL Server Management Studio, you CANNOT use the connectionstring and user/password that the site uses. This is not allowed! 

> You must use your **own personal account** to access the databases!

Here is how to set it up:

1. Your customer needs to sign a "Database access amendment", since database access is not allowed by Optimizely by default. Getting the amendmend in place is usually done by SA during project startup - ask your Optimizely CSM about the amendment.
2. Episerver needs to whitelist Avensia IPs in the databases. This is also usually done by SA during project startup. Send an email to Optimizely support asking them to whitelist Avensias IPs in the integration, preprod and production databases (they will probably reply with "no, this is not allowed", and you reply "yes, we have an amendment agreement"). Avensia's IP ranges can be found [on Sharepoint](https://avensiaab.sharepoint.com/sites/AvensiaITSupport2/SitePages/Avensia-IP-range.aspx)
3. You need to have access to the PaaS portal for your customer. Request access on https://world.episerver.com/documentation/developer-guides/digital-experience-platform/creating-an-episerver-cloud-account/.
3. When amendment and whitelist is in place, you should be able to get access via support. Make sure to clearly specify the customer id in the request.
4. Connect to database using "Universal with MFA" and your windows login. The server address is always instance name + database.windows.net. Note that you need to 
specify which database to connect to, either `epicms` or `epicommerce` (you do not have access to list databases on server - so you need two separate connections for the two databases).

   ![image](https://user-images.githubusercontent.com/38249038/219373026-3a4de494-f005-4500-a7f7-786b93d594c7.png)

   ![image](https://user-images.githubusercontent.com/38249038/219373254-846215e4-17a1-4baa-81a1-e4bfac2bda4c.png)

