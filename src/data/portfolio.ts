export const profile = {
  name: 'astraa', handle: '5erax', year: 2026,
  intro: 'Starting from zero. Learning by making. Turning curiosity into things you can feel.',
  location: 'Vietnam', github: 'https://github.com/5erax',
  email: '', availability: 'Open to learning & collaboration',
};

export type Project = {
  slug: string; name: string; tagline: string; description: string; role: string;
  year: string; status: string; technologies: string[]; cover: string; media: string[];
  challenge: string; solution: string; implementation: string; result: string;
  liveUrl?: string; repositoryUrl?: string; pending: boolean;
};

export const projects: Project[] = [
  {
    slug: 'portfolio-experience', name: 'First contact.', tagline: 'A PORTFOLIO, BUILT FROM ZERO',
    description: 'The first entry in an open-ended collection. This website is the starting point: a place to learn, experiment, and document what comes next.',
    role: 'Personal learning project', year: '2026', status: 'First iteration',
    technologies: ['Next.js', 'React', 'TypeScript', 'GSAP'], cover: '/media/orbital.webp', media: ['/media/orbital.webp'],
    challenge: 'Start with an empty repository and turn an ambitious visual idea into a working, accessible experience.',
    solution: 'One cinematic world, one scroll timeline, and a small set of interactions that connect the story.',
    implementation: 'A seekable H.264 sequence follows smoothed scroll progress. Semantic sections, native dialogs, and a lighter mobile layout keep the experience usable.',
    result: 'The portfolio you are exploring right now. The beginning of a learning journey, with no invented clients or performance claims.',
    repositoryUrl: 'https://github.com/5erax/Pflio', pending: false,
  },
  {
    slug: 'next-experiment', name: 'What comes next?', tagline: 'THE NEXT EXPERIMENT',
    description: 'An open space for a future project. There is no released product here yet.',
    role: 'To be decided', year: 'Pending', status: 'Pending project', technologies: [],
    cover: '/media/orbital.webp', media: [], challenge: 'Pending a real project brief.',
    solution: 'Pending implementation.', implementation: 'This space will hold real work as it is created.',
    result: 'No result to report yet.', pending: true,
  },
  {
    slug: 'open-canvas', name: 'An open canvas.', tagline: 'ROOM TO PLAY',
    description: 'A reserved place for a future exploration. Not a completed project or a claim of experience.',
    role: 'To be decided', year: 'Pending', status: 'Pending project', technologies: [],
    cover: '/media/orbital.webp', media: [], challenge: 'Pending a real project brief.',
    solution: 'Pending implementation.', implementation: 'New ideas will become entries here as the journey develops.',
    result: 'No result to report yet.', pending: true,
  },
];

export const technologies = [
  { name: 'React', short: 'Re', group: 0, detail: 'Components and interactive interfaces', projects: ['portfolio-experience'] },
  { name: 'Next.js', short: 'N', group: 0, detail: 'The foundation of this experience', projects: ['portfolio-experience'] },
  { name: 'TypeScript', short: 'TS', group: 0, detail: 'Learning to make data and behavior explicit', projects: ['portfolio-experience'] },
  { name: 'Tailwind', short: 'Tw', group: 1, detail: 'Styling and responsive foundations', projects: ['portfolio-experience'] },
  { name: 'GSAP', short: 'Gs', group: 1, detail: 'Scroll timelines and cinematic transitions', projects: ['portfolio-experience'] },
  { name: 'Motion', short: 'M', group: 1, detail: 'Small interactions and state changes', projects: ['portfolio-experience'] },
  { name: 'Git', short: 'Git', group: 2, detail: 'Tracking each step of the build', projects: ['portfolio-experience'] },
  { name: 'CSS', short: 'CSS', group: 2, detail: 'Layout, material, and the details', projects: ['portfolio-experience'] },
  { name: 'HTML', short: '</>', group: 2, detail: 'Semantic and accessible structure', projects: ['portfolio-experience'] },
];

export const journey = [
  { id: 'started', file: 'beginning.txt', title: 'Every journey has a first commit.', date: '2026', text: 'I am astraa. I am starting from zero, with curiosity and an empty repository. This is the beginning, not a polished history of things I have not done.' },
  { id: 'portfolio', file: 'portfolio.tsx', title: 'A place to build in public.', date: '2026', text: 'This portfolio is the first project. A personal space for experimenting with code, interaction, and visual storytelling.' },
  { id: 'next', file: 'next-step.todo', title: 'Keep making. Keep learning.', date: 'Next', text: 'The next milestone has not been written yet. Future projects and learning notes will live here when they exist.' },
];

export const panels = [
  { id: 'experience', name: 'Experience', title: 'The first chapter.', text: 'Just starting out. No professional experience to list yet. This portfolio is my first step toward learning through real projects.' },
  { id: 'education', name: 'Education', title: 'Learning in progress.', text: 'Education details are pending. This space is reserved for real courses, studies, and milestones as they are added.' },
  { id: 'now', name: 'Now', title: 'Building from zero.', text: 'Creating this portfolio, exploring frontend development, and finding a personal visual language. One small step at a time.' },
];
