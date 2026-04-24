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
  }
];
