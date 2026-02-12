# Claude Code Skills Created - Summary

**Date:** 2026-02-12
**Purpose:** Two specialized sub-agents for resume adaptation and cover letter generation

---

## 🎯 What Was Created

### 1. **Resume/CV Adaptation Skill** 📄
**File:** [.claude/skills/adapt-resume.md](.claude/skills/adapt-resume.md)

A comprehensive skill that adapts your CV to match specific job descriptions, with special focus on finance, business analysis, and data analytics roles.

**Key Features:**
- ✅ Analyzes job requirements vs. your skills (gap analysis)
- ✅ Reorders CV sections to highlight most relevant experience
- ✅ Optimizes for ATS (Applicant Tracking System) keywords
- ✅ Adds finance-specific terminology (P&L, DCF, EBITDA, etc.)
- ✅ Quantifies all achievements (%, $, time savings)
- ✅ Detects industry context (Finance, Tech, Consulting, Corporate)
- ✅ Saves adapted CV to `cvs_adaptes/` directory
- ✅ Provides detailed summary report with recommendations

**How to Use:**
```bash
# With job ID from database
/adapt-resume 123

# Interactive mode (manually provide job details)
/adapt-resume
```

**Output Example:**
```
📄 CV ADAPTED FOR: JPMorgan Chase - Business Analyst

🎯 KEY CHANGES:
- Reordered competencies to prioritize financial analysis
- Added P&L, FP&A, and financial modeling keywords
- Emphasized $4M margin improvement at HP
- Quantified all achievements with metrics

🔑 KEYWORD OPTIMIZATION:
- Matched: 18/22 required skills (82%)
- Added keywords: DCF, EBITDA, variance analysis, stakeholder management

⚠️ SKILL GAPS IDENTIFIED:
- SQL Server Reporting Services (SSRS)
- Mitigation: Emphasize your Power BI expertise (similar tool)

📁 SAVED TO: cvs_adaptes/CV_Arsene_Vuarand_JPMorgan.txt
```

---

### 2. **Cover Letter Generation Skill** ✍️
**File:** [.claude/skills/generate-cover-letter.md](.claude/skills/generate-cover-letter.md)

A detailed skill that generates comprehensive, personalized cover letters (500-700 words) - solving the problem of current cover letters being too short (150-200 words).

**Key Features:**
- ✅ Researches company (recent news, mission, values)
- ✅ Generates 5-paragraph structure with strong hook
- ✅ Uses STAR format (Situation, Task, Action, Result) for examples
- ✅ Includes specific quantified achievements
- ✅ Adjusts tone based on industry (formal for finance, casual for startups)
- ✅ Shows cultural fit and genuine enthusiasm
- ✅ Avoids generic clichés and template language
- ✅ Saves to database via API
- ✅ Provides both formatted and plain-text versions

**How to Use:**
```bash
# With job ID from database
/generate-cover-letter 123

# Interactive mode
/generate-cover-letter
```

**Cover Letter Structure:**
1. **Opening (100-120 words):** Attention-grabbing hook with company-specific insight
2. **Body Para 1 (140-160 words):** Core competency with detailed example
3. **Body Para 2 (140-160 words):** Technical/analytical strength
4. **Body Para 3 (120-140 words):** Cultural fit or unique differentiator
5. **Closing (80-100 words):** Strong conclusion with call-to-action

**Output Example:**
```
✍️ COVER LETTER GENERATED FOR: Goldman Sachs - Business Analyst

📊 STATISTICS:
- Word count: 627 words
- Paragraphs: 5
- Key themes: Financial analysis, stakeholder management, data-driven decision-making
- Specific examples: 3

🎯 COVER LETTER HIGHLIGHTS:
- Opening hook: Referenced Goldman's recent expansion into sustainable finance
- Core competency: $4M margin improvement project at HP
- Unique differentiator: Entrepreneurial experience with CoachGPT (P&L management)
- Company research: Mentioned Goldman's "engineering-first" culture

✅ SAVED TO DATABASE (Job ID: 123)
```

---

## 📚 Documentation

All skills are fully documented in [.claude/skills/README.md](.claude/skills/README.md), which includes:

- Detailed usage instructions
- Best practices for resumes and cover letters
- Industry-specific adjustments
- Troubleshooting guide
- Integration with job tracker
- Customization instructions

---

## 🔄 Automatic Workflow (No Manual Action Needed!)

**🤖 Claude automatically invokes these skills when jobs are scraped - you just scrape and review!**

```
1. User scrapes jobs from LinkedIn (via MCP server with cookie session)
   ↓
2. Jobs saved to database automatically
   ↓
3. 🤖 CLAUDE AUTOMATICALLY INVOKES for EACH job:
   │  ├─ /adapt-resume [job-id]
   │  └─ /generate-cover-letter [job-id]
   ↓
4. Claude reports completion:
   │  ├─ ✅ CV adapted for {Company} - {Role}
   │  ├─ ✅ Cover letter generated (627 words)
   │  └─ 📁 Files saved (cvs_adaptes/ + database)
   ↓
5. User reviews generated documents in dashboard
   ↓
6. User exports PDF and copies cover letter
   ↓
7. User applies to job
   ↓
8. Update status to "Applied" in tracker
```

