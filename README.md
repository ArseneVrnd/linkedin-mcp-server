# LinkedIn Job Tracker - Enhanced Fork

> **Forked from:** [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)
>
> **Enhanced with:** Full-stack job application tracker + AI-powered CV/cover letter generation

<p align="left">
  <a href="https://pypi.org/project/linkedin-scraper-mcp/" target="_blank"><img src="https://img.shields.io/pypi/v/linkedin-scraper-mcp?color=blue" alt="PyPI"></a>
  <a href="https://github.com/stickerdaniel/linkedin-mcp-server/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-Apache%202.0-brightgreen?labelColor=32383f" alt="License"></a>
  <a href="https://claude.ai/download" target="_blank"><img src="https://img.shields.io/badge/Claude_Code-Required-blue" alt="Claude Code"></a>
</p>

---

## 🎯 What This Fork Adds

This fork extends the original LinkedIn MCP Server with a **complete job application management system**:

### ✨ New Features

1. **📊 Full-Stack Dashboard** - React + Express + SQLite job tracker
2. **🤖 AI CV Adaptation** - Automatically tailors your resume to each job (finance-focused)
3. **✍️ AI Cover Letter Generation** - Creates comprehensive 500-700 word cover letters
4. **🏷️ Intelligent Auto-Tagging** - Automatically categorizes jobs (Remote, Senior, High Salary, etc.)
5. **📈 Analytics Dashboard** - Track success metrics, conversion rates, time-to-interview
6. **🗂️ Kanban Pipeline** - Drag-and-drop job status management
7. **⚡ Keyboard Shortcuts** - Fast workflow navigation (Ctrl+N, Ctrl+I, etc.)
8. **📅 Scheduled Searches** - Automated job discovery with cron
9. **🎨 Skills Gap Analysis** - Identify missing skills for target roles
10. **📄 PDF Export** - Generate professional CVs directly from dashboard

### 🤖 AI-Powered Automation

**🔑 Key Benefit:** With a Claude Code subscription, you get **automatic** CV and cover letter generation for every job you scrape - **no API keys, no extra costs**.

When you import jobs from LinkedIn, Claude automatically:
- Adapts your CV to match the job description
- Generates a tailored 500-700 word cover letter
- Saves everything to your dashboard for review

**Just scrape → Claude handles the rest → You review and apply!**

---

## 🚀 Quick Start (3 Steps)

