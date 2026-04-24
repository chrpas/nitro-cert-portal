export interface ArticleContent {
  title: string;
  summary: string;
  body: string[];
  codeSnippets?: { language: string; code: string; label: string }[];
}

export const articleContent: Record<string, ArticleContent> = {
  "Introduction to Nitro": {
    title: "Introduction to Nitro",
    summary: "Nitro is an e-commerce project accelerator built on Optimizely CMS and Commerce.",
    body: [
      "The primary purpose of Nitro is to speed up delivery of customer projects by providing a battle-tested base.",
      "Nitro uses Optimizely CMS 12 and Commerce Connect 14.",
      "Nitro5 is the modern version built on .NET 8, while Nitro Classic was .NET Framework 4.7.2.",
      "It is built with a React frontend and a robust .NET backend, connected via the Scope SPA library."
    ],
    codeSnippets: [
      {
        language: "csharp",
        label: "Project Structure",
        code: "Avensia.Shop - The web application\nAvensia.Common - Core logic and features\nAvensia.Tests - Unit and integration tests"
      }
    ]
  },
  "Single Page Application": {
    title: "Single Page Application (SPA)",
    summary: "Nitro behaves as a fully-featured SPA while maintaining excellent SEO through Server-Side Rendering.",
    body: [
      "Nitro uses the 'Scope' package to handle SPA routing and state management.",
      "Initial page load is rendered on the server (SSR) for speed and indexing.",
      "Subsequent navigations only fetch JSON data, which React uses to update the view.",
      "SSR is performed using ClearScript, a .NET wrapper for the V8 JavaScript engine."
    ],
    codeSnippets: [
      {
        language: "typescript",
        label: "Scope Component Pragma",
        code: "/**\n * @ComponentFor Avensia.Common.Features.Start.StartPageViewModel\n */\nexport const StartPage = (props) => { ... }"
      }
    ]
  },
  "Migrations": {
    title: "Data Migrations",
    summary: "Programmatic model changes and data population across all environments.",
    body: [
      "Migrations ensure that database changes (columns, tables, meta-fields) are synced across local, integration, and production DBs.",
      "All migrations must inherit from the IMigration interface.",
      "Nitro automatically discovers these classes if their names start with 'Avensia'.",
      "Naming convention: M[Date]_[Time]_Name (e.g., M20230522_1000_Initial)."
    ],
    codeSnippets: [
      {
        language: "csharp",
        label: "IMigration Interface",
        code: "public class M20230522_AddColorField : IMigration {\n  public void Up() { /* logic */ }\n}"
      }
    ]
  },
  "Jobs": {
    title: "Background Jobs",
    summary: "Managing repeatable, long-running tasks in the Nitro ecosystem.",
    body: [
      "Jobs run in the background at preset intervals (schedulers).",
      "They are used for things like price imports, PIM syncs, and sitemap generation.",
      "In Nitro5, all jobs must implement INitroJob and use the [NitroJob] attribute.",
      "Nitro offers a custom Job Admin UI within the Backoffice for manual triggers."
    ]
  },
  "Frontend": {
    title: "Frontend Development",
    summary: "Modern React-based UI development with high performance and theming support.",
    body: [
      "State Management: Uses Redux for global state.",
      "Styling: Uses Glitz, a CSS-in-JS library developed by Avensia.",
      "Global State: Access shared data through window.APP_SHELL_DATA and window.CURRENT_PAGE.",
      "Type Safety: tstypegen automatically generates TypeScript interfaces from C# ViewModels."
    ],
    codeSnippets: [
      {
        language: "typescript",
        label: "Accessing AppShell",
        code: "const settings = useSelector(state => state.appShellData.siteSettings);"
      }
    ]
  },
  "Setting up the dev environment": {
    title: "Setting up the dev environment",
    summary: "Configuring your local machine for Nitro5 development.",
    body: [
      "Prerequisites: VS 2022, .NET 8 SDK, SQL Server with mixed auth.",
      "Network: Requires VPN access to Avensia networks for package servers.",
      "CLI: Use 'nitro setup-dev-env' to initialize the project.",
      "SSL: Run 'setup-certificates' to enable local HTTPS support."
    ]
  }
};
