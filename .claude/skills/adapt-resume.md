---
description: Adapt a CV/Resume to fit a specific job description with finance-focused optimization
argument-hint: <job-id>
---

# Resume/CV Adaptation Skill - Finance Edition

**Target Job:** $ARGUMENTS (if provided) or use interactive mode

---

## Overview

This skill adapts your CV to match a specific job description, with specialized expertise in finance, business analysis, and data analytics roles. It creates a tailored resume that highlights relevant experience while maintaining authenticity.

---

## Phase 1: Gather Information

1. **Load Base CV**
   - Check `cvs_adaptes/CV_Arsene_Vuarand_Generic.txt` as the master template
   - This contains all your skills, experience, and accomplishments
   - Parse structure: name, contact, key competencies, experiences, education, certifications

2. **Load Job Details**
   - If job-id provided: fetch from database via `/api/jobs/:id`
   - Extract critical fields:
     - Job title
     - Company name
     - Job description
     - Required skills (from `skills` JSON field)
     - Seniority level
     - Employment type
     - Salary range (if available)
     - Benefits mentioned

3. **Interactive Clarification** (if no job-id):
   - Ask user to provide:
     - Company name
     - Job title
     - Key requirements (paste job description)
     - Preferred focus areas

---

## Phase 2: Analysis & Strategy

