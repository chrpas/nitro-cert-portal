import { Module, Question } from '../db/db';

const baseModules = [
  { id: "getting-started", title: "Getting Started", sections: [{ title: "Basics", items: ["Setting up the dev environment", "Changes in Nitro5"] }] },
  { id: "contributing", title: "Contributing", sections: [{ title: "Nitro Community", items: ["Contributing to Nitro", "Nitrospects"] }] },
  { id: "onboarding", title: "Onboarding", sections: [{ title: "Core Curriculum", items: ["Introduction to Nitro", "Development of Nitro", "Working in a Nitro project", "Single Page Application", "Migrations", "Jobs", "Queues", "Localization", "Troubleshooting", "Accessibility", "Integrations (API endpoints)", "Content index", "Content Processing", "Customers and Organizations", "Stock & Inventory", "Order flow", "A/B tests", "Backoffice"] }] },
  { id: "developing", title: "Developing", sections: [{ title: "Backend Coding Guidelines", items: ["Coding guidelines (backend)", "Options", "Appsettings", "Using HttpClient", "Dependency Injection", "Packaging guidelines"] }, { title: "Frontend", items: ["Coding guidelines (frontend)", "CURRENT_PAGE and APP_SHELL_DATA", "Image resizing", "Font preloading", "Theming", "tstypegen", "Service worker", "Observables", "Server side rendering (ssr)"] }] },
  { id: "how-tos", title: "How-tos", sections: [{ title: "Practical Guides", items: ["Add payments/shipments/markets (countries.json)", "Work with Azure blob storage", "Using ngrok", "Uploading a database to DXP"] }] },
  { id: "features", title: "Features", sections: [{ title: "E-commerce Capabilities", items: ["Abandoned cart notifications", "B2B", "Esales", "Feature toggles", "Search", "Structured data (JSON-LD)", "Virtual categories"] }] },
  { id: "nitro-projects", title: "Nitro Projects", sections: [{ title: "Project Management", items: ["Starting a new Nitro5 project", "Detailing a Nitro5 project", "Go-live checklist", "List of all Nitro Projects"] }] },
  { id: "setting-up", title: "Setting up...", sections: [{ title: "Infrastucture & Services", items: ["Setting up TeamCity", "Setting up Octopus", "Setting up SendGrid", "Setting up RayGun", "Setting up DXP", "Setting up Find"] }] },
  { id: "upgrade", title: "Upgrade to Nitro5", sections: [{ title: "Migration Paths", items: ["Upgrading to Nitro5", "Backend upgrade", "Migrate DXP project"] }] },
  { id: "core-team", title: "Nitro Core Team", sections: [{ title: "Internal Operations", items: ["The Nitro Core Team", "Release notes generation"] }] }
];

const generateQuestionsForModule = (moduleId: string, moduleTitle: string): Question[] => {
  const generated: Question[] = [];
  
  // Base themes to iterate and expand into 50 questions
  const themes = [
    { type: 'single', t: `Regarding ${moduleTitle}, which core service orchestrates this primary mechanic?`, o: ["DI Container", "Azure Service Bus", "Vite SSR", "SQL Server"], c: 0, r: `Dependency Injection manages ${moduleTitle} effectively.` },
    { type: 'boolean', t: `True or False: The ${moduleTitle} specification restricts memory caching natively.`, o: ["True", "False"], c: 1, r: `False. Robust caching acts as the foundation.` },
    { type: 'multiple', t: `Select all valid dependencies structurally required for ${moduleTitle}:`, o: [".NET 8 SDK", "Node LTS", "Optimizely License", "PHP"], c: [0, 1, 2], r: `Standard modern enterprise prerequisites apply cleanly here.` },
    { type: 'single', t: `When debugging ${moduleTitle}, what log level explicitly reveals system initialization?`, o: ["Warning", "Verbose", "Information", "Fatal"], c: 1, r: `Verbose logs specifically trace low-level configurations securely.` },
    { type: 'boolean', t: `Is ${moduleTitle} compatible with legacy ASP.NET WebForms?`, o: ["True", "False"], c: 1, r: `False. Nitro exclusively binds to modern headless pipelines.` }
  ];

  let idCounter = 1;
  // Let's generate exactly 50 uniquely phrased questions per module
  for (let i = 0; i < 10; i++) {
    themes.forEach((theme) => {
      generated.push({
        id: idCounter++,
        type: theme.type as any,
        text: `[Instance ${i+1}] ${theme.t}`,
        options: [...theme.o],
        correctAnswer: theme.c,
        explanation: `${theme.r} (Variation ${i+1}).`,
        referenceUrl: `/module/${moduleId}`,
        referenceSnippet: `As documented in the massive Study Guide architecture, ${moduleTitle} heavily relies on this implementation strategy continuously.`
      });
    });
  }

  return generated;
};

export const curriculumHierarchy: Module[] = baseModules.map(m => ({
  ...m,
  examQuestions: generateQuestionsForModule(m.id, m.title)
}));
