There are two types of API endpoints in Nitro: inbound and outbound endpoints.

## Inbound integrations
Inbound integrations in Nitro are exposed as HTTP/REST API:s. Usually it is customer's ERP system using these endpoints, sending for instance prices, stock updates or order updates to Nitro.

All API endpoints are controllers decorated with the `[ApiController]` attribute, see for example the [PriceImportController](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Pricing/Import/PriceImportController.cs). 

Most inbound integrations in Nitro uses the Nitro queue system. The controller simply adds all messages it receives to a queue and returns `200 OK` (or sometimes `204 NO CONTENT`) without any further processing. The queue is processed by a [background job](https://github.com/avensia/nitro5/wiki/Jobs). This way, the integrations will not affect the web site performance. 

Some endpoints process messages directly without using queues, for instance the `ShipmentImportController` and `ReturnImportController` where we need to report status of the order update immediately back to ERP. 



### Testing with Postman
You can test the API endpoints locally by using Postman:

1. Install [Postman](https://www.postman.com/), if you havn't already
2. Import collection to Postman: Click "Import" button, select "File", and use file [postman_collection.json](https://github.com/avensia/nitro5/blob/nitro5-develop/postman_collection.json), click "Continue"
3. Open the endpoint you want to test, for instance the **Price import**
4. Open the **Body** tab. Here you'll find the JSON included as the body of the request. Modify to fit your test - perhaps modify the variant code to one that you want to set a new price for.
5. Click **Send**
6. You should get a 200 or 204 response if everything was succesfull.
7. Depending on which endpoint you are testing, you might need to run a job also, for instance the `price_import` job.
8. You might also need to do a `iisreset` to see updates in Commerce UI, since old values might be cached otherwise.
9. To see results on web site you might need to run `incremental_index` as well.

![image](https://user-images.githubusercontent.com/38249038/203278027-db901fb3-89fc-43db-9a39-97716c52fee2.png)

### Authorization
Authorization is required by the [WebApiTokenAuthorization](https://github.com/avensia/nitro5-packages/blob/nitro5-develop/packages/core/src/Avensia.Nitro.Core/Attributes/WebApiTokenAuthorizationAttribute.cs) attribute, for instance the `PriceImportController` looks like this:

```c#
[TypeFilter(typeof(WebApiLogRequestAttribute))]
[TypeFilter(typeof(WebApiTokenAuthorizationAttribute))] 
[Route("api/PriceImport")]
[ApiController]
public class PriceImportController : ControllerBase
{
   // ...
}
```
When sending a request to the API controller, you must include the `SiteApiKey` as an Auhorization header in your request. You'll find the key in `Nitro:ApiControllers:SiteApiKey` `appsettings.json`. In Postman, you'll add the authorization on the Headers tab:
![image](https://user-images.githubusercontent.com/38249038/203278821-59204ac2-ee74-44a2-9eb4-11ce27536291.png)

### Logging
Requests made to the api controllers are logged by the `WebApiLogRequestAttribute` using `WebApiRequestLogFormatter`. You can adjust the implementation of [WebApiRequestLogFormatter](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Log/WebApiRequestLogFormatter.cs) if you want to log something differenty.

## Outbound integrations
The outbound integrations are default implemented as JSON files exported by Nitro. This default behavior is modified in customer projects, for instance by instead calling an endpoint in customer’s ERP system. 

Out of the box there are two outbound exports: 

* the [order export job](https://github.com/avensia/nitro5/blob/nitro5-develop/src/Avensia.Common/Features/Order/Export/OrderExportJob.cs) - you'll find exported JSON files in `/src/Avensia.Shop/bin/Debug/OrderExport` folder 
* the [return order export job](https://github.com/avensia/nitro/blob/develop/src/Avensia.Common/Features/Order/ReturnExport/ReturnExportJob.cs) - you'll find exported JSON files in `/src/Avensia.Shop/bin/Debug/ReturnExport` folder 

## Integration specification
All inbound and outbound endpoints are documented in the [Integration specification](https://avensiaab.sharepoint.com/sites/AvensiaProducts/SitePages/Nitro-Documents.aspx) on Sharepoint. Feel free to share this document with customer and use as a starting point when discussing integrations in your project. Remember to also supply customer with the `SiteApiKey` that should be used as the Authorization header. This key should be changed to a project unique value - do not use the default value from Nitro. 