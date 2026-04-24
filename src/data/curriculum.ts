export interface Section {
  title: string;
  items: string[];
}

export interface Module {
  id: string;
  title: string;
  sections: Section[];
}

export const curriculumHierarchy: Module[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    sections: [
      {
        title: "Basics",
        items: ["Setting up the dev environment", "Changes in Nitro5"]
      }
    ]
  },
  {
    id: "contributing",
    title: "Contributing",
    sections: [
      {
        title: "Nitro Community",
        items: ["Contributing to Nitro", "Nitrospects"]
      }
    ]
  },
  {
    id: "onboarding",
    title: "Onboarding",
    sections: [
      {
        title: "Core Curriculum",
        items: [
          "Introduction to Nitro",
          "Development of Nitro",
          "Working in a Nitro project",
          "Single Page Application",
          "Migrations",
          "Jobs",
          "Queues",
          "Localization",
          "Troubleshooting",
          "Accessibility",
          "Integrations (API endpoints)",
          "Content index",
          "Content Processing",
          "Customers and Organizations",
          "Stock & Inventory",
          "Order flow",
          "A/B tests",
          "Backoffice"
        ]
      }
    ]
  },
  {
    id: "developing",
    title: "Developing",
    sections: [
      {
        title: "Backend Coding Guidelines",
        items: [
          "Coding guidelines (backend)",
          "Options",
          "Appsettings",
          "Using HttpClient",
          "Dependency Injection",
          "Packaging guidelines"
        ]
      },
      {
        title: "Nitro5 Packages How-tos",
        items: [
          "Debug packages",
          "Upgrade packages",
          "Modify an existing package",
          "Creating a new package",
          "Tips n tricks"
        ]
      },
      {
        title: "Developer Tools/Features",
        items: [
          "Application Insights & Logging",
          "Buildsystem",
          "Developer database",
          "Tests (unit tests, integration tests, UI tests, load tests)",
          "Accounts"
        ]
      },
      {
        title: "Frontend",
        items: [
          "Coding guidelines (frontend)",
          "CURRENT_PAGE and APP_SHELL_DATA",
          "Image resizing",
          "Font preloading",
          "Theming",
          "Sourcemaps",
          "tstypegen",
          "Service worker",
          "Observables",
          "ESLint & prettier",
          "Browser strategy",
          "Server side rendering (ssr)"
        ]
      }
    ]
  },
  {
    id: "how-tos",
    title: "How-tos",
    sections: [
      {
        title: "Practical Guides",
        items: [
          "Cherry pick commits from nitro",
          "Add payments/shipments/markets (countries.json)",
          "Create new database backups",
          "Work with Azure blob storage",
          "Reset the order number sequence",
          "Accessing databases in DXP",
          "Using ngrok",
          "Creating a new payment gateway",
          "Creating a new shipping plugin",
          "Uploading a database to DXP"
        ]
      }
    ]
  },
  {
    id: "features",
    title: "Features",
    sections: [
      {
        title: "E-commerce Capabilities",
        items: [
          "Abandoned cart notifications",
          "Back in stock notifications",
          "B2B",
          "Esales",
          "Esales4",
          "Error pages - 500, 404",
          "Facebook Conversions API",
          "Feature toggles",
          "Google Feed",
          "Google Tag Manager (GA4)",
          "Instagram block",
          "Optimizely Feature Experimentation",
          "PIN code",
          "Price history",
          "Robots",
          "Search",
          "Sitemap",
          "Structured data (JSON-LD)",
          "Test-ids",
          "Virtual categories",
          "Virtual discounts",
          "Voyado"
        ]
      }
    ]
  },
  {
    id: "nitro-projects",
    title: "Nitro Projects",
    sections: [
      {
        title: "Project Management",
        items: [
          "Starting a new Nitro5 project",
          "Detailing a Nitro5 project",
          "Go-live checklist",
          "List of all Nitro Projects"
        ]
      }
    ]
  },
  {
    id: "setting-up",
    title: "Setting up...",
    sections: [
      {
        title: "Infrastucture & Services",
        items: [
          "Setting up TeamCity",
          "Setting up Octopus",
          "Setting up SendGrid (email/SMTP)",
          "Setting up RayGun",
          "Setting up DXP",
          "Setting up Slack",
          "Setting up Search & Navigation (Find)"
        ]
      }
    ]
  },
  {
    id: "upgrade",
    title: "Upgrade to Nitro5",
    sections: [
      {
        title: "Migration Paths",
        items: [
          "Upgrading to Nitro5",
          "Backend upgrade tips & tricks",
          "Migrate DXP project",
          "Build during upgrade"
        ]
      }
    ]
  },
  {
    id: "core-team",
    title: "Nitro Core Team",
    sections: [
      {
        title: "Internal Operations",
        items: ["The Nitro Core Team", "Release notes generation"]
      }
    ]
  }
];
