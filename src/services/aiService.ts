import { GapAnalysis, Skill, PathStep, AISettings } from '../types';

export const AI_SYSTEM_PROMPT = `Sa oled empaatiline ja professionaalne karjäärinõustaja ja oskuste mentor.
Sinu ülesanne on võrrelda inimese tegelikku tausta (CV või kogemuste kirjeldus) ja tema soovitud eesmärki (töökoht või roll).

Tee analüüs järgmiselt:
1. Tuvasta inimese tegelikud oskused tema sisendist (nii tehnilised kui ka ülekantavad pehmed oskused).
2. Tuvasta oskused, mida soovitud roll tegelikult nõuab.
3. Võrdle neid ausalt:
   - alreadyHave: oskused, mis tal on juba olemas või mis kanduvad uude rolli üle.
   - stillNeed: konkreetsed lüngad / puuduvad oskused, mida roll eeldab.
4. Arvuta realistlik sobivuse protsent (readinessScore 0-100) tegeliku kattuvuse põhjal.
5. Koosta järjestatud, realistlik ja samm-sammuline õpiteekond, kus iga samm aitab omandada ühte puuduvat oskust.
6. Kirjuta soe, toetav ja inimlik kokkuvõte, vältides külma AI kõnepruuki.

Vasta AINULT kehtiva JSON-ina:
{
  "readinessScore": number,
  "summaryNote": string,
  "encouragingHeadline": string,
  "alreadyHave": [{ "name": string, "level": "intermediate", "source": "ai_extracted", "category": "technical" | "soft" | "tool" | "language" }],
  "stillNeed": [{ "name": string, "level": "beginner", "source": "ai_extracted", "category": "technical" | "soft" | "tool" | "language" }],
  "path": [
    {
      "order": number,
      "title": string,
      "why": string,
      "estimatedEffort": string,
      "suggestedResource": string,
      "relatedSkill": string,
      "priority": "high" | "medium",
      "details": {
        "overview": string,
        "keyLearningPoints": string[],
        "handsOnProject": string,
        "recommendedPlatforms": string[]
      }
    }
  ]
}`;

export async function analyzeProfileWithAI(
  rawInput: string,
  goalTitle: string,
  settings: AISettings,
  lang: 'en' | 'et' = 'et'
): Promise<GapAnalysis> {
  // If an external API key is provided, try calling the appropriate API
  if (settings.provider === 'gemini' && settings.apiKey) {
    try {
      return await callGeminiAPI(rawInput, goalTitle, settings.apiKey, lang);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart engine:', err);
    }
  } else if (settings.provider === 'anthropic' && settings.apiKey) {
    try {
      return await callAnthropicAPI(rawInput, goalTitle, settings.apiKey, lang);
    } catch (err) {
      console.warn('Anthropic API call failed, falling back to smart engine:', err);
    }
  } else if (settings.provider === 'openai' && settings.apiKey) {
    try {
      return await callOpenAIAPI(rawInput, goalTitle, settings.apiKey, lang);
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to smart engine:', err);
    }
  }

  // Built-in Intelligent Skill Analysis Engine (100% dependable, offline-ready, dynamic & human-centered)
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateIntelligentAnalysis(rawInput, goalTitle, lang);
}

// External API implementations
async function callGeminiAPI(rawInput: string, goalTitle: string, apiKey: string, lang: string): Promise<GapAnalysis> {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const userPrompt = `Keel: ${lang === 'et' ? 'Eesti' : 'Inglise'}\nInimese taust/CV:\n"""\n${rawInput}\n"""\nSoovitud siht/töökoht: "${goalTitle}"`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: `${AI_SYSTEM_PROMPT}\n\n${userPrompt}` }]
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseAIResponse(text, goalTitle, rawInput, lang);
}

async function callAnthropicAPI(rawInput: string, goalTitle: string, apiKey: string, lang: string): Promise<GapAnalysis> {
  const url = 'https://api.anthropic.com/v1/messages';
  const userPrompt = `Language: ${lang === 'et' ? 'Estonian' : 'English'}\nBackground:\n"""\n${rawInput}\n"""\nTarget: "${goalTitle}"`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: AI_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  return parseAIResponse(text, goalTitle, rawInput, lang);
}

async function callOpenAIAPI(rawInput: string, goalTitle: string, apiKey: string, lang: string): Promise<GapAnalysis> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const userPrompt = `Language: ${lang === 'et' ? 'Estonian' : 'English'}\nBackground:\n"""\n${rawInput}\n"""\nTarget: "${goalTitle}"`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  return parseAIResponse(text, goalTitle, rawInput, lang);
}

