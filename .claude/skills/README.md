# Claude Code Skills for LinkedIn Job Tracker

This directory contains specialized Claude Code skills for job application optimization.

## Available Skills

### 1. 📄 Resume/CV Adaptation (`adapt-resume.md`)

**Purpose:** Adapt your CV to fit specific job descriptions with finance-focused optimization

**Usage:**
```bash
# In Claude Code, invoke with job ID
/adapt-resume 123

# Or use interactively
/adapt-resume
```

**What it does:**
- Analyzes job description and extracts key requirements
- Performs skill gap analysis
- Reorders and rewrites CV sections to highlight relevant experience
- Optimizes for ATS (Applicant Tracking System) keywords
- Adds finance-specific terminology when applicable
- Saves adapted CV to `cvs_adaptes/CV_Arsene_Vuarand_{CompanyName}.txt`

**Best for:**
- Finance, Banking, Consulting roles
- Business Analyst, Data Analyst positions
- Any role requiring tailored applications

**Output:**
- Fully adapted CV in text format
- Summary of changes made
- Keyword match percentage
- Skill gap analysis
- Recommendations for interview prep

---

### 2. ✍️ Cover Letter Generation (`generate-cover-letter.md`)

**Purpose:** Generate comprehensive, personalized cover letters (500-700 words)

**Usage:**
```bash
# In Claude Code, invoke with job ID
/generate-cover-letter 123

# Or use interactively
/generate-cover-letter
```

**What it does:**
- Researches company background and recent news
- Analyzes job requirements and company culture
- Generates detailed cover letter with:
  - Strong opening hook (company-specific insight)
  - 3-4 body paragraphs with specific examples
  - Quantified achievements (STAR format)
  - Cultural fit demonstration
  - Professional closing with call-to-action
- Saves to database via API

**Addresses current problem:** Existing cover letters are too short (150-200 words). New version generates 500-700 word professional letters.

**Structure:**
1. **Opening (100-120 words):** Attention-grabbing hook with company research
2. **Body Para 1 (140-160 words):** Core competency with detailed example
3. **Body Para 2 (140-160 words):** Technical/analytical strength
4. **Body Para 3 (120-140 words):** Cultural fit or unique differentiator
5. **Closing (80-100 words):** Strong conclusion with clear next steps

**Output:**
- Formatted cover letter (500-700 words)
- Plain text version for copy-paste
- Statistics (word count, themes, examples used)
- Recommendations for follow-up

---

## How These Skills Work Together

### Recommended Workflow:

```
1. Import job from LinkedIn → /import-job
2. Adapt CV for the role → /adapt-resume [job-id]
3. Generate cover letter → /generate-cover-letter [job-id]
4. Export PDF → Use dashboard JobDetail component
5. Apply and track → Update job status to "Applied"
```

---

## Skill Architecture

Both skills follow the same structure:

### Phase 1: Information Gathering
- Load job details from database
- Load your master CV
- Research company (web search if available)
- Interactive clarification if needed

### Phase 2: Analysis & Strategy
- Skill gap analysis
- Industry context detection
- Keyword optimization strategy
- Theme selection

### Phase 3: Content Generation
- Apply industry-specific best practices
- Use STAR format for achievements
- Quantify all accomplishments
- Natural keyword integration

### Phase 4: Quality Control
- Format checks
- Tone verification
- Proofreading
- ATS optimization

### Phase 5: Save & Export
- Save to appropriate location
- Generate summary report
- Update database records

---

## Finance-Focused Features

Both skills include specialized optimizations for finance roles:

### Resume Adaptation:
- Financial modeling terminology (DCF, P&L, EBITDA)
- Regulatory/compliance keywords (IFRS, GAAP, audit)
- Quantified financial impact ($, %, ROI)
- Conservative formatting (finance prefers traditional)

### Cover Letter Generation:
- Industry-specific tone (professional, detail-oriented)
- Emphasis on accuracy and analytical rigor
- Risk management and compliance awareness
- Strategic business partnership framing

---

## Customization

To customize these skills for your specific background:

1. **Update Master CV Location:**
   - Edit line in `adapt-resume.md`: "Check `cvs_adaptes/CV_Arsene_Vuarand_Generic.txt`"
   - Change to your master CV path

2. **Adjust Industry Focus:**
   - In Phase 2 of both skills, modify industry detection logic
   - Add your target industries (e.g., Healthcare, Legal, Engineering)

3. **Update Examples:**
   - Replace HP/CoachGPT examples with your experiences
   - Maintain STAR format (Situation, Task, Action, Result)

4. **API Integration:**
   - Both skills use `/api/jobs/:id` endpoint
   - Ensure your backend has these routes active

---

## Tips for Best Results

### For Resume Adaptation:
1. Keep your master CV (`Generic.txt`) updated with ALL your skills and experiences
2. Don't delete old adapted CVs - version control is useful
3. Review the generated CV before sending (AI assistance, but human approval)
4. Use the keyword match % to gauge ATS compatibility

### For Cover Letter Generation:
1. Provide context when using interactive mode (what excites you about the role?)
2. Manually add any personal connections (referrals, alumni networks)
3. Adjust tone based on company culture (formal vs. casual)
4. Read the full letter - don't just copy-paste blindly

---

## Integration with Job Tracker

These skills integrate seamlessly with the LinkedIn Job Tracker:

- **Database:** Pulls job details from SQLite database
- **API:** Uses existing Express routes (`/api/jobs`, `/api/cover-letters`)
- **File System:** Saves adapted CVs to `cvs_adaptes/` directory
- **Dashboard:** Generated cover letters appear in JobDetail component

---

## Troubleshooting

### Resume skill not finding job:
- Verify job ID exists in database
- Check API endpoint is running: `http://localhost:3001/api/jobs/:id`

### Cover letter too generic:
- Add more details in interactive mode
- Ensure WebSearch is available for company research
- Manually add company insights if web search unavailable

### Formatting issues:
- Check text encoding (UTF-8)
- Verify line breaks are preserved
- Use plain text version if formatting is problematic

### Skill not loading:
```bash
# Claude Code skills are invoked with:
/adapt-resume
/generate-cover-letter

# NOT with the Skill tool directly
```

---

## Future Enhancements

Planned improvements:

1. **Multi-language support** (French CVs, bilingual cover letters)
2. **A/B testing** (generate 2 variants, pick best)
3. **Interview prep** (generate questions based on cover letter claims)
4. **Follow-up templates** (automated follow-up emails after 2 weeks)
5. **Success tracking** (which CV variants get more interviews?)

---

## Contributing

To add new skills:

1. Create a new `.md` file in this directory
2. Follow the phase-based structure (Gather → Analyze → Generate → QC → Save)
3. Include industry-specific best practices
4. Add usage examples and troubleshooting
5. Update this README with the new skill

---

## License

These skills are part of the LinkedIn Job Tracker project. Use and modify freely for personal job search purposes.

---

**Last Updated:** 2026-02-12

**Maintained by:** LinkedIn Job Tracker Project

**Questions?** Check CLAUDE.md and MEMORY.md in project root for more context.
