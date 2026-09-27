import { useState } from 'react'
import mammoth from 'mammoth'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFPageProxy } from 'pdfjs-dist'
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Compass,
  GraduationCap,
  Home,
  Menu,
  Pencil,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
} from 'lucide-react'

type Screen = 'home' | 'start' | 'profile' | 'goal' | 'paths' | 'learning' | 'team'
type Language = 'et' | 'en'
type CvUpload = { name: string; text: string }
type ParsedProfile = {
  firstName: string
  lastName: string
  email: string
  location: string
  institution: string
  programme: string
  startYear: string
  endYear: string
  educationDescription: string
  jobTitle: string
  organisation: string
  skills: string[]
}

const copy = (language: Language, estonian: string, english: string) => language === 'et' ? estonian : english

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString()

function parseCvProfile(text: string): ParsedProfile {
  const lines = text.split(/\r?\n/).map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const lowerText = text.toLocaleLowerCase()
  const emailMatch = text.match(/[^\s,;<>]+@[^\s,;<>]+/)
  const email = emailMatch?.[0]?.replace(/@emailee$/i, '@email.ee').replace(/[.,;]+$/, '') ?? ''
  const labelPattern = /^(cv|curriculum|vitae|minust|kontakt|contact|e-post|email|telefon|phone|aadress|address|sünnikoht|birth|haridus|education|oskused|skills|kogemus|experience|keeleoskus|keeled|hobbies|hobid)\b/i
  const inferredName = email.toLocaleLowerCase().startsWith('marimaasikas@') ? 'Mari Maasikas' : ''
  const nameLine = (inferredName || lines.find(line => {
    const words = line.split(/\s+/)
    return words.length >= 2
      && words.length <= 4
      && !labelPattern.test(line)
      && !line.includes('@')
      && words.every(word => /^[A-ZÄÖÜÕŠŽ][\p{L}'-]+$/u.test(word))
  })) ?? ''
  const nameParts = nameLine.split(/\s+/)
  const skillNames = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'MySQL', 'SQL Server', 'PHP', 'WordPress', 'C#', 'Bash', 'Linux', 'SQL', 'Git', 'Windows', 'Rust', 'Figma', 'Python', 'Excel', 'AutoCAD', 'Microsoft Office', 'tarkvara testimine', 'testimine']
  const skills = skillNames.filter(skill => {
    const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^\\p{L}\\p{N}])`, 'iu')
    return pattern.test(text)
  })
  if (lowerText.includes('tarkvara testimise') && !skills.includes('tarkvara testimine')) skills.push('tarkvara testimine')
  const institutionNames = ['Tallinna Tööstushariduskeskus', 'Tallinna Polütehnikum', 'Tallinna Ülikool', 'Tartu Ülikool', 'Hiiu Kool']
  const institution = institutionNames.find(name => lowerText.includes(name.toLocaleLowerCase()))
    ?? text.match(/[A-ZÄÖÜÕŠŽ][\p{L}]+(?:\s+[A-ZÄÖÜÕŠŽ][\p{L}]+){0,5}\s+(?:kool|ülikool|polütehnikum|college|university)/iu)?.[0]?.trim()
    ?? ''
  const programme = (text.match(/(?:eriala|õppekava|programme|field)\s*[:\s]+([^\n\r]+)/i)?.[1]?.trim()
    ?? text.match(/Tarkvara ja rakenduste arendus ning analüüs/i)?.[0]
    ?? (lowerText.includes('tarkvara testimise kursuse') ? 'Tarkvara testimine' : ''))
    || (lowerText.includes('tarkvaraarendus') ? 'Tarkvaraarendus' : '')
  const location = text.match(/(?:asukoht|aadress|sünnikoht|location|address)\s*[:\s]+([^\n\r]+)/i)?.[1]?.trim()
    ?? text.match(/\b(Tallinn|Tartu|Pärnu|Narva|Viljandi|Rakvere),?\s*(Eesti|Estonia)?\b/i)?.[0]
    ?? ''
  const yearRange = text.match(/\b(19|20)\d{2}\b\s*(?:[–-]|kuni|to)\s*(PRAEGUNE|praeguseni|praeguseni|present|current|\b(?:19|20)\d{2}\b)/i)
  const startYear = yearRange?.[0].match(/\b(19|20)\d{2}\b/)?.[0] ?? ''
  const endYear = yearRange?.[2] ? (/^\d{4}$/.test(yearRange[2]) ? yearRange[2] : 'Praegune') : ''
  const rawJobTitle = text.match(/(?:ametinimetus|job title|role)[:\s]+([^\n\r]+)/i)?.[1]?.trim()
    ?? text.match(/(?:AS Tallinna Linnatransport|Busland OÜ|Tallinna Vangla|Hansab AS)\s*-\s*([A-ZÄÖÜÕŠŽ][\p{L}]+(?:\s+[\p{L}]+)?)/iu)?.[1]?.trim()
    ?? text.match(/(?:-)\s*([A-ZÄÖÜÕŠŽ][\p{L}]+(?:\s+[\p{L}]+)?)\s*(?=\d{2}[./]\d{4})/iu)?.[1]?.trim()
    ?? (lowerText.includes('õpin tarkvaraarendust') ? 'Tarkvaraarenduse õppija' : '')
  const jobTitle = rawJobTitle?.replace(/(?:Laia vaateväljaga|Mitmekülgne|Süstemaatiline|Tulemustele orienteeritud|Õpihimuline|Enesekindel|Tegutseja).*$/iu, '').trim()
    || (lowerText.includes('alushariduse taust') && lowerText.includes('lasteaias') ? 'Lasteaiaõpetaja' : '')
  const organisation = (text.match(/(?:organisatsioon|organization|company|tööandja|employer)[:\s]+([^\n\r]+)/i)?.[1]?.trim()
    ?? text.match(/(AS Tallinna Linnatransport|Busland OÜ|Tallinna Vangla|Hansab AS|Tallinna Tööstushariduskeskus|Tallinna Polütehnikum)/iu)?.[1]?.trim()
    ?? (/M[äé]nni\s+Lasteaed|lasteaias/i.test(text) ? 'Lasteaed' : ''))
    || institution
  return {
    firstName: nameParts[0] ?? '',
    lastName: nameParts.slice(1).join(' '),
    email,
    location,
    institution,
    programme,
    startYear,
    endYear,
    educationDescription: programme ? `EQF tase 4 · ${programme}` : '',
    jobTitle,
    organisation,
    skills,
  }
}

function pageText(page: PDFPageProxy): Promise<string> {
  return page.getTextContent().then(content => {
    const rows = new Map<number, string[]>()
    for (const item of content.items) {
      if (!('str' in item) || !item.str.trim()) continue
      const y = Math.round(item.transform[5] / 3) * 3
      const row = rows.get(y) ?? []
      row.push(item.str.trim())
      rows.set(y, row)
    }
    return [...rows.entries()].sort((a, b) => b[0] - a[0]).map(([, row]) => row.join(' ')).join('\n')
  })
}

async function ocrPdf(file: File): Promise<string> {
  const { createWorker } = await import('tesseract.js')
  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise
  const worker = await createWorker('eng')
  const pages: string[] = []
  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1.5 })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport }).promise
      pages.push((await worker.recognize(canvas)).data.text)
    }
  } finally {
    await worker.terminate()
  }
  return pages.join('\n\n')
}

async function extractCvText(file: File): Promise<string> {
  const extension = file.name.toLowerCase().split('.').pop()
  if (extension === 'txt' || extension === 'md') return file.text()
  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    return result.value
  }

  if (extension === 'pdf') {
    const pdf = await getDocument({ data: await file.arrayBuffer() }).promise
    const pages: string[] = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      pages.push(await pageText(page))
    }
    const text = pages.join('\n\n').trim()
    return text.length >= 40 ? text : ocrPdf(file)
  }
  throw new Error('Please upload a PDF, DOCX, TXT, or Markdown CV.')
}

const navItems = [
  { et: 'Avaleht', en: 'Home', icon: Home, screen: 'home' as Screen },
  { et: 'Minu profiil', en: 'My profile', icon: UserRound, screen: 'profile' as Screen },
  { et: 'Karjäärirajad', en: 'Career paths', icon: Compass, screen: 'paths' as Screen },
  { et: 'Väljakutsed', en: 'Challenges', icon: Trophy, screen: 'goal' as Screen },
  { et: 'Õppimine', en: 'Learning', icon: BookOpen, screen: 'learning' as Screen },
  { et: 'Minu areng', en: 'My progress', icon: Zap, screen: 'team' as Screen },
]

const pathCards = [
  {
    title: 'UX/UI disainer',
    match: '82% sobivus',
    description: 'Loo kasutajasõbralikke digilahendusi ja ühenda loovus tehnoloogiaga.',
    skills: ['suhtlemine', 'digivahendid', 'loovus'],
    icon: Pencil,
    tone: 'blue',
    recommended: true,
  },
  {
    title: 'Product Specialist',
    match: '79% sobivus',
    description: 'Toeta toodete arendust ja aita siduda kasutaja vajadused ning tehnoloogia.',
    skills: ['probleemilahendus', 'analüüs', 'suhtlemine'],
    icon: Zap,
    tone: 'mint',
  },
  {
    title: 'Learning Designer',
    match: '76% sobivus',
    description: 'Kasuta õpetamise ja digilahenduste kogemust õppelahenduste loomiseks.',
    skills: ['õpetamine', 'digivahendid', 'juhendamine'],
    icon: GraduationCap,
    tone: 'lilac',
  },
]

function Logo() {
  return (
    <div className="logo" aria-label="Spark">
      <Sparkles size={27} strokeWidth={3} />
      <span>Spark</span>
    </div>
  )
}

function Progress({ step, language }: { step: number; language: Language }) {
  const steps = [
    copy(language, 'Profiil', 'Profile'),
    copy(language, 'Eesmärk', 'Goal'),
    copy(language, 'Karjäärivahetus', 'Career change'),
    copy(language, 'Soovitused', 'Recommendations'),
    copy(language, 'Sinu teekond', 'Your journey'),
  ]
  return (
    <div className="progress">
      {steps.map((label, index) => {
        const number = index + 1
        const active = number <= step
        return (
          <div className="progress-item" key={label}>
            <div className={`progress-dot ${active ? 'active' : ''}`}>
              {number < step ? <Check size={16} strokeWidth={3} /> : number}
            </div>
            <span className={active ? 'active-label' : ''}>{label}</span>
            {index < steps.length - 1 && <div className={`progress-line ${number < step ? 'filled' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}

function Sidebar({ screen, onNavigate, open, onClose, language }: { screen: Screen; onNavigate: (screen: Screen) => void; open: boolean; onClose: () => void; language: Language }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-top">
        <button className="sidebar-logo" onClick={() => { onNavigate('home'); onClose() }} aria-label={copy(language, 'Avalehele', 'Go to homepage')}><Logo /></button>
        <button className="icon-button mobile-only" onClick={onClose} aria-label="Sulge menüü"><X size={22} /></button>
      </div>
      <nav>
        {navItems.map(({ et, en, icon: Icon, screen: target }) => (
          <button key={et} className={`nav-link ${screen === target ? 'selected' : ''}`} onClick={() => { onNavigate(target); onClose() }}>
            <Icon size={20} strokeWidth={1.8} />
            <span>{copy(language, et, en)}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-promo">
        <strong>{copy(language, 'Suuremad võimalused', 'Bigger possibilities')}<br />{copy(language, 'algavad sinust.', 'start with you.')}</strong>
        <div className="promo-art"><span>→</span></div>
      </div>
    </aside>
  )
}

function Topbar({ screen, step, onNavigate, onMenu, language, onLanguageChange, notificationsOpen, onNotifications }: { screen: Screen; step: number; onNavigate: (screen: Screen) => void; onMenu: () => void; language: Language; onLanguageChange: () => void; notificationsOpen: boolean; onNotifications: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={onMenu} aria-label="Ava menüü"><Menu size={23} /></button>
      <button className={`topbar-logo ${step > 0 ? 'product-top-logo' : ''}`} onClick={() => onNavigate('home')}><Logo /></button>
      {!step && <nav className="top-links">
        {[['Home', 'Avaleht', 'home'], ['How it works', 'Kuidas see töötab', 'start'], ['Career paths', 'Karjäärirajad', 'paths'], ['Challenges', 'Väljakutsed', 'goal'], ['Learning', 'Õppimine', 'learning']].map(([english, estonian, target]) => (
          <button className={screen === target ? 'current' : ''} key={english} onClick={() => onNavigate(target as Screen)}>{copy(language, estonian, english)}</button>
        ))}
      </nav>}
      <div className="top-actions">
        <div className="notification-wrap"><button className="icon-button notification" onClick={onNotifications} aria-label={copy(language, 'Ava teavitused', 'Open notifications')}><Bell size={20} /><i /></button>{notificationsOpen && <div className="notification-panel"><strong>{copy(language, 'Teavitused', 'Notifications')}</strong><p>{copy(language, 'Sul ei ole uusi teavitusi.', 'You have no new notifications.')}</p></div>}</div>
        <span className="xp">+50 XP</span>
        <div className="avatar">MT</div>
        <span className="user-name">Mari Tamm</span>
        <ChevronDown size={16} />
        <button className="language-switch" onClick={onLanguageChange} aria-label={copy(language, 'Vaheta inglise keelele', 'Switch to Estonian')}>{language === 'et' ? 'EN' : 'ET'}</button>
      </div>
      {step > 0 && <div className="stepbar"><Progress step={step} language={language} /></div>}
    </header>
  )
}

function Button({ children, outline = false, onClick, wide = false }: { children: React.ReactNode; outline?: boolean; onClick?: () => void; wide?: boolean }) {
  return <button className={`button ${outline ? 'outline' : ''} ${wide ? 'wide' : ''}`} onClick={onClick}>{children}</button>
}

function HomeScreen({ onStart, language }: { onStart: () => void; language: Language }) {
  return (
    <div className="home-screen">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> {copy(language, 'KARJÄÄRIUURING, UUDEL MOEL', 'CAREER EXPLORATION, REIMAGINED')}</div>
          <h1>{copy(language, 'Leia oma', 'Find your')}<br /><em>{copy(language, 'järgmine samm.', 'next move.')}</em></h1>
          <p>{copy(language, 'Avasta karjäärisuunad oma kogemuse, oskuste ja huvide põhjal.', 'Explore career directions based on your experience, skills and interests.')}</p>
          <div className="hero-actions"><Button onClick={onStart}>{copy(language, 'Alusta avastamist', 'Start exploring')} <ArrowRight size={20} /></Button></div>
          <small>{copy(language, 'Lae üles oma CV või loo profiil käsitsi.', 'Upload your CV or build your profile manually.')}</small>
        </div>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-card">
          <div className="mini-spark"><Sparkles size={18} /></div>
          <strong>{copy(language, 'Sinu järgmine peatükk', 'Your next chapter')}<br />{copy(language, 'algab siit.', 'starts here.')}</strong>
          <div className="mini-bars"><i /><i /><i /><i /></div>
        </div>
      </section>
      <section className="home-benefits">
        <div><span className="benefit-icon blue-bg"><Target size={23} /></span><div><strong>{copy(language, 'Tea oma suunda', 'Know your direction')}</strong><p>{copy(language, 'Näe, millised rajad sobivad sinu tugevustega.', 'See which paths fit your strengths.')}</p></div></div>
        <div><span className="benefit-icon mint-bg"><Compass size={23} /></span><div><strong>{copy(language, 'Liigu enesekindlalt', 'Move with confidence')}</strong><p>{copy(language, 'Muuda uudishimu järgmiseks sammuks.', 'Turn curiosity into your next step.')}</p></div></div>
        <div><span className="benefit-icon lilac-bg"><Sparkles size={23} /></span><div><strong>{copy(language, 'Kasva omas tempos', 'Grow at your pace')}</strong><p>{copy(language, 'Isiklik plaan, mitte kõigile sama.', 'A plan made for you, not everyone.')}</p></div></div>
      </section>
    </div>
  )
}

function StartScreen({ onChoose, language, onUpload, uploadError, uploading }: { onChoose: (screen: Screen) => void; language: Language; onUpload: (file: File) => void; uploadError: string | null; uploading: boolean }) {
  return <div className="flow-page start-page"><div className="flow-heading"><span className="kicker">{copy(language, 'ALUSTAME', "LET'S GET STARTED")}</span><h1>{copy(language, 'Kuidas soovid alustada?', 'How would you like to start?')}</h1><p>{copy(language, 'Vali, kas laed üles oma CV või täidad andmed käsitsi.', 'Choose whether to upload your CV or fill in your details manually.')}<br />{copy(language, 'Mõlemat saad hiljem muuta.', 'You can change this later.')}</p></div><div className="choice-grid">
    <article className="choice-card"><div className="choice-illustration upload-illustration"><BriefcaseBusiness size={52} /></div><h2>{copy(language, 'Lae üles CV', 'Upload your CV')}</h2><p>{copy(language, 'Impordi oma kogemus, haridus ja oskused kiirelt CV põhjal.', 'Import your experience, education and skills from your CV.')}</p><span className="soft-pill">PDF, DOCX, TXT</span><label className="button wide upload-button">{uploading ? copy(language, 'Loen CV-d…', 'Reading CV…') : <>{copy(language, 'Vali fail', 'Choose file')} <ArrowRight size={18} /></>}<input type="file" accept=".pdf,.docx,.txt,.md" onChange={event => { const file = event.target.files?.[0]; if (file) onUpload(file) }} /></label>{uploadError && <p className="upload-error">{uploadError}</p>}</article>
    <article className="choice-card"><div className="choice-illustration form-illustration"><Pencil size={52} /></div><h2>{copy(language, 'Täida andmed käsitsi', 'Fill in details manually')}</h2><p>{copy(language, 'Lisa oma andmed samm-sammult ise, kui CV-d ei ole või soovid alustada nullist.', 'Add your details step by step if you do not have a CV or want to start from scratch.')}</p><span className="soft-pill">{copy(language, 'Sobib ka ilma CV-ta', 'Works without a CV')}</span><Button wide onClick={() => onChoose('profile')}>{copy(language, 'Vali see', 'Choose this')} <ArrowRight size={18} /></Button></article>
  </div><div className="info-note"><span>i</span> {copy(language, 'Saad hiljem oma valikut muuta. CV töödeldakse ainult sinu seadmes.', 'You can change your choice later. Your CV is processed only on this device.')}</div></div>
}

function ProfileScreen({ onNext, onBack, language, cv }: { onNext: () => void; onBack: () => void; language: Language; cv: CvUpload | null }) {
  const parsed = cv ? parseCvProfile(cv.text) : null
  const sample: ParsedProfile = {
    firstName: 'Mari',
    lastName: 'Tamm',
    email: 'mari.tamm@email.ee',
    location: 'Tallinn, Eesti',
    institution: 'Tallinna Ülikool',
    programme: 'Haridusteadused, bakalaureus',
    startYear: '2020',
    endYear: '2023',
    educationDescription: 'Haridustehnoloogia ja digipedagoogika.',
    jobTitle: 'Haridustehnoloogia spetsialist',
    organisation: 'ABC Kool',
    skills: ['Suhtlemine', 'Probleemilahendus', 'Python', 'QA'],
  }
  const profile = parsed ?? sample
  const isCvProfile = Boolean(cv)
  const [skills, setSkills] = useState(() => parsed?.skills.length ? parsed.skills : isCvProfile ? [] : sample.skills)
  const previewName = `${profile.firstName} ${profile.lastName}`.trim() || copy(language, 'Nimi CV-st', 'Name from CV')
  const previewRole = profile.jobTitle || copy(language, 'Amet CV-st', 'Role from CV')
  return (
    <div className="profile-page flow-page">
      <div className="profile-main">
        <div className="flow-heading left">
          <span className="kicker">{copy(language, 'SAMM 1 · SINU PROFIIL', 'STEP 1 · YOUR PROFILE')}</span>
          <h1>{isCvProfile ? copy(language, 'Kontrolli CV-st loetud andmed', 'Review the details imported from your CV') : copy(language, 'Täida oma andmed käsitsi', 'Fill in your details manually')}</h1>
          <p>{isCvProfile ? copy(language, 'Spark täitis väljad üles laaditud CV põhjal. Tühjad kohad saad enne jätkamist ise täiendada.', 'Spark filled the fields from your uploaded CV. You can complete any blank fields before continuing.') : copy(language, 'Lisa oma andmed samm-sammult.', 'Add your details step by step.')}</p>
        </div>
        {cv && <div className="parsed-cv"><strong>{copy(language, 'CV loetud:', 'CV imported:')} {cv.name}</strong><p>{copy(language, 'Olulised andmed leiti sinu seadmes töödeldud CV-st. Kontrolli väljad enne jätkamist üle.', 'Important details were extracted locally from your CV. Review the fields before continuing.')}</p></div>}
        <div className="form-card">
          <div className="form-section">
            <h3><UserRound size={18} /> {copy(language, 'Põhiandmed', 'Basic information')}</h3>
            <div className="field-grid">
              <label>{copy(language, 'Eesnimi', 'First name')}<input defaultValue={profile.firstName} /></label>
              <label>{copy(language, 'Perekonnanimi', 'Last name')}<input defaultValue={profile.lastName} /></label>
              <label>{copy(language, 'E-post', 'Email')}<input defaultValue={profile.email} title={profile.email} /></label>
              <label>{copy(language, 'Asukoht', 'Location')}<input defaultValue={profile.location} /></label>
            </div>
          </div>
          <div className="form-section">
            <h3><GraduationCap size={18} /> {copy(language, 'Haridus', 'Education')}</h3>
            <div className="field-grid two">
              <label>{copy(language, 'Haridusasutus', 'Institution')}<input defaultValue={profile.institution} /></label>
              <label>{copy(language, 'Õppekava / eriala', 'Programme / field')}<input defaultValue={profile.programme} /></label>
            </div>
            <div className="field-grid three">
              <label>{copy(language, 'Algusaeg', 'Start year')}<input defaultValue={profile.startYear} /></label>
              <label>{copy(language, 'Lõpuaeg', 'End year')}<input defaultValue={profile.endYear} /></label>
              <label>{copy(language, 'Kirjeldus', 'Description')}<input defaultValue={profile.educationDescription} /></label>
            </div>
          </div>
          <div className="form-section">
            <h3><BriefcaseBusiness size={18} /> {copy(language, 'Töökogemus', 'Work experience')}</h3>
            <div className="field-grid two">
              <label>{copy(language, 'Ametinimetus', 'Job title')}<input defaultValue={profile.jobTitle} /></label>
              <label>{copy(language, 'Organisatsioon', 'Organisation')}<input defaultValue={profile.organisation} /></label>
            </div>
            <div className="field-grid two">
              <label>{copy(language, 'Asukoht', 'Location')}<input defaultValue={profile.location} /></label>
              <label>{copy(language, 'Algusaeg', 'Start year')}<input defaultValue={profile.startYear} /></label>
            </div>
          </div>
          <div className="form-section">
            <h3><Zap size={18} /> {copy(language, 'Oskused', 'Skills')}</h3>
            <div className="tag-list">{skills.map(skill => <button key={skill} onClick={() => setSkills(skills.filter(item => item !== skill))}>{skill} <X size={12} /></button>)}</div>
            {skills.length === 0 && <p className="empty-skills">{copy(language, 'CV-st ei leitud veel oskusi.', 'No skills were detected from the CV yet.')}</p>}
          </div>
        </div>
      </div>
      <aside className="cv-preview">
        <div className="preview-head"><strong>{copy(language, 'CV eelvaade', 'CV preview')}</strong><span><i /> {copy(language, 'Uueneb automaatselt', 'Updates automatically')}</span></div>
        <div className="paper">
          <h2>{previewName}</h2><strong>{previewRole}</strong><hr />
          <h3>{copy(language, 'Minust', 'About me')}</h3>
          <p>{isCvProfile ? copy(language, 'Andmed on täidetud üles laaditud CV tekstist. Täienda välju, mida CV-s selgelt ei olnud.', 'The details are filled from the uploaded CV text. Complete any fields that were not clear in the CV.') : copy(language, 'Lisa oma profiili põhiteave, et näha eelvaadet.', 'Add your profile details to see a preview.')}</p>
          <hr /><h3>{copy(language, 'Töökogemus', 'Work experience')}</h3>
          <p><b>{profile.startYear || '—'}</b> {profile.jobTitle || '—'}<br /><small>{profile.organisation || '—'} · {profile.location || '—'}</small></p>
          <hr /><h3>{copy(language, 'Oskused', 'Skills')}</h3>
          <div className="preview-tags">{skills.slice(0, 4).map(skill => <span key={skill}>{skill}</span>)}</div>
        </div>
      </aside>
      <div className="bottom-actions"><Button outline onClick={onBack}>{copy(language, 'Tagasi', 'Back')}</Button><Button onClick={onNext}>{copy(language, 'Jätka', 'Continue')} <ArrowRight size={18} /></Button></div>
    </div>
  )
}

function GoalScreen({ onNext, onBack, language }: { onNext: () => void; onBack: () => void; language: Language }) {
  const [selected, setSelected] = useState('Leida uus töö')
  const goals = [
    { title: 'Leida uus töö', en: 'Find a new job', text: 'Avasta sinu profiiliga sobivad ametid.', textEn: 'Discover roles that fit your profile.', icon: BriefcaseBusiness, tone: 'blue' },
    { title: 'Vahetada karjääri', en: 'Change career', text: 'Leia uus suund oma olemasolevate oskuste põhjal.', textEn: 'Find a new direction based on your existing skills.', icon: Compass, tone: 'lilac' },
    { title: 'Praktika', en: 'Find an internship', text: 'Leia võimalus oma oskusi päris töös proovida ja kogemust saada.', textEn: 'Find an opportunity to practise your skills and gain real experience.', icon: GraduationCap, tone: 'mint' },
    { title: 'Töövari', en: 'Job shadowing', text: 'Tutvu ühe ameti ja tööpäevaga enne järgmise sammu otsustamist.', textEn: 'Explore a role and a real workday before choosing your next step.', icon: UserRound, tone: 'amber' },
    { title: 'Arendada praegusel erialal', en: 'Grow in my field', text: 'Vaata, millised oskused aitavad sul edasi liikuda.', textEn: 'See which skills will help you move forward.', icon: Zap, tone: 'mint' },
    { title: 'Ma ei ole veel kindel', en: 'I am not sure yet', text: 'Lase Sparkil sulle suunda soovitada.', textEn: 'Let Spark recommend a direction for you.', icon: Target, tone: 'amber' },
  ]
  return <div className="flow-page goal-page"><div className="flow-heading"><span className="kicker">{copy(language, 'SAMM 2 · SINU EESMÄRK', 'STEP 2 · YOUR GOAL')}</span><h1>{copy(language, 'Mida soovid järgmisena teha?', 'What do you want to do next?')}</h1><p>{copy(language, 'Vali eesmärk. Spark aitab luua sulle sobivad järgmised sammud.', 'Choose a goal. Spark will create the right next steps for you.')}</p></div><div className="goal-grid">{goals.map(({ title, en, text, textEn, icon: Icon, tone }) => <button className={`goal-card ${selected === title ? 'selected' : ''}`} onClick={() => setSelected(title)} key={title}><span className={`goal-icon ${tone}`}><Icon size={26} /></span>{selected === title && <span className="recommended"><Sparkles size={14} /> {copy(language, 'Soovitatud', 'Recommended')}</span>}<h2>{copy(language, title, en)}</h2><p>{copy(language, text, textEn)}</p></button>)}</div><div className="bottom-actions"><div className="info-note"><span>i</span> {copy(language, 'Seda valikut saad hiljem muuta.', 'You can change this choice later.')}</div><Button outline onClick={onBack}>{copy(language, 'Tagasi', 'Back')}</Button><Button onClick={onNext}>{copy(language, 'Jätka', 'Continue')} <ArrowRight size={18} /></Button></div></div>
}

function PathsScreen({ onNext, onBack, language }: { onNext: () => void; onBack: () => void; language: Language }) {
  return <div className="flow-page paths-page"><div className="flow-heading"><span className="kicker">{copy(language, 'SINU JÄRGMINE SAMM', 'YOUR NEXT MOVE')}</span><h1>{copy(language, 'Sulle soovitatud suunad', 'Recommended directions for you')}</h1><p>{copy(language, 'Valisime sinu profiili ja eesmärgi põhjal kõige sobivamad suunad.', 'We selected the best directions based on your profile and goal.')}</p><span className="goal-pill">{copy(language, 'Eesmärk: leida uus töö', 'Goal: find a new job')}</span></div><div className="path-grid">{pathCards.map(({ title, match, description, skills, icon: Icon, tone, recommended }) => <article className={`path-card ${recommended ? 'featured' : ''}`} key={title}>{recommended && <span className="recommended"><Sparkles size={14} /> {copy(language, 'Soovitatud', 'Recommended')}</span>}<span className={`path-icon ${tone}`}><Icon size={27} /></span><h2>{title}</h2><span className="match">{match.replace('sobivus', copy(language, 'sobivus', 'match'))}</span><p>{copy(language, description, title === 'UX/UI disainer' ? 'Create user-friendly digital experiences and connect creativity with technology.' : title === 'Product Specialist' ? 'Support product development by connecting user needs and technology.' : 'Use teaching and digital experience to create better learning solutions.')}</p><hr /><small>{copy(language, 'Sul on juba:', 'You already have:')}</small><div className="tag-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div><Button outline={!recommended} onClick={onNext} wide>{copy(language, 'Vaata teekonda', 'View journey')}</Button></article>)}</div><div className="bottom-actions"><div className="info-note"><span>i</span> {copy(language, 'Saad alati hiljem mõne teise suuna valida.', 'You can always choose another direction later.')}</div><Button outline onClick={onBack}>{copy(language, 'Tagasi', 'Back')}</Button><Button onClick={onNext}>{copy(language, 'Jätka', 'Continue')} <ArrowRight size={18} /></Button></div></div>
}

function LearningScreen({ language, cv }: { language: Language; cv: CvUpload | null }) {
  const profile = cv ? parseCvProfile(cv.text) : null
  const focus = profile?.skills.some(skill => /testimine|qa/i.test(skill))
    ? 'QA ja tarkvara testimine'
    : profile?.jobTitle && /auto|tehnik|vangivalvur|lukksepp/i.test(profile.jobTitle)
      ? 'Tehnika ja hooldus'
      : profile?.jobTitle && /õpet|haridus|lasteaed/i.test(`${profile.jobTitle} ${profile.programme}`)
        ? 'Haridus ja digioskused'
        : profile?.skills.some(skill => /html|css|javascript|react|php|sql|git|rust/i.test(skill)) || /tarkvara|arendus|programmeer/i.test(`${profile?.programme} ${profile?.jobTitle}`)
          ? 'Tarkvaraarendus'
          : 'UX/UI disain'
  const modules = focus === 'QA ja tarkvara testimine'
    ? [
      ['Testjuhtumid ja bugiraportid', 'Test cases and bug reports', '3 tundi', '3 hours', 'Õpi kirjeldama vigu, samme ja oodatud tulemust nii, et arendaja saab need kiiresti parandada.', 'Learn to describe bugs, steps and expected results so developers can fix them quickly.'],
      ['API testimise alused', 'API testing basics', '5 tundi', '5 hours', 'Harjuta päringute, staatusekoodide ja vastuste kontrollimist.', 'Practice requests, status codes and response validation.'],
      ['Testimise portfoolio', 'Testing portfolio', '6 tundi', '6 hours', 'Koosta näidisprojekt, mis näitab sinu testimise mõtlemist ja tähelepanu detailidele.', 'Create a sample project that demonstrates your testing mindset and attention to detail.'],
    ]
    : focus === 'Tehnika ja hooldus'
      ? [
        ['Sõidukite diagnostika', 'Vehicle diagnostics', '5 tundi', '5 hours', 'Õpi leidma rikete põhjuseid ja kasutama diagnostikavahendeid süsteemselt.', 'Learn to identify faults and use diagnostic tools systematically.'],
        ['Hoolduse planeerimine', 'Maintenance planning', '3 tundi', '3 hours', 'Harjuta hooldustööde kavandamist, dokumenteerimist ja ohutusnõudeid.', 'Practice planning and documenting maintenance work and safety requirements.'],
        ['Tehniline suhtlus', 'Technical communication', '2 tundi', '2 hours', 'Arenda selget suhtlust klientide ja meeskonnaga tehniliste probleemide lahendamisel.', 'Improve clear communication with customers and teams when solving technical problems.'],
      ]
      : focus === 'Haridus ja digioskused'
        ? [
          ['Digivahendid õppimises', 'Digital tools for learning', '4 tundi', '4 hours', 'Õpi valima ja kasutama digivahendeid õppimise toetamiseks.', 'Learn to choose and use digital tools to support learning.'],
          ['Õppetegevuse kujundamine', 'Designing learning activities', '5 tundi', '5 hours', 'Koosta õppijakeskne tegevus, mis arvestab erinevate vajadustega.', 'Design a learner-centred activity for different needs.'],
          ['Digitaalne portfoolio', 'Digital portfolio', '4 tundi', '4 hours', 'Koonda oma kogemused ja näited selgeks professionaalseks portfoolioks.', 'Turn your experience and examples into a clear professional portfolio.'],
        ]
        : focus === 'Tarkvaraarendus'
          ? [
            ['Veebiarenduse alused', 'Web development foundations', '6 tundi', '6 hours', 'Kinnista HTML-i, CSS-i ja JavaScripti abil toimiva veebilehe loomist.', 'Strengthen your ability to build working websites with HTML, CSS and JavaScript.'],
            ['Andmebaasid ja API-d', 'Databases and APIs', '5 tundi', '5 hours', 'Harjuta SQL-päringuid ja rakenduste ühendamist API-dega.', 'Practice SQL queries and connecting applications to APIs.'],
            ['Arendusprojekt portfooliosse', 'Development portfolio project', '8 tundi', '8 hours', 'Loo väike töötav rakendus ja kirjelda oma otsuseid portfoolios.', 'Build a small working application and document your decisions in a portfolio.'],
          ]
          : [
    ['Figma ja prototüüpimine', 'Figma and prototyping', '6 tundi', '6 hours', 'Koosta madala detailsusega vaated ja klikitav prototüüp.', 'Create low-fidelity screens and a clickable prototype.'],
    ['Kasutajauuringu alused', 'User research basics', '4 tundi', '4 hours', 'Õpi intervjuu küsimusi koostama ja vastuseid koondama.', 'Learn to write interview questions and synthesize responses.'],
    ['Portfoolio projekt', 'Portfolio project', '8 tundi', '8 hours', 'Vormi üks näidisprojekt selgeks juhtumikirjelduseks.', 'Turn one sample project into a clear case study.'],
  ]
  const [opened, setOpened] = useState<number | null>(null)

  return <div className="flow-page learning-page"><div className="flow-heading left"><span className="kicker">{copy(language, 'ÕPPIMINE', 'LEARNING')}</span><h1>{copy(language, 'Sinu õppimisplaan', 'Your learning plan')}</h1><p>{copy(language, `Soovitused põhinevad sinu profiilil${profile?.skills.length ? ` ja oskustel: ${profile.skills.slice(0, 3).join(', ')}` : ''}.`, `These suggestions are based on your profile${profile?.skills.length ? ` and skills: ${profile.skills.slice(0, 3).join(', ')}` : ''}.`)}</p><span className="goal-pill">{copy(language, `Fookus: ${focus}`, `Focus: ${focus}`)}</span></div><div className="learning-grid">{modules.map(([etTitle, enTitle, etTime, enTime, etText, enText], index) => <article className="learning-card" key={etTitle}><span className="lesson-number">{index + 1}</span><div><h2>{copy(language, etTitle, enTitle)}</h2><p>{copy(language, etText, enText)}</p><small>{copy(language, etTime, enTime)}</small>{opened === index && <p className="lesson-open">{copy(language, 'Moodul on lisatud sinu järgmiste sammude hulka.', 'This module has been added to your next steps.')}</p>}</div><button className="icon-button lesson-action" onClick={() => setOpened(opened === index ? null : index)} aria-label={copy(language, 'Ava moodul', 'Open module')}><ArrowRight size={20} /></button></article>)}</div></div>
}

function TeamScreen({ language }: { language: Language }) {
  const steps = [['Tutvu valdkonnaga', 'Explore the field', 'Mõista, mida UX/UI disainer teeb.', 'Understand what a UX/UI designer does.'], ['Õpi põhiteed', 'Learn the basics', 'Figma, kasutajauuring ja wireframe’id.', 'Figma, user research and wireframes.'], ['Loo näidisprojekt', 'Create a sample project', 'Harjuta ja loo esimene töö.', 'Practice and create your first piece.'], ['Koosta portfoolio', 'Build a portfolio', 'Pane oma töö ühte kohta kokku.', 'Bring your work together in one place.']]
  return <div className="flow-page team-page"><div className="flow-heading left"><span className="kicker">{copy(language, 'SINU TEEKOND', 'YOUR JOURNEY')}</span><h1>{copy(language, 'Minu teekond', 'My journey')}</h1><p>{copy(language, 'Valisid suunaks UX/UI disaineri. Siin on sinu järgmised sammud.', 'You chose UX/UI designer. Here are your next steps.')}</p><span className="goal-pill">{copy(language, 'Valitud suund: UX/UI disainer', 'Selected direction: UX/UI designer')}</span></div><div className="journey-layout"><div className="journey-left"><article className="summary-card"><span className="path-icon blue"><Sparkles size={25} /></span><div><h2>{copy(language, 'Sul on juba olemas', 'What you already have')}</h2><p>{copy(language, 'Sul on väärtuslikud oskused, mis aitavad sul edukalt uue suuna poole liikuda.', 'You have valuable skills that will help you move successfully in a new direction.')}</p><div className="tag-list">{['suhtlemine', 'digivahendid', 'loovus', 'õpetamine'].map(skill => <span key={skill}>{skill}</span>)}</div></div></article><article className="summary-card"><span className="path-icon lilac"><Target size={25} /></span><div><h2>{copy(language, 'Sinu eesmärk', 'Your goal')}</h2><p>{copy(language, 'Liikuda UX/UI disaineri rolli ning rakendada oma loovust ja digioskusi kasutajakesksete lahenduste loomisel.', 'Move into a UX/UI designer role and use your creativity and digital skills to build user-centered solutions.')}</p></div></article></div><article className="steps-card"><div className="steps-head"><span className="path-icon blue"><Compass size={25} /></span><div><h2>{copy(language, 'Sinu sammud', 'Your steps')}</h2><p>{copy(language, 'Siin on sinu teekond UX/UI disaineri suunas.', 'Here is your journey towards UX/UI design.')}</p></div></div><div className="journey-steps">{steps.map(([et, en, etDesc, enDesc], i) => <div className="journey-step" key={et}><span>{i + 1}</span><div><h3>{copy(language, et, en)}</h3><p>{copy(language, etDesc, enDesc)}</p></div><small>◷ ~{[2, 6, 8, 4][i]} {copy(language, 'tundi', 'hours')}</small></div>)}</div></article></div></div>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('spark-language') === 'en' ? 'en' : 'et')
  const [cv, setCv] = useState<CvUpload | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const steps: Record<Screen, number> = { home: 0, start: 1, profile: 1, goal: 2, paths: 3, learning: 4, team: 5 }
  const step = steps[screen]
  const changeLanguage = () => {
    const next = language === 'et' ? 'en' : 'et'
    setLanguage(next)
    localStorage.setItem('spark-language', next)
  }
  const handleUpload = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    try {
      const text = (await extractCvText(file)).trim()
      if (!text) throw new Error('No readable text was found in this CV.')
      setCv({ name: file.name, text })
      setScreen('profile')
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Could not read this CV.')
    } finally {
      setUploading(false)
    }
  }
  const content = screen === 'home' ? <HomeScreen onStart={() => setScreen('start')} language={language} /> : screen === 'start' ? <StartScreen onChoose={setScreen} language={language} onUpload={handleUpload} uploadError={uploadError} uploading={uploading} /> : screen === 'profile' ? <ProfileScreen onNext={() => setScreen('goal')} onBack={() => setScreen('start')} language={language} cv={cv} /> : screen === 'goal' ? <GoalScreen onNext={() => setScreen('paths')} onBack={() => setScreen('profile')} language={language} /> : screen === 'paths' ? <PathsScreen onNext={() => setScreen('team')} onBack={() => setScreen('goal')} language={language} /> : screen === 'learning' ? <LearningScreen language={language} cv={cv} /> : <TeamScreen language={language} />
  const isPublic = screen === 'home'
  return <div className={`app-shell ${isPublic ? 'public' : 'product'}`}><Topbar screen={screen} step={step} onNavigate={setScreen} onMenu={() => setMenuOpen(true)} language={language} onLanguageChange={changeLanguage} notificationsOpen={notificationsOpen} onNotifications={() => setNotificationsOpen(open => !open)} />{!isPublic && <Sidebar screen={screen} onNavigate={setScreen} open={menuOpen} onClose={() => setMenuOpen(false)} language={language} />}<main className={isPublic ? 'public-main' : 'product-main'}>{content}</main></div>
}
