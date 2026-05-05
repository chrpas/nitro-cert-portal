**Virtual discount codes** enable regular Epi discounts to be associated with multiple one-time-use codes. This offers greater convenience for administrators compared to creating distinct Epi discounts for each recipient, as seen in scenarios such as distributing newsletters.

See https://github.com/avensia/nitro5-packages/tree/develop/packages/virtual-discounts on installation and how to make this work in combination with customer specific prices.

## Usage
1. Create a discount under the "Virtual discounts" campaign in Epi Marketing. You can create any discount you want, but it must must have an associated **coupon code** that is **at least 5 characters long** (you can just type some random characters as this code will never be displayed anywhere). Also make sure that the discount is **active**.
2. Go to "Nitro Admin - Nitro Tools - Virtual discounts". Click **Add Discount**. Fill in all required fields, select Type = 'Multicode' and the discount you created in step 1. Specify the rules for the code generated and then click **Save**.
3. In the overview view, select your discount and click **Apply**. 
4. Click **Export** to get an Excel file containing all generated codes.
5. You can now use these generated codes on checkout page and they will activate the discount you created in step 1.

Everytime a purchase is made using a virtual code, it will update the "number of usages" for that virtual code. You can check this in the virtual discounts admin tool or the [Nitro5.Commerce].dbo.Avensia_VirtualDiscountCodes table


## Read more
- https://github.com/avensia/nitro5-packages/tree/develop/packages/virtual-discounts
