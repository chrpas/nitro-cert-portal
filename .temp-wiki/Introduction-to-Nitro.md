## What is Nitro?

Nitro is an **e-commerce site built on Optimizely CMS and Optimizely Commerce**. The purpose of Nitro is to be a **project accelerator** - it enables us to deliver customer projects faster, by containing a base to start building from. 

Nitro uses:
- **Optimizely CMS 12** 
   - ...formerly known as **Episerver CMS**
- **Optimizely Commerce Connect 14** 
   - ...formerly known as **Optimizely Customized Commerce**
   - ...formerly known as **Optimizely Commerce**
   - ...formerly known as **Episerver Commerce** 
   - ...which was acquired by Episerver from **Mediachase Commerce**

## Nitro5
In January 2022, just when Nitro had turned 5 years old, we started upgrading Nitro (which is .NET Framework 4.7.2) to .NET 5. Because of so many breaking changes between .NET Framework 4 and .NET 5, we decided to have two different Nitros, living in parallell, separated in different repositories. We usually refer to the original Nitro as "Nitro classic", while the new .NET 5 version of Nitro got the name of "Nitro5".

Note that we've kept the name of "Nitro5" even though Nitro5 is now .NET 8 (while packages are .NET 6).

Repositories:
* Nitro classic: [nitro](https://github.com/avensia/nitro) + [suite](https://github.com/avensia/suite) + [scope](https://github.com/avensia/scope)
* Nitro5: [nitro5](https://github.com/avensia/nitro5) + [nitro5-packages](https://github.com/avensia/nitro5-packages) (nitro5-packages includes scope) (plus [avensia-oss/tstypegen](https://github.com/avensia-oss/tstypegen) and [avensia/garn](https://github.com/avensia/garn))

## Nitro Starter Site
Nitro is a **starter site**, meaning that new customer projects start from this starter site. Basically what we do is we take all the starter site code (everything in the Nitro Github repository), and we clone this (like ”copy and paste”) into a new customer project Github repository. From here, we adapt everything to fit the requirements of this specific customer. This involves adjusting the UX (the look and feel), modifying features and adding customer specific features.

If we do something in a customer project that we think other projects might find useful, we can add this to Nitro. This way, Nitro is continuously updated with new features. It's also possible for the customer projects to pick updates from Nitro into their projects. This is done by cherry picking commits and/or manually copy and paste of the code. 

### The other Avensia starter sites
Avensia actually has three e-commerce starter sites. The other two are **[Avensia Excite](https://github.com/avensia/excite)** (built on CommerceTools and Contentful) and **[Storefront D365](https://avensiastorefront.com/for-partners)** (built on Optimizely like Nitro but uses Microsoft Dynamics 365 as its ecom engine).

## Nitro packages
In addition to the starter site, nitro is also the **Nitro Packages**. The packages are available as nuget and/or npm packages on https://packages.avensia.com. The source code for the packages can be found in repository [nitro5-packages](https://github.com/avensia/nitro5-packages). 

The Nitro Packages make it easier for customer projects to bring updates from Nitro into their project. It's a lot easier to update a Nuget/npm package than manually copy/paste code from the starter site repository. 

## Nitro Tech stack

![Nitro tech stack](https://github.com/user-attachments/assets/8fcfecab-ffe2-43b5-8be9-fe43406100ca)

In frontend we use:

* React - managing the virtual DOM, rendering HTML
* Redux – the global state manager
* TypeScript – to get intellisense when developing (we generate frontend types from backend c# types)
* [Glitz](https://github.com/frenic/glitz) - a CSS-in-JS library, an open-source library developed by developers from Avensia

In backend we use:

* Microsoft .NET 8
* Microsoft SQL Server
* Optimizely: CMS + Commerce
* Microsoft Azure (hosting)

For the build system we use:

* WebPack – bundling everything together
* Node.js

## Optimizely
There are three parts of Optimizely that are relevant to discuss when introducing someone to Nitro:

* **Optimizely CMS** – deals with content
* **Optimizely Commerce** – deals with e-commerce
* **Optimizely Digital Experience Cloud (DXP)** – the hosting of Episerver in Azure. We will talk more about DXP in a later presentation.

### Optimizely CMS
Optimizely CMS provides a backoffice user interface for managing content. CMS = Content Management System.

The Optimizely backoffice is where editors create content for the web site. It handles creating pages, creating content blocks, adding images, linking content, content collaboration, managing versions, content approvals, multilanguage content and managing permissions.

Image below shows what the backoffice looks like. The left pane displays the hierarchy of site pages. Center pane is where you edit the current page. 

![Optimizely CMS UI](https://github.com/user-attachments/assets/0904b904-c2bd-444c-ac7d-fda33bcbf886)

Optimizely CMS also provides API:s for building web sites with this content. Nitro is built using these API:s.

### Optimizely Commerce
Optimizely Commerce provides a backoffice user interface for managing a web shop. It deals with products, categories, prices, campaigns, inventory, carts, orders and customers.

Image below shows what the backoffice UI looks like. The left pane displays the hierarchy of the products (the catalog). 

![Optimizely Commerce UI](https://github.com/user-attachments/assets/5d8ec741-dc2f-4a17-8770-3820342430f1)

Optimizely Commerce also provides API:s for building e-commerce sites. Nitro is built using these API:s.

## What Nitro adds to Optimizely
To summarize, Nitro adds three things to Optimizely:

* An actual website
* More backoffice tools - we call these the "Nitro Tools"
* Integrations

## The Nitro web site
Nitro has most of the common features of an e-commerce site. Some example features are the cart, checkout, product category pages, campaign pages, login to my pages with order history, search, wish list, back-in-stock notifications, abandoned cart notifications. For a complete spec of all features see the Functional specification of Nitro. You can try the features of Nitro on the Nitro Demo site​​​​​​​.

Nitro is a **Single Page Application**. The only full page load is done on the first page visit. On subsequent requests we only replace content on the page, using AJAX requests and JSON. This means there is a lot of serializing objects to/from JSON going on. We use React to render the HTML. 

Nitro is also a **Progressive Web App**.  It works (at least partially) also on slow or even none internet connectivity. One example of this is that we use “optimistic updates” such as adding something to the cart and seeing it in the cart before the server has accepted it. Another example is rendering content and pages using the data we already have in frontend and rendering placeholders while we request the full data from backend. If something requires internet connectivity, we show graceful error messages.

Nitro uses **asynchronous processes** to ensure **availability** and **scalability**. This is done using a queue system. For example, when a product is changed (e.g. its description or price changed), we do not process this change immediately. The change is placed in a queue and a separate background job processes this queue and sends the product updates to the search index. This means we can process multiple changes at the same time. We also have an admin UI for error handling and re-processing of errors in the queues. Other examples of queues in Nitro are the order export, all transactional emails, price import and stock import.

### Performance is about perception
One very central concept in Nitro is that performance is about perception. There a multiple ways of measuring performance, but what really matters is not how fast the site actually is - what matters is **how fast the site feels**. It is about perception. 

So, in Nitro we try to "trick" the visitor that pages are loading instantly. One example is when navigating from category page to product page. On the category page we already have some data about the product. We have an image, the product name, the product price and possibly also the campaign price. When user clicks on a product to go to the product detail page, we immediately render the product page using the data we have from category page, leaving empty placeholders for all missing data. In the background we fetch all detailed product data from backend, and the product page is updated when this data arrives from backend. 

![Performance is about perception](https://github.com/user-attachments/assets/b3c6c57e-e361-4b3d-8232-3e3629aed79d)

This means that when developing features in a Nitro site, we must make sure that all views works both for this immediate temporary view with the cached/partial data, as well as the full view with all data. Our principles are:

* Reuse data we already have - load the rest in the background
* Only load data we actually need
* Don’t reload data that does not change between page views

## Nitro Tools
**Nitro Tools** are our additions to the Optimizely UI. For example, we have added admin interfaces for orders, all queues, all background jobs, data imports via Excel (products, prices, stock, ... ), URL redirects and payment provider settings.

![Nitro Tools](https://github.com/user-attachments/assets/7ce07d81-bff0-4a43-8330-8441daf641e7)

## Integrations
Nitro comes with a lot of integrations to 3rd party systems. Here are some examples.

Nitro exposes API:s for the customer **ERP system** to consume. For instance order export, order update imports (like when an order is shipped to customer or returned by customer), price imports and stock imports.

Nitro has an integration to **Voyado Elevate**, the search engine most Nitro projects use. Nitro sends product data and behavioural data (e.g. clicks, views, purchases) to Voyado. In turn, Voyado provides Nitro with search results sorted by relevance, category pages sorted by relevance, recommended products and related products listings.

Nitro has an integration to **inRiver PIM**, the Product Information Management system most Nitro projects use. Editors use inRiver to enrich the products (like adding description texts, images, etc) and the product data is transferred from inRiver to Nitro. This actually means that basically no editors ever enrich products using the Optimizely Commerce UI - they use inRiver instead.

Nitro has an integration to **Voyado Engage,** the Customer Relationship Management (CRM) system many customers use. This means all customer data is kept in Voyado instead of in Nitro.

As a developer you will most likely spend a lot of time adapting and adding integrations. Common tasks are:

* Adding site features, like a chat with customer services on start page, or a review widget on product page
* Adapting the product model in PIM (like adding more fields) and adapt the connector between PIM and Nitro
* Indexing the new product fields also in eSales, so you can display it on the product page
* Adapting the order export to fit requirements from the customer ERP
* Adding a new payment provider (like Swish)
* Adding a new shipping provider (like Instabox)

