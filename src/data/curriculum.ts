import { Question, Section, Module } from '../db/db';

export const curriculumHierarchy: Module[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    sections: [
      {
        title: "Basics",
        items: ["Setting up the dev environment", "Changes in Nitro5"]
      }
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "Which CLI command is the primary entry point for setting up a local Nitro5 development environment?",
        options: ["nitro build", "nitro setup-dev-env", "npm run setup", "dotnet nitro setup"],
        correctAnswer: 1,
        explanation: "The 'nitro setup-dev-env' command initializes the environment, certificates, and local databases."
      },
      {
        id: 2,
        type: 'multiple',
        text: "Which of the following are prerequisites for setting up a Nitro5 development environment?",
        options: ["Visual Studio 2022", ".NET 8 SDK", "Node.js (for frontend tooling)", "SQL Server with Mixed Mode Auth"],
        correctAnswer: [0, 1, 2, 3],
        explanation: "All listed tools are essential for the full-stack development experience in Nitro5."
      },
      {
        id: 3,
        type: 'boolean',
        text: "Nitro5 is compatible with .NET Framework 4.7.2.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "False. Nitro5 is built on the modern .NET 8 (Core) platform. Nitro Classic was on .NET Framework."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "What is the primary branch for Nitro core development contributions?",
        options: ["master", "develop", "main", "nitro-next"],
        correctAnswer: 1,
        explanation: "Contributions are typically targeted towards the 'develop' branch before being released to master/main."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "What is the primary role of the 'Scope' package in Nitro?",
        options: ["Generating SQL Migrations", "Managing SPA behavior and hydration", "Resizing images", "Handling background jobs"],
        correctAnswer: 1,
        explanation: "Scope manages the serialization of ViewModels and handles the client-side routing for the Single Page Application."
      },
      {
        id: 2,
        type: 'boolean',
        text: "Nitro uses ClearScript to perform Server-Side Rendering (SSR).",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. Nitro uses ClearScript to execute React code on the server side using the V8 engine."
      },
      {
        id: 3,
        type: 'multiple',
        text: "Which of the following are standard features of a Nitro5 background job?",
        options: ["Implements INitroJob", "Uses [NitroJob] attribute", "Automatic tracking via Application Insights", "Can be triggered via Backoffice tools"],
        correctAnswer: [0, 1, 2, 3],
        explanation: "Nitro background jobs are highly integrated with the ecosystem, providing logging, attributes, and administrative controls."
      },
      {
        id: 4,
        type: 'single',
        text: "In the Nitro order flow, where is the initial payment request usually triggered?",
        options: ["Backend only", "Client-side only", "In the Checkout React component", "Via a scheduled job"],
        correctAnswer: 2,
        explanation: "Payment is typically initiated from the frontend checkout interface before being validated on the server."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "What is the primary function of 'tstypegen' in a Nitro project?",
        options: ["Minifying production assets", "Generating TypeScript interfaces from C# ViewModels", "Running unit tests", "Deploying to DXP"],
        correctAnswer: 1,
        explanation: "tstypegen ensures type safety between the backend and frontend by automatically generating TS interfaces from your C# models."
      },
      {
        id: 2,
        type: 'boolean',
        text: "Nitro5 uses ClearScript to perform Server Side Rendering (SSR).",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. Nitro uses ClearScript to execute React code on the server using the V8 engine."
      },
      {
        id: 3,
        type: 'multiple',
        text: "Which of the following are included in the 'APP_SHELL_DATA' global variable?",
        options: ["Site-wide settings", "Main navigation menu", "Current page content index", "Footer links"],
        correctAnswer: [0, 1, 3],
        explanation: "APP_SHELL_DATA contains shared global data like menus and settings, while CURRENT_PAGE usually contains the specific page content."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "Which file is the primary source for market, currency, and language mapping in Nitro?",
        options: ["appsettings.json", "countries.json", "web.config", "markets.xml"],
        correctAnswer: 1,
        explanation: "countries.json defines the configuration for all markets and their associated cultures and currencies."
      },
      {
        id: 2,
        type: 'boolean',
        text: "It is possible to use ngrok to expose your local Nitro instance to external webhooks.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. ngrok is the standard tool recommended in the Nitro documentation for testing webhooks and mobile devices locally."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "Which integration is used for AI-driven search and personalization in Nitro?",
        options: ["Esales", "Google Analytics", "Raygun", "SendGrid"],
        correctAnswer: 0,
        explanation: "Esales (Apptus) is the industry-standard integration used for personalization and search logic in Nitro projects."
      },
      {
        id: 2,
        type: 'multiple',
        text: "Which of the following are supported features for commerce notifications in Nitro?",
        options: ["Abandoned cart", "Back in stock", "Price drop alerts", "Order confirmation"],
        correctAnswer: [0, 1, 3],
        explanation: "Nitro provides out-of-the-box support for abandoned cart, back in stock, and standard transactional emails."
      },
      {
        id: 3,
        type: 'boolean',
        text: "B2B features are a core part of the Nitro5 offering.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. Nitro5 includes extensive B2B capabilities including organizational structures and specific checkout flows."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "What should always be checked before a Nitro project goes live?",
        options: ["Color palette", "Go-live checklist", "Developer birthdays", "Git commit history length"],
        correctAnswer: 1,
        explanation: "The Nitro Wiki provides a specific Go-live checklist to ensure all production settings are hardened."
      },
      {
        id: 2,
        type: 'boolean',
        text: "The 'List of all Nitro Projects' wiki page is an internal resource for tracking existing implementations.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. This page is used to document and reference all historical and active Nitro projects within Avensia."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "Which tool is primarily used for deployment in the Nitro stack?",
        options: ["TeamCity", "Octopus Deploy", "Jenkins", "FTP"],
        correctAnswer: 1,
        explanation: "Octopus Deploy is the standard tool for managing releases and environment-specific variables."
      },
      {
        id: 2,
        type: 'multiple',
        text: "Which services require specific configuration during a Nitro DXP setup?",
        options: ["SendGrid", "Raygun", "Slack", "Search & Navigation (Find)"],
        correctAnswer: [0, 1, 3],
        explanation: "SendGrid (Email), Raygun (Error tracking), and Find (Search) are core external services that must be configured for DXP environments."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "What is the core framework change when moving from Nitro Classic to Nitro5?",
        options: ["Java to C#", ".NET Framework 4.7.2 to .NET 8", "MySQL to SQL Server", "Angular to React"],
        correctAnswer: 1,
        explanation: "Nitro5 is a major replatforming from .NET Framework to .NET 8 core."
      },
      {
        id: 2,
        type: 'boolean',
        text: "Existing DXP projects must be migrated when upgrading to Nitro5.",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "True. Upgrading to Nitro5 involves migrating configuration and codebase to the .NET 8 DXP environment."
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
    ],
    examQuestions: [
      {
        id: 1,
        type: 'single',
        text: "Who creates the release notes for new Nitro versions?",
        options: ["The user", "The Nitro Core Team", "The customer", "Sales team"],
        correctAnswer: 1,
        explanation: "The Nitro Core Team is responsible for maintaining the framework and generating release notes."
      }
    ]
  }
];