function parseAIResponse(rawJson: string, goalTitle: string, rawInput: string, lang: string): GapAnalysis {
  try {
    const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const alreadyHave: Skill[] = (parsed.alreadyHave || []).map((s: any) => ({
      name: typeof s === 'string' ? s : s.name,
      level: s.level || 'intermediate',
      source: 'ai_extracted',
      category: s.category || 'technical'
    }));

    const stillNeed: Skill[] = (parsed.stillNeed || []).map((s: any) => ({
      name: typeof s === 'string' ? s : s.name,
      level: s.level || 'beginner',
      source: 'ai_extracted',
      category: s.category || 'technical'
    }));

    const path: PathStep[] = (parsed.path || []).map((p: any, idx: number) => ({
      order: p.order || idx + 1,
      title: p.title || `Omanda ${p.relatedSkill || 'oskus'}`,
      why: p.why || 'Oluline samm sihi saavutamiseks.',
      estimatedEffort: p.estimatedEffort || '~2 nädalat',
      suggestedResource: p.suggestedResource || 'Praktiline kursus ja projekt',
      relatedSkill: p.relatedSkill || p.title,
      completed: false,
      priority: idx < 2 ? 'high' : 'medium',
      resourceType: 'course',
      details: p.details || {
        overview: p.why,
        keyLearningPoints: [
          `Põhimõisted ja baasteadmised`,
          `Praktiline rakendamine igapäevatöös`,
          `Levinumad parimad praktikad`
        ],
        handsOnProject: `Tee läbi iseseisev praktiline ülesanne teemal ${p.relatedSkill || p.title}`,
        recommendedPlatforms: ['Coursera', 'Udemy', 'YouTube']
      }
    }));

    const readinessScore = typeof parsed.readinessScore === 'number' ? parsed.readinessScore : 60;

    return {
      id: 'analysis-' + Date.now(),
      profileId: 'profile-' + Date.now(),
      goalId: goalTitle.toLowerCase().replace(/\s+/g, '-'),
      goalTitle,
      readinessScore,
      alreadyHave,
      stillNeed,
      path,
      createdAt: new Date().toISOString(),
      categoryBreakdown: {
        technical: Math.min(95, Math.max(35, Math.round(readinessScore * 0.95))),
        soft: Math.min(95, Math.max(50, Math.round(readinessScore * 1.1))),
        languages: Math.min(90, Math.max(40, Math.round(readinessScore * 0.9)))
      },
      summaryNote: parsed.summaryNote || (lang === 'et'
        ? "Analüüs põhineb sinu kirjeldatud oskuste ja soovitud rolli tegelike nõudmiste võrdlusel."
        : "Analysis based on comparing your stated experience with role requirements."),
      encouragingHeadline: parsed.encouragingHeadline || (lang === 'et'
        ? "Sul on väärtuslik kogemus, mida saab uues rollis edukalt rakendada!"
        : "You have strong transferable strengths ready for this career move!")
    };
  } catch (e) {
    console.error('Failed to parse AI response, fallback to smart analysis:', e);
    return generateIntelligentAnalysis(rawInput, goalTitle, lang as any);
  }
}

// -------------------------------------------------------------
// Core Intelligent Skill Extraction & Dynamic Gap Engine
// -------------------------------------------------------------

interface SkillDefinition {
  name: string;
  nameEn: string;
  category: 'technical' | 'tool' | 'soft' | 'language';
  keywords: string[];
}

