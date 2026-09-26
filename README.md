# Õpilausuja — AI-Powered Learning & Career Path Builder

> **"See what you already know. Discover what comes next."**  
> *(Eesti keeles: "Sinu CV. Sinu eesmärk. Selge plaan.")*

Õpilausuja is an AI-powered learning and career roadmap builder designed for students, career changers, and professionals upskilling for new opportunities. Instead of overwhelming users with an intimidating list of missing qualifications, Õpilausuja turns skill gaps into an encouraging, sequenced, and achievable learning journey.

---

## 🌟 The Core 4-Step Promise Arc

The application guides learners through a clear 4-step transformation arc:

$$\textbf{What I already know} \longrightarrow \textbf{What I need} \longrightarrow \textbf{What I should learn next} \longrightarrow \textbf{How do I get there}$$

*(Estonian: Mida juba oskad $\rightarrow$ Mida vajad $\rightarrow$ Mida järgmisena õppida $\rightarrow$ Kuidas selleni jõuda)*

1. **What I already know**: Extracts skills and strengths directly from uploaded CVs (PDF/TXT) or free-text descriptions.
2. **What I need**: Analyzes authentic job market requirements for the user's chosen target role or custom ambition.
3. **What I should learn next**: Computes a readiness match score and categorizes competencies into existing strengths vs. gaps.
4. **How do I get there**: Generates a sequenced, step-by-step roadmap with time estimates, rationale, and concrete learning resources.

---

## 🚀 Key Features

- **📄 CV Upload & Text Extraction**: Direct in-browser parsing for PDF and TXT resumes without transmitting sensitive personal data to external storage.
- **🎯 Curated & Custom Goals**: Search from high-demand roles (*Data Analyst, IT Project Manager, Frontend Developer, UX/UI Designer, Cybersecurity, etc.*) or enter custom career titles and job descriptions.
- **📊 Skill Gap Comparison**:
  - Circular readiness gauge (e.g. **68% Sobivus / Match**).
  - Clear visual separation: **"What you already have"** (Teal/Green) vs. **"What you'll need"** (Amber/Orange).
  - Category breakdown bars (*Technical Skills, Soft & Leadership Skills, Languages & Tools*).
  - Interactive skill editor to add custom competencies (`+`) or remove false positives.
- **🗺️ Sequenced Learning Path**:
  - Foundational skills sequenced before advanced specializations.
  - Each milestone includes: **Title**, **Why it matters**, **Estimated effort**, and **Concrete suggested resource** (*Coursera, LinkedIn Learning, EF SET, hands-on capstone*).
  - **Interactive progress tracking**: Marking milestones as completed recalculates the readiness score in real-time and triggers celebratory confetti 🎊.
- **🔍 Step Detail Modal**: Deep-dive into any milestone with syllabus topics, mini-project briefs, and platform recommendations.
- **📱 Dual Display Modes**:
  - **Mobile Phone Simulator (430px)**: Realistic phone frame with dynamic island and thumb-friendly bottom navigation.
  - **Desktop Responsive Dashboard**: Full-screen layout with navigation sidebar and multi-column widgets.
- **💾 Local Persistence & History**:
  - Automatically saves analyses to browser storage.
  - **Side-by-side goal comparison**: Compare two career goals to identify the highest-leverage path.
- **📤 Export & Share**: Copy roadmaps to clipboard as formatted Markdown or download as `.md` files.
- **🌐 Bilingual UI**: Instant 1-click toggle between **Estonian** (🇪🇪) and **English** (🇬🇧).

---

## 🤖 Dual AI Engine Architecture

1. **Built-in Smart Heuristics Engine (Default)**:
   - 100% reliable, fast, and offline-ready for presentations, testing, and pitch judging.
   - Accurately parses backgrounds and builds realistic 5–6 step roadmaps.
2. **External AI Providers**:
   - Configurable in the **Settings** modal.
   - Supports **Google Gemini**, **Anthropic Claude 3.5 Sonnet**, and **OpenAI GPT-4o**.
   - API keys are stored solely in the user's browser `localStorage` and are never logged or stored externally.
