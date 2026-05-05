This document describes how to make inRiver PIM and Nitro work well together.

1. [Brands](#brands)
2. [Images (resources)](#images-resources)

## Brands

Brands can be handled in two ways in PIM; as string fields on products or as distinct Brand entities. Nitro supports both approaches, and it's really a business decision to make.

> If you don't work with brands at all it is perfectly fine to remove this feature from Nitro in your project.

### Brands as string fields

This is the simpler approach of the two. Brand can either be set as a string from ERP and/or be enriched by editors via a brand CVL on product. No specific requirement on the channel, no brand _links_ are needed in PIM.

On the Nitro side, brand entities will be created and links to products and variations will be established during import.

Rich brand content and brand logos will be maintained in Episerver.

> For customers that don't have any specific brand requirements, working with brands as strings is the recommended approach.

### Brands as entities

If there are specific requirements for brands, e.g. editors want to work with brand resources in PIM, control brand subcategories or other settings such as market visibility per brand then using brands as entities can be a good approach.

For this scenario, Nitro expects brand entities to be part of the channel via `ChannelBrand` and linked to products, via a `ProductBrand` link.

A challenge with this approach can be to maintain these brand links. As is common, brands are often enriched via a CVL field on the product. What is required to make this work is a listener to establish the link between product and brand as the CVL field is set.

Another consideration with this approach is that it will make the channel structure more complex, and potentially worsen the performance. The more links are added to the channel, the more complex the channel structure will be. Although this is more of a limitation in inRiver, it's a consideration that must be made.

## Images (resources)

### Image sizes

By default, images are transfered to Episerver in its _original size_. While it's true that Nitro will resize the images as appropriate, it is a waste to send more data than what is needed. The limit for the ImageResizer in Nitro is to work with images no larger than 3000 x 3000 (or it will throw an error). Usually, the largest size that will be used on a site is 1920 (pdp, 2x).

> We recommend an image configuration to resize images to 1920 for Episerver

To configure an image format for the epi connector:

1. Go to Control Center
2. Select environment
3. Click Image configuration
4. Create one rule for png -> png and one for jpg -> jpg and one for jpeg -> jpeg with the following params:

   `-background white -alpha remove -type truecolor -colorspace rgb -resize 1920x1920> -density 96 -type optimize`

5. Name it `EPI`. Save.
6. Click Connect -> Extensions
7. Click the epi connector
8. Change the value of `ImageConfiguration` setting and set it to `EPI`. Save.