const KNOWN_SKILL_CATALOG: SkillDefinition[] = [
  // Programming & Web
  { name: "JavaScript / TypeScript", nameEn: "JavaScript / TypeScript", category: "technical", keywords: ["javascript", "js", "typescript", "ts", "ecmascript"] },
  { name: "HTML & CSS", nameEn: "HTML & CSS", category: "technical", keywords: ["html", "html5", "css", "css3", "sass", "scss", "tailwind"] },
  { name: "React", nameEn: "React", category: "technical", keywords: ["react", "reactjs", "nextjs", "next.js"] },
  { name: "Vue.js", nameEn: "Vue.js", category: "technical", keywords: ["vue", "vuejs", "nuxt"] },
  { name: "Python programmeerimine", nameEn: "Python Programming", category: "technical", keywords: ["python", "django", "flask", "fastapi"] },
  { name: "Java / C#", nameEn: "Java / C#", category: "technical", keywords: ["java", "c#", ".net", "dotnet", "spring", "spring boot"] },
  { name: "Git & versioonihaldus", nameEn: "Git Version Control", category: "tool", keywords: ["git", "github", "gitlab", "bitbucket", "versioonihaldus"] },
  { name: "API-d ja veebiteenused", nameEn: "APIs & Web Services", category: "technical", keywords: ["api", "rest", "restful", "graphql", "json", "endpoint"] },

  // Data & Analytics
  { name: "SQL andmebaasipäringud", nameEn: "SQL Database Querying", category: "technical", keywords: ["sql", "postgresql", "mysql", "sqlite", "oracle", "database", "andmebaas"] },
  { name: "Excel ja tabelitöötlus", nameEn: "Excel & Spreadsheets", category: "tool", keywords: ["excel", "vlookup", "xlookup", "pivot", "tabelid", "google sheets", "valemid"] },
  { name: "Power BI / Tableau andmevisualiseerimine", nameEn: "Power BI / Tableau Data Viz", category: "tool", keywords: ["power bi", "powerbi", "tableau", "visualiseerimine", "dashboard", "graafikud", "looker"] },
  { name: "Andmeanalüüs ja statistika", nameEn: "Data Analysis & Statistics", category: "technical", keywords: ["andmeanalüüs", "data analysis", "statistika", "pandas", "numpy", "r-keel", "analüütika"] },
  { name: "ETL ja andmepuhastus", nameEn: "ETL & Data Cleaning", category: "technical", keywords: ["etl", "andmepuhastus", "data cleaning", "pipeline", "andmevoog"] },

  // Management & Agile
  { name: "Agile ja Scrum metoodikad", nameEn: "Agile & Scrum Methodologies", category: "technical", keywords: ["agile", "scrum", "kanban", "sprint", "standup", "retrospective", "agiilne", "sprindid"] },
  { name: "Jira & Confluence", nameEn: "Jira & Confluence", category: "tool", keywords: ["jira", "confluence", "atlassian"] },
  { name: "Trello, Asana & Notion", nameEn: "Trello, Asana & Notion", category: "tool", keywords: ["trello", "asana", "notion", "monday", "clickup", "ülesannete haldus"] },
  { name: "Projekti eelarvestamine ja riskijuhtimine", nameEn: "Project Budgeting & Risk Management", category: "technical", keywords: ["eelarve", "eelarvestamine", "risk", "riskijuhtimine", "ajakava", "tähtajad", "budget"] },
  { name: "Huvigruppide juhtimine ja tehniline suhtlus", nameEn: "Stakeholder Management & Tech Comms", category: "soft", keywords: ["huvigrupp", "stakeholder", "tellija", "klient", "läbirääkimised", "koostöö partneritega"] },
  { name: "Meeskonna koordineerimine", nameEn: "Team Coordination", category: "soft", keywords: ["tiimitöö", "tiimijuht", "koordinaator", "meeskonna juhtimine", "tiimi juhtimine", "juhendamine", "delegeerimine"] },

  // Design & UX
  { name: "Figma & prototüüpimine", nameEn: "Figma & Prototyping", category: "tool", keywords: ["figma", "sketch", "adobe xd", "prototüüp", "prototyping", "wireframe", "wireframing"] },
  { name: "Kasutajauuringud ja testimine", nameEn: "User Research & Usability Testing", category: "technical", keywords: ["kasutajauuring", "ux research", "usability", "kasutatavus", "intervjuud", "kasutajatestimine"] },
  { name: "UI/UX disainipõhimõtted", nameEn: "UI/UX Design Principles", category: "technical", keywords: ["ui", "ux", "kasutajakogemus", "kasutajaliides", "design system", "tüpograafia"] },

  // Customer Support, Communication & Soft Skills
  { name: "Klienditugi ja probleemide lahendamine", nameEn: "Customer Support & Problem Solving", category: "soft", keywords: ["klienditugi", "klienditeenindus", "customer support", "customer service", "helpdesk", "piletisüsteem", "zendesk", "freshdesk"] },
  { name: "Suhtlemisoskus ja empaatia", nameEn: "Communication & Empathy", category: "soft", keywords: ["suhtlemine", "suhtlemisoskus", "empaatia", "kuulamine", "kirjalik suhtlus", "esitlusoskus", "presentatsioon"] },
  { name: "Organiseeritus ja ajajuhtimine", nameEn: "Organization & Time Management", category: "soft", keywords: ["ajaplaneerimine", "ajajuhtimine", "organiseeritus", "täpsus", "iseseisev", "kohusetundlik"] },
  { name: "Kriitiline ja analüütiline mõtlemine", nameEn: "Critical & Analytical Thinking", category: "soft", keywords: ["analüütiline", "kriitiline mõtlemine", "loogiline", "süsteemne", "probleemide lahendamine"] },
  { name: "Kiire kohanemis- ja õppimisvõime", nameEn: "Fast Adaptability & Continuous Learning", category: "soft", keywords: ["kiire õppija", "kohanemisvõime", "paindlikkus", "uudishimulik", "iseseisev õppimine"] },

  // Office & Admin
  { name: "MS Office & Google Workspace", nameEn: "MS Office & Google Workspace", category: "tool", keywords: ["word", "powerpoint", "office", "google docs", "google drive", "dokumentatsioon"] },
  { name: "Raamatupidamine ja finantstarkvara", nameEn: "Accounting & Financial Tools", category: "tool", keywords: ["raamatupidamine", "merit aktiva", "directo", "arved", "palgaarvestus", "finants"] },

  // Languages
  { name: "Inglise keel (erialane/suhtlus)", nameEn: "English (Professional Fluency)", category: "language", keywords: ["inglise keel", "english", "b2", "c1", "b1", "c2", "rahvusvaheline"] },
  { name: "Eesti keel (kõnes ja kirjas)", nameEn: "Estonian (Fluent)", category: "language", keywords: ["eesti keel", "emakeel", "estonian"] }
];

interface RoleRequirement {
  goalMatch: string[];
  requiredSkills: {
    skillName: string;
    skillNameEn: string;
    category: 'technical' | 'tool' | 'soft' | 'language';
    why: string;
    whyEn: string;
    effort: string;
    resource: string;
    resourceEn: string;
    handsOn: string;
    platforms: string[];
  }[];
}

