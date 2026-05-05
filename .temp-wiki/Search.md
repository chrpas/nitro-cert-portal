The on-site search in Nitro has been implemented according to UX best practices from Baymard Institute. See https://github.com/avensia/nitro5/pull/151

The following text is taken from Nitro Functional specification, and describes the on-site search that is included in Nitro OOTB.

## Interaction
- Visible search box in the header (desktop and mobile)
- Visual indication when focusing search box (desktop and mobile)
- Visual indication when hovering suggestions (desktop)
- Button to clear the search box (desktop and mobile)
- Button to close search (mobile)
- Keyboard navigation of suggestions
- Clicking on a suggestion or pressing enter will bring up the search results page 

## Suggestions
- When the user sets focus in the search box, 5 most recent searches [by the user] are shown as suggestions
- As the user starts typing, suggestions are presented (max 9 in desktop, max 5 in mobile)
- Search suggestions are based on product data and search statistics (depending on the search engine)
- Adequate spacing between suggestions for touch navigation
- The “completing” part of the suggestion is visually indicated  
   ![image](https://github.com/avensia/nitro5/assets/38249038/d0f476cf-388e-4715-aa75-ccc91ee73928)


## Search results
- It is possible to search for article number, product name, color, category and brand – or a combination
- Content can be searched for by title and body
- Clicking on a suggestion or pressing enter will perform a search:
   - The current page url is updated to the search results page url
   - If search gives multiple hits, the matching products are displayed in relevance order
   - If search gives exactly 1 hit, user is redirected to the corresponding product page
   - Search results page shows a list of products that matches the search criteria
- Search results page shares the same capabilities as the product listing page with regards to sorting and filtering
   - Content matches are shown in a separate tab (if any)
- Automatic correction of misspelled searches, e.g. searching for “jneas” will show results for “jeans”.
- Possibility to add manual search synonyms
- If no matches are found, user will be presented a list of popular products

