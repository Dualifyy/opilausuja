import { Goal } from './types';

export const APP_NAME = "Õpilausuja";
export const APP_TAGLINE_EN = "See what you already know. Discover what comes next.";
export const APP_TAGLINE_ET = "Sinu CV. Sinu eesmärk. Selge plaan.";
export const APP_SUBTITLE_EN = "AI-powered skill mapping and personalized learning paths that close gaps, build confidence, and guide your career forward.";
export const APP_SUBTITLE_ET = "Võrdleme sinu CV-d soovitud tööga, näitame, mis oskustest puudu jääb ja soovitame, mida järgmisena õppida.";

export const FOUR_STEPS_PROMISE = [
  {
    step: 1,
    titleEn: "What I already know",
    titleEt: "Mida juba oskad",
    descEn: "Extract skills from CV or your own words",
    descEt: "Kaardistame oskused CV-st või vabas vormis",
    icon: "sparkles",
  },
  {
    step: 2,
    titleEn: "What I need",
    titleEt: "Mida vajad",
    descEn: "Analyze requirements of your target role",
    descEt: "Analüüsime soovitud rolli tegelikke nõudmisi",
    icon: "target",
  },
  {
    step: 3,
    titleEn: "What I should learn next",
    titleEt: "Mida järgmisena õppida",
    descEn: "Identify highest-priority gap milestones",
    descEt: "Tuvastame prioriteetsed lüngad ja oskused",
    icon: "lightbulb",
  },
  {
    step: 4,
    titleEn: "How do I get there",
    titleEt: "Kuidas selleni jõuda",
    descEn: "Actionable, ordered roadmap with resources",
    descEt: "Selge, järjestatud tegevuskava ja kursused",
    icon: "compass",
  },
];

export const CURATED_GOALS: Goal[] = [
  {
    id: "data-analyst",
    title: "Data Analyst",
    titleEt: "Andmeanalüütik",
    isCustom: false,
    category: "Data & AI",
    popular: true,
    description: "Transform raw data into strategic insights with SQL, Python, Excel & Tableau/Power BI.",
    iconName: "chart-bar",
  },
  {
    id: "it-project-manager",
    title: "IT Project Manager",
    titleEt: "IT projektijuht",
    isCustom: false,
    category: "Management",
    popular: true,
    description: "Lead agile tech teams, manage sprints, timelines, stakeholders, and digital tooling (Jira, Trello).",
    iconName: "briefcase",
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    titleEt: "Veebiarendaja (Frontend)",
    isCustom: false,
    category: "Engineering",
    popular: true,
    description: "Build modern, responsive, accessible web interfaces using React, TypeScript, and modern CSS.",
    iconName: "code",
  },
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    titleEt: "Kasutajakogemuse (UX/UI) disainer",
    isCustom: false,
    category: "Design",
    popular: true,
    description: "Design intuitive user journeys, wireframes, user testing and high-fidelity Figma prototypes.",
    iconName: "palette",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    titleEt: "Tootejuht",
    isCustom: false,
    category: "Management",
    popular: false,
    description: "Define product vision, run customer discovery, prioritize roadmaps and balance business & tech.",
    iconName: "compass",
  },
  {
    id: "cybersecurity-specialist",
    title: "Cybersecurity Analyst",
    titleEt: "Küberturbe spetsialist",
    isCustom: false,
    category: "Security",
    popular: false,
    description: "Protect systems, monitor vulnerabilities, implement compliance and handle incident response.",
    iconName: "shield-check",
  },
  {
    id: "digital-marketer",
    title: "Growth & Digital Marketer",
    titleEt: "Digitaalturunduse spetsialist",
    isCustom: false,
    category: "Marketing",
    popular: false,
    description: "Drive user acquisition through SEO, performance marketing, content analytics, and conversion optimization.",
    iconName: "trending-up",
  },
  {
    id: "devops-engineer",
    title: "Cloud & DevOps Engineer",
    titleEt: "Pilve- ja DevOps insener",
    isCustom: false,
    category: "Engineering",
    popular: false,
    description: "Automate CI/CD pipelines, containerize with Docker/Kubernetes, and manage cloud infra (AWS/Azure/GCP).",
    iconName: "server",
  }
];