const ROLE_KNOWLEDGE_BASE: RoleRequirement[] = [
  // 1. IT Projektijuht
  {
    goalMatch: ["projektijuht", "project manager", "pm", "scrum master", "it projektijuht"],
    requiredSkills: [
      {
        skillName: "Agile ja Scrum metoodikad",
        skillNameEn: "Agile & Scrum Methodologies",
        category: "technical",
        why: "Arendustiimid töötavad sprinditsüklites. Scrumi ja Kanbani põhjalik tundmine on IT projektijuhi igapäevane tööriist.",
        whyEn: "Modern tech squads depend on sprint cadences. This forms the everyday operational backbone of a tech PM.",
        effort: "~3 nädalat (4 h nädalas)",
        resource: "Coursera: Google Agile Project Management või Scrum.org juhend",
        resourceEn: "Coursera: Google Agile Project Management or Scrum.org Guide",
        handsOn: "Koosta reaalse tarkvaraprojekti 2-nädalane sprindiplaan koos backlogi ja eesmärkidega.",
        platforms: ["Coursera", "Scrum.org", "LinkedIn Learning"]
      },
      {
        skillName: "Jira & Confluence haldus",
        skillNameEn: "Jira & Confluence Administration",
        category: "tool",
        why: "Jira on IT-sektori standard. Selle süsteemne tundmine aitab töid selgelt jaotada ja tiimi edenemist reaalajas jälgida.",
        whyEn: "Jira is the de-facto tech industry standard. Knowing workflows and boards separates great PMs from beginners.",
        effort: "~1–2 nädalat (3 h nädalas)",
        resource: "Atlassian University: Jira Fundamentals (tasuta)",
        resourceEn: "Atlassian University: Jira Fundamentals (Free)",
        handsOn: "Loo tasuta Jira pilvekontol toimiv Scrum board koos ülesannete, filtrite ja reeglitega.",
        platforms: ["Atlassian University", "YouTube", "Udemy"]
      },
      {
        skillName: "Projekti eelarvestamine ja riskijuhtimine",
        skillNameEn: "Project Budgeting & Risk Management",
        category: "technical",
        why: "Tagab, et projekt püsib eelarves, ajakavas ning riskid lahendatakse enne kriisi tekkimist.",
        whyEn: "Ensures projects stay within budget and timeline, catching risks before they escalate.",
        effort: "~2 nädalat (4 h nädalas)",
        resource: "PMI: Foundations of Project Risk Management",
        resourceEn: "PMI: Foundations of Project Risk Management",
        handsOn: "Koosta täielik riskiregister koos leevendusmeetmetega tarkvaraprojekti näitel.",
        platforms: ["PMI", "Coursera", "edX"]
      },
      {
        skillName: "Huvigruppide juhtimine ja tehniline suhtlus",
        skillNameEn: "Stakeholder Management & Tech Comms",
        category: "soft",
        why: "Projektijuht on sild arendajate ja äripoole vahel. Selge ja diplomaatiline suhtlus hoiab ootused paigas.",
        whyEn: "PMs bridge business stakeholders and engineers. Diplomatic communication keeps everyone aligned.",
        effort: "~2 nädalat (3 h nädalas)",
        resource: "Harvard Business Review: Communicating with Stakeholders",
        resourceEn: "Harvard Business Review: Communicating with Stakeholders",
        handsOn: "Vormista projekti staatuse ülevaade (Status Report) ja simuleeri huvigruppide koosolekut.",
        platforms: ["LinkedIn Learning", "Harvard Business Review"]
      },
      {
        skillName: "Inglise keel erialases kontekstis (B2)",
        skillNameEn: "Professional Tech English (B2)",
        category: "language",
        why: "Rahvusvahelistes ja ka kohalikes IT-tiimides toimub koodidokumentatsioon, piletid ja suhtlus suures osas inglise keeles.",
        whyEn: "Tech documentation, code reviews, and multi-national team syncs happen in English.",
        effort: "~1–2 kuud (2 h nädalas)",
        resource: "English for Tech Professionals (LinkedIn Learning / EF SET)",
        resourceEn: "English for Tech Professionals (LinkedIn Learning / EF SET)",
        handsOn: "Harjuta 15-minutilist ingliskeelset sprindi ülevaatekoosoleku läbiviimist.",
        platforms: ["EF SET", "BBC Learning English", "Preply"]
      },
      {
        skillName: "Andmepõhised mõõdikud (Velocity, Burndown, KPI)",
        skillNameEn: "Data-Driven Delivery Metrics (Velocity, Burndown, KPI)",
        category: "technical",
        why: "Projektijuht peab tegema otsuseid andmete, tiimi kiiruse ja ressursside tegeliku kulu põhjal.",
        whyEn: "Great PMs lead with metrics: team velocity, burndown trends, and delivery forecasts.",
        effort: "~1 nädal (4 h)",
        resource: "Agile Metrics for Delivery Teams (Scrum.org / Coursera)",
        resourceEn: "Agile Metrics for Delivery Teams (Scrum.org / Coursera)",
        handsOn: "Loo Google Sheetsis või Excelis burndown graafik ja tiimi kiiruse arvutustabel.",
        platforms: ["YouTube", "Coursera", "DataCamp"]
      }
    ]
  },

  // 2. Andmeanalüütik
  {
    goalMatch: ["andmeanalüütik", "data analyst", "andmed", "data analysis", "ärianalüütik", "business analyst"],
    requiredSkills: [
      {
        skillName: "SQL andmebaasipäringud",
        skillNameEn: "SQL Database Querying",
        category: "technical",
        why: "Andmeanalüütiku põhitööriist andmete kättesaamiseks. Vajalik on osata liitmisi (JOIN), grupeerimisi ja filtreid.",
        whyEn: "The essential core tool for extracting relational data. Requires proficiency in JOINs, GROUP BY, and aggregations.",
        effort: "~3–4 nädalat (5 h nädalas)",
        resource: "Mode Analytics SQL Tutorial & Khan Academy SQL (tasuta)",
        resourceEn: "Mode Analytics SQL Tutorial & Khan Academy SQL (Free)",
        handsOn: "Kirjuta 15 praktilist SQL päringut reaalsete müügi- ja kliendiandmete analüüsimiseks.",
        platforms: ["Mode Analytics", "LeetCode SQL", "Coursera"]
      },
      {
        skillName: "Excel ja tabelitöötlus edasijõudnutele",
        skillNameEn: "Advanced Excel & Spreadsheets",
        category: "tool",
        why: "Kiireks andmete kontrolliks, prototüüpimiseks ja juhtkonnale lihtsate ülevaadete tegemiseks.",
        whyEn: "Crucial for fast ad-hoc verification, financial models, and quick executive summaries.",
        effort: "~2 nädalat (4 h nädalas)",
        resource: "Excelis edasijõudnutele: Pivot, VLOOKUP/XLOOKUP ja Power Query",
        resourceEn: "Advanced Excel: Pivot Tables, XLOOKUP & Power Query",
        handsOn: "Loo automaatselt uuenev Exceli müügikoond Power Query abil.",
        platforms: ["YouTube", "LinkedIn Learning", "DataCamp"]
      },
      {
        skillName: "Power BI / Tableau andmevisualiseerimine",
        skillNameEn: "Power BI / Tableau Data Viz",
        category: "tool",
        why: "Äripoolele tuleb tulemusi esitada selgete ja interaktiivsete graafikutena.",
        whyEn: "Translating raw database rows into interactive executive dashboards that guide decisions.",
        effort: "~3 nädalat (4 h nädalas)",
        resource: "Microsoft Power BI Data Analyst sertifikaadikursus",
        resourceEn: "Microsoft Power BI Data Analyst Certificate",
        handsOn: "Ehita interaktiivne juhtimislaud (dashboard), mis visualiseerib ettevõtte tulemusmõõdikuid.",
        platforms: ["Microsoft Learn", "Coursera", "YouTube"]
      },
      {
        skillName: "Andmeanalüüs ja statistika (Python või R)",
        skillNameEn: "Data Analysis & Statistics (Python / R)",
        category: "technical",
        why: "Võimaldab automatiseerida analüüse, leida seoseid ja teha trendiprognoose suuremate andmehulkade puhul.",
        whyEn: "Enables automation, statistical modeling, and handling datasets beyond Excel's capacity.",
        effort: "~4 nädalat (5 h nädalas)",
        resource: "Python for Data Analysis (Pandas, NumPy) - Kaggle Learn (tasuta)",
        resourceEn: "Python for Data Analysis (Pandas, NumPy) - Kaggle Learn",
        handsOn: "Puhasta ja analüüsi reaalset andmestikku Jupyter Notebookis Pandas teegi abil.",
        platforms: ["Kaggle", "DataCamp", "FreeCodeCamp"]
      },
      {
        skillName: "Kriitiline ja analüütiline mõtlemine",
        skillNameEn: "Critical & Analytical Thinking",
        category: "soft",
        why: "Andmed ise ei ütle midagi ilma oskuseta küsida õigeid küsimusi ja märgata anomaaliaid.",
        whyEn: "Numbers alone mean nothing without the curiosity to ask the right questions and spot anomalies.",
        effort: "~2 nädalat (2 h nädalas)",
        resource: "Data-Driven Decision Making & Business Storytelling",
        resourceEn: "Data-Driven Decision Making & Business Storytelling",
        handsOn: "Sõnasta 3 ärilist hüpoteesi ja pane kokku 5-slaidiline esitlus tulemustest juhtkonnale.",
        platforms: ["Coursera", "Harvard Business Review"]
      }
    ]
  },

  // 3. Veebiarendaja (Frontend)
  {
    goalMatch: ["frontend", "veebiarendaja", "frontend arendaja", "web developer", "react arendaja", "developer"],
    requiredSkills: [
      {
        skillName: "HTML & CSS kaasaegsel tasemel",
        skillNameEn: "Modern Semantic HTML & CSS",
        category: "technical",
        why: "Iga veebirakenduse vundament: semantika, ligipääsetavus (a11y) ja mobiilisõbralik kujundus.",
        whyEn: "The bedrock of web development: semantic structure, accessibility (a11y), and responsive design.",
        effort: "~2–3 nädalat (5 h nädalas)",
        resource: "MDN Web Docs & FreeCodeCamp Responsive Web Design",
        resourceEn: "MDN Web Docs & FreeCodeCamp Responsive Web Design",
        handsOn: "Ehita puhtas HTML/CSS-is täielikult mobiilile ja arvutile kohanduv maandumisleht.",
        platforms: ["MDN Web Docs", "FreeCodeCamp", "Frontend Mentor"]
      },
      {
        skillName: "JavaScript / TypeScript",
        skillNameEn: "JavaScript / TypeScript",
        category: "technical",
        why: "Veebi loogika keel. Kaasaegne arendus eeldab ES6+ süntaksi, DOM-i ja asünkroonse koodi (async/await) valdamist.",
        whyEn: "The core language of modern browsers: ES6+, asynchronous promises, and type safety with TypeScript.",
        effort: "~4–6 nädalat (6 h nädalas)",
        resource: "javascript.info & TypeScript Handbook",
        resourceEn: "javascript.info & TypeScript Handbook",
        handsOn: "Programmeeri interaktiivne veebirakendus (nt ülesannete haldur või valuutakalkulaator) puhtas TypeScriptis.",
        platforms: ["javascript.info", "Scrimba", "FreeCodeCamp"]
      },
      {
        skillName: "React ja kaasaegsed raamistikud",
        skillNameEn: "React & Component Architecture",
        category: "technical",
        why: "Enim nõutud frontend-tehnoloogia tööturul. Õpi ehitama korduvkasutatavaid komponente ja haldama olekut (state).",
        whyEn: "The most sought-after UI library. Teaches component architecture, hooks, and clean state flow.",
        effort: "~4 nädalat (6 h nädalas)",
        resource: "React.dev ametlik interaktiivne õpetus",
        resourceEn: "React.dev official interactive documentation",
        handsOn: "Ehita mitme lehega React rakendus koos otsingu, filtrite ja API andmete kuvamisega.",
        platforms: ["React.dev", "Scrimba", "Coursera"]
      },
      {
        skillName: "Git & versioonihaldus",
        skillNameEn: "Git Version Control & GitHub",
        category: "tool",
        why: "Ilma Gitita ei tööta ükski tarkvaratiim. Oluline on osata harusid luua, pull request'e teha ja konflikte lahendada.",
        whyEn: "Universal team collaboration requirement. Branching, PRs, and collaborative merges.",
        effort: "~1 nädal (4 h)",
        resource: "Git Immersion & GitHub Skills",
        resourceEn: "Git Immersion & GitHub Skills",
        handsOn: "Avalikusta oma projektid GitHubis ja seadista tasuta veebimajutus GitHub Pages või Vercel keskkonnas.",
        platforms: ["GitHub", "YouTube", "Atlassian Git Guide"]
      },
      {
        skillName: "API-d ja veebiteenused",
        skillNameEn: "REST APIs & Asynchronous Data Fetching",
        category: "technical",
        why: "Frontend peab oskama suhelda serveriga, kuvada laadimise ja vigade olekuid ning saata päringuid.",
        whyEn: "Frontends must fetch data asynchronously, handle loading states, and handle network errors cleanly.",
        effort: "~2 nädalat (4 h nädalas)",
        resource: "Postman API 101 & Fetch/Axios juhendid",
        resourceEn: "Postman API 101 & Fetch/Axios Tutorials",
        handsOn: "Ühenda oma rakendus avaliku API-ga (nt ilmateade, riiklikud andmed või filmide andmebaas).",
        platforms: ["MDN", "FreeCodeCamp", "Postman Academy"]
      }
    ]
  },

  // 4. UX/UI Disainer
  {
    goalMatch: ["disainer", "designer", "ux", "ui", "kasutajakogemus", "tootedisainer"],
    requiredSkills: [
      {
        skillName: "Figma & prototüüpimine",
        skillNameEn: "Figma & Interactive Prototyping",
        category: "tool",
        why: "Standardtööriist disainimaailmas. Auto-layout, komponendid ja interaktiivsed prototüübid.",
        whyEn: "The undisputed industry standard for digital product design. Auto-layout, components, and clickable prototypes.",
        effort: "~3 nädalat (5 h nädalas)",
        resource: "Figma官方 YouTube õpetused ja Figma Community failid",
        resourceEn: "Figma Official YouTube Tutorials & Community Practice",
        handsOn: "Disaini mobiilirakenduse 5 põhivaadet Figmas koos töötavate nuppude ja animatsioonidega.",
        platforms: ["Figma Academy", "YouTube", "Coursera"]
      },
      {
        skillName: "Kasutajauuringud ja testimine",
        skillNameEn: "User Research & Usability Testing",
        category: "technical",
        why: "Hea disain lähtub kasutaja tegelikest probleemidest, mitte oletustest.",
        whyEn: "Great interfaces solve real user pain points, proven through testing rather than guesswork.",
        effort: "~2–3 nädalat (3 h nädalas)",
        resource: "Nielsen Norman Group UX Basics & Interaction Design Foundation",
        resourceEn: "Nielsen Norman Group UX Basics & IxDF",
        handsOn: "Viia läbi 3 kasutajatesti oma prototüübiga ja kaardista kitsaskohad.",
        platforms: ["Interaction Design Foundation", "Nielsen Norman Group"]
      },
      {
        skillName: "UI/UX disainipõhimõtted ja disainisüsteemid",
        skillNameEn: "Design Systems, Typography & Color Theory",
        category: "technical",
        why: "Tüpograafia, hierarhia, vahed (spacing) ja värvikasutus loovad professionaalse ja usaldusväärse mulje.",
        whyEn: "Visual rhythm, typography scales, accessible contrast, and reusable design tokens.",
        effort: "~3 nädalat (4 h nädalas)",
        resource: "Refactoring UI raamat & Google Material Design juhend",
        resourceEn: "Refactoring UI Book & Material Design Guidelines",
        handsOn: "Loo mini-disainisüsteem: värvipalett, nupud, sisestusväljad ja tüpograafiline skaala.",
        platforms: ["Refactoring UI", "Material Design", "Medium UX Planet"]
      }
    ]
  }
];

