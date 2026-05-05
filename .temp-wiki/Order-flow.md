This page gives an overview of the standard order flow in Nitro.

## Order creation
1. Order is placed on checkout, cart is converted to purchase order with status "InProgress" and added to queue to be exported to ERP (table `QueueErpOrderExport`). See [Order numbers](https://github.com/avensia/nitro5/wiki/Order-numbers) on how the order number is generated.
2. Order is exported by `OrderExportJob` to ERP. Order status is still "InProgress" but an ordernote is added saying it was exported.

## Order delivery
3. When order has been shipped to customer, ERP will call nitro on endpoint `api/ShipmentImport`. To simulate this locally, you can either make a post to this endpoint using Postman or use button "Create Shipment" in order admin (button is visible locally and on Integration). 
      
   ![image](https://github.com/avensia/nitro5/assets/38249038/9588b3cb-34e3-48ad-b103-c6724d021eea)

   Note that you need to specify the **quantity** to deliver. If you deliver everything that is ordered, you should choose "Create Final". To do a part delivery, choose "Create Partial".

   ![image](https://github.com/avensia/nitro5/assets/38249038/e894081d-3f88-487c-a72b-e4b3afddfc5b)

   You can also specify a **tracking number**, this is tracking id for **the shipment** (and not to be confused by nitro's order id which is also called "tracking number") and will be included in order shipped email to customer e.g. as a link to Postnord tracking page.

4. When a shipment has been registered on the order, nitro will add the order to the email queue (table `QueueCustomerOrderEmail`) and add the order to the capture payment queue (table `QueueCaptureMoney`). 
5. The `CustomerOrderEmailSenderJob` will send the "order shipped" email to customer.
5. The `CapturePaymentsJob` will call PSP which will do the actual payment transaction. This will update order status to "Completed".

## Order return
When customer returns an order, a **return order form** needs to be created. This can be done in three ways:
- Either customer creates one herself using **Return form** on My pages 
- Or ERP calls `api/ReturnImport` to register a return order. To simulate this locally, you can make a post to this endpoint using Postman.
- Or customer services creates a return form in order admin. Note that this button is only visible when something has been shipped on order.
   
   ![image](https://github.com/avensia/nitro5/assets/38249038/02e8b222-fd46-4d52-8190-6328e7cc8682)

   You need to specify the **quantity** returned. You can also optionally specify a **return fee** (which will be subtracted from the amount credited to customer).

6. When a return has been registered on the order, the order is added to the capture payment queue (table `QueueCaptureMoney`), and order is added to the email queue (table `QueueCustomerOrderEmail`) and if the order was created in nitro, order will be queued for export to ERP (table `QueueReturnExport`).
7. Job `ReturnExportJob` will export the return to ERP.
8. The `CapturePaymentsJob` will call PSP which will do the actual payment transaction and refund customer. 
9. The `CustomerOrderEmailSenderJob` will send the "order returned" email to customer.

## Discounts/crediting customer
Before order has been delivered, it is possible to update the prices in order admin:
![image](https://github.com/avensia/nitro5/assets/38249038/823f9949-dfb3-435e-a4c5-9b2eea9c8cf8)

Note however that it is only possible to lower the prices, not increase them.

When order has been delivered, it is possible to give a discount instead:
![image](https://github.com/avensia/nitro5/assets/38249038/bb34b3a3-b525-446c-9503-a03b6520e972)

![image](https://github.com/avensia/nitro5/assets/38249038/2b4c279a-2d8c-43f4-8437-64dd50b8c954)

Lowering the prices or creating a discount will add the order to the capture payments queue and `CapturePaymentsJob` will call PSP which will do the actual payment transaction and refund customer. 