3. **Backend API Endpoint**:
   - Implements `POST /api/analyze` adhering to the hackathon specification, returning structured JSON for seamless client integration.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Server:** [Vite 8](https://vite.dev/) with integrated dev server middleware
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Extraction:** [pdfjs-dist](https://github.com/mozilla/pdf.js)
- **Effects:** [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Storage:** HTML5 LocalStorage

---

## 💻 How to Launch on Localhost

Follow these simple steps to run **Õpilausuja** locally on your machine.

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (check version with `node -v`)
- **npm**: v9.0.0 or higher (check version with `npm -v`)

### 2. Quick Start (Step-by-Step)

1. **Open your terminal** (PowerShell, Command Prompt, or Bash) and navigate to the project directory:
   ```bash
   cd c:\Users\akanoni\projects\opilausuja
   ```

2. **Install project dependencies** (only needed on first run):
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Click or navigate in your web browser to:
   👉 **[http://localhost:3000](http://localhost:3000)**

   *(If port 3000 is occupied, Vite will automatically select the next available port, e.g., 3001, and print the active URL in your terminal).*

---

### 3. Testing the Local Backend Endpoint (`/api/analyze`)

The Vite development server includes built-in middleware for the single required API endpoint:

```bash
# Test with cURL:
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"rawInput": "2 years in tech support, basic SQL and Excel", "goalTitle": "Data Analyst"}'
```

Or in **PowerShell**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/analyze" -Method POST -Body '{"rawInput":"2 years tech support", "goalTitle":"Data Analyst"}' -ContentType "application/json" | ConvertTo-Json -Depth 4
```

---

### 4. Available npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local dev server on `http://localhost:3000` with instant Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and builds minified production-ready assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build from `dist/` for final pre-deployment verification. |
| `npm run lint` | Runs the Oxlint linter for code health and syntax checks. |

---

### 5. Troubleshooting Localhost Issues

- **Port already in use (`EADDRINUSE: 3000`)**:
  - Vite automatically picks the next available port (e.g. `3001`). Look at the terminal output for the exact link.
  - Or terminate whatever process is occupying port 3000 in PowerShell:
    ```powershell
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
    ```
- **Blank page or CSS not loading**:
  - Perform a hard refresh in your browser with `Ctrl + F5` (Windows) or `Cmd + Shift + R` (macOS).
- **Clearing local demo data**:
  - Click the **Settings (⚙️)** icon in the top right header of the app and choose **"Clear All Local Data"**.

---

## 🎬 2-Minute Pitch Demo Script

1. **Landing & Promise**:
   - Open [http://localhost:3000](http://localhost:3000).
   - Point out the 4-step promise arc and the winding mountain roadmap illustration.
2. **1-Click Demo Profile**:
   - In the **Quick 1-Click Demo Scenarios** card, click **"Customer Support to Data Analyst"** (or **"Anneli Sepp -> IT projektijuht"**).
3. **AI Analysis State**:
   - Observe the progress states cycling through background reading, goal alignment, and path construction.
4. **Skill Gap Results**:
   - Highlight the **68% Readiness Score** and the encouraging messaging.
   - Point out the green vs. amber split and category breakdown.
5. **Actionable Roadmap**:
   - Click **"View Your Learning Path"**.
   - Show how the steps sequence from foundational SQL to dashboards, Python, and portfolio building.
   - Click a step to open the **Step Deep Dive** modal.
   - Mark a step as done to demonstrate dynamic score recalculation and confetti.
6. **Persistence & Comparison**:
   - Navigate to **History** to demonstrate local persistence and side-by-side goal comparison.

---

## 🔒 Privacy & Data Handling

- No account or sign-up required.
- All CV parsing and analysis happen locally or directly via the user's selected API provider.
- Resume texts are not logged or stored on any external database.

---

## 📄 Configuration

To change the application working title, edit the single constant in [`src/config.ts`](file:///c:/Users/akanoni/projects/opilausuja_1/src/config.ts):

```typescript
export const APP_NAME = "Õpilausuja";
```
