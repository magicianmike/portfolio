/**
 * The resume, copied word for word from `resume.html` in the author's `resume` repository and kept up to date by hand
 * (the spec). `**…**` marks the words it sets in bold. No phone number: the site is public, and its contact is email,
 * GitHub and LinkedIn. The downloadable PDF is printed from the same source by `scripts/resume-pdf.ts`.
 */
export const resume = {
  title: 'Senior Software Engineer & Design Architect',
  linkedin: {
    label: 'linkedin.com/in/mikel-mccormick-b054b445',
    href: 'https://www.linkedin.com/in/mikel-mccormick-b054b445/',
  },
  location: 'Galesburg, Michigan, USA',
  email: 'mjmfxmike@gmail.com',
  tagline: ['Design · Engineer · AI', '18+ Yrs Dev Experience'],
  profile:
    'Empathetic **user experience** advocate with senior **software engineering** experience and an **electrical engineering** foundation. Builds **AI-driven** architectures and leads design initiatives that drive acquisitions and business outcomes.',
  impact: [
    {
      heading: 'Product Launch & AI Ecosystem Ownership',
      company: 'Edthena',
      body: 'Co-led the launch of **AI Coach** (Vue 3 migration) and own **Observation Copilot**—frontend architecture, prompt engineering, and LLM analysis. Led adoption of **agentic development workflows**; drove legacy architectural migrations.',
    },
    {
      heading: 'Brand Foundation & Design System',
      company: 'Olakai',
      body: 'Bootstrapped company **branding** and a **Figma design system**, mapped to the existing **React/Next.js** component architecture. Drove **UX innovation** in early **AI application** market.',
    },
    {
      heading: 'Product Scaling & Acquisition',
      company: 'Liveclicker',
      body: 'Championed UX for **VideoEmail** and **RealtimeEmail**, central to the company’s **successful acquisition**. Led a **Vue** migration from legacy systems and built a drag-and-drop enterprise report builder.',
    },
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Edthena',
      years: '2022 — Present',
      stack: ['React', 'Vue', 'Datastar', 'MuJS', 'Apollo', 'GraphQL', 'Tailwind'],
    },
    {
      role: 'Senior Design Engineer',
      company: 'Olakai',
      years: '2025 — 2026',
      stack: ['Figma', 'React', 'Next.js', 'Shadcn UI', 'Tailwind'],
    },
    {
      role: 'Senior Frontend Developer',
      company: 'The C2 Group',
      years: '2021 — 2022',
      stack: ['Vue', 'Pinia', 'Figma', 'Tailwind'],
    },
    {
      role: 'Frontend Developer / UX Engineer',
      company: 'Liveclicker',
      years: '2012 — 2021',
      stack: ['Vue', 'Vuex', 'jQuery', 'Sass'],
    },
  ],
  education: {
    degree: 'BS, Electrical Engineering',
    school: 'Michigan Technological University',
    years: '2006 — 2012',
    gpa: '3.37 GPA',
  },
  skills: {
    Engineering: 'Frontend architecture, modern component frameworks, AI & agentic workflows, accessibility',
    Design:
      'Design systems & tokenization, user experience & research, ui interaction, prototyping, Figma & Adobe Suite',
  },
  pdf: '/mikel-mccormick-resume.pdf',
} as const

/** Splits text on its `**…**` marks, for the words set in bold. */
export function emphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => ({ text: part, strong: i % 2 === 1 }))
}
