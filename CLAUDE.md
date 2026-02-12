# LinkedIn Job Tracker - Development Guide

## Project Structure

This is a full-stack job application tracker with three main components:

1. **LinkedIn MCP Server** (Python/FastMCP) - Scrapes LinkedIn job data
2. **Backend Server** (Node.js/Express) - REST API + SQLite database
3. **Frontend Dashboard** (React/Vite) - User interface

## Development Setup

### Prerequisites
- Python 3.12+ with uv package manager
- Node.js 20+ with npm
- Playwright (for LinkedIn scraping)

### Quick Start

**Terminal 1 - LinkedIn MCP Server:**
```bash
cd "d:\linkedin scraper"
uv run linkedin-scraper-mcp
```

**Terminal 2 - Backend Server:**
```bash
cd dashboard/server
npm install
npm run dev
```

**Terminal 3 - Frontend Client:**
```bash
cd dashboard/client
npm install
npm run dev
```

### Port Configuration
- Backend: http://localhost:3001
- Frontend: http://localhost:5173 (or 5174 if 5173 in use)
- MCP Server: stdio (no HTTP port)

## Recent Major Enhancements (2026-02-12)

### Backend Improvements
1. **Enhanced LinkedIn Scraping**
   - Extracts 10+ additional fields (skills, salary_range, seniority_level, employment_type, remote_status, benefits, applicants_count, etc.)
   - Custom extraction logic in `linkedin_mcp_server/tools/job.py`
   - Extended base `JobScraper` with `extract_enhanced_job_data()` function

2. **Database Schema**
   - 11 new columns in jobs table
   - `saved_searches` table for automation
   - Auto-migration system in `db.js`

3. **Saved Search Profiles**
   - API: `/api/saved-searches`
   - Cron-based scheduling with node-cron
   - Auto-import and auto-tagging on schedule

4. **Intelligent Auto-Tagging**
   - 9 smart rules in `utils/autoTag.js`
   - Tags: Remote, Hybrid, Senior, Entry Level, Contract, Full-time, Hot, High Salary, Competitive
   - Auto-creates tags if missing

5. **Bulk Operations**
   - Endpoints: `/api/jobs/bulk/update-status`, `/api/jobs/bulk/add-tag`, etc.
   - Handles hundreds of jobs at once

### Frontend Improvements
1. **Job Pipeline (Kanban)**
   - Drag-and-drop with @dnd-kit
   - 7 status columns
   - Works when dropping on columns OR job cards

2. **Quick Actions & Shortcuts**
   - `Ctrl+N` - New job
   - `Ctrl+I` - Import
   - `Ctrl+R` - Refresh
   - `Ctrl+P` - Pipeline
   - Component: `components/ui/QuickActions.jsx`

3. **Advanced Analytics**
   - Skills Gap Analysis - identifies missing skills
   - Success Metrics - conversion rates, time to interview
   - Components in `components/analytics/`

4. **Better UX**
   - Toast notifications
   - Loading spinners & overlays
   - Skeleton loaders

## Key Architecture Patterns

### Auto-Migration Pattern
```javascript
// In db.js - safe column additions
for (const migration of migrations) {
  const columns = db.prepare(`PRAGMA table_info(${migration.table})`).all();
  const columnExists = columns.some(col => col.name === migration.column);
  if (!columnExists) {
    db.exec(`ALTER TABLE ${migration.table} ADD COLUMN ${migration.column} ${migration.type}`);
  }
}
```

### Auto-Tagging Pattern
```javascript
// In utils/autoTag.js
const AUTO_TAG_RULES = [
  {
    tagName: 'Remote',
    tagColor: '#10b981',
    condition: (job) => {
      const location = (job.location || '').toLowerCase();
      return location.includes('remote');
    }
  }
  // ... more rules
];
```

### Drag-and-Drop Pattern
```javascript
// In JobPipeline.jsx - handles both column and job card drops
const handleDragEnd = async (event) => {
  const { active, over } = event;
  let newStatus = over.id;

  // Check if dropped on column or job card
  if (!STATUS_COLUMNS.find(col => col.id === newStatus)) {
    // Dropped on job card - get that job's status
    const targetJob = jobs.find(j => j.id === over.id);
    if (targetJob) newStatus = targetJob.status;
  }

  await api.updateJob(jobId, { status: newStatus });
};
```

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process
netstat -ano | findstr :3001

# Kill process (PowerShell)
powershell -Command "Stop-Process -Id PID -Force"
```

### LinkedIn Session Expired
```bash
uv run linkedin-scraper-mcp --get-session --no-headless
```

### Missing Dependencies
```bash
# Server
cd dashboard/server && npm install