4. **Skill Gap Analysis**
   - Compare your skills against job requirements
   - Categorize into:
     - ✅ **Strong matches** (you have direct experience)
     - ⚠️ **Transferable skills** (you have related experience)
     - ❌ **Gaps** (skills you don't have - be honest)

5. **Industry Context Detection**
   - **Finance/Banking:** Emphasize: compliance, risk management, financial modeling, regulatory knowledge, audit experience
   - **Consulting:** Emphasize: client-facing, stakeholder management, strategic recommendations, business case development
   - **Tech/Startups:** Emphasize: agility, full-stack capabilities, product thinking, innovation, scalability
   - **Corporate/Enterprise:** Emphasize: process optimization, change management, cross-functional collaboration, governance

6. **Keyword Optimization Strategy**
   - Extract ATS (Applicant Tracking System) keywords from job description
   - Identify synonyms and related terms (e.g., "Business Analyst" = "BA", "Requirements Engineering")
   - Plan where to naturally integrate keywords without stuffing

---

## Phase 3: Content Adaptation

7. **Rewrite Key Competencies Section**
   - Prioritize skills matching job requirements (top 3-5 first)
   - Use exact terminology from job description when applicable
   - Group skills logically:
     - **Business Analysis:** [relevant BA skills]
     - **Financial Analysis:** [if finance role - add FP&A, financial modeling, valuation]
     - **Data & Analytics:** [BI tools, SQL, Python if relevant]
     - **Technical Skills:** [tools/platforms mentioned in job]
     - **Soft Skills:** [leadership, communication - only if emphasized in job]

8. **Tailor Professional Experience**
   - **For each experience block:**
     - Keep job title, company, dates unchanged
     - Reorder bullet points to prioritize relevant accomplishments
     - Quantify achievements with metrics (%, $, time saved, impact)
     - Add context for finance roles:
       - Mention budget sizes ("$200M program")
       - Financial impact ("+$4M margin improvement")
       - ROI, cost savings, revenue impact
       - Compliance/audit achievements
     - Use action verbs: Optimized, Architected, Delivered, Analyzed, Implemented, Led, Streamlined

   - **HP Business Analyst** - Adapt focus based on role:
     - Finance BA: Emphasize financial reporting, budget analysis, cost optimization
     - Data BA: Emphasize data modeling, Power BI, ETL, analytics
     - Technical BA: Emphasize requirements engineering, stakeholder management, Agile

   - **CoachGPT Founder** - Adapt based on role:
     - Startup/Product: Full narrative (entrepreneurship, product development)
     - Corporate: Condense to 2-3 bullets (technical skills, business acumen)
     - Finance: Focus on P&L management, unit economics, financial metrics

   - **Econocom IT Support** - Usually minimize unless:
     - IT operations role: Expand technical troubleshooting
     - Cybersecurity focus: Emphasize incident response, phishing detection

9. **Add Finance-Specific Sections** (if relevant):
   - **Financial Certifications:** CFA, FRM, CPA (if you had them - don't invent)
   - **Financial Modeling:** Excel (VBA, Pivot, Solver), financial statement analysis
   - **Accounting Knowledge:** P&L, Balance Sheet, Cash Flow, IFRS/GAAP
   - **Valuation Methods:** DCF, Comparable Companies, Precedent Transactions
   - **Risk Management:** Market risk, credit risk, operational risk frameworks

10. **Optimize Education Section**
    - Highlight "Business Analytics" from GEM
    - If finance role, emphasize relevant coursework:
      - Corporate Finance, Financial Markets, Accounting, Economics
    - Keep quantitative achievements (TOEFL 111/120, TOEIC 955/990) - shows analytical rigor

---

## Phase 4: Formatting & Quality Control

11. **Apply Professional Finance Format**
    - Use clean, conservative layout (finance industry prefers traditional)
    - Structure:
      ```
      NAME (Bold, 14-16pt)
      Title | Specialty
      Contact info (email | phone | location | LinkedIn/GitHub)

      KEY COMPETENCIES
      ---
      [Grouped skills with keywords]

      PROFESSIONAL EXPERIENCE
      ---
      [Reverse chronological, with quantified bullets]

      EDUCATION
      ---
      [Degrees, dates, key achievements]

      CERTIFICATIONS & LANGUAGES
      ---
      [Relevant certs, language proficiency]
      ```

12. **Final Checks**
    - ✅ Company name appears in bullets (shows you researched them)
    - ✅ Keywords from job description naturally integrated
    - ✅ All numbers/metrics double-checked
    - ✅ No typos (use American spelling for US companies, UK for European)
    - ✅ Consistent formatting (dates, bullet styles, capitalization)
    - ✅ Length: 1 page ideal, max 2 pages
    - ✅ File naming: `CV_Arsene_Vuarand_{CompanyName}.txt`

13. **Quality Assurance**
    - Read aloud - does it flow naturally?
    - Are accomplishments specific and credible?
    - Does it tell a coherent story?
    - Would you hire this person for the role?

---

## Phase 5: Save & Export

14. **Save Adapted CV**
    - Save to: `cvs_adaptes/CV_Arsene_Vuarand_{CompanyName}.txt`
    - Also offer PDF generation via the JobDetail component

15. **Generate Summary Report**
    - Provide user with:
      - **Changes Made:** List of key modifications
      - **Keyword Matches:** % match with job description
      - **Skill Gaps:** Honest assessment of missing skills
      - **Recommendations:**
        - Courses to take for gaps
        - How to address gaps in interview
        - Talking points to emphasize
      - **Cover Letter Hook:** Suggested opening paragraph

16. **Update Database** (optional)
    - If job-id provided, add note to job record:
      - "CV adapted on [date] - focus: [key themes]"

---

## Best Practices for Finance Resumes

### Do's ✅
- **Quantify everything:** Use $, %, time metrics
- **Show business impact:** Link your work to revenue, cost, risk, efficiency
- **Use industry terminology:** EBITDA, P&L, DCF, working capital, etc.
- **Highlight technical skills:** Excel, SQL, Python, Power BI (finance loves data literacy)
- **Demonstrate attention to detail:** Zero typos, perfect formatting
- **Show progression:** Each role should build on previous one

### Don'ts ❌
- **Don't lie or exaggerate:** Finance industry checks references rigorously
- **Don't use creative formats:** Stick to traditional, ATS-friendly layouts
- **Don't include irrelevant details:** Keep it focused on finance/business/data
- **Don't use vague language:** "Worked on project" → "Led financial analysis for $50M M&A transaction"
- **Don't exceed 2 pages:** Recruiters spend 6 seconds on first pass
- **Don't forget to tailor:** Generic CVs are obvious and get rejected

### Finance-Specific Keywords to Include
- Financial Modeling, Valuation, DCF Analysis
- P&L Management, Budget Forecasting, Variance Analysis
- IFRS/GAAP, Financial Reporting, Audit
- Excel (Advanced), VBA, Power Query, Power BI
- Risk Management, Compliance, Internal Controls
- Stakeholder Management, Executive Reporting
- M&A, Due Diligence, Deal Structuring
- Working Capital, Cash Flow, Treasury
- FP&A, Business Partnering, Strategic Planning

---

## Output Format

Present to user:

```
📄 CV ADAPTED FOR: {Company Name} - {Job Title}

🎯 KEY CHANGES:
- [List 4-6 major modifications]

🔑 KEYWORD OPTIMIZATION:
- Matched: {X}/{Y} required skills ({Z}%)
- Added keywords: [list 5-7 key terms]

⚠️ SKILL GAPS IDENTIFIED:
- [List any missing requirements]
- Mitigation: [How to address in interview]

💡 RECOMMENDATIONS:
- [2-3 specific tips for this application]

📁 SAVED TO:
cvs_adaptes/CV_Arsene_Vuarand_{CompanyName}.txt

✅ READY FOR:
- PDF export (via dashboard)
- Cover letter generation (use /generate-cover-letter)
- Application submission

Next steps:
1. Review the adapted CV in cvs_adaptes folder
2. Generate PDF if needed
3. Create tailored cover letter
4. Update job status to "Applied"
```

---

## Advanced Features

### Multi-Role Targeting
If applying to multiple roles at same company:
- Create variants: `CV_Arsene_Vuarand_{Company}_{Role}.txt`
- Example: `CV_Arsene_Vuarand_JPMorgan_BA.txt` vs `CV_Arsene_Vuarand_JPMorgan_DataAnalyst.txt`

### Version Control
- Keep master template unchanged
- Track changes in file metadata/comments
- Note date of adaptation for follow-up reference

### Integration with Application Tracker
- Auto-update job record with "CV_adapted" tag
- Store which version was sent
- Track success rate per CV variant

---

**Remember:** A great CV gets you the interview. The goal is not to trick the system, but to authentically present your strongest, most relevant self for each opportunity.
