Nitro contains a base implementation to support the [Europan price directive](https://eur-lex.europa.eu/legal-content/SV/TXT/PDF/?uri=CELEX:52021XC1229(06)&from=EN) (aka "price law") that took effect on 1 September 2022.

> The purpose of this Directive is to stipulate indication of the selling price and the price per unit of measurement of products offered by traders to consumers in order to improve consumer information and to facilitate comparison of prices.

The logic implemented in Nitro is making use of the  **[PriceHistory](https://github.com/avensia/nitro5-packages/tree/nitro5-develop/packages/pricehistory)** package which adds support for storing and retrieving historical prices.

Price history is stored in table `dbo.Avensia_PriceHistory` when the promo cache job discovers that a price has changed. The previous price is also stored in the promotion cache table, indexed to esales and available in the product view models.

Note: Nitro does not include any frontend code for displaying previous prices on the site. It is up to each project to decide how to present the information. The base implementation go as far as delivering the data to frontend. To see example implementations for frontend, check Apohem and SkinCity.

## Read more
- https://github.com/avensia/nitro/pull/801