**🔑 KEY BENEFIT:**
- No need to manually invoke `/adapt-resume` or `/generate-cover-letter`
- Claude detects new jobs and automatically runs both skills
- Uses your existing Claude Code session (no API keys needed)
- Just scrape jobs → Claude handles CV/cover letter generation → You review and apply

**When Claude Auto-Invokes:**
- ✅ After LinkedIn job search completes
- ✅ After job import via dashboard
- ✅ After scheduled searches run
- ✅ When you paste LinkedIn job URLs

---

## 🎯 Why These Skills Are Better

### Resume Adaptation Skill:
**Before:**
- Manual CV editing for each job
- Inconsistent keyword optimization
- Hard to track which version sent where

**After:**
- Automated skill gap analysis
- ATS-optimized with keyword matching (shows %)
- Consistent quantified achievements
- Finance-specific terminology
- Saved with company name for version control

### Cover Letter Generation Skill:
**Before:**
- Short, generic cover letters (150-200 words)
- "I am writing to apply for..." openings
- Resume bullet points in paragraph form
- No company research
- No specific examples

**After:**
- Comprehensive letters (500-700 words)
- Company-specific opening hooks
- Detailed STAR-format examples
- Quantified achievements throughout
- Industry-appropriate tone
- Cultural fit demonstration
- Clear narrative arc

---

## 🔧 Technical Details

### Integration with Job Tracker:
- **Database:** Both skills read from SQLite via `/api/jobs/:id`
- **File System:** Resume skill writes to `cvs_adaptes/` directory
- **API:** Cover letter skill writes to database via `/api/jobs/:jobId/cover-letters`
- **Dashboard:** Generated documents visible in JobDetail component

### Dependencies:
- No new npm packages required
- Uses existing API endpoints
- Compatible with current database schema
- Works with or without MCP server running

### File Structure:
```
d:\linkedin scraper\
├── .claude\
│   └── skills\
│       ├── adapt-resume.md          # Resume adaptation skill
│       ├── generate-cover-letter.md # Cover letter generation skill
│       └── README.md                # Full documentation
├── cvs_adaptes\
│   ├── CV_Arsene_Vuarand_Generic.txt    # Master template
│   └── CV_Arsene_Vuarand_{Company}.txt  # Adapted versions (auto-generated)
└── dashboard\
    ├── server\
    │   └── src\
    │       └── routes\
    │           ├── jobs.js           # Job CRUD API
    │           └── coverLetters.js   # Cover letter API
    └── client\
        └── src\
            └── components\
                └── jobs\
                    └── JobDetail.jsx # Displays generated documents
```

---

## 🚀 Next Steps

1. **Test the Skills:**
   ```bash
   # Try adapting a resume
   /adapt-resume 123

   # Try generating a cover letter
   /generate-cover-letter 123
   ```

2. **Customize for Your Background:**
   - Edit `.claude/skills/adapt-resume.md` to adjust examples
   - Modify industry detection logic if needed
   - Update master CV path if different

3. **Enhance Further:**
   - Add more industry-specific templates
   - Create A/B testing variants
   - Generate interview prep materials
   - Build follow-up email templates

---

## 📖 Additional Resources

- **Full Documentation:** [.claude/skills/README.md](.claude/skills/README.md)
- **Project Guide:** [CLAUDE.md](CLAUDE.md)
- **Project Memory:** `C:\Users\arsen\.claude\projects\d--linkedin-scraper\memory\MEMORY.md`
- **Quick Start:** [QUICK_START.md](QUICK_START.md)

---

## 💡 Pro Tips

### For Best Resume Results:
1. Keep `CV_Arsene_Vuarand_Generic.txt` updated with ALL your experience
2. Review keyword match % - aim for 70%+ for ATS systems
3. Don't delete old adapted CVs (useful for version comparison)
4. Use the skill gap analysis to prepare for interviews

### For Best Cover Letter Results:
1. Provide context in interactive mode (what excites you about the role?)
2. Manually add personal connections (referrals, alumni)
3. Read the full letter before sending (AI assistance, not replacement)
4. Adjust tone if the generated version feels off

### General Workflow:
1. Use skills early in your application process (not last-minute)
2. Review and personalize the generated content
3. Track which versions get interviews (optimize over time)
4. Update the skills based on what works for you

---

**Created:** 2026-02-12
**Status:** ✅ Ready to use
**Maintained by:** LinkedIn Job Tracker Project

---

## 🙏 Feedback

If you find issues or have suggestions:
1. Update the skill files directly
2. Document changes in MEMORY.md
3. Share improvements via project documentation

**Remember:** These are AI-assisted tools to enhance your job search, not replace your judgment. Always review and personalize the output before sending!