// Helper to extract actual skills from user's raw input
function extractUserSkills(rawInput: string, isEstonian: boolean): Skill[] {
  const normalized = rawInput.toLowerCase();
  const extractedMap = new Map<string, Skill>();

  // 1. Scan against skill catalog
  for (const def of KNOWN_SKILL_CATALOG) {
    const hasMatch = def.keywords.some((kw) => {
      // Use boundary check or substring check
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(normalized) || normalized.includes(kw);
    });

    if (hasMatch) {
      extractedMap.set(def.name, {
        name: isEstonian ? def.name : def.nameEn,
        level: normalized.includes('kogenud') || normalized.includes('senior') || normalized.includes('advanced')
          ? 'advanced'
          : normalized.includes('algaja') || normalized.includes('beginner') || normalized.includes('baas')
            ? 'beginner'
            : 'intermediate',
        source: 'ai_extracted',
        category: def.category
      });
    }
  }

  // 2. Scan for user-listed items (lines with bullets or commas)
  const lines = rawInput.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[•\-*]\s*(.+)$/.test(trimmed)) {
      const match = trimmed.replace(/^[•\-*]\s*/, '').trim();
      if (match.length > 2 && match.length < 40 && !extractedMap.has(match)) {
        extractedMap.set(match, {
          name: match,
          level: 'intermediate',
          source: 'ai_extracted',
          category: 'technical'
        });
      }
    }
  }

  // 3. Fallback: if user input is very short or general, detect baseline strengths
  if (extractedMap.size === 0) {
    if (normalized.includes('klient') || normalized.includes('tugi') || normalized.includes('teenindus')) {
      extractedMap.set('Klienditugi', {
        name: isEstonian ? "Klienditugi ja probleemide lahendamine" : "Customer Support & Problem Solving",
        level: "intermediate",
        source: "ai_extracted",
        category: "soft"
      });
    }
    if (normalized.includes('töö') || normalized.includes('kogemus')) {
      extractedMap.set('Meeskonnatöö', {
        name: isEstonian ? "Meeskonnatöö ja kohusetundlikkus" : "Teamwork & Reliability",
        level: "intermediate",
        source: "ai_extracted",
        category: "soft"
      });
      extractedMap.set('Õppimisvõime', {
        name: isEstonian ? "Kiire kohanemis- ja õppimisvõime" : "Fast Adaptability & Learning",
        level: "intermediate",
        source: "ai_extracted",
        category: "soft"
      });
    }
  }

  // If still empty (e.g. random text), add baseline adaptable qualities
  if (extractedMap.size === 0) {
    extractedMap.set('Analüütiline mõtlemine', {
      name: isEstonian ? "Analüütiline mõtlemine" : "Analytical Thinking",
      level: "intermediate",
      source: "ai_extracted",
      category: "soft"
    });
    extractedMap.set('Eesmärgile pühendumine', {
      name: isEstonian ? "Eesmärgipärasus ja kohusetunne" : "Goal Dedication & Ownership",
      level: "intermediate",
      source: "ai_extracted",
      category: "soft"
    });
  }

  return Array.from(extractedMap.values());
}

