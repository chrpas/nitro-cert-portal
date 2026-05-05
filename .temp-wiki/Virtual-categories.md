**Virtual categories** is a very simple concept which enables editors to create "combination categories" that can be used as filters in promotions and product listing pages. Since Episerver combines their criteria with OR, it is not possible in vanilla Episerver to say "Category x in brand y". With virtual categories, we can create such a category in PIM and then use this as filter.

The virtual categories are hidden from the site, they are only used by editors to create filters. Any product that has a link to a virtual category will have this category excluded from indexing, since we don't want it to appear in any breadcrumbs or search facets.

## How to setup virtual categories
1. Create a category in the root called "Virtuella kategorier" (in a customer production environment, this category should be created in PIM, but for testing you can create it manually in epi). Note that this category must be *in the root* of the catalog.
2. Set the site setting `Virtual categories root` to point to this node.
3. Create a subcategory "Fyndhörna" under this category
4. Add a couple of products to the "Fyndhörna" category
5. Run incremental index

## How to setup virtual categories in inRiver PIM
If you have lots of products in one single virtual category, you might run into performance issues with the pim import in nitro (because every time an item is added/removed to the category that category has to be re-processed by the pim import). Therefore, it is recommended to add items to virtual categories with a `categorySynchronizer` based on CVL values. (See GetInspired for example of how)


## Read more
* https://github.com/avensia/nitro/pull/726