# Client (must restart Vite after)
cd dashboard/client && npm install
```

### Drag-and-Drop Not Working
- Ensure @dnd-kit packages installed
- Check that both droppable (column) and sortable (items) contexts exist
- When dropping on job card, system looks up that job's status

## File Structure

```
d:\linkedin scraper/
├── linkedin_mcp_server/          # Python MCP server
│   └── tools/job.py              # Enhanced scraping
├── dashboard/
│   ├── server/
│   │   ├── src/
│   │   │   ├── routes/           # API endpoints
│   │   │   ├── utils/            # Auto-tagging logic
│   │   │   ├── scheduler.js      # Cron automation
│   │   │   ├── db.js             # Database + migrations
│   │   │   └── index.js          # Express server
│   │   └── data/
│   │       └── tracker.db        # SQLite database
│   └── client/
│       └── src/
│           ├── pages/            # Route pages
│           ├── components/       # React components
│           ├── hooks/            # Custom hooks
│           └── lib/api.js        # API client
├── IMPROVEMENTS_SUMMARY.md       # Full documentation
├── QUICK_START.md                # Setup guide
└── CLAUDE.md                     # This file
```

## API Endpoints

### Jobs
- `GET /api/jobs` - List with filters
- `POST /api/jobs` - Create
- `PUT /api/jobs/:id` - Update
- `DELETE /api/jobs/:id` - Delete
- `POST /api/jobs/bulk/update-status` - Bulk status update
- `POST /api/jobs/bulk/add-tag` - Bulk tag
- `POST /api/jobs/:id/auto-tag` - Auto-tag single job
- `POST /api/jobs/auto-tag-all` - Auto-tag all jobs

### Saved Searches
- `GET /api/saved-searches` - List all
- `POST /api/saved-searches` - Create
- `PUT /api/saved-searches/:id` - Update
- `DELETE /api/saved-searches/:id` - Delete
- `POST /api/saved-searches/:id/execute` - Run search

### MCP Integration
- `GET /api/mcp/status` - Check MCP connection
- `POST /api/mcp/search-jobs` - Search LinkedIn
- `POST /api/mcp/job-details` - Get enhanced job data

### Analytics
- `GET /api/analytics/summary` - Overview metrics
- `GET /api/analytics/timeline` - Application timeline
- `GET /api/analytics/pipeline` - Pipeline stats

## Automatic CV & Cover Letter Generation

**CRITICAL WORKFLOW - Claude Auto-Skills:**

When jobs are scraped/imported from LinkedIn, Claude (the AI assistant) should **automatically** invoke the specialized skills to generate application materials:

### Auto-Skill Flow
```
1. Job scraped/imported → Database
   ↓
2. Claude detects new job(s)
   ↓
3. For EACH job, Claude automatically runs:
   - Skill: /adapt-resume [job-id]
   - Skill: /generate-cover-letter [job-id]
   ↓
4. Claude reports:
   - "✅ CV adapted for {Company} - {Role}"
   - "✅ Cover letter generated (627 words)"
   - "📁 Saved to cvs_adaptes/ and database"
```

### When to Auto-Invoke Skills
- ✅ After MCP job search completes
- ✅ After job import via JobImport component
- ✅ After scheduled search runs
- ✅ When user provides LinkedIn job URL
- ✅ Manual /import-job command

### No User Prompt Needed
- Claude should invoke skills proactively
- No need to ask "Should I generate CV/cover letter?"
- Just do it and report completion
- Uses existing Claude Code session (no API keys)

### Skills Location
- **Resume Adapter:** `.claude/skills/adapt-resume.md`
- **Cover Letter Generator:** `.claude/skills/generate-cover-letter.md`
- **Full Guide:** `.claude/skills/README.md`

## Troubleshooting

### Server won't start
1. Check port 3001 isn't in use
2. Verify database file isn't locked
3. Check all dependencies installed

### Frontend errors
1. Clear node_modules and reinstall
2. Check browser console for errors
3. Verify backend is running

### MCP disconnected
1. Ensure MCP server is running
2. Check session.json exists (~/.linkedin-mcp/)
3. Re-authenticate if needed

### Drag-and-drop issues
1. Ensure @dnd-kit packages installed
2. Restart Vite dev server after installing
3. Check browser console for errors

### Skills not generating content
1. Verify skills exist in `.claude/skills/`
2. Check database has job details (description, company, etc.)
3. Ensure master CV exists at `cvs_adaptes/CV_Arsene_Vuarand_Generic.txt`
4. Check cover_letters table exists in database

## Testing

```bash
# Backend
cd dashboard/server
npm test  # If tests exist

# MCP Server
cd "d:\linkedin scraper"
uv run pytest
```

## Building for Production

```bash
# Frontend
cd dashboard/client
npm run build

# Backend (no build needed - Node.js)
# Just run: node src/index.js

# MCP Server
cd "d:\linkedin scraper"
uv build
```

## Contributing

When adding features:
1. Update database schema in `db.js` (with migration)
2. Add API endpoint in `routes/`
3. Create React components in `components/`
4. Add API method to `lib/api.js`
5. Update this CLAUDE.md file
6. Update MEMORY.md with lessons learned

## Commit Message Format

Follow conventional commits:
- `feat(scope): description` - New feature
- `fix(scope): description` - Bug fix
- `docs(scope): description` - Documentation
- `refactor(scope): description` - Code refactoring
- `chore(scope): description` - Maintenance

Examples:
- `feat(pipeline): add drag-and-drop to job cards`
- `fix(api): handle job card drops in pipeline`
- `docs(claude): update development guide`

---

For detailed documentation, see IMPROVEMENTS_SUMMARY.md and QUICK_START.md