// Helper to determine target role requirements
function getTargetRoleRequirements(goalTitle: string, _isEstonian: boolean) {
  const normalizedGoal = goalTitle.toLowerCase();

  for (const role of ROLE_KNOWLEDGE_BASE) {
    if (role.goalMatch.some((m) => normalizedGoal.includes(m))) {
      return role.requiredSkills;
    }
  }

  // Dynamic synthesizer for ANY custom goal!
  const goalWords = goalTitle.split(/\s+/).filter(Boolean);
  const mainTerm = goalWords.join(' ');

  return [
    {
      skillName: `${mainTerm} põhimõisted ja valdkonna raamistik`,
      skillNameEn: `Core Principles of ${mainTerm}`,
      category: "technical" as const,
      why: `Tugev baas võimaldab sul kiiresti orienteeruda ${mainTerm} igapäevastes nõudmistes ja terminoloogias.`,
      whyEn: `A solid foundation helps you navigate daily tasks and terminology of ${mainTerm}.`,
      effort: "~2–3 nädalat (4 h nädalas)",
      resource: "Erialane veebikursus (Coursera / edX) või valdkondlik käsiraamat",
      resourceEn: "Online Course (Coursera / edX) or Industry Handbook",
      handsOn: `Koosta kokkuvõtlik mõttekaart ${mainTerm} peamistest tööülesannetest ja protsessidest.`,
      platforms: ["Coursera", "edX", "Udemy"]
    },
    {
      skillName: "Valdkondlikud digitaalsed tööriistad ja tarkvara",
      skillNameEn: "Industry Standard Digital Tools & Software",
      category: "tool" as const,
      why: "Tööandjad eeldavad oskust kasutada erialast standardtarkvara ja töövooge.",
      whyEn: "Employers expect hands-on proficiency with standard software and operational workflows.",
      effort: "~2 nädalat (4 h nädalas)",
      resource: "Tarkvara ametlikud õppematerjalid ja praktilised videoõpetused",
      resourceEn: "Official Documentation & Video Walkthroughs",
      handsOn: "Tee läbi näidisülesanne valdkonna tarkvaras algusest lõpuni.",
      platforms: ["YouTube", "LinkedIn Learning", "Tarkvara ametlik leht"]
    },
    {
      skillName: "Protsesside juhtimine ja tulemuste mõõtmine",
      skillNameEn: "Process Management & KPI Tracking",
      category: "technical" as const,
      why: "Võime planeerida aega, hallata prioriteete ja jälgida tulemusi eristab tugevat spetsialisti.",
      whyEn: "Ability to manage timelines, prioritize tasks, and track outcomes drives long-term success.",
      effort: "~2 nädalat (3 h nädalas)",
      resource: "Erialane juhtimisjuhend ja praktilised mallid",
      resourceEn: "Practical Operations & Execution Guide",
      handsOn: "Koosta tegevusplaan ja kontroll-leht tüüpilise tööprotsessi tõhusaks läbiviimiseks.",
      platforms: ["Coursera", "Medium", "Harvard Business Review"]
    },
    {
      skillName: "Praktiline proovitöö ja portfoolio koostamine",
      skillNameEn: "Portfolio Project & Applied Case Study",
      category: "technical" as const,
      why: "Tõesta oma uusi oskusi konkreetse tulemusega. Valmis näidistöö veenab tööandjat kõige paremini.",
      whyEn: "Prove your new skills with a real showcase piece. Portfolios speak louder than resumes.",
      effort: "~3 nädalat (5 h nädalas)",
      resource: "Iseseisev praktiline case study ja tulemuste vormistamine",
      resourceEn: "Independent Case Study & Presentation Deck",
      handsOn: `Lahenda terviklik näidisülesanne rolli ${mainTerm} vaatenurgast ja vormista tulemused.`,
      platforms: ["GitHub", "Behance", "LinkedIn"]
    }
  ];
}

