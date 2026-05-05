## From Functional spec
- The **quick order page** is available from the page header on all pages (this can be disabled by editors)
- Web editors can add content to the top of the page by using Nitro CMS blocks.
- Visitor can add items to the quick order by supplying article number or by uploading an Excel file with article numbers and quantities
- Visitor can use the **Add all top cart** button to add all items to cart and be redirected to checkout 


## How to setup
1. Create a page of type QuickOrderPage
2. To display link to quick order from the header: go to Site Settings and set the Quick order page property

## Developer notes
- Uses 3rd party DocumentFormat.OpenXml for reading Excel files
- See [nitro5#62](https://github.com/avensia/nitro5/pull/62)

