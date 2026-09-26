import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function apiAnalyzePlugin(): Plugin {
  return {
    name: 'api-analyze-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const rawInput = parsed.rawInput || '';
              const goalTitle = parsed.goalTitle || 'Data Analyst';

              // Return structured response as specified in Section 7 of Hackathon prompt
              const responseData = {
                readinessScore: 68,
                alreadyHave: [
                  { name: "Excel & Pivot Tables" },
                  { name: "SQL Queries (SELECT, JOIN)" },
                  { name: "Problem Solving" },
                  { name: "Customer Communication" }
                ],
                stillNeed: [
                  { name: "Advanced SQL (Window Functions)" },
                  { name: "Python for Data Analysis (Pandas)" },
                  { name: "Power BI / Tableau Dashboards" },
                  { name: "Applied Business Statistics" }
                ],
                path: [
                  {
                    order: 1,
                    title: "Advanced SQL & Data Transformation",
                    why: "Builds on your SQL fundamentals to master analytical queries and CTEs.",
                    estimatedEffort: "~2 weeks (5 hrs/week)",
                    suggestedResource: "Interactive SQL Course (e.g. DataCamp or Mode Analytics)",
                    relatedSkill: "Advanced SQL"
                  },
                  {
                    order: 2,
                    title: "Interactive Dashboards in Power BI / Tableau",
                    why: "Allows you to transform query results into visual executive reporting.",
                    estimatedEffort: "~3 weeks (4 hrs/week)",
                    suggestedResource: "Microsoft Power BI Data Analyst Certificate",
                    relatedSkill: "BI Dashboards"
                  },
                  {
                    order: 3,
                    title: "Python for Data Analysis (Pandas & Seaborn)",
                    why: "Automate repetitive data cleaning tasks and analyze complex metrics.",
                    estimatedEffort: "~4 weeks (5 hrs/week)",
                    suggestedResource: "FreeCodeCamp: Data Analysis with Python Certification",
                    relatedSkill: "Python (Pandas)"
                  },
                  {
                    order: 4,
                    title: "Practical Business Statistics & A/B Testing",
                    why: "Differentiate real signal from statistical noise when presenting insights.",
                    estimatedEffort: "~2 weeks (3 hrs/week)",
                    suggestedResource: "Khan Academy: Statistics & Probability for Data Science",
                    relatedSkill: "Applied Statistics"
                  },
                  {
                    order: 5,
                    title: "Portfolio Capstone Case Study & GitHub Showcase",
                    why: "Tangible evidence to present during job interviews.",
                    estimatedEffort: "~2 weeks (5 hrs/week)",
                    suggestedResource: "Public GitHub Repository with documented README",
                    relatedSkill: "Portfolio Presentation"
                  }
                ]
              };

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(responseData));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiAnalyzePlugin()],
  server: {
    port: 3000,
    host: true,
  }
})