// -------------------------------------------------------------
// High-Fidelity Intelligent Offline Analysis Generator
// -------------------------------------------------------------
export function generateIntelligentAnalysis(
  rawInput: string,
  goalTitle: string,
  lang: 'en' | 'et' = 'et'
): GapAnalysis {
  const isEstonian = lang === 'et';
  
  // 1. Extract actual skills from user's input
  const userSkills = extractUserSkills(rawInput, isEstonian);

  // 2. Retrieve structured requirements for the goal
  const roleReqs = getTargetRoleRequirements(goalTitle, isEstonian);

  // 3. Match user skills against role requirements
  const alreadyHaveMap = new Map<string, Skill>();
  const stillNeedMap = new Map<string, Skill>();
  const pathSteps: PathStep[] = [];

  let matchedReqCount = 0;

  roleReqs.forEach((req) => {
    // Check if user has this skill (direct or keyword overlap)
    const isMatched = userSkills.some((us) => {
      const uName = us.name.toLowerCase();
      const rName = req.skillName.toLowerCase();
      const rNameEn = req.skillNameEn.toLowerCase();

      return (
        uName.includes(rName) ||
        rName.includes(uName) ||
        uName.includes(rNameEn) ||
        rNameEn.includes(uName) ||
        // Check partial word stems
        (uName.includes('scrum') && rName.includes('scrum')) ||
        (uName.includes('agile') && rName.includes('agile')) ||
        (uName.includes('jira') && rName.includes('jira')) ||
        (uName.includes('sql') && rName.includes('sql')) ||
        (uName.includes('excel') && rName.includes('excel')) ||
        (uName.includes('figma') && rName.includes('figma')) ||
        (uName.includes('html') && rName.includes('html')) ||
        (uName.includes('javascript') && rName.includes('javascript')) ||
        (uName.includes('react') && rName.includes('react')) ||
        (uName.includes('inglise') && rName.includes('inglise'))
      );
    });

    if (isMatched) {
      matchedReqCount++;
      alreadyHaveMap.set(req.skillName, {
        name: isEstonian ? req.skillName : req.skillNameEn,
        level: 'intermediate',
        source: 'ai_extracted',
        category: req.category
      });
    } else {
      stillNeedMap.set(req.skillName, {
        name: isEstonian ? req.skillName : req.skillNameEn,
        level: 'beginner',
        source: 'ai_extracted',
        category: req.category
      });

      // Add to sequenced learning path
      pathSteps.push({
        order: pathSteps.length + 1,
        title: isEstonian ? req.skillName : req.skillNameEn,
        why: isEstonian ? req.why : req.whyEn,
        estimatedEffort: req.effort,
        suggestedResource: isEstonian ? req.resource : req.resourceEn,
        relatedSkill: isEstonian ? req.skillName : req.skillNameEn,
        completed: false,
        priority: pathSteps.length < 2 ? 'high' : 'medium',
        resourceType: 'course',
        details: {
          overview: isEstonian ? req.why : req.whyEn,
          keyLearningPoints: isEstonian ? [
            `Teooria ja peamised printsiibid`,
            `Igapäevane praktiline rakendamine rollis ${goalTitle}`,
            `Levinud vead ja nende ennetamine`
          ] : [
            `Core theoretical principles`,
            `Practical everyday application in ${goalTitle}`,
            `Best industry workflows & avoiding pitfalls`
          ],
          handsOnProject: req.handsOn,
          recommendedPlatforms: req.platforms
        }
      });
    }
  });

  // Also include remaining user skills as transferable strengths in alreadyHave!
  userSkills.forEach((us) => {
    if (!alreadyHaveMap.has(us.name) && !stillNeedMap.has(us.name)) {
      alreadyHaveMap.set(us.name, us);
    }
  });

  // 4. Calculate dynamic match score
  const totalReqCount = roleReqs.length;
  const baseReqRatio = totalReqCount > 0 ? (matchedReqCount / totalReqCount) : 0;
  const transferableBonus = Math.min(25, (userSkills.length - matchedReqCount) * 5);
  
  // Natural realistic readiness score between 20% and 92%
  let calculatedScore = Math.round(baseReqRatio * 65 + transferableBonus + 15);
  calculatedScore = Math.max(20, Math.min(92, calculatedScore));

  const alreadyHave = Array.from(alreadyHaveMap.values());
  const stillNeed = Array.from(stillNeedMap.values());

  // 5. Generate human, empathetic summary
  let summaryNote = "";
  let encouragingHeadline = "";

  const haveNames = alreadyHave.slice(0, 3).map(s => s.name).join(', ');
  const needNames = stillNeed.slice(0, 2).map(s => s.name).join(', ');

  if (isEstonian) {
    if (calculatedScore >= 70) {
      encouragingHeadline = "Suurepärane stardipositsioon uueks rolliks!";
      summaryNote = `Sul on juba väga hea vundament (${haveNames}). Sihtrolli (${goalTitle}) saavutamiseks vajad peamiselt viimistlust teemadel: ${needNames}.`;
    } else if (calculatedScore >= 45) {
      encouragingHeadline = "Hea baas ja tugevad ülekantavad oskused!";
      summaryNote = `Sinu senine kogemus annab sulle väärtusliku pagasi (${haveNames}). Rolli (${goalTitle}) edukaks täitmiseks tasub sihipäraselt omandada: ${needNames}.`;
    } else {
      encouragingHeadline = "Selge ja samm-sammuline teekond eesmärgini!";
      summaryNote = `Uuele ametikohale (${goalTitle}) liikumine nõuab uusi oskusi. Teekond on üles ehitatud nii, et alustad baasist (${needNames}) ja liigud praktiliste projektideni.`;
    }
  } else {
    if (calculatedScore >= 70) {
      encouragingHeadline = "Outstanding starting position for this role!";
      summaryNote = `You already bring strong foundations (${haveNames}). Bridging into ${goalTitle} will mainly require fine-tuning: ${needNames}.`;
    } else {
      encouragingHeadline = "Strong transferable strengths ready to build upon!";
      summaryNote = `Your existing background provides great transferable strengths (${haveNames}). To step into ${goalTitle}, focus on acquiring: ${needNames}.`;
    }
  }

  return {
    id: 'analysis-' + Date.now(),
    profileId: 'profile-' + Date.now(),
    goalId: goalTitle.toLowerCase().replace(/\s+/g, '-'),
    goalTitle,
    readinessScore: calculatedScore,
    alreadyHave,
    stillNeed,
    path: pathSteps,
    createdAt: new Date().toISOString(),
    categoryBreakdown: {
      technical: Math.min(95, Math.max(30, Math.round(calculatedScore * 0.95))),
      soft: Math.min(95, Math.max(50, Math.round(calculatedScore * 1.15))),
      languages: Math.min(90, Math.max(40, Math.round(calculatedScore * 0.9)))
    },
    summaryNote,
    encouragingHeadline
  };
}
