import { Module, Question } from '../db/db';
import { examQuestions as allExamQuestions } from './exam';

/**
 * Automagically distributes the 154-question bank into specialized modules
 * based on keyword patterns in the question text.
 */
const categorizeQuestions = (questions: Question[]): Record<string, Question[]> => {
  const categories: Record<string, Question[]> = {
    "getting-started": [],
    "contributing": [],
    "onboarding": [],
    "developing": [],
    "how-tos": [],
    "features": [],
    "nitro-projects": [],
    "setting-up": [],
    "upgrade": [],
    "core-team": [],
  };

  if (!questions || questions.length === 0) return categories;

  questions.forEach(q => {
    const text = q.text.toLowerCase();
    
    if (text.includes("setup") || text.includes("kestrel") || text.includes("cli") || text.includes("vite") || q.id <= 15) {
      categories["getting-started"].push(q);
    } else if (text.includes("pr ") || text.includes("pull request") || text.includes("gitflow") || text.includes("nitrospect") || text.includes("branch")) {
      categories["contributing"].push(q);
    } else if (text.includes("spa") || text.includes("hydration") || text.includes("migration") || text.includes("queue") || text.includes("job")) {
       categories["onboarding"].push(q);
    } else if (text.includes("di ") || text.includes("httpclient") || text.includes("typescript") || text.includes("ssr") || text.includes("viewmodel") || text.includes("tstypegen")) {
       categories["developing"].push(q);
    } else if (text.includes("azure") || text.includes("keyvault") || text.includes("dxp") || text.includes("ngrok") || text.includes("application insights")) {
       categories["how-tos"].push(q);
    } else if (text.includes("b2b") || text.includes("payment") || text.includes("elevate") || text.includes("esales") || text.includes("discount") || text.includes("promotion")) {
       categories["features"].push(q);
    } else if (text.includes("go-live") || text.includes("ttl") || text.includes("theming") || text.includes("design") || text.includes("accessibility") || text.includes("aria-")) {
       categories["nitro-projects"].push(q);
    } else if (text.includes("teamcity") || text.includes("octopus") || text.includes("raygun") || text.includes("sendgrid") || text.includes("monitoring")) {
       categories["setting-up"].push(q);
    } else if (text.includes("upgrade-assistant") || text.includes("legacy") || text.includes("version")) {
       categories["upgrade"].push(q);
    } else {
       categories["core-team"].push(q);
    }
  });

  return categories;
};

const categorizedPool = categorizeQuestions(allExamQuestions);

// Enrichment helper to ensure every question has a valid reference card
const enrich = (qs: Question[], modId: string): Question[] => {
  return qs.map(q => ({
    ...q,
    referenceUrl: q.referenceUrl || `/module/${modId}`,
    referenceSnippet: q.referenceSnippet || q.explanation.split('.')[0] + '.'
  }));
};

export const curriculumHierarchy: Module[] = [
  {
    id: "getting-started",
    title: "Environment Setup",
    sections: [{ title: "Prerequisites", items: ["Setting up the dev environment", "How to setup Visual Studio Code", "Troubleshooting"] }],
    examQuestions: enrich(categorizedPool["getting-started"], "getting-started")
  },
  {
    id: "contributing",
    title: "Contributing to Core",
    sections: [{ title: "Workflow", items: ["Contributing to Nitro", "Coding guidelines", "Frontend Guidelines", "PR checklist"] }],
    examQuestions: enrich(categorizedPool["contributing"], "contributing")
  },
  {
    id: "onboarding",
    title: "Onboarding Basics",
    sections: [{ title: "Systems", items: ["Introduction to Nitro", "Single Page Application", "Background Logistics"] }],
    examQuestions: enrich(categorizedPool["onboarding"], "onboarding")
  },
  {
    id: "developing",
    title: "Backend Development",
    sections: [{ title: "Patterns", items: ["Dependency injection", "Data Handling", "Queues", "Migrations"] }],
    examQuestions: enrich(categorizedPool["developing"], "developing")
  },
  {
    id: "how-tos",
    title: "Infrastructure How-Tos",
    sections: [{ title: "Deployment", items: ["Setting up DXP", "Azure Blob Storage", "Application Insights & Logging"] }],
    examQuestions: enrich(categorizedPool["how-tos"], "how-tos")
  },
  {
    id: "features",
    title: "Product Features",
    sections: [{ title: "Commerce", items: ["B2B", "Search", "Localization", "Order flow"] }],
    examQuestions: enrich(categorizedPool["features"], "features")
  },
  {
    id: "nitro-projects",
    title: "Frontend & UI Strategy",
    sections: [{ title: "Presentation", items: ["Accessibility", "Site theming", "React 19 & TypeScript 5 upgrade guide"] }],
    examQuestions: enrich(categorizedPool["nitro-projects"], "nitro-projects")
  },
  {
    id: "setting-up",
    title: "External Integrations",
    sections: [{ title: "Monitoring", items: ["Setting up Octopus Deploy", "Setting up Raygun", "Setting up Sendgrid"] }],
    examQuestions: enrich(categorizedPool["setting-up"], "setting-up")
  },
  {
    id: "upgrade",
    title: "Migration & Continuity",
    sections: [{ title: "Upgrading", items: ["Upgrade codebase to Nitro5", "Run upgrade assistant"] }],
    examQuestions: enrich(categorizedPool["upgrade"], "upgrade")
  },
  {
    id: "core-team",
    title: "Technical Excellence",
    sections: [{ title: "Internal", items: ["Architectural Standards", "Package structure"] }],
    examQuestions: enrich(categorizedPool["core-team"], "core-team")
  }
];
