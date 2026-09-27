import { useState } from 'react'
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

type Screen = 'home' | 'start' | 'profile' | 'goal' | 'paths' | 'team'

const navItems = [
  { label: 'Avaleht', icon: Home, screen: 'home' as Screen },
  { label: 'Minu profiil', icon: UserRound, screen: 'profile' as Screen },
  { label: 'Karjäärirajad', icon: Compass, screen: 'paths' as Screen },
  { label: 'Väljakutsed', icon: Trophy, screen: 'goal' as Screen },
  { label: 'Õppimine', icon: BookOpen, screen: 'paths' as Screen, activeScreen: null },
  { label: 'Minu areng', icon: Zap, screen: 'team' as Screen },
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

function Progress({ step }: { step: number }) {
  const steps = ['Profiil', 'Eesmärk', 'Karjäärivahetus', 'Soovitused', 'Sinu teekond']
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

function Sidebar({ screen, onNavigate, open, onClose }: { screen: Screen; onNavigate: (screen: Screen) => void; open: boolean; onClose: () => void }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-top">
        <div className="sidebar-logo"><Logo /></div>
        <button className="icon-button mobile-only" onClick={onClose} aria-label="Sulge menüü"><X size={22} /></button>
      </div>
      <nav>
        {navItems.map(({ label, icon: Icon, screen: target, activeScreen }) => (
          <button key={label} className={`nav-link ${screen === (activeScreen === undefined ? target : activeScreen) ? 'selected' : ''}`} onClick={() => { onNavigate(target); onClose() }}>
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-promo">
        <strong>Suuremad võimalused<br />algavad sinust.</strong>
        <div className="promo-art"><span>→</span></div>
      </div>
    </aside>
  )
}

function Topbar({ screen, step, onNavigate, onMenu }: { screen: Screen; step: number; onNavigate: (screen: Screen) => void; onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={onMenu} aria-label="Ava menüü"><Menu size={23} /></button>
      <button className={`topbar-logo ${step > 0 ? 'product-top-logo' : ''}`} onClick={() => onNavigate('home')}><Logo /></button>
      {!step && <nav className="top-links">
        {['Home', 'How it works', 'Career paths', 'Challenges', 'Pricing'].map((item, index) => (
          <button className={index === 0 && screen === 'home' ? 'current' : ''} key={item} onClick={() => index === 0 ? onNavigate('home') : onNavigate('paths')}>{item}</button>
        ))}
      </nav>}
      <div className="top-actions">
        <button className="icon-button notification"><Bell size={20} /><i /></button>
        <span className="xp">+50 XP</span>
        <div className="avatar">MT</div>
        <span className="user-name">Mari Tamm</span>
        <ChevronDown size={16} />
      </div>
      {step > 0 && <div className="stepbar"><Progress step={step} /></div>}
    </header>
  )
}

function Button({ children, outline = false, onClick, wide = false }: { children: React.ReactNode; outline?: boolean; onClick?: () => void; wide?: boolean }) {
  return <button className={`button ${outline ? 'outline' : ''} ${wide ? 'wide' : ''}`} onClick={onClick}>{children}</button>
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="home-screen">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> CAREER EXPLORATION, REIMAGINED</div>
          <h1>Find your<br /><em>next move.</em></h1>
          <p>Explore career directions based on your<br className="desktop-only" /> experience, skills and interests.</p>
          <div className="hero-actions"><Button onClick={onStart}>Start exploring <ArrowRight size={20} /></Button><Button outline onClick={onStart}>Sign in</Button></div>
          <small>Upload your CV or build your profile manually.</small>
        </div>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-card">
          <div className="mini-spark"><Sparkles size={18} /></div>
          <strong>Your next chapter<br />starts here.</strong>
          <div className="mini-bars"><i /><i /><i /><i /></div>
        </div>
      </section>
      <section className="home-benefits">
        <div><span className="benefit-icon blue-bg"><Target size={23} /></span><div><strong>Know your direction</strong><p>See which paths fit your strengths.</p></div></div>
        <div><span className="benefit-icon mint-bg"><Compass size={23} /></span><div><strong>Move with confidence</strong><p>Turn curiosity into your next step.</p></div></div>
        <div><span className="benefit-icon lilac-bg"><Sparkles size={23} /></span><div><strong>Grow at your pace</strong><p>A plan made for you, not everyone.</p></div></div>
      </section>
    </div>
  )
}

function StartScreen({ onChoose }: { onChoose: (screen: Screen) => void }) {
  return <div className="flow-page start-page"><div className="flow-heading"><span className="kicker">LET'S GET STARTED</span><h1>Kuidas soovid alustada?</h1><p>Vali, kas laed üles oma CV või täidad andmed käsitsi.<br />Mõlemat saad hiljem muuta.</p></div><div className="choice-grid">
    <article className="choice-card"><div className="choice-illustration upload-illustration"><BriefcaseBusiness size={52} /></div><h2>Lae üles CV</h2><p>Impordi oma kogemus, haridus ja oskused kiirelt CV põhjal.</p><span className="soft-pill">PDF, DOC või DOCX</span><Button wide onClick={() => onChoose('profile')}>Vali see <ArrowRight size={18} /></Button></article>
    <article className="choice-card"><div className="choice-illustration form-illustration"><Pencil size={52} /></div><h2>Täida andmed käsitsi</h2><p>Lisa oma andmed samm-sammult ise, kui CV-d ei ole või soovid alustada nullist.</p><span className="soft-pill">Sobib ka ilma CV-ta</span><Button wide onClick={() => onChoose('profile')}>Vali see <ArrowRight size={18} /></Button></article>
  </div><div className="info-note"><span>i</span> Saad hiljem oma valikut muuta.</div></div>
}

function ProfileScreen({ onNext }: { onNext: () => void }) {
  const [skills, setSkills] = useState(['Suhtlemine', 'Probleemilahendus', 'Python', 'QA'])
  return <div className="profile-page flow-page"><div className="profile-main"><div className="flow-heading left"><span className="kicker">STEP 1 · YOUR PROFILE</span><h1>Täida oma andmed käsitsi</h1><p>Lisa oma andmed samm-sammult. Spark kasutab seda, et soovitada sulle sobivaid karjääriradu.</p></div><div className="form-card"><div className="form-section"><h3><UserRound size={18} /> Põhiandmed</h3><div className="field-grid"><label>Eesnimi<input defaultValue="Mari" /></label><label>Perekonnanimi<input defaultValue="Tamm" /></label><label>E-post<input defaultValue="mari.tamm@email.ee" /></label><label>Asukoht<input defaultValue="Tallinn, Eesti" /></label></div></div><div className="form-section"><h3><GraduationCap size={18} /> Haridus</h3><div className="field-grid two"><label>Haridusasutus<input defaultValue="Tallinna Ülikool" /></label><label>Õppekava / eriala<input defaultValue="Haridusteadused, bakalaureus" /></label></div><div className="field-grid three"><label>Algusaeg<input defaultValue="2020" /></label><label>Lõpuaeg<input defaultValue="2023" /></label><label>Kirjeldus<input defaultValue="Haridustehnoloogia ja digipedagoogika." /></label></div><button className="add-row">＋ Lisa haridus</button></div><div className="form-section"><h3><BriefcaseBusiness size={18} /> Töökogemus</h3><div className="field-grid two"><label>Ametinimetus<input defaultValue="Haridustehnoloogia spetsialist" /></label><label>Organisatsioon<input defaultValue="ABC Kool" /></label></div><div className="field-grid two"><label>Asukoht<input defaultValue="Tallinn, Eesti" /></label><label>Algusaeg<input defaultValue="2023" /></label></div><button className="add-row">＋ Lisa töökogemus</button></div><div className="form-section"><h3><Zap size={18} /> Oskused</h3><div className="tag-list">{skills.map(skill => <button key={skill} onClick={() => setSkills(skills.filter(item => item !== skill))}>{skill} <X size={12} /></button>)}</div><button className="add-row">＋ Lisa oskus</button></div></div></div><aside className="cv-preview"><div className="preview-head"><strong>CV eelvaade</strong><span><i /> Uueneb automaatselt</span></div><div className="paper"><h2>Mari Tamm</h2><strong>Haridustehnoloogia spetsialist</strong><hr /><h3>Minust</h3><p>Haridustehnoloogia spetsialist, kelle kirg on kaasaegsete õppelahenduste arendamine ja õpetajate toetamine.</p><hr /><h3>Töökogemus</h3><p><b>2023 –</b> Haridustehnoloogia spetsialist<br /><small>ABC Kool · Tallinn, Eesti</small></p><hr /><h3>Oskused</h3><div className="preview-tags">{skills.slice(0, 4).map(skill => <span key={skill}>{skill}</span>)}</div></div></aside><div className="bottom-actions"><Button outline>Tagasi</Button><Button onClick={onNext}>Jätka <ArrowRight size={18} /></Button></div></div>
}

function GoalScreen({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState('Leida uus töö')
  const goals = [{ title: 'Leida uus töö', text: 'Avasta sinu profiiliga sobivad ametid.', icon: BriefcaseBusiness, tone: 'blue' }, { title: 'Vahetada karjääri', text: 'Leia uus suund oma olemasolevate oskuste põhjal.', icon: Compass, tone: 'lilac' }, { title: 'Arendada praegusel erialal', text: 'Vaata, millised oskused aitavad sul edasi liikuda.', icon: Zap, tone: 'mint' }, { title: 'Ma ei ole veel kindel', text: 'Lase Sparkil sulle suunda soovitada.', icon: Target, tone: 'amber' }]
  return <div className="flow-page goal-page"><div className="flow-heading"><span className="kicker">STEP 2 · YOUR GOAL</span><h1>Mida soovid järgmisena teha?</h1><p>Vali eesmärk. Spark aitab luua sulle sobivad järgmised sammud.</p></div><div className="goal-grid">{goals.map(({ title, text, icon: Icon, tone }) => <button className={`goal-card ${selected === title ? 'selected' : ''}`} onClick={() => setSelected(title)} key={title}><span className={`goal-icon ${tone}`}><Icon size={26} /></span>{selected === title && <span className="recommended"><Sparkles size={14} /> Soovitatud</span>}<h2>{title}</h2><p>{text}</p></button>)}</div><div className="bottom-actions"><div className="info-note"><span>i</span> Seda valikut saad hiljem muuta.</div><Button onClick={onNext}>Jätka <ArrowRight size={18} /></Button></div></div>
}

function PathsScreen({ onNext }: { onNext: () => void }) {
  return <div className="flow-page paths-page"><div className="flow-heading"><span className="kicker">YOUR NEXT MOVE</span><h1>Sulle soovitatud suunad</h1><p>Valisime sinu profiili ja eesmärgi põhjal kõige sobivamad suunad.</p><span className="goal-pill">Eesmärk: leida uus töö</span></div><div className="path-grid">{pathCards.map(({ title, match, description, skills, icon: Icon, tone, recommended }) => <article className={`path-card ${recommended ? 'featured' : ''}`} key={title}>{recommended && <span className="recommended"><Sparkles size={14} /> Soovitatud</span>}<span className={`path-icon ${tone}`}><Icon size={27} /></span><h2>{title}</h2><span className="match">{match}</span><p>{description}</p><hr /><small>Sul on juba:</small><div className="tag-list">{skills.map(skill => <span key={skill}>{skill}</span>)}</div><Button outline={!recommended} onClick={onNext} wide>Vaata teekonda</Button></article>)}</div><div className="bottom-actions"><div className="info-note"><span>i</span> Saad alati hiljem mõne teise suuna valida.</div><Button onClick={onNext}>Jätka <ArrowRight size={18} /></Button></div></div>
}

function TeamScreen() {
  const steps = ['Tutvu valdkonnaga', 'Õpi põhiteed', 'Loo näidisprojekt', 'Koosta portfoolio']
  return <div className="flow-page team-page"><div className="flow-heading left"><span className="kicker">YOUR JOURNEY</span><h1>Minu teekond</h1><p>Valisid suunaks UX/UI disaineri. Siin on sinu järgmised sammud.</p><span className="goal-pill">Valitud suund: UX/UI disainer</span></div><div className="journey-layout"><div className="journey-left"><article className="summary-card"><span className="path-icon blue"><Sparkles size={25} /></span><div><h2>Sul on juba olemas</h2><p>Sul on väärtuslikud oskused, mis aitavad sul edukalt uue suuna poole liikuda.</p><div className="tag-list">{['suhtlemine', 'digivahendid', 'loovus', 'õpetamine'].map(skill => <span key={skill}>{skill}</span>)}</div></div></article><article className="summary-card"><span className="path-icon lilac"><Target size={25} /></span><div><h2>Sinu eesmärk</h2><p>Liikuda UX/UI disaineri rolli ning rakendada oma loovust ja digioskusi kasutajakesksete lahenduste loomisel.</p></div></article></div><article className="steps-card"><div className="steps-head"><span className="path-icon blue"><Compass size={25} /></span><div><h2>Sinu sammud</h2><p>Siin on sinu teekond UX/UI disaineri suunas.</p></div></div><div className="journey-steps">{steps.map((step, i) => <div className="journey-step" key={step}><span>{i + 1}</span><div><h3>{step}</h3><p>{['Mõista, mida UX/UI disainer teeb.', 'Figma, kasutajauuring ja wireframe’id.', 'Harjuta ja loo esimene töö.', 'Pane oma töö ühte kohta kokku.'][i]}</p></div><small>◷ ~{[2, 6, 8, 4][i]} tundi</small></div>)}</div></article></div></div>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const steps: Record<Screen, number> = { home: 0, start: 1, profile: 1, goal: 2, paths: 3, team: 5 }
  const step = steps[screen]
  const content = screen === 'home' ? <HomeScreen onStart={() => setScreen('start')} /> : screen === 'start' ? <StartScreen onChoose={setScreen} /> : screen === 'profile' ? <ProfileScreen onNext={() => setScreen('goal')} /> : screen === 'goal' ? <GoalScreen onNext={() => setScreen('paths')} /> : screen === 'paths' ? <PathsScreen onNext={() => setScreen('team')} /> : <TeamScreen />
  const isPublic = screen === 'home'
  return <div className={`app-shell ${isPublic ? 'public' : 'product'}`}><Topbar screen={screen} step={step} onNavigate={setScreen} onMenu={() => setMenuOpen(true)} />{!isPublic && <Sidebar screen={screen} onNavigate={setScreen} open={menuOpen} onClose={() => setMenuOpen(false)} />}<main className={isPublic ? 'public-main' : 'product-main'}>{content}</main></div>
}
