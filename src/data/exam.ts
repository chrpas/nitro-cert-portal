import { Question } from '../db/db';

export const examQuestions: Question[] = [
  {
    id: 1,
    type: 'single',
    text: "What is the primary purpose of Nitro in the Avensia ecosystem?",
    options: [
      "A standalone CRM system",
      "A project accelerator for Optimizely CMS and Commerce",
      "A database management tool",
      "A cloud hosting provider"
    ],
    correctAnswer: 1,
    explanation: "Nitro is designed as a project accelerator, providing a base to deliver customer projects faster on Optimizely."
  },
  {
    id: 2,
    type: 'single',
    text: "Which package is responsible for Nitro's Single Page Application (SPA) behavior?",
    options: [
      "Avensia.Nitro5.Core",
      "Avensia.Shop",
      "Avensia.Scope",
      "Avensia.Garn"
    ],
    correctAnswer: 2,
    explanation: "The Scope package implements the SPA behavior, serializing view models to JSON and handling hydration."
  },
  {
    id: 3,
    type: 'single',
    text: "How does Nitro handle Server-Side Rendering (SSR)?",
    options: [
      "Using Next.js",
      "Using ClearScript to run the V8 engine within .NET",
      "Using standard ASP.NET Razor views only",
      "Using a separate Node.js microservice"
    ],
    correctAnswer: 1,
    explanation: "Nitro uses ClearScript, a .NET wrapper for the V8 engine, to perform SSR using the same React code as the frontend."
  },
  {
    id: 4,
    type: 'single',
    text: "What is the purpose of the @ComponentFor pragma in Nitro React units?",
    options: [
      "To define CSS styles",
      "To map the React component to its corresponding C# ViewModel",
      "To trigger a database migration",
      "To enable Hot Module Replacement"
    ],
    correctAnswer: 1,
    explanation: "The @ComponentFor pragma is used by the build system to register components in the component registry, mapping them to backend view models."
  },
  {
    id: 5,
    type: 'single',
    text: "Which variable in the frontend contains global data like the main menu and site settings?",
    options: [
      "CURRENT_PAGE",
      "GLOBAL_CONFIG",
      "APP_SHELL_DATA",
      "NITRO_STATE"
    ],
    correctAnswer: 2,
    explanation: "APP_SHELL_DATA holds shared data that stays in memory across page loads, such as menus and site-wide configurations."
  },
  {
    id: 6,
    type: 'single',
    text: "What is the recommended tool for tracking backend and frontend errors in a Nitro project?",
    options: [
      "Log4Net",
      "Raygun",
      "Google Analytics",
      "StatusCake"
    ],
    correctAnswer: 1,
    explanation: "Raygun is the standard error tracking provider used in Nitro for both frontend and backend exceptions."
  },
  {
    id: 7,
    type: 'boolean',
    text: "True or False: In Nitro5, all jobs must implement the INitroJob interface.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "Correct. All background jobs in Nitro5 must implement the INitroJob interface and use the [NitroJob] attribute."
  },
  {
    id: 8,
    type: 'single',
    text: "What happens during 'Hydration' in the Nitro lifecycle?",
    options: [
      "The database is refreshed with mock data",
      "React attaches event handlers to server-rendered HTML",
      "The browser downloads the entire product catalog",
      "The CSS-in-JS library generates new class names"
    ],
    correctAnswer: 1,
    explanation: "Hydration is the process where React takes the static HTML from SSR and attaches JavaScript event listeners to make it interactive."
  },
  {
    id: 9,
    type: 'single',
    text: "In Nitro5, what is the recommended way to handle sensitive settings like API keys?",
    options: [
      "Store them in appsettings.json",
      "Use Octopus variables only",
      "Store them in Azure KeyVault",
      "Hardcode them in the Startup.cs file"
    ],
    correctAnswer: 2,
    explanation: "According to the Appsettings guidelines, all sensitive settings must be stored in Azure KeyVault, accessed via the PaaS portal."
  },
  {
    id: 10,
    type: 'single',
    text: "Which Higher Order Component (HOC) should be used when the focusable element is a child of the outermost element?",
    options: [
      "createTabbingFocusElement()",
      "createTabbingFocusWithinElement()",
      "TabTrap",
      "EpiProperty"
    ],
    correctAnswer: 1,
    explanation: "createTabbingFocusWithinElement() is used when the focusable element is a child, such as a label wrapping an input."
  },
  {
    id: 11,
    type: 'single',
    text: "What is the correct protocol for accessing DXP databases in production using SQL Server Management Studio?",
    options: [
      "Use the site's connection string and password",
      "Connect using a shared team account",
      "Use your own personal account with 'Universal with MFA'",
      "Database access in DXP is strictly prohibited and impossible"
    ],
    correctAnswer: 2,
    explanation: "Users must use their own personal account with MFA and ensure an amendment is signed and their IP is whitelisted."
  },
  {
    id: 12,
    type: 'single',
    text: "In Nitro5, what has replaced StructureMap for Dependency Injection?",
    options: [
      "Autofac",
      "Ninject",
      "Microsoft Dependency Injection (with Scrutor)",
      "Unity Container"
    ],
    correctAnswer: 2,
    explanation: "Nitro5 has migrated to Microsoft Dependency Injection, utilizing Scrutor for extension methods like decoration."
  },
  {
    id: 13,
    type: 'single',
    text: "Where are the localization XML files (e.g., shop_sv-SE.xml) located in a Nitro5 project?",
    options: [
      "Avensia.Common/lang",
      "Avensia.Shop/lang",
      "Avensia.Core/localization",
      "App_Data/lang"
    ],
    correctAnswer: 1,
    explanation: "In Nitro5, language XML files have moved from Avensia.Common/lang to Avensia.Shop/lang."
  },
  {
    id: 14,
    type: 'boolean',
    text: "True or False: Using 'aria-label' is recommended to describe what a button does when it only contains an icon.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. If a button provides no text (only an icon), aria-label should be used to provide metadata for screen readers."
  },
  {
    id: 15,
    type: 'single',
    text: "What is the purpose of the [NitroJob] attribute in Nitro5?",
    options: [
      "To mark a class as a React component",
      "To define the job name and schedule in a single location",
      "To trigger a SQL migration",
      "To enable real-time price resolving"
    ],
    correctAnswer: 1,
    explanation: "The [NitroJob] attribute is used on classes implementing INitroJob to set both the display name and the default schedule."
  },
  {
    id: 16,
    type: 'single',
    text: "When implementing 'Skip to content' buttons for accessibility, how should they behave visually?",
    options: [
      "They should always be visible at the top of the page",
      "They should be hidden behind an icon",
      "They should be visually hidden until they receive keyboard focus",
      "They should only appear for mobile users"
    ],
    correctAnswer: 2,
    explanation: "Skip links are visually hidden until focused, ensuring they assist keyboard users without cluttering the UI for mouse users."
  },
  {
    id: 17,
    type: 'single',
    text: "Which property is used to restrict product access in a B2B scenario in Nitro?",
    options: [
      "IsPrivate",
      "IsPublic",
      "AccessLevel",
      "RequiredOrganization"
    ],
    correctAnswer: 1,
    explanation: "By default, products are public. To restrict access, 'IsPublic' is set to false, and the product is connected to specific Product Groups."
  },
  {
    id: 18,
    type: 'single',
    text: "How do you check if a page is in On-Page Editing mode in Nitro5?",
    options: [
      "if (PageEditing.PageIsInEditMode)",
      "if (CurrentContext.IsEdit)",
      "Inject IContextModeResolver and check CurrentMode.EditOrPreview()",
      "Check the URL for the 'epiedit' parameter"
    ],
    correctAnswer: 2,
    explanation: "The legacy PageEditing check is gone; you must now inject IContextModeResolver to determine the current mode."
  },
  {
    id: 19,
    type: 'single',
    text: "What is the default URL for the Optimizely backoffice in Nitro5?",
    options: [
      "/episerver",
      "/admin",
      "/backoffice",
      "/cms"
    ],
    correctAnswer: 2,
    explanation: "Nitro5 has changed the default backoffice URL from '/episerver' to '/backoffice'."
  },
  {
    id: 20,
    type: 'single',
    text: "Which component should be used in React to enable On-Page Editing (OPE) for properties?",
    options: [
      "EditableProperty",
      "EpiProperty",
      "ScopeEditor",
      "NitroField"
    ],
    correctAnswer: 1,
    explanation: "The 'EpiProperty' component from @avensia/scope-episerver is the standard way to enable OPE for properties in Nitro5."
  },
  {
    id: 21,
    type: 'single',
    text: "How does Nitro5 define its browser support strategy?",
    options: [
      "Supports all versions of Internet Explorer",
      "Based on global usage of > 0.5% on caniuse.com",
      "Only supports the latest version of Chrome",
      "Supports Safari up to 5 major versions back"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 supports browser versions with global usage > 0.5% and Safari up to two major versions back."
  },
  {
    id: 22,
    type: 'single',
    text: "Which command is used to start the Nitro5 site locally using Kestrel?",
    options: [
      "nitro start-iis",
      "nitro start-site",
      "yarn start",
      "npm run dev"
    ],
    correctAnswer: 1,
    explanation: "'nitro start-site' stops IIS on port 443 and runs the project using 'dotnet run'."
  },
  {
    id: 23,
    type: 'single',
    text: "What is the purpose of the 'nitro continuous-integration' task?",
    options: [
      "To deploy code to production",
      "To run the same checks as TeamCity locally (e.g., linting, tests)",
      "To sync the local database with production",
      "To generate documentation"
    ],
    correctAnswer: 1,
    explanation: "This task runs the CI pipeline checks locally to help developers catch issues before submitting a Pull Request."
  },
  {
    id: 24,
    type: 'single',
    text: "In Nitro5, what is the standard for logging in new code?",
    options: [
      "log4net",
      "EPiServer.Logging.Compatibility",
      "Microsoft.Extensions.Logging (.NET Core native)",
      "Serilog.Direct"
    ],
    correctAnswer: 2,
    explanation: "While EPiServer.Logging exists for backward compatibility, new code should use the native .NET Core logging API."
  },
  {
    id: 25,
    type: 'single',
    text: "What is the recommended approach for restricting which blocks editors can add to a ContentArea?",
    options: [
      "Use naming conventions",
      "Let allowed blocks implement IContentBlock and use [AllowedTypes(typeof(IContentBlock))]",
      "Restrict permissions via the database",
      "Blocks cannot be restricted in Optimizely"
    ],
    correctAnswer: 1,
    explanation: "Implementing IContentBlock on specific block types and using the AllowedTypes attribute on the ContentArea property is the standard Nitro5 pattern."
  },
  {
    id: 26,
    type: 'single',
    text: "How are prices and promotions pre-calculated before being sent to the search index?",
    options: [
      "They are calculated on-the-fly during search",
      "Via the FullPromoCacheJob which populates the NitroPromotionCache table",
      "Inside the InRiver PIM",
      "By the frontend using a price service"
    ],
    correctAnswer: 1,
    explanation: "The indexing process starts with the promo cache job to pre-calculate prices, which are then read by the indexing job."
  },
  {
    id: 27,
    type: 'boolean',
    text: "True or False: Nitro5 uses IIS as the primary web server for local development.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. Nitro5 has moved away from IIS in favor of Kestrel (.NET 8/Core)."
  },
  {
    id: 28,
    type: 'single',
    text: "What image resizing solution does Nitro5 use when running in the DXP environment?",
    options: [
      "ImageResizer.net",
      "SkiaSharp",
      "Cloudflare's built-in image resizer",
      "Adobe Scene7"
    ],
    correctAnswer: 2,
    explanation: "While SkiaSharp is used locally, Nitro5 leverages Cloudflare's image resizing capabilities in the DXP environment."
  },
  {
    id: 29,
    type: 'single',
    text: "Which Nitro subsystem is responsible for tracking dependencies between content entities to facilitate incremental processing?",
    options: [
      "Processing engine",
      "Change tracking",
      "Dependency tracking",
      "Time dependency tracking"
    ],
    correctAnswer: 2,
    explanation: "Dependency tracking tracks connections between content (e.g., between a promotion and its products) so that when one changes, related items are also re-processed."
  },
  {
    id: 30,
    type: 'single',
    text: "What is the primary table used by Nitro to log all system changes for incremental jobs?",
    options: [
      "Nitro_ChangeLog",
      "Nitro_PendingChanges",
      "Avensia_SystemUpdates",
      "Epi_ContentChanges"
    ],
    correctAnswer: 1,
    explanation: "The Nitro_PendingChanges table acts as a log of all relevant changes (Data, Pricing, Inventory, etc.) in the system."
  },
  {
    id: 31,
    type: 'single',
    text: "Which design pattern does Nitro use to track dependencies by replacing built-in services like IContentRepository?",
    options: [
      "Strategy pattern",
      "Factory pattern",
      "Decorator pattern",
      "Observer pattern"
    ],
    correctAnswer: 2,
    explanation: "Nitro uses the decorator pattern to wrap standard Episerver services with 'DependencyTracking' versions that register content access during processing."
  },
  {
    id: 32,
    type: 'single',
    text: "When creating a new Nitro5 payment gateway, which property on the view model hides the standard 'Complete Purchase' button on the Checkout page?",
    options: [
      "HideCheckoutButton",
      "HasBuyButton",
      "IsInteractive",
      "CustomCheckoutFlow"
    ],
    correctAnswer: 1,
    explanation: "Setting 'HasBuyButton' to true indicates the gateway provides its own button, hiding the default one."
  },
  {
    id: 33,
    type: 'single',
    text: "In the context of Nitro shipping plugins, where should shipping-related data (like a session ID) be stored to ensure frontend and backend sync?",
    options: [
      "Directly in the backend by calling cart.Save()",
      "In a temporary SQL table",
      "On the cart using the 'setShippingPluginAdditionalData' checkout action from the frontend",
      "In the user's browser local storage only"
    ],
    correctAnswer: 2,
    explanation: "All cart updates should come from the frontend via actions to ensure the cart is saved correctly and the UI remains in sync."
  },
  {
    id: 34,
    type: 'single',
    text: "What is the standard format for a Nitro5 release candidate (rc) version tag in git?",
    options: [
      "rc-v1.0.0",
      "v1.0.0-rc0001",
      "1.0.0-beta.1",
      "v1.0.0.rc1"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 uses a specific format like v2.3.4-rc0001 for version tags to trigger TeamCity builds."
  },
  {
    id: 35,
    type: 'single',
    text: "Which global variable in the frontend contains shared data that stays in memory across page loads, such as site settings and main menus?",
    options: [
      "window.CURRENT_PAGE",
      "window.APP_SHELL_DATA",
      "window.GLOBAL_STATE",
      "window.NITRO_CONFIG"
    ],
    correctAnswer: 1,
    explanation: "APP_SHELL_DATA holds page-agnostic data like menus, cart info, and footer data that persists during SPA navigation."
  },
  {
    id: 36,
    type: 'single',
    text: "In Nitro5's CRM terminology, what is a 'Contact'?",
    options: [
      "Any person with a record in the database",
      "A user who can log in to the backoffice",
      "A user who can log in on the site (frontend)",
      "A third-party API integration point"
    ],
    correctAnswer: 2,
    explanation: "A contact is specifically defined as a user who can log in on the site, as opposed to an editor/admin who logs in to the backoffice."
  },
  {
    id: 37,
    type: 'single',
    text: "Which command allows a developer to debug a Nitro5 NuGet package by replacing the NuGet reference with a local project reference?",
    options: [
      "nitro debug-package",
      "nitro link-nuget",
      "nitro local-nuget",
      "nitro include-source"
    ],
    correctAnswer: 2,
    explanation: "The 'nitro local-nuget' command replaces package references with project references from a local clone of the nitro5-packages repo."
  },
  {
    id: 38,
    type: 'single',
    text: "What is the recommended approach for handling initialization logic that must run after the IOC container is fully configured in Nitro5?",
    options: [
      "Use StructureMap's ConfigurationComplete event",
      "Implement the logic within NitroStartupService.cs",
      "Call services.BuildServiceProvider() in Startup.cs",
      "Place the logic in the Global.asax file"
    ],
    correctAnswer: 1,
    explanation: "Logic requiring a fully configured IOC container is handled in NitroStartupService.cs."
  },
  {
    id: 39,
    type: 'boolean',
    text: "True or False: In a multisite Nitro5 solution, email addresses are required to be unique across the entire AspNetUsers table.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. Emails only need to be unique in combination with the SiteId, allowing the same email to be used for different users on different sites."
  },
  {
    id: 40,
    type: 'single',
    text: "How often is the APP_SHELL_DATA refreshed automatically in the frontend by default?",
    options: [
      "Every 30 seconds",
      "On every page navigation",
      "Every 5 minutes",
      "Only on full page reloads"
    ],
    correctAnswer: 2,
    explanation: "The browser-entry.tsx schedules an update of AppShellData every 5 minutes."
  },
  {
    id: 41,
    type: 'single',
    text: "Which Nitro job is responsible for purging entries from the Nitro_PendingChanges table that are older than 7 days?",
    options: [
      "PurgeChangeTrackingJob",
      "DeleteOldChangeTrackingDataJob",
      "CleanupDatabaseJob",
      "IncrementalMaintenanceJob"
    ],
    correctAnswer: 1,
    explanation: "The DeleteOldChangeTrackingDataJob is responsible for cleaning up the log of changes to keep the Nitro_PendingChanges table size manageable."
  },
  {
    id: 42,
    type: 'single',
    text: "What is the primary benefit of using the 'Auto' resolve mode in Dynamic Data?",
    options: [
      "It automatically saves changes to the database",
      "It triggers the framework to resolve the data as soon as it is encountered in the frontend",
      "It automatically converts C# models to TypeScript",
      "It resolves the data only when the user clicks a button"
    ],
    correctAnswer: 1,
    explanation: "DynamicDataResolveMode.Auto tells Scope to automatically fetch the data asynchronously as soon as the component or code runs into it."
  },
  {
    id: 43,
    type: 'single',
    text: "When implementing a DynamicDataBatchResolverBase, why is the order of the returned list critical?",
    options: [
      "Because the database requires sorted IDs",
      "Because the position in the list is how the framework matches the context to the returned value",
      "To ensure the items appear alphabetically in the UI",
      "It is not critical; the framework matches them by ID automatically"
    ],
    correctAnswer: 1,
    explanation: "Batch resolvers rely on index positions to map requested contexts (like SKUs) to their corresponding results (like Prices)."
  },
  {
    id: 44,
    type: 'single',
    text: "Which EpiFoundation service should be used to load Optimizely associations by their TargetId?",
    options: [
      "IAssociationRepository",
      "IAvensiaAssociationRepository",
      "IContentRepository",
      "IRelationRepository"
    ],
    correctAnswer: 1,
    explanation: "IAvensiaAssociationRepository extends the standard Optimizely repository with the GetAssociationsByTarget method."
  },
  {
    id: 45,
    type: 'single',
    text: "What is the purpose of the 'UploadAssets' idempotent migration in the Nitro error handling flow?",
    options: [
      "To upload product images to the CDN",
      "To copy current frontend assets to a 'oldassets' blob container to prevent 404s after a new deploy",
      "To minify CSS files during runtime",
      "To sync the database with Azure Blob Storage"
    ],
    correctAnswer: 1,
    explanation: "UploadAssets preserves historical frontend chunks (JS/CSS) so that users with cached pages don't encounter 404s when requesting old hashes after a deploy."
  },
  {
    id: 46,
    type: 'single',
    text: "In Elevate 3 (eSales), what is the purpose of 'presentation attributes'?",
    options: [
      "To define the CSS classes for products",
      "To limit the response to only specific attributes, reducing data transfer and improving performance",
      "To mark which products are currently on sale",
      "To define the layout of the product grid"
    ],
    correctAnswer: 1,
    explanation: "Presentation attributes ensure that the API only returns the necessary data fields defined in the model (e.g., EsalesPartialProduct)."
  },
  {
    id: 47,
    type: 'single',
    text: "What is a major security 'gotcha' to remember when indexing custom properties in Elevate 4 (Esales4)?",
    options: [
      "Custom properties are encrypted and cannot be searched",
      "All indexed data is publicly available via the storefront API without an API key",
      "You can only index up to 5 custom properties",
      "Custom properties require a manual SQL update to be visible"
    ],
    correctAnswer: 1,
    explanation: "The storefront API in Elevate 4 does not use an API key, so sensitive data (like product cost) should never be indexed as a custom property."
  },
  {
    id: 48,
    type: 'boolean',
    text: "True or False: If you need to lock a purchase order for processing, you should use the standard Optimizely OrderRepository directly.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. You should use the EpiFoundation locking subsystem (LockManager.LoadWithLock) to prevent multiple jobs from operating on the same order simultaneously."
  },
  {
    id: 49,
    type: 'single',
    text: "Which controller handles 500 server errors and renders the static 500.cshtml page in Nitro5?",
    options: [
      "PageNotFoundController",
      "ErrorHandlingController",
      "ErrorCodeController",
      "SystemStatusController"
    ],
    correctAnswer: 2,
    explanation: "The ErrorCodeController is responsible for parsing the language and returning the 500 error view."
  },
  {
    id: 50,
    type: 'single',
    text: "How does the Redirector package handle a URL that doesn't exist but has a record in the 'ARPreviousContentUrls' table?",
    options: [
      "It displays a standard 404 page",
      "It triggers a full re-index of the site",
      "It automatically redirects the user to the current URL of that content",
      "It deletes the old record and bails out"
    ],
    correctAnswer: 2,
    explanation: "The Redirector package uses the historical data in ARPreviousContentUrls to find and redirect users to the renamed or moved content."
  },
  {
    id: 51,
    type: 'single',
    text: "Which Higher Order Component (HOC) should be used when the focusable element is a child of the outermost element?",
    options: [
      "createTabbingFocusElement()",
      "createTabbingFocusWithinElement()",
      "TabTrap",
      "EpiProperty"
    ],
    correctAnswer: 1,
    explanation: "createTabbingFocusWithinElement() is used when the focusable element is a child, such as a label wrapping an input."
  },
  {
    id: 52,
    type: 'single',
    text: "What is the primary protocol for accessing DXP databases in production using SQL Server Management Studio?",
    options: [
      "Use the site's connection string and password",
      "Connect using a shared team account",
      "Use your own personal account with 'Universal with MFA'",
      "Database access in DXP is strictly prohibited"
    ],
    correctAnswer: 2,
    explanation: "Users must use their own personal account with MFA and ensure an amendment is signed and their IP is whitelisted."
  },
  {
    id: 53,
    type: 'single',
    text: "In Azure Application Insights, where are logs found that do NOT have a corresponding System.Exception?",
    options: [
      "exceptions",
      "traces",
      "customEvents",
      "dependencies"
    ],
    correctAnswer: 1,
    explanation: "Logs without an exception, such as LogInformation, are sent to the 'traces' table, while those with exceptions go to 'exceptions'."
  },
  {
    id: 54,
    type: 'single',
    text: "According to Nitro guidelines, where should sensitive settings like API keys and passwords be stored?",
    options: [
      "appsettings.json",
      "Octopus variables",
      "Azure KeyVault",
      "web.config"
    ],
    correctAnswer: 2,
    explanation: "All sensitive settings must be stored in Azure KeyVault, which is accessed via the PaaS portal."
  },
  {
    id: 55,
    type: 'single',
    text: "What happens to the version numbers in AssemblyInfo.cs during a local build?",
    options: [
      "They match the latest git tag",
      "They are automatically bumped by one",
      "They will always be 0.0.0",
      "They are pulled from appsettings.json"
    ],
    correctAnswer: 2,
    explanation: "For local builds, the version will always be 0.0.0 because the automatic file containing the version is only generated during production builds."
  },
  {
    id: 56,
    type: 'single',
    text: "How are customer-unique prices added to variants in a B2B scenario?",
    options: [
      "Using the Optimizely Commerce UI",
      "Setting a PriceGroup via the PriceImport API endpoint",
      "Hardcoding them in a custom price service",
      "They are calculated automatically based on the organization name"
    ],
    correctAnswer: 1,
    explanation: "Customer unique prices require specifying a PriceGroup via the 'api/PriceImport' endpoint as they cannot be added via the UI."
  },
  {
    id: 57,
    type: 'single',
    text: "What is the Nitro5 replacement for the StructureMap '.DecorateAllWith()' method?",
    options: [
      "services.AddDecorator()",
      "The Scrutor extension method 'services.Decorate<T, TDecorator>()'",
      "services.AddTransientWithWrapper()",
      "Decoration is no longer supported in .NET Core"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 uses the Scrutor library to provide the 'Decorate' extension method for the Microsoft DI container."
  },
  {
    id: 58,
    type: 'single',
    text: "How does Nitro ensure events reach Facebook even if the user blocks client-side tracking?",
    options: [
      "By using a tracking proxy",
      "Implementing a 'redundant setup' with both Facebook Pixel and Conversions API",
      "Forcing the user to disable ad-blockers",
      "It is not possible to track events if the client blocks them"
    ],
    correctAnswer: 1,
    explanation: "A redundant setup sends events from both the client (Pixel) and server (CAPI), using de-duplication to identify unique events."
  },
  {
    id: 59,
    type: 'single',
    text: "When adding a themed favicon, what is a critical requirement for DXP deployment?",
    options: [
      "The icon must be in .ico format",
      "The folder name must match the theme name's casing exactly",
      "The icon must be larger than 512x512",
      "Themes do not support custom favicons"
    ],
    correctAnswer: 1,
    explanation: "Because DXP runs on Linux, folder names are case-sensitive. The favicon folder must match the theme name's casing to be found."
  },
  {
    id: 60,
    type: 'single',
    text: "Why does Nitro5 support preloading of local fonts by default?",
    options: [
      "To enable custom font colors",
      "To avoid Flash Of Unstyled Text (FOUT) and Cumulative Layout Shift (CLS)",
      "To reduce the size of the CSS files",
      "To allow the use of system fonts only"
    ],
    correctAnswer: 1,
    explanation: "Preloading critical resources like woff2 fonts ensures they are loaded early in the rendering pipeline, preventing visual stability issues."
  },
  {
    id: 61,
    type: 'single',
    text: "What is the recommended file naming convention for non-React component files (hooks, utilities, etc.) in Nitro5?",
    options: [
      "PascalCase",
      "camelCase",
      "lower-kebab-case",
      "UPPER_SNAKE_CASE"
    ],
    correctAnswer: 2,
    explanation: "Nitro5 guidelines specify lower-kebab-case for hooks, utilities, and configs, while PascalCase is reserved for React components."
  },
  {
    id: 62,
    type: 'single',
    text: "One week before go-live, what is the recommended change for the DNS TTL (Time-To-Live)?",
    options: [
      "Increase it to 24 hours",
      "Lower it to a minimum value (e.g., 10 minutes)",
      "Disable the TTL entirely",
      "TTL should not be changed during go-live"
    ],
    correctAnswer: 1,
    explanation: "Lowering the TTL ensures that host name changes take effect quickly across the internet during the actual go-live day."
  },
  {
    id: 63,
    type: 'single',
    text: "What is the primary role of the 'Nitro Core Team' at Avensia?",
    options: [
      "To manage all customer projects directly",
      "To work 100% on the Nitro product, its architecture, and packages",
      "To handle sales and marketing for Optimizely",
      "To provide 24/7 server support for DXP"
    ],
    correctAnswer: 1,
    explanation: "The Nitro Core Team is a dedicated unit focused on developing the accelerator, its architecture, and maintaining core packages."
  },
  {
    id: 64,
    type: 'single',
    text: "Which command is used to emulate Azure Blob Storage locally for features like the Google Product Feed?",
    options: [
      "nitro start-storage",
      "azurite.exe",
      "docker run azure-storage",
      "StorageEmulator.exe"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 recommends using Azurite for local blob emulation, which is bundled with Visual Studio 2022."
  },
  {
    id: 65,
    type: 'single',
    text: "In Nitro5, what is the default behavior of 'Inbound Integrations' (like Price or Stock imports)?",
    options: [
      "They process data immediately and return the result",
      "They add messages to a queue for background processing to protect site performance",
      "They write directly to the Episerver cache",
      "They trigger a full site re-index automatically"
    ],
    correctAnswer: 1,
    explanation: "Most inbound integrations use the Nitro queue system to ensure that heavy data imports do not degrade the performance of the web site."
  },
  {
    id: 66,
    type: 'single',
    text: "Which Nitro5 component is responsible for handling themed favicons based on the active theme?",
    options: [
      "ManifestController",
      "FaviconMiddleware",
      "ThemeLayoutService",
      "LayoutModelBase"
    ],
    correctAnswer: 1,
    explanation: "The FaviconMiddleware in Avensia.Nitro5.SiteInfra is responsible for locating and serving the correct favicon from the theme's folder."
  },
  {
    id: 67,
    type: 'single',
    text: "How does the Instagram block maintain access to the Instagram API without manual intervention?",
    options: [
      "By using a permanent, non-expiring token",
      "A background job periodically refreshes the Access Token",
      "The user must log in once per week to the site",
      "It uses the Facebook Pixel for authentication"
    ],
    correctAnswer: 1,
    explanation: "The Instagram block includes a background job designed to periodically refresh the required access token automatically."
  },
  {
    id: 68,
    type: 'single',
    text: "In Nitro5, what is used to resolve image resizing locally versus in the DXP environment?",
    options: [
      "ImageResizer.net is used in both",
      "SkiaSharp locally and Cloudflare Image Resizing in DXP",
      "Photoshop API locally and Akamai in DXP",
      "Static images only locally and SkiaSharp in DXP"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 uses SkiaSharp for local development and offloads processing to Cloudflare's edge resizing service in DXP."
  },
  {
    id: 69,
    type: 'single',
    text: "What endpoint can be used to monitor the health of Nitro background jobs in a production environment?",
    options: [
      "/health",
      "/JobHealthCheck",
      "/api/jobs/status",
      "/admin/jobs/monitor"
    ],
    correctAnswer: 1,
    explanation: "The /JobHealthCheck endpoint returns a 500 error if monitored jobs fail or encounter issues, allowing for external monitoring."
  },
  {
    id: 70,
    type: 'single',
    text: "When syncing the latest changes from the 'nitro5-develop' branch to a project, what is the recommended git command sequence?",
    options: [
      "git pull origin nitro5-develop",
      "git remote add nitro5 <url> followed by git merge nitro5/nitro5-develop",
      "git clone nitro5 --force",
      "Copy-paste the files from the Nitro repo"
    ],
    correctAnswer: 1,
    explanation: "The recommended flow is to add Nitro as a remote, fetch the develop branch, and then merge it into the project branch."
  },
  {
    id: 71,
    type: 'boolean',
    text: "True or False: Internal error emails (like order export failures) are sent via the same SendGrid configuration as customer newsletters.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. Internal emails are sent via a separate, dedicated SMTP configuration specified in the 'Nitro:InternalEmails' settings."
  },
  {
    id: 72,
    type: 'single',
    text: "What is the primary master for 'Contact' data when Nitro is integrated with a CRM like Voyado?",
    options: [
      "Optimizely Commerce",
      "The CRM (Voyado/HubSpot)",
      "The Nitro Commerce Database",
      "The ERP system"
    ],
    correctAnswer: 1,
    explanation: "While Optimizely is master of the User (credentials), the CRM is the master for all Contact/Profile information."
  },
  {
    id: 73,
    type: 'single',
    text: "How does the Nitro5 migration system ensure that a specific migration only runs once per environment?",
    options: [
      "By deleting the migration class after execution",
      "By storing the migration name in the tblBigTable in the Episerver database",
      "By checking the file creation date in the repository",
      "By requiring a manual approval in Octopus Deploy"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 tracks migrated steps by storing the migration class name in the tblBigTable to prevent duplicate executions."
  },
  {
    id: 74,
    type: 'single',
    text: "When should you use an 'idempotent' migration instead of a standard migration?",
    options: [
      "For every database change to ensure safety",
      "Only when there is an explicit need for the migration to be able to run multiple times without side effects",
      "When creating a new database table for the first time",
      "Idempotent migrations are deprecated in Nitro5"
    ],
    correctAnswer: 1,
    explanation: "Standard migrations are preferred for one-time tasks like table creation; idempotent migrations are reserved for logic that specifically requires repeatable execution."
  },
  {
    id: 75,
    type: 'single',
    text: "In Nitro5, how can a developer reset a migration's status to run it again during development?",
    options: [
      "Delete the migration file and recreate it",
      "Execute a SQL DELETE statement against tblBigTable for that specific migration name",
      "Restart the IIS/Kestrel server",
      "Run the 'nitro clean' command"
    ],
    correctAnswer: 1,
    explanation: "Executing a SQL delete for the migration's name in tblBigTable clears the 'migrated' status, allowing it to run again on the next startup."
  },
  {
    id: 76,
    type: 'single',
    text: "What is the primary technical difference between 'Multisite' and 'Multi-language' in Nitro5?",
    options: [
      "Multisite requires multiple databases; Multi-language uses one",
      "Multisite uses unique startpages and site settings; Multi-language translates content within the same structure",
      "Multisite is for B2B; Multi-language is for B2C",
      "There is no technical difference; they are the same concept"
    ],
    correctAnswer: 1,
    explanation: "Multisite is defined by having multiple site definitions with unique startpages and settings, whereas multi-language handles translations of content."
  },
  {
    id: 77,
    type: 'single',
    text: "Which load testing tool is recommended for Nitro5 to simulate virtual users and analyze site performance?",
    options: [
      "JMeter",
      "Locust",
      "K6",
      "LoadRunner"
    ],
    correctAnswer: 2,
    explanation: "K6 is the recommended tool for load testing Nitro5, and the wiki provides templates for writing performance scripts."
  },
  {
    id: 78,
    type: 'single',
    text: "What is the benefit of the 'frontend:generate-translation-keys-type' task in the Nitro build process?",
    options: [
      "It translates English keys into other languages automatically",
      "It creates a TypeScript definition file providing intellisense and typechecking for translation keys",
      "It minifies the XML translation files for production",
      "It uploads the keys to a 3rd party translation service"
    ],
    correctAnswer: 1,
    explanation: "This task generates a .d.ts file that allows developers to get intellisense when using the translate() function in React."
  },
  {
    id: 79,
    type: 'single',
    text: "How should you specify a project-specific max request length for a specific endpoint (like PIM import) in Nitro5?",
    options: [
      "Modify the global web.config file",
      "Use custom middleware to set IHttpMaxRequestBodySizeFeature for that specific request path",
      "Change the RAM allocation on the Azure App Service",
      "It is not possible to set limits per-endpoint in .NET 8"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 uses targeted middleware to adjust the MaxRequestBodySize feature for specific segments like /pimdatareceiver."
  },
  {
    id: 80,
    type: 'single',
    text: "When merging a PR in nitro5-packages, what is the purpose of the 'garn tag-version' command?",
    options: [
      "To create an unstable release candidate (rc)",
      "To create a stable release and update the RELEASE_NOTES.md",
      "To push the code to the project repository",
      "To delete old branches from GitHub"
    ],
    correctAnswer: 1,
    explanation: "The tag-version task is used for stable releases; it manages the version bump and prompts the developer to update the release notes."
  },
  {
    id: 81,
    type: 'single',
    text: "In the DXP 'Project Migration' process, what does the 'Start Migration' button actually do?",
    options: [
      "It deletes the existing Windows site",
      "It provisions the new Linux project and the new integration environment in parallel",
      "It copies all production data to the developer's local machine",
      "It automatically updates all NuGet packages to the latest version"
    ],
    correctAnswer: 1,
    explanation: "The migration process provisions a new Linux-based DXP environment that lives in parallel with the existing Windows environment."
  },
  {
    id: 82,
    type: 'boolean',
    text: "True or False: Because DXP Linux is case-sensitive, you must ensure themed favicon folders match the theme name's casing exactly.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. Linux file systems are case-sensitive, and mismatched casing in folder names will prevent the site from finding themed assets like favicons."
  },
  {
    id: 83,
    type: 'single',
    text: "According to Nitro packaging guidelines, which design pattern should be used to allow projects to customize package logic?",
    options: [
      "Factory Pattern",
      "Strategy Pattern",
      "Template Method Pattern",
      "Singleton Pattern"
    ],
    correctAnswer: 2,
    explanation: "The Template Method pattern is recommended, where an interface and an abstract base class are provided in the package, and the project creates a reference implementation."
  },
  {
    id: 84,
    type: 'single',
    text: "What is a 'Nitrospect' in the context of Avensia development?",
    options: [
      "A tool for inspecting network traffic",
      "A Pull Request in a project that is a potential candidate for being merged into Nitro core",
      "A specific type of SQL migration",
      "A automated testing suite for frontend components"
    ],
    correctAnswer: 1,
    explanation: "Nitrospect is a wordplay on 'nitro' and 'prospect,' referring to project PRs that are prospects for the Nitro product."
  },
  {
    id: 85,
    type: 'single',
    text: "Which value of 'appearanceWidth' in the PageLayout component limits the container to a maximum of 1280px?",
    options: [
      "narrow",
      "normal",
      "full",
      "standard"
    ],
    correctAnswer: 1,
    explanation: "The 'normal' appearanceWidth sets the PageLayout to not exceed 1280px in width."
  },
  {
    id: 86,
    type: 'single',
    text: "Why does Nitro use a custom '@avensia/observable' library instead of Redux or MobX for some features?",
    options: [
      "Redux is incompatible with .NET 8",
      "To reduce the bundle size sent to the end customer while still managing state updates",
      "Because third-party libraries do not support TypeScript",
      "To enable better integration with SQL Server"
    ],
    correctAnswer: 1,
    explanation: "Nitro uses a small, custom implementation to deal with state to reduce the amount of code sent to customers, as larger libraries often offer more than is needed."
  },
  {
    id: 87,
    type: 'single',
    text: "In the Nitro options pattern, which interface should be used for configuration that requires site or market-specific values?",
    options: [
      "IOptions<T>",
      "INitroOptions<T>",
      "IConfiguration",
      "ISiteSettings"
    ],
    correctAnswer: 1,
    explanation: "INitroOptions<T> allows for unique configuration values in appsettings.json for each site and market."
  },
  {
    id: 88,
    type: 'single',
    text: "In the standard Nitro order flow, what status is assigned to a purchase order immediately after it is placed on checkout?",
    options: [
      "Completed",
      "Pending",
      "InProgress",
      "OnHold"
    ],
    correctAnswer: 2,
    explanation: "When an order is placed, the cart is converted to a purchase order with the status 'InProgress' before being exported to the ERP."
  },
  {
    id: 89,
    type: 'single',
    text: "How are order numbers uniquely identified across different environments (Integration, Preprod, Prod) to prevent collisions?",
    options: [
      "By using a GUID",
      "By applying environment-specific prefixes (e.g., 'INT', 'PREP', 'O')",
      "By using different SQL databases",
      "Order numbers are not unique across environments"
    ],
    correctAnswer: 1,
    explanation: "Nitro uses prefixes like 'INT' for integration and 'O' for production to prevent order number collisions between environments."
  },
  {
    id: 90,
    type: 'single',
    text: "What is the mandatory versioning standard for all Nitro5 packages?",
    options: [
      "Sequential Versioning",
      "Semantic Versioning (SemVer)",
      "Date-based Versioning",
      "Git Hash Versioning"
    ],
    correctAnswer: 1,
    explanation: "Nitro5 packages strictly follow Semantic Versioning (semver.org)."
  },
  {
    id: 91,
    type: 'single',
    text: "In a Nitro5 package structure, where is the metadata defining build tasks, dependencies, and the NuGet ID located?",
    options: [
      "src/Properties/AssemblyInfo.cs",
      "buildsystem/index.ts",
      "README.md",
      "appsettings.json"
    ],
    correctAnswer: 1,
    explanation: "The buildsystem/index.ts file contains the metadata for the package, including projects to be built, dependencies, and build tasks."
  },
  {
    id: 92,
    type: 'boolean',
    text: "True or False: To include CMS blocks in a package, you must generate TypeScript definitions for the block's viewmodel using tstypegen.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. Including CMS blocks in a package requires tstypegen to generate the necessary TypeScript definitions for the frontend component."
  },
  {
    id: 93,
    type: 'single',
    text: "What is the primary purpose of the 'PriceHistory' package in Nitro?",
    options: [
      "To track inflation rates in different markets",
      "To support the European price directive by storing the lowest price within the last 30 days",
      "To provide a graph of price trends for customers on the PDP",
      "To sync prices between Optimizely and the ERP in real-time"
    ],
    correctAnswer: 1,
    explanation: "The PriceHistory package was implemented to comply with the European price directive, tracking historical price changes."
  },
  {
    id: 94,
    type: 'single',
    text: "How does Nitro handle situations where a price or stock update for a SKU arrives before the SKU itself is created from PIM?",
    options: [
      "The message is discarded and must be resent by the ERP",
      "The message is kept in an error state in the queue and can be programmatically retried via 'RetryIfExists'",
      "The SKU is automatically created with dummy data",
      "The system pauses all imports until the SKU is found"
    ],
    correctAnswer: 1,
    explanation: "Nitro's queue system allows for retrying messages if a dependency (like a SKU) was missing when the message first arrived."
  },
  {
    id: 95,
    type: 'single',
    text: "In the context of the Quick Order page, how can visitors add a large number of items to their cart at once?",
    options: [
      "By scanning barcodes with a mobile camera",
      "By uploading an Excel file with article numbers and quantities",
      "By using a voice-activated search",
      "By syncing with their LinkedIn profile"
    ],
    correctAnswer: 1,
    explanation: "The Quick Order feature supports Excel uploads using the OpenXml library to allow for bulk adding of items to the cart."
  },
  {
    id: 96,
    type: 'single',
    text: "If you are adding a new feature to a package that is backwards compatible, which part of the version number should be bumped?",
    options: [
      "MAJOR (first digit)",
      "MINOR (second digit)",
      "PATCH (third digit)",
      "BETA (suffix)"
    ],
    correctAnswer: 1,
    explanation: "According to Semantic Versioning guidelines in Nitro, new features without breaking changes require a MINOR version bump."
  },
  {
    id: 97,
    type: 'single',
    text: "What is the recommended maximum image size for resources being transferred from inRiver PIM to Optimizely?",
    options: [
      "1024 x 1024 pixels",
      "1920 x 1920 pixels",
      "3000 x 3000 pixels",
      "No limit, as Nitro resizes them anyway"
    ],
    correctAnswer: 1,
    explanation: "While Nitro can resize images, it is recommended to limit them to 1920px to avoid wasting bandwidth."
  },
  {
    id: 98,
    type: 'single',
    text: "How does Nitro prevent search engines from indexing non-public domains like integration or pre-production environments?",
    options: [
      "By requiring a VPN to access those domains",
      "By using Robots.txt, the X-Robots-Tag header, and the 'noindex' meta tag simultaneously",
      "By deleting the search index every night",
      "By IP-blocking all traffic from known Googlebot ranges"
    ],
    correctAnswer: 1,
    explanation: "Nitro applies a three-layer defense (Robots.txt, HTTP headers, and Meta tags) to block crawlers on non-public domains."
  },
  {
    id: 99,
    type: 'single',
    text: "How can you reset the sequence for order numbers in the database if they need to be restarted?",
    options: [
      "Delete all rows in the PurchaseOrder table",
      "Run the SQL command: ALTER SEQUENCE OrderNumberSequence RESTART WITH <number>",
      "Change the prefix in appsettings.json",
      "Restart the IIS/Kestrel server"
    ],
    correctAnswer: 1,
    explanation: "Order numbers are generated via a SQL sequence that can be manually restarted or adjusted using standard T-SQL commands."
  },
  {
    id: 100,
    type: 'boolean',
    text: "True or False: The PIN code feature is active by default for local development environments to ensure security.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. The PIN code is typically inactive locally and enabled for DXP environments via Octopus transformations."
  },
  {
    id: 101,
    type: 'single',
    text: "In the Nitro PR checklist, what is the 'Multisite' requirement for new features?",
    options: [
      "The feature must have a different UI for every site",
      "The developer must verify if the feature works correctly for both single-site and multisite solutions",
      "The feature must be disabled for all sites except the primary one",
      "Every site must have a unique database"
    ],
    correctAnswer: 1,
    explanation: "Reviewers must ensure that new logic does not break multisite capabilities, such as site-specific settings or catalog access."
  },
  {
    id: 102,
    type: 'single',
    text: "Which global setting is used to let specific 'User Agents' like Lighthouse or Facebook through the PIN code protection?",
    options: [
      "Nitro:PinCode:AllowedUserAgents",
      "Nitro:Security:Whitelist",
      "Nitro:CrawlerAccess:Enabled",
      "Nitro:Appsettings:Bypass"
    ],
    correctAnswer: 0,
    explanation: "The PIN code middleware can be configured to allow specific automated tools to crawl the site for testing purposes."
  },
  {
    id: 103,
    type: 'single',
    text: "When migrating between DXP environments, what is a critical consideration regarding the production database copy?",
    options: [
      "It will automatically delete all existing users",
      "It will keep the state of the scheduled jobs exactly as they were on the old environment",
      "It will change the SQL collation to case-sensitive",
      "It will bypass all feature toggles"
    ],
    correctAnswer: 1,
    explanation: "When Optimizely makes a database copy for a migration, the state of the jobs is preserved from the source environment."
  },
  {
    id: 104,
    type: 'single',
    text: "Which command is used to automate the creation and cloning of an Octopus Deploy project for Nitro5?",
    options: [
      "nitro clone-octopus",
      "nitro setup-octopus",
      "nitro init-deploy",
      "nitro create-release"
    ],
    correctAnswer: 1,
    explanation: "The 'nitro setup-octopus' command automates the cloning of the 'Nitro5 Template' project in Octopus Deploy."
  },
  {
    id: 105,
    type: 'single',
    text: "In the context of Raygun error tracking, what is the purpose of providing an 'applicationId' in the buildsystem config?",
    options: [
      "To enable real-time monitoring of SQL queries",
      "To allow the buildsystem to automatically upload Javascript source maps",
      "To link the Raygun account to the Azure PaaS portal",
      "To trigger a re-index of the site on every error"
    ],
    correctAnswer: 1,
    explanation: "Providing the applicationId is required for the buildsystem to upload sourcemaps so Raygun can resolve minified code."
  },
  {
    id: 106,
    type: 'single',
    text: "What is the primary difference between the standard Optimizely 'Search & Navigation Content Indexing Job' and Nitro's 'Find indexing' jobs?",
    options: [
      "The standard job is only for images, while Nitro's is for products",
      "The standard job provides the initial full index, while Nitro's jobs handle specific Nitro data structures",
      "The standard job runs in the browser, while Nitro's runs on the server",
      "There is no difference; they are redundant"
    ],
    correctAnswer: 1,
    explanation: "The standard Optimizely job should be run once initially, but subsequent indexing is handled by Nitro-specific jobs."
  },
  {
    id: 107,
    type: 'single',
    text: "How are credentials for the internal SendGrid SMTP (used for error emails in DXP) obtained?",
    options: [
      "They are hardcoded in the Avensia.Common package",
      "They are generated in the Optimizely PaaS portal under the 'API' tab",
      "They are requested via a ticket to the Google Cloud team",
      "They are identical to the project's Voyado API keys"
    ],
    correctAnswer: 1,
    explanation: "Internal email credentials are generated specifically within the PaaS portal."
  },
  {
    id: 108,
    type: 'single',
    text: "According to the search UX guidelines, how many suggestions should be shown to a user typing in the search box on a desktop?",
    options: [
      "Exactly 3",
      "Maximum of 5",
      "Maximum of 9",
      "Unlimited until the user stops typing"
    ],
    correctAnswer: 2,
    explanation: "Nitro search suggestions are limited to 9 on desktop and 5 on mobile to maintain clean UX."
  },
  {
    id: 109,
    type: 'single',
    text: "Which technology does Nitro use to perform Server-Side Rendering (SSR) by running the frontend React code within .NET?",
    options: [
      "Node.js via a sidecar container",
      "ClearScript (wrapping the V8 engine)",
      "Native ASP.NET Razor engine",
      "WebAssembly"
    ],
    correctAnswer: 1,
    explanation: "Nitro uses ClearScript to run the V8 JavaScript engine inside the .NET process for SSR."
  },
  {
    id: 110,
    type: 'single',
    text: "In which of the following scenarios is Server-Side Rendering (SSR) forced ON by default in Nitro?",
    options: [
      "When the user is logged in as an administrator",
      "For user agents 'googlebot' and 'bingbot'",
      "When the request comes from a mobile app",
      "When the server is under high CPU load"
    ],
    correctAnswer: 1,
    explanation: "To ensure SEO performance, Nitro forces SSR for major search engine crawlers like Google and Bing."
  },
  {
    id: 111,
    type: 'single',
    text: "What is the recommended status for the Service Worker in new Nitro5 projects?",
    options: [
      "Enabled for all environments",
      "Enabled only for local development",
      "Discontinued/Disabled",
      "Mandatory for PWA compliance"
    ],
    correctAnswer: 2,
    explanation: "The Service Worker has been discontinued in Nitro5, and it is recommended that projects do not use it."
  },
  {
    id: 112,
    type: 'boolean',
    text: "True or False: When running the upgrade-assistant, you should aim to get the solution to run correctly before attempting a successful build.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. The goal is to get the solution to build first, even if logic is commented out with TODOs."
  },
  {
    id: 113,
    type: 'single',
    text: "Which Nitro job is responsible for generating XML sitemaps by extracting data from the content index?",
    options: [
      "FullFindIndexJob",
      "SitemapGeneratorJob",
      "GoogleProductFeedExportJob",
      "RobotsControllerJob"
    ],
    correctAnswer: 1,
    explanation: "SitemapGeneratorJob runs to extract products, categories, and pages from the index and store them as XML in Azure Blob Storage."
  },
  {
    id: 114,
    type: 'single',
    text: "What is a key benefit of the Nitro5 'Site Theming' architecture regarding performance?",
    options: [
      "It minifies the database size",
      "Theme-specific code is split into separate bundles, so users only load code for the active site",
      "It allows for real-time CSS editing in the backoffice",
      "It disables React for older browsers"
    ],
    correctAnswer: 1,
    explanation: "Theming in Nitro5 ensures optimal loading by placing site-specific logic in unique bundles."
  },
  {
    id: 115,
    type: 'single',
    text: "In the Nitro5 build process, when are Javascript sourcemaps automatically uploaded to Raygun?",
    options: [
      "On every local 'nitro build'",
      "During the 'Publish release' build configuration (triggered by a version tag)",
      "Whenever a developer saves a file in VS Code",
      "Only when a 500 error occurs in production"
    ],
    correctAnswer: 1,
    explanation: "Sourcemaps are uploaded during the 'Publish release' chain, specifically via the 'frontend:send-sourcemaps-to-raygun' task."
  },
  {
    id: 116,
    type: 'single',
    text: "To see readable stack traces in Chrome for minified production code, what must a developer do?",
    options: [
      "They can't; sourcemaps are only for Raygun",
      "Disable the 'SourceMapsMiddleware' in Startup.cs",
      "Log in as an Administrator to bypass the 'empty' sourcemaps served to public users",
      "Open the site in Incognito mode"
    ],
    correctAnswer: 2,
    explanation: "Nitro serves empty sourcemaps to the public, but the 'SourceMapsMiddleware' provides real maps to logged-in Administrators."
  },
  {
    id: 117,
    type: 'single',
    text: "When creating a Nitro5 package, where must you specify backend dependencies to ensure the resulting NuGet package is correct?",
    options: [
      "Only in the *.csproj file",
      "In both the *.csproj file and the 'dependencies' property in buildsystem/index.ts",
      "In the README.md file",
      "In the appsettings.json file"
    ],
    correctAnswer: 1,
    explanation: "The NuGet package creation relies on the metadata in buildsystem/index.ts to define dependencies."
  },
  {
    id: 118,
    type: 'single',
    text: "Which Nitro5 command is used to initially create empty CMS and Commerce databases for a new project?",
    options: [
      "nitro run-migrations",
      "nitro setup-dev-env",
      "nitro create-databases",
      "nitro download-backups"
    ],
    correctAnswer: 2,
    explanation: "'create-databases' is a task run during the new project setup that utilizes .sql files from the Episerver NuGet packages."
  },
  {
    id: 119,
    type: 'single',
    text: "What makes Nitro's 'AvensiaInventoryService' more reliable than the default Optimizely implementation for high-traffic checkouts?",
    options: [
      "It is written in TypeScript",
      "It uses 'TransactionScope' and proper SQL locks to prevent over-selling the last item",
      "It stores inventory in the search index instead of the database",
      "It disables the inventory check if the database is slow"
    ],
    correctAnswer: 1,
    explanation: "AvensiaInventoryService adds transaction safety by taking locks during the 'Request' process."
  },
  {
    id: 120,
    type: 'single',
    text: "In the standard Nitro5 TeamCity setup, which build configuration is responsible for verified builds of PRs and the 'develop' branch?",
    options: [
      "Continuous build",
      "Continuous deployment",
      "Publish release",
      "Nightly index"
    ],
    correctAnswer: 0,
    explanation: "The 'Continuous build' configuration automatically verifies develop and PRs to ensure the code builds and tests pass."
  },
  {
    id: 121,
    type: 'single',
    text: "When setting up the Nitro5 dev environment, what is the recommended action if you have IIS running on port 443?",
    options: [
      "Run the site on port 80 instead",
      "Stop all IIS sites on port 443 or stop the 'w3svc' service to avoid conflict with Kestrel",
      "Install a proxy to route traffic between IIS and Kestrel",
      "Uninstall IIS completely"
    ],
    correctAnswer: 1,
    explanation: "Since Nitro5 uses Kestrel, any IIS binding on 443 will conflict."
  },
  {
    id: 122,
    type: 'single',
    text: "How does the 'ScopeAsyncActionFilter' determine whether to return HTML or JSON in the Nitro SPA architecture?",
    options: [
      "Based on the browser version",
      "It always returns HTML first, then JSON",
      "It checks if the request is a 'Scope request' and if the result is a 'ReactViewComponentResult'",
      "By checking if the user is an Administrator"
    ],
    correctAnswer: 2,
    explanation: "Scope intercepts the request; if the controller uses 'Component.For()', Scope serializes the model to JSON."
  },
  {
    id: 123,
    type: 'boolean',
    text: "True or False: The @ComponentFor pragma is used by the build system to map a React component to its corresponding C# ViewModel.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. This pragma is scanned during the build to create the component registry."
  },
  {
    id: 124,
    type: 'single',
    text: "What happens during 'Hydration' in the Nitro lifecycle?",
    options: [
      "The database is refreshed with mock data",
      "The browser downloads the entire product catalog",
      "React attaches event handlers to the server-rendered static HTML",
      "The CSS-in-JS library generates new class names"
    ],
    correctAnswer: 2,
    explanation: "Hydration is the process where React takes the static HTML provided by SSR and attaches JavaScript event listeners."
  },
  {
    id: 125,
    type: 'single',
    text: "Which class in Nitro5 is responsible for emitting JSON-LD structured data for the start page and product pages?",
    options: [
      "JsonLdProvider",
      "JsonLdFactory",
      "StructuredDataService",
      "SchemaMarkupBuilder"
    ],
    correctAnswer: 1,
    explanation: "The JsonLdFactory class is responsible for creating the JSON-LD objects that help search engines interpret page content."
  },
  {
    id: 126,
    type: 'single',
    text: "What is the recommended tool for validating JSON-LD markup locally in the browser during development?",
    options: [
      "Postman",
      "Structured Data Testing Tool (browser extension)",
      "Google Search Console",
      "Raygun"
    ],
    correctAnswer: 1,
    explanation: "The 'Structured Data Testing Tool' extension is recommended for grabbing and validating JSON-LD directly from a page's source."
  },
  {
    id: 127,
    type: 'single',
    text: "Which HTML attribute does Nitro5 use as the standard for selecting elements in automated UI tests?",
    options: [
      "id",
      "class",
      "data-test-id",
      "automation-target"
    ],
    correctAnswer: 2,
    explanation: "Nitro5 uses 'data-test-id' as a stable attribute for querying DOM elements in tests."
  },
  {
    id: 128,
    type: 'single',
    text: "In the Nitro5 backend test environment, which library is used alongside MSTest for mocking dependencies?",
    options: [
      "Moq",
      "NSubstitute",
      "FakeItEasy",
      "Rhino Mocks"
    ],
    correctAnswer: 2,
    explanation: "Nitro5 backend tests are built using MSTest and the FakeItEasy library for creating fakes and mocks."
  },
  {
    id: 129,
    type: 'single',
    text: "What should a developer do if a frontend snapshot test fails but the new output is visually correct and intended?",
    options: [
      "Delete the snapshot file and rebuild",
      "Run 'nitro frontend:test-update' to commit the new snapshots",
      "Manually edit the .snap file in VS Code",
      "Snapshot tests cannot be updated; they must be fixed in code"
    ],
    correctAnswer: 1,
    explanation: "The 'test-update' command updates the Jest snapshots to match the new output."
  },
  {
    id: 130,
    type: 'single',
    text: "Which tool is used in Nitro5 for automated end-to-end (UI) tests that can record videos of the test runs?",
    options: [
      "Selenium",
      "Playwright",
      "Cypress",
      "Puppeteer"
    ],
    correctAnswer: 2,
    explanation: "Cypress is the standard tool in Nitro5 for automated UI tests."
  },
  {
    id: 131,
    type: 'single',
    text: "What is a major benefit of using Nitro's theming support in a multisite solution?",
    options: [
      "It automatically translates all site content",
      "Code and components belonging to Site B are not downloaded by users visiting Site A",
      "It allows editors to change the database schema per site",
      "It bypasses the need for a PIN code on integration"
    ],
    correctAnswer: 1,
    explanation: "Nitro's theming system uses separate bundles to ensure users only download relevant frontend code."
  },
  {
    id: 132,
    type: 'single',
    text: "How do you implement logic to determine which theme name to use for a specific HTTP request?",
    options: [
      "Configure it in appsettings.json only",
      "Implement the ICurrentTheme.GetCurrentThemeName() method",
      "Set a 'Theme' cookie in the browser",
      "Add a [Theme] attribute to the controller"
    ],
    correctAnswer: 1,
    explanation: "By implementing GetCurrentThemeName(), you can switch themes based on domain, site name, etc."
  },
  {
    id: 133,
    type: 'single',
    text: "Which React component must wrap the entire application to enable the use of Glitz themes throughout the UI?",
    options: [
      "ThemeProvider",
      "GlitzProvider",
      "SiteLayout/Container",
      "NitroApp"
    ],
    correctAnswer: 2,
    explanation: "The SiteLayout/Container component contains the Glitz ThemeProvider."
  },
  {
    id: 134,
    type: 'boolean',
    text: "True or False: If a frontend component dispatches the 'setTheme' action, the backend is automatically notified and will update the server-rendered HTML for the next load.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 1,
    explanation: "False. There is no built-in sync between frontend and backend theme states."
  },
  {
    id: 135,
    type: 'single',
    text: "When troubleshooting in DXP, what query parameter can be used to bypass Server-Side Rendering (SSR) and check if the error still occurs in the browser?",
    options: [
      "?no-ssr=1",
      "?ssr=off",
      "?disable-ssr=true",
      "?client-only=1"
    ],
    correctAnswer: 1,
    explanation: "Adding ?ssr=off to the URL is a standard troubleshooting step to determine if a rendering error is specific to SSR."
  },
  {
    id: 136,
    type: 'single',
    text: "Which C# attribute is primarily used by tstypegen to mark view models for frontend TypeScript generation?",
    options: [
      "[TsInterface]",
      "[GenerateTypeScriptDefinition]",
      "[ExportToFrontend]",
      "[MapToTypeScript]"
    ],
    correctAnswer: 1,
    explanation: "tstypegen scans for the [GenerateTypeScriptDefinition] attribute."
  },
  {
    id: 137,
    type: 'single',
    text: "In Nitro5, where should the `[assembly: GenerateTypeScriptNamespace(\"ProjectName\")]` attribute be placed?",
    options: [
      "Startup.cs",
      "AssemblyInfo.cs",
      "AssemblyVersionInfo.cs",
      "In the root index.ts file"
    ],
    correctAnswer: 1,
    explanation: "The namespace attribute must be added to AssemblyInfo.cs to instruct tstypegen on the output filename."
  },
  {
    id: 138,
    type: 'single',
    text: "What is the primary goal when first running the 'upgrade-assistant' on a legacy Nitro project?",
    options: [
      "To ensure all features work perfectly in .NET 8",
      "To get the solution to build, even if some logic is temporarily commented out",
      "To automatically migrate all StructureMap registrations to Microsoft DI",
      "To update the production database schema immediately"
    ],
    correctAnswer: 1,
    explanation: "The goal is to achieve a successful build first; stabilization follows after the build is green."
  },
  {
    id: 139,
    type: 'single',
    text: "What domain must Klarna Checkout (KCO) integrations migrate to before March 31, 2026?",
    options: [
      "api.klarnapay.com",
      "api.kustom.co",
      "checkout.klarna.se",
      "api.avensia-payments.com"
    ],
    correctAnswer: 1,
    explanation: "Due to the sale of KCO to Kustom, all API calls must transition to api.kustom.co."
  },
  {
    id: 140,
    type: 'single',
    text: "Which tool is recommended for uploading and restoring local database backups to the DXP Integration environment?",
    options: [
      "SQL Server Management Studio (SSMS) Import Wizard",
      "The EpiCloud PowerShell module",
      "The Azure Portal Data Factory",
      "Nitro Job Admin UI"
    ],
    correctAnswer: 1,
    explanation: "Nitro uses the EpiCloud PowerShell module to handle .bacpac file uploads and restorations in DXP."
  },
  {
    id: 141,
    type: 'single',
    text: "According to Nitro guidelines, why should you use IHttpClientFactory instead of instantiating a new HttpClient manually?",
    options: [
      "To bypass SSL certificate validation",
      "To prevent SNAT port exhaustion by managing the underlying HttpClientHandler lifecycle",
      "To automatically convert XML responses to JSON",
      "Because HttpClient is deprecated in .NET 8"
    ],
    correctAnswer: 1,
    explanation: "Using IHttpClientFactory ensures that underlying connections are pooled and reused efficiently."
  },
  {
    id: 142,
    type: 'single',
    text: "Where is the recommended place to create an HttpClient instance within a service class?",
    options: [
      "In the class constructor and stored in a private field",
      "Directly in the method where it is used (in-place)",
      "In a static global helper class",
      "In the Startup.cs file only"
    ],
    correctAnswer: 1,
    explanation: "The guideline is to create the client in-place using the factory within the specific method calling it."
  },
  {
    id: 143,
    type: 'single',
    text: "What is the primary use case for using **ngrok** in a Nitro development workflow?",
    options: [
      "To speed up local SQL queries",
      "To test external callbacks (e.g., from a PSP like Klarna) to a local development machine",
      "To minify frontend assets for production",
      "To deploy code directly to Azure"
    ],
    correctAnswer: 1,
    explanation: "Ngrok creates a public tunnel to a local environment, allowing external services to send webhooks."
  },
  {
    id: 144,
    type: 'boolean',
    text: "True or False: When using ngrok to test a Nitro site, you should typically use the `--host-header=rewrite` flag for Nitro classic projects.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. Rewriting the host header is often necessary for the local server to correctly route the request."
  },
  {
    id: 145,
    type: 'single',
    text: "What is the primary technical purpose of 'Virtual Categories' in Nitro?",
    options: [
      "To create categories that are only visible to mobile users",
      "To enable editors to create 'combination categories' for filtering without affecting SEO or breadcrumbs",
      "To allow products to belong to multiple catalogs simultaneously",
      "To store temporary products during a PIM migration"
    ],
    correctAnswer: 1,
    explanation: "Virtual categories are used by editors to create filters and are excluded from indexing."
  },
  {
    id: 146,
    type: 'single',
    text: "Where must the 'Virtuella kategorier' root node be located for the feature to function correctly?",
    options: [
      "Inside the CMS Pages tree",
      "Directly in the root of the Commerce Catalog",
      "As a sub-node of the 'All Products' category",
      "In the 'Global Assets' folder"
    ],
    correctAnswer: 1,
    explanation: "Nitro requires the virtual categories root node to be created specifically in the root of the catalog."
  },
  {
    id: 147,
    type: 'single',
    text: "What is a major advantage of using 'Virtual Discount Codes' over standard Optimizely discounts for newsletter distributions?",
    options: [
      "They allow for higher discount percentages",
      "They enable thousands of unique one-time-use codes to be associated with a single master discount",
      "They automatically calculate VAT for different regions",
      "They do not require a master discount to be created in Optimizely"
    ],
    correctAnswer: 1,
    explanation: "Virtual discounts allow for multiple codes to be associated with one Epi discount."
  },
  {
    id: 148,
    type: 'single',
    text: "When configuring a Virtual Discount in the Nitro Admin tool, which 'Type' should be selected to generate a batch of unique codes?",
    options: [
      "SingleCode",
      "Multicode",
      "Unlimited",
      "SystemGenerated"
    ],
    correctAnswer: 1,
    explanation: "The 'Multicode' type is used in the Virtual Discounts tool to manage a batch of coupon codes."
  },
  {
    id: 149,
    type: 'single',
    text: "When Voyado is enabled as the CRM provider, which system is considered the 'master' for contact and profile information?",
    options: [
      "Optimizely CMS",
      "Voyado",
      "The ERP system",
      "The local Nitro SQL database"
    ],
    correctAnswer: 1,
    explanation: "While Optimizely handles credentials, Voyado is the master for Profile and Contact information."
  },
  {
    id: 150,
    type: 'single',
    text: "How does Nitro link a user in Optimizely Commerce to their corresponding contact in Voyado?",
    options: [
      "Using the user's email address only",
      "Using the CrmId and CustomerNumber fields in the cls_Contact table",
      "Via a session cookie generated by the Voyado script",
      "They are not linked; the systems remain entirely separate"
    ],
    correctAnswer: 1,
    explanation: "The connection is maintained via the CrmId and CustomerNumber fields stored within the commerce database."
  },
  {
    id: 151,
    type: 'single',
    text: "In the context of the Voyado integration, what is required for product images to appear correctly in transactional emails?",
    options: [
      "The images must be uploaded directly to Voyado's servers",
      "Voyado must be able to access the site's Google Product Feed",
      "Images must be sent as Base64 strings in the API call",
      "Transactional emails do not support images"
    ],
    correctAnswer: 1,
    explanation: "Voyado uses the Google Product Feed to resolve and display product images within email templates."
  },
  {
    id: 152,
    type: 'single',
    text: "In the typical lifecycle of a Nitro project, what is 'Hypercare'?",
    options: [
      "The initial phase where requirements are gathered",
      "A two-week period after go-live where the team is fully available to fix production issues",
      "A specialized hosting tier for high-traffic sites",
      "The process of upgrading from Nitro Classic to Nitro5"
    ],
    correctAnswer: 1,
    explanation: "Hypercare is the phase immediately following go-live for rapid bug fixing."
  },
  {
    id: 153,
    type: 'single',
    text: "Which phase of a Nitro project involves a GAP-analysis between customer requirements and existing Nitro features?",
    options: [
      "Project startup (Sprint 0)",
      "Detailing phase",
      "Development phase",
      "UAT phase"
    ],
    correctAnswer: 1,
    explanation: "The detailing phase is where requirements are compared to Nitro's baseline."
  },
  {
    id: 154,
    type: 'boolean',
    text: "True or False: In a Voyado development environment, emails and SMS will only be sent to addresses that have been whitelisted.",
    options: [
      "True",
      "False"
    ],
    correctAnswer: 0,
    explanation: "True. To prevent accidental communication with real customers, Voyado requires manual whitelisting."
  }
];