export const COMMON_SKILLS = [
  "Excel", "SQL", "Python", "JavaScript", "React", "Git", "Figma", 
  "Agile / Scrum", "Jira", "Customer Communication", "Data Visualization",
  "Problem Solving", "English B2/C1", "Power BI", "Tableau", "Project Management"
];

export interface DemoPreset {
  id: string;
  name: string;
  nameEt: string;
  roleBadge: string;
  goalId: string;
  goalTitle: string;
  input: string;
  fileName?: string;
  summary: string;
  summaryEt: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "preset-support-to-data",
    name: "Customer Support to Data Analyst",
    nameEt: "Klienditugi -> Andmeanalüütik",
    roleBadge: "Career Changer",
    goalId: "data-analyst",
    goalTitle: "Data Analyst",
    input: `2 years working as a technical customer support specialist at a SaaS company.
Day-to-day experience:
- Strong Excel skills (VLOOKUP, Pivot Tables, SUMIFS, data cleaning)
- Basic SQL queries (SELECT, JOIN, GROUP BY) to search user tickets and database logs
- Strong client communication, ticket troubleshooting, and problem-solving
- High empathy and cross-team collaboration with product and QA teams
- Fluent in English (C1) and Estonian (Native)
Goal: I want to transition into a full-time Data Analyst role and master automated data pipelines and business dashboards.`,
    summary: "Hackathon script demo: 2 years support agent with basic SQL & Excel moving to Data Analyst.",
    summaryEt: "Klienditoe spetsialist põhiliste SQL ja Exceli oskustega, kes soovib saada andmeanalüütikuks."
  },
  {
    id: "preset-anneli-pm",
    name: "Anneli Sepp -> IT Project Manager",
    nameEt: "Anneli Sepp -> IT projektijuht",
    roleBadge: "Upskilling / Management",
    goalId: "it-project-manager",
    goalTitle: "IT projektijuht",
    fileName: "cv_anneli_sepp.pdf",
    input: `Anneli Sepp - CV Kokkuvõte
Töökogemus:
- 3 aastat büroojuht ja tiimikoordinaator tehnoloogiaettevõttes
- Igapäevane suhtlemine arendajate, klientide ja juhtkonnaga
- Koosolekute protokollimine, ajakavade koostamine ja eelarve jälgimine
- Tööriistad: Trello, Asana, MS Office, Slack, Google Workspace
- Keeled: Eesti keel (emakeel), Inglise keel (B2)
Oskused: Meeskonna motiveerimine, organiseeritus, probleemide lahendamine, suhtlemisoskus.
Soovin astuda järgmise sammu ja saada sertifitseeritud IT projektijuhiks (Agile/Scrum).`,
    summary: "As seen in mockup: Anneli Sepp moving to IT Project Manager.",
    summaryEt: "Disaininäidise Anneli Sepp: tiimikoordinaatorist IT projektijuhiks."
  },
  {
    id: "preset-html-to-frontend",
    name: "Junior HTML/CSS to Modern Frontend Dev",
    nameEt: "Junior veebihuviline -> Frontend arendaja",
    roleBadge: "Junior Learner",
    goalId: "frontend-developer",
    goalTitle: "Frontend Developer",
    input: `Self-taught learner with 6 months of hobby coding.
- Solid understanding of semantic HTML5 and modern CSS (Flexbox, responsive design)
- Basic JavaScript (functions, DOM manipulation, fetch API, array methods)
- Experience using Git and GitHub for small personal hobby pages
- Familiar with Figma layouts and turning designs into code
Looking to master React, TypeScript, state management, and modern component libraries to land my first junior developer job.`,
    summary: "Self-taught coder with HTML/CSS/JS basics aiming for modern React & TypeScript.",
    summaryEt: "Iseõppija baasveebioskustega, kes soovib jõuda React & TypeScript juunior-arendajaks."
  }
];
