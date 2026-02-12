# 🚀 Quick Start Guide

## Installation (5 minutes)

### 1. Install Server Dependencies
```bash
cd "d:\linkedin scraper\dashboard\server"
npm install
```

### 2. Install Client Dependencies
```bash
cd "d:\linkedin scraper\dashboard\client"
npm install
```

### 3. Start LinkedIn MCP Server
```bash
cd "d:\linkedin scraper"

# First time: Create session
uv run linkedin-scraper-mcp --get-session --no-headless

# After session created, run normally:
uv run linkedin-scraper-mcp
```

### 4. Start Backend Server (New Terminal)
```bash
cd "d:\linkedin scraper\dashboard\server"
npm run dev
```

Server will run on: http://localhost:3001
Database will auto-migrate on first run!

### 5. Start Frontend (New Terminal)
```bash
cd "d:\linkedin scraper\dashboard\client"
npm run dev
```

Client will run on: http://localhost:5173 (or similar)

---

## First Steps

### 1. Import Some Jobs
- Click "Import from LinkedIn" button
- Search for jobs (e.g., "React Developer", "Remote")
- Jobs will auto-import and auto-tag!

### 2. Explore the Pipeline
- Navigate to "Pipeline" in sidebar
- Drag jobs between columns
- See your job search visualized!

### 3. Check Analytics
- Go to Dashboard
- See success metrics
- Identify skills to learn

### 4. Set Up Auto-Search (Optional)
Create a saved search via API:

```bash
curl -X POST http://localhost:3001/api/saved-searches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily React Jobs",
    "keywords": "React Developer",
    "location": "Remote",
    "auto_import": 1,
    "schedule": "0 9 * * *"
  }'
```

This will search every day at 9 AM and auto-import matching jobs!

---

## Keyboard Shortcuts

- `Ctrl+N` - Add new job
- `Ctrl+I` - Import from LinkedIn
- `Ctrl+R` - Refresh
- `Ctrl+P` - Go to Pipeline
- `Esc` - Close modals

---

## Troubleshooting

**MCP Shows "Disconnected":**
- Make sure LinkedIn MCP server is running
- Check: `uv run linkedin-scraper-mcp --get-session`

**Database errors:**
- Delete `dashboard/server/data/tracker.db`
- Restart server (will recreate database)

**LinkedIn session expired:**
- Run: `uv run linkedin-scraper-mcp --get-session`

**npm install fails:**
- Try: `npm install --legacy-peer-deps`

---

## What's New?

✅ **Enhanced job scraping** - 10+ new fields extracted
✅ **Auto-tagging** - Smart rules tag jobs automatically
✅ **Saved searches** - Reusable search profiles
✅ **Auto-scheduler** - Jobs import automatically
✅ **Job Pipeline** - Drag-and-drop Kanban board
✅ **Quick actions** - Bulk operations and shortcuts
✅ **Advanced analytics** - Skills gap + success metrics
✅ **Better UX** - Loading states and notifications

See `IMPROVEMENTS_SUMMARY.md` for full details!

---

Happy job hunting! 🎯