### Prerequisites
- **[Claude Code](https://claude.com/claude-code)** - Required for AI automation (paid subscription)
- **[Node.js 20+](https://nodejs.org/)** - For the dashboard
- **[Python 3.12+](https://www.python.org/downloads/)** with [uv](https://docs.astral.sh/uv/)
- **[Playwright](https://playwright.dev/)** - For LinkedIn scraping

### Step 1: Set Up LinkedIn MCP Server

```bash
# Clone this repo
git clone https://github.com/ArseneVrnd/linkedin-mcp-server
cd linkedin-mcp-server

# Install dependencies
uv sync
uv run playwright install chromium

# Create LinkedIn session (opens browser for login)
uv run linkedin-scraper-mcp --get-session --no-headless
```

### Step 2: Start the Dashboard

**Terminal 1 - MCP Server:**
```bash
cd linkedin-mcp-server
uv run linkedin-scraper-mcp
```

**Terminal 2 - Backend:**
```bash
cd dashboard/server
npm install
npm run dev
# Runs on http://localhost:3001
```

**Terminal 3 - Frontend:**
```bash
cd dashboard/client
npm install
npm run dev
# Opens http://localhost:5173
```

### Step 3: Use Claude Code

Open the dashboard in your browser, then use Claude Code to scrape jobs. Claude will **automatically** generate CVs and cover letters for each job!

```
# Example: Scrape jobs via Claude Code
Search for "Business Analyst" jobs in "Paris" on LinkedIn
```

Claude detects new jobs and runs:
- `/adapt-resume [job-id]` → Tailored CV saved to `cvs_adaptes/`
- `/generate-cover-letter [job-id]` → Cover letter saved to database

---

## 📚 Documentation

### For Users
- **[QUICK_START.md](QUICK_START.md)** - Detailed setup guide
- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** - Full feature documentation
- **[SKILLS_CREATED.md](SKILLS_CREATED.md)** - AI skills usage guide
- **[.claude/skills/README.md](.claude/skills/README.md)** - Skills technical documentation

### For Developers
- **[CLAUDE.md](CLAUDE.md)** - Development guide & architecture
- **[MEMORY.md](C:\Users\arsen\.claude\projects\d--linkedin-scraper\memory\MEMORY.md)** - Project patterns & lessons learned
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute

---

## 🏗️ Architecture

```
linkedin-mcp-server/
├── linkedin_mcp_server/          # Python MCP server (original + enhanced)
│   └── tools/job.py              # Enhanced scraping (10+ fields)
├── dashboard/
│   ├── server/                   # Express + SQLite backend
│   │   ├── src/
│   │   │   ├── routes/           # API endpoints
│   │   │   ├── utils/            # Auto-tagging, helpers
│   │   │   ├── scheduler.js      # Cron automation
│   │   │   └── db.js             # Database + migrations
│   │   └── data/
│   │       └── tracker.db        # SQLite database
│   └── client/                   # React + Vite frontend
│       └── src/
│           ├── pages/            # Dashboard, Jobs, Pipeline, etc.
│           ├── components/       # UI components
│           └── hooks/            # React hooks
├── cvs_adaptes/                  # Generated CVs (1 per company)
├── .claude/                      # Claude Code configuration
│   └── skills/                   # AI skills (resume, cover letter)
│       ├── adapt-resume.md       # CV adaptation skill
│       ├── generate-cover-letter.md  # Cover letter skill
│       └── README.md             # Skills documentation
├── CLAUDE.md                     # Development guide
└── README.md                     # This file
```

---

## 🎨 Features in Detail

### 1. LinkedIn MCP Server (Original + Enhanced)

**Original Features:**
- ✅ Get person profiles
- ✅ Get company profiles
- ✅ Get company posts
- ✅ Search jobs
- ✅ Get job details

**Enhancements:**
- ✅ Extract 10+ additional fields per job (skills, salary, seniority, remote status, benefits, applicants count)
- ✅ Parse structured data from LinkedIn insights
- ✅ Auto-detect remote/hybrid positions
- ✅ Extract skills from job criteria

### 2. Job Application Tracker Dashboard

**Core Features:**
- 📋 Job list table with filters, search, bulk operations
- 🗂️ Kanban pipeline (Saved → Applied → Interview → Offer → Accepted/Rejected)
- 📊 Analytics dashboard (conversion rates, success metrics)
- 🏷️ Intelligent auto-tagging (Remote, Senior, High Salary, etc.)
- 📅 Saved search profiles with scheduling
- ⚡ Keyboard shortcuts (Ctrl+N, Ctrl+I, Ctrl+P, etc.)

**Data Management:**
- SQLite database with auto-migrations
- Bulk operations (update status, add tags, delete)
- Export/import capabilities
- Version control for CVs (saved by company name)

### 3. AI-Powered Content Generation

#### 📄 Resume/CV Adaptation Skill

**Location:** `.claude/skills/adapt-resume.md`

Automatically adapts your CV to match job descriptions:
- 🔍 Skill gap analysis (strong matches vs. gaps)
- 🏢 Industry context detection (Finance, Tech, Consulting, Corporate)
- 🔑 ATS keyword optimization
- 💰 Finance-specific terminology (P&L, DCF, EBITDA, FP&A)
- 📊 Quantified achievements (%, $, time metrics)
- 📁 Saves to `cvs_adaptes/CV_Arsene_Vuarand_{CompanyName}.txt`

**Output Example:**
```
📄 CV ADAPTED FOR: JPMorgan Chase - Business Analyst

🎯 KEY CHANGES:
- Reordered competencies to prioritize financial analysis
- Added P&L, FP&A, financial modeling keywords
- Emphasized $4M margin improvement at HP

🔑 KEYWORD OPTIMIZATION:
- Matched: 18/22 required skills (82%)

⚠️ SKILL GAPS:
- SQL Server Reporting Services (SSRS)
- Mitigation: Emphasize Power BI expertise
```

#### ✍️ Cover Letter Generation Skill

**Location:** `.claude/skills/generate-cover-letter.md`

Generates comprehensive, personalized cover letters (500-700 words):
- 🎯 Company-specific opening hook with research
- 📖 STAR format examples (Situation, Task, Action, Result)
- 💼 Industry-appropriate tone (formal for finance, casual for startups)
- 🎨 Cultural fit demonstration
- ❌ No generic clichés ("team player," "hit the ground running")
- 💾 Saves to database via `/api/jobs/:jobId/cover-letters`

**5-Paragraph Structure:**
1. **Opening (100-120w):** Attention-grabbing hook with company insight
2. **Body Para 1 (140-160w):** Core competency with detailed example
3. **Body Para 2 (140-160w):** Technical/analytical strength
4. **Body Para 3 (120-140w):** Cultural fit or unique differentiator
5. **Closing (80-100w):** Strong conclusion with call-to-action

---

## 🔧 Configuration

### LinkedIn Session Management

LinkedIn sessions are stored in `~/.linkedin-mcp/session.json`. Sessions may expire periodically.

**To refresh your session:**
```bash
uv run linkedin-scraper-mcp --get-session --no-headless
```

This opens a browser where you can log in (handles 2FA, captcha, etc.).

### Database Schema

The tracker uses SQLite with auto-migrations. Schema includes:

**Tables:**
- `jobs` - Job listings (title, company, description, skills, salary, status, etc.)
- `tags` - Custom tags for categorization
- `job_tags` - Many-to-many relationship
- `cover_letters` - Generated cover letters
- `saved_searches` - Scheduled search profiles
- `notes` - Job-specific notes
- `interviews` - Interview tracking

**Auto-Migration:**
When you start the server, it automatically adds new columns if they don't exist. No manual migrations needed!

### Environment Variables

**Backend (dashboard/server/.env):**
```env
PORT=3001
DATABASE_PATH=./data/tracker.db
NODE_ENV=development
```

**Frontend (dashboard/client/.env):**
```env
VITE_API_URL=http://localhost:3001
```

---

## 📖 Usage Guide

### Workflow

**1. Scrape Jobs from LinkedIn**
```
# Via Claude Code in the dashboard
"Search for Business Analyst jobs in Paris"
```

**2. Claude Auto-Generates Content**
- Detects new jobs in database
- Adapts CV for each job
- Generates cover letter for each job
- Reports completion

**3. Review in Dashboard**
- Open http://localhost:5173
- View generated CVs in `cvs_adaptes/`
- View cover letters in job detail panel
- Edit if needed

**4. Apply**
- Export CV as PDF (via JobDetail component)
- Copy cover letter text
- Apply on company website or LinkedIn
- Update status to "Applied"

**5. Track Progress**
- Move jobs through pipeline (Kanban board)
- Add notes, schedule interviews
- Track success metrics in analytics

### API Endpoints

**Jobs:**
- `GET /api/jobs` - List jobs (with filters, search, pagination)
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `POST /api/jobs/bulk/update-status` - Bulk status update
- `POST /api/jobs/bulk/add-tag` - Bulk add tag
- `POST /api/jobs/:id/auto-tag` - Auto-tag single job
- `POST /api/jobs/auto-tag-all` - Auto-tag all jobs

**Cover Letters:**
- `GET /api/jobs/:jobId/cover-letters` - List cover letters
- `POST /api/jobs/:jobId/cover-letters` - Save cover letter
- `DELETE /api/cover-letters/:id` - Delete cover letter

**Saved Searches:**
- `GET /api/saved-searches` - List searches
- `POST /api/saved-searches` - Create search
- `PUT /api/saved-searches/:id` - Update search
- `DELETE /api/saved-searches/:id` - Delete search
- `POST /api/saved-searches/:id/execute` - Execute search now

**MCP Integration:**
- `GET /api/mcp/status` - Check MCP connection
- `POST /api/mcp/search-jobs` - Search LinkedIn
- `POST /api/mcp/job-details` - Get enhanced job data
- `POST /api/mcp/import-job` - Manual job import

**Analytics:**
- `GET /api/analytics/summary` - Overview metrics
- `GET /api/analytics/timeline` - Application timeline
- `GET /api/analytics/pipeline` - Pipeline stats

### Keyboard Shortcuts

- `Ctrl+N` - New job (quick add)
- `Ctrl+I` - Import from LinkedIn
- `Ctrl+R` - Refresh job list
- `Ctrl+P` - Open pipeline (Kanban)
- `Ctrl+F` - Focus search
- `Esc` - Close modal/dialog

---

## 🧪 Testing

```bash
# Backend tests
cd dashboard/server
npm test

# MCP Server tests
cd linkedin-mcp-server
uv run pytest
```

---

## 🤝 Who Can Use This?

✅ **Anyone with a Claude Code subscription!**

- No additional API keys needed
- No Anthropic API costs
- Uses your existing Claude Code session
- Works on Windows, macOS, Linux

**Requirements:**
- Claude Code account (paid subscription)
- Node.js 20+
- Python 3.12+
- Basic command-line knowledge

**Best For:**
- Job seekers applying to multiple positions
- Finance/business analyst roles (skills are optimized for this)
- Users who want automation for repetitive tasks
- Anyone tired of manually tailoring CVs and cover letters

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use (3001 or 5173):**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

**LinkedIn session expired:**
```bash
uv run linkedin-scraper-mcp --get-session --no-headless
```

**MCP server not connecting:**
1. Ensure MCP server is running (Terminal 1)
2. Check session file exists: `~/.linkedin-mcp/session.json`
3. Restart backend server

**Skills not generating:**
1. Verify skills exist in `.claude/skills/`
2. Check master CV exists: `cvs_adaptes/CV_Arsene_Vuarand_Generic.txt`
3. Ensure job has description in database

**Database issues:**
```bash
# Reset database (WARNING: deletes all data)
rm dashboard/server/data/tracker.db
npm run dev  # Auto-recreates with schema
```

### Getting Help

- **Issues:** [GitHub Issues](https://github.com/ArseneVrnd/linkedin-mcp-server/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ArseneVrnd/linkedin-mcp-server/discussions)
- **Original Project:** [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server)

---

## 🗺️ Roadmap

### Planned Features
- [ ] Multi-language support (French CVs/cover letters)
- [ ] A/B testing for cover letters (track which version gets responses)
- [ ] Interview prep agent (generate questions based on cover letter)
- [ ] Email notifications (when new jobs match criteria)
- [ ] Browser extension (one-click import from LinkedIn page)
- [ ] Resume parsing (extract skills from uploaded CV)
- [ ] Job matching score (ML-based compatibility)

### Contributions Welcome!
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

This project is licensed under the **Apache 2.0 License** - same as the original project.

**Important Notes:**
- ⚠️ Use in accordance with [LinkedIn's Terms of Service](https://www.linkedin.com/legal/user-agreement)
- ⚠️ Web scraping may violate LinkedIn's terms
- ⚠️ This tool is for **personal use only**
- ⚠️ Keep your session file (`~/.linkedin-mcp/session.json`) secure

---

## 🙏 Acknowledgements

### Original Project
Built with [LinkedIn Scraper](https://github.com/joeyism/linkedin_scraper) by [@joeyism](https://github.com/joeyism) and [FastMCP](https://gofastmcp.com/).

**Forked from:** [stickerdaniel/linkedin-mcp-server](https://github.com/stickerdaniel/linkedin-mcp-server) by [@stickerdaniel](https://github.com/stickerdaniel)

### This Fork
Enhanced by [@ArseneVrnd](https://github.com/ArseneVrnd) with:
- Full-stack job application tracker (React + Express + SQLite)
- AI-powered CV adaptation and cover letter generation (Claude Code skills)
- Advanced analytics and automation features

### Built With
- **Backend:** Express.js, SQLite, better-sqlite3, node-cron
- **Frontend:** React, Vite, Tailwind CSS v4, @dnd-kit, recharts
- **MCP Server:** FastMCP, Playwright, linkedin_scraper
- **AI:** Claude Code (by Anthropic)

---

## ⭐ Star This Repo

If you find this fork useful, please consider:
- ⭐ Starring this repo
- ⭐ Starring the [original repo](https://github.com/stickerdaniel/linkedin-mcp-server)
- 📢 Sharing with other job seekers
- 🤝 Contributing improvements

---

**Made with ❤️ for job seekers by job seekers**
