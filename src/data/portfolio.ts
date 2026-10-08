export const profile = {
  name: 'astraa', handle: '5erax', year: 2026,
  intro: 'Fullstack developer. An eye for the interface.',
  location: 'Vietnam', github: 'https://github.com/5erax',
  email: 'lagna0175@gmail.com', linkedin: 'https://linkedin.com/in/dha2608',
  availability: 'Open to frontend & fullstack opportunities',
};

export type Project = {
  slug: string; name: string; tagline: string; description: string; role: string;
  year: string; status: string; technologies: string[]; cover: string; media: string[];
  challenge: string; solution: string; implementation: string; result: string;
  liveUrl?: string; repositoryUrl?: string;
};

export const projects: Project[] = [
  {
    slug: 'proz0', name: 'ProZ0', tagline: 'SURVIVAL / EXPLORATION',
    description: 'A browser-first, 2D pixel-art sandbox. Build a new civilization on a settled planet and discover the traces of the one that came before.',
    role: 'Game & web development', year: '2026', status: 'In development · current focus',
    technologies: ['TypeScript', 'PixiJS', 'Vite'], cover: '/media/proz0-cover.svg', media: [],
    challenge: 'Connect exploration, preparation, survival and colony building in one persistent world.',
    solution: 'An expedition loop: explore, gather, prepare, survive, return, craft and expand. Ruins leave room for discovery beyond the colony.',
    implementation: 'TypeScript and PixiJS, with shared simulation, procedural regions, versioned saves and hosted co-op boundaries.',
    result: 'Active development. The repository and project board track current milestones; this portfolio does not claim a completed release.',
    repositoryUrl: 'https://github.com/5erax/ProZ0',
  },
  {
    slug: 'medimate', name: 'MediMate AI', tagline: 'HEALTHCARE / PRE-VISIT',
    description: 'An AI-assisted pre-visit interface for symptom intake, care discovery and patient workflows. Complex information, presented with clarity and care.',
    role: 'Frontend development', year: '2026', status: 'Featured web project',
    technologies: ['React', 'JavaScript', 'Vite', 'MapLibre'], cover: '/media/medimate-cover.svg', media: [],
    challenge: 'Help people describe symptoms, find relevant care and manage their pre-visit information.',
    solution: 'Patient workflows for intake, care search, profiles and lab records, alongside an administrative workspace.',
    implementation: 'React and Vite, MapLibre maps, Google OAuth and backend integrations. A React Native companion is linked from GitHub.',
    result: 'A public web application and source repository. MediMate provides pre-visit support rather than medical diagnosis.',
    repositoryUrl: 'https://github.com/5erax/SEP490_FE_MedicalAIAssistant',
    liveUrl: 'https://sep-490-fe-medical-ai-assistant.vercel.app',
  },
  {
    slug: 'fingenie', name: 'FinGenie', tagline: 'PERSONAL FINANCE / WEB & MOBILE',
    description: 'AI-assisted personal finance across web and mobile, with gamification and online payments.',
    role: 'Fullstack development', year: '2026', status: 'Source project',
    technologies: ['Next.js', 'NestJS', 'Expo', 'PostgreSQL', 'Prisma'], cover: '', media: [],
    challenge: 'Bring personal finance tools into a consistent web and mobile experience.',
    solution: 'A shared monorepo connects a Next.js web app, a NestJS API and an Expo mobile app.',
    implementation: 'PostgreSQL and Prisma for data; shared TypeScript types; Firebase authentication and PayOS integration.',
    result: 'The source is available on GitHub. A public deployment or measured product outcome is not listed in the profile.',
    repositoryUrl: 'https://github.com/5erax/FinGenie',
  },
];

export const moreProjects = [
  { name: 'GeoConnect', detail: 'Maps & communities', url: 'https://github.com/5erax/geoconnect' },
  { name: 'CVmate', detail: 'CV & interview practice', url: 'https://github.com/5erax/CVmate' },
  { name: 'Ecommerce Mobile', detail: 'React Native & Expo', url: 'https://github.com/5erax/ecomerce-mobile' },
  { name: 'MLN Web', detail: 'Interactive history', url: 'https://github.com/5erax/MLN-web' },
];

export const technologies = [
  { name: 'React', short: 'Re', group: 0, detail: 'Components and interactive interfaces', projects: ['portfolio-experience'] },
  { name: 'Next.js', short: 'N', group: 0, detail: 'The foundation of this experience', projects: ['portfolio-experience'] },
  { name: 'TypeScript', short: 'TS', group: 0, detail: 'Typed interfaces, games and shared data', projects: ['portfolio-experience'] },
  { name: 'Tailwind', short: 'Tw', group: 1, detail: 'Styling and responsive foundations', projects: ['portfolio-experience'] },
  { name: 'GSAP', short: 'Gs', group: 1, detail: 'Scroll timelines and cinematic transitions', projects: ['portfolio-experience'] },
  { name: 'Motion', short: 'M', group: 1, detail: 'Small interactions and state changes', projects: ['portfolio-experience'] },
  { name: 'Git', short: 'Git', group: 2, detail: 'Source history and delivery workflows', projects: ['portfolio-experience'] },
  { name: 'CSS', short: 'CSS', group: 2, detail: 'Layout, material, and the details', projects: ['portfolio-experience'] },
  { name: 'HTML', short: '</>', group: 2, detail: 'Semantic and accessible structure', projects: ['portfolio-experience'] },
];

export const journey = [
  { id: 'studies', file: '2020—2024', title: 'Computer science foundations.', date: '2020 — 2024', text: 'Programming, databases, algorithms and software development fundamentals. The foundation behind the visual layer.' },
  { id: 'internship', file: '2023', title: 'Working with real interfaces.', date: '2023', text: 'A frontend internship focused on responsive layouts, reusable components and interface consistency.' },
  { id: 'fullstack', file: '2024—now', title: 'Beyond the visual layer.', date: '2024 — present', text: 'Web and mobile applications, components, APIs and data flows. Expressive UI and thoughtful motion remain the focus; ProZ0 is the current project.' },
];

export const panels = [
  { id: 'experience', name: 'Experience', title: 'Interfaces, APIs, data.', text: 'Fullstack development since 2024, across web and mobile. React Native and Expo on mobile; Node.js, NestJS, Spring Boot, PostgreSQL and MongoDB behind the interface.' },
  { id: 'education', name: 'Education', title: 'Computer science / 2020–2024.', text: 'Programming, databases, algorithms and software development. The foundations I use across web, mobile and game development.' },
  { id: 'now', name: 'Now', title: 'Building ProZ0.', text: 'A survival and exploration sandbox in TypeScript and PixiJS. Following the whole interaction: where attention goes, how a control responds, how one state becomes the next.' },
];
