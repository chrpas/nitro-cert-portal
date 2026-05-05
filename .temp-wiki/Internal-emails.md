One email address can be configured to receive "Internal Error Emails", below you will find the triggers that exist by default.

Please note that Nitros infrastructure is set up so that it is very easy to add, remove and edit triggers.

- **Capture Money Job**

   In the case of an error with the communication towards the payment provider when capturing money an internal email will be sent as a manual payment handling is required for that specific order.

   Additionally if a payment fails during a capture an email will be triggered to ensure that the order is investigated.

- **Order Export Job**

   If an Order export failed an email containing OrderId and the error message will be sent so that the information can be forwarded to a relevant party. 
   
   This is also true if the order export fails due to communication with the external system to which the order communication takes place.

- **OrderFlowService**

    There are several sanity checks when preparing an order in Nitro. If these were to fail and require manual handling an email will be triggered. Sanity checks include difficulty allocating inventory or for instance if a virtual code is used incorrectly.

- **ReturnExportJob**

   If a return export fails an email will be triggered so that the order in question can be manually investigated. This is also true if there is a communication error with the external system which is set to receive the return.

- **Stale Queue Error Notifier**

   If any of the different messaging queues used in Nitro contains several error messages that has not been handled in some time an email will be sent containing information regarding what queue and the amount of error lines needed to handle.

- **Diagnostics Admin**

   A test email can be triggered via the Diagnostics Admin Interface.

## Developer notes
See appsetting `Nitro:InternalEmails`. 

Note that internal emails are sent via a separate SMTP config, not via SendGrid/Voyado, see [Setting-up-Sendgrid](https://github.com/avensia/nitro5/wiki/Setting-up-Sendgrid)