---
description: Generate a comprehensive, personalized cover letter for a job application (500-700 words)
argument-hint: <job-id>
---

# Cover Letter Generation Skill - Professional Edition

**Target Job:** $ARGUMENTS (if provided) or use interactive mode

---

## Overview

This skill generates detailed, personalized cover letters (500-700 words) that go beyond generic templates. The cover letter should tell a compelling story, demonstrate research about the company, and make a strong case for why you're the ideal candidate.

**Current Problem:** Existing cover letters are too short (150-200 words) and generic.

**Solution:** Create comprehensive cover letters with:
- Strong opening hook (researched company insight)
- 3-4 detailed body paragraphs with specific examples
- Clear connection between your experience and their needs
- Genuine enthusiasm and cultural fit
- Professional closing with clear call-to-action

---

## Phase 1: Research & Information Gathering

1. **Load Job Details**
   - If job-id provided: fetch from database via `/api/jobs/:id`
   - Extract all available data:
     - Company name
     - Job title
     - Job description (full text)
     - Required skills
     - Company culture clues (benefits, remote status, etc.)
     - Applicants count (gauge competition)
     - Salary range (shows company's investment)
     - Posted date (shows urgency)

2. **Company Research**
   - **Search company online** (use WebSearch if available):
     - Company mission/vision/values
     - Recent news (funding, expansion, product launches)
     - Industry position (leader, challenger, startup)
     - Company culture (LinkedIn, Glassdoor insights)
     - Leadership team and their backgrounds

   - **Key questions to answer:**
     - What does this company do? (in one sentence)
     - What makes them unique in their industry?
     - What challenges are they likely facing?
     - What's their growth trajectory?
     - What do they value in employees? (from job description tone)

3. **Load Your Background**
   - Read your master CV: `cvs_adaptes/CV_Arsene_Vuarand_Generic.txt`
   - If CV adapted for this company exists, use that version
   - Identify your 3 strongest selling points for THIS role

4. **Interactive Clarification** (if needed):
   - "What specifically excites you about this role?"
   - "Any personal connection to the company/industry?"
   - "Which of your experiences is most relevant?"
   - "Any concerns you want to address? (gaps, career change, etc.)"

---

## Phase 2: Strategy & Structure Planning

5. **Identify Cover Letter Type**
   - **Career Progression:** Moving up in same field → emphasize growth, increased responsibility
   - **Career Change:** Switching industries → emphasize transferable skills, genuine interest
   - **First Professional Role:** Entry-level → emphasize education, projects, potential, learning agility
   - **Return to Work:** After gap → address gap positively, emphasize readiness
   - **Dream Company:** Company you're passionate about → show authentic enthusiasm, research depth

6. **Define Key Themes** (Pick 2-3)
   - Technical Excellence (strong analytical/technical skills)
   - Business Impact (delivered measurable results)
   - Problem Solving (tackled complex challenges)
   - Innovation (created something new)
   - Leadership (led teams or initiatives)
   - Cultural Fit (align with company values)
   - Industry Expertise (deep domain knowledge)
   - Rapid Learning (quick adaptability)

7. **Select Supporting Examples** (STAR format)
   - For each theme, pick 1-2 specific stories:
     - **Situation:** Context/challenge
     - **Task:** Your responsibility
     - **Action:** What you did (with details)
     - **Result:** Quantified outcome

---

## Phase 3: Drafting the Cover Letter

### Opening Paragraph (100-120 words) - THE HOOK

**Goal:** Grab attention immediately. Show you did research and are genuinely interested.

**Formula:**
```
[Compelling opening - specific company insight or recent news]
+ [Your fit statement - role + why you're excited]
+ [Transition to your background]
```

**Examples:**

**Good Opening (Finance/Data Role):**
"When I read that [Company] recently expanded its data analytics team to support decision-making across 12 European markets, I immediately saw the alignment with my experience building financial dashboards that drove $4M in margin improvements at HP. As a Business Analyst passionate about transforming complex data into strategic insights, I'm excited to apply for the [Job Title] position and contribute to [Company]'s mission of [specific mission/goal]."

**Good Opening (Startup/Product Role):**
"Building CoachGPT from zero to a profitable SaaS product taught me that the best solutions emerge from deeply understanding user pain points. [Company]'s approach to [specific product/feature] demonstrates the same user-centric philosophy, which is why I'm drawn to the [Job Title] role. With my full-stack development background and business analytics training, I'm eager to help [Company] scale its platform while maintaining the quality that has earned you [specific achievement/recognition]."

**What Makes It Good:**
- ✅ Specific company reference (shows research)
- ✅ Relevant personal experience (shows qualification)
- ✅ Genuine enthusiasm (shows motivation)
- ✅ Forward-looking (shows you're thinking about contributing)

**Avoid:**
- ❌ "I am writing to apply..." (boring, everyone says this)
- ❌ "I saw your job posting..." (obviously)
- ❌ Generic company praise ("You're an industry leader...")
- ❌ Talking only about what you want ("This would be great for my career...")

---

### Body Paragraph 1 (140-160 words) - CORE COMPETENCY

**Goal:** Prove you have the #1 skill they need, with a detailed example.

**Structure:**
```
[Identify their key need from job description]
+ [Your relevant experience - specific role/project]
+ [Detailed example with context, actions, results]
+ [Connect to their specific challenges]
```

**Example (Business Analysis Focus):**
"Your job description emphasizes the need for strong stakeholder management and requirements elicitation - skills I honed during my year as a Business Analyst at HP, where I served as the bridge between executive leadership and technical teams for a $200M strategic transformation program. I led the requirements gathering process through 30+ stakeholder interviews, translated complex business needs into clear functional specifications, and facilitated consensus among competing priorities from Finance, Operations, and IT. This work culminated in a data warehouse implementation that improved reporting accuracy by 15% and reduced manual data preparation time from 8 hours to 30 minutes per week. I understand that [Company] is navigating [specific challenge from research], and my experience balancing multiple stakeholder perspectives while maintaining project momentum would be directly applicable."

**Key Elements:**
- Specific numbers (30 interviews, $200M, 15% improvement)
- Clear actions (led, translated, facilitated)
- Quantified results (time saved, accuracy improved)
- Connection to their needs (final sentence)

---

### Body Paragraph 2 (140-160 words) - TECHNICAL/ANALYTICAL STRENGTH

**Goal:** Prove you have the technical chops and analytical mindset for the role.

**Structure:**
```
[Acknowledge technical requirements]
+ [Your technical background and skills]
+ [Specific technical project/achievement]
+ [Results and learning]
```

**Example (Data/Analytics Focus):**
"The [Job Title] role requires advanced proficiency in Power BI and SQL - tools I use daily to transform raw data into actionable insights. At HP, I designed and built a comprehensive executive dashboard that synthesized data from 10+ sources into a unified Star Schema data model. The technical implementation involved advanced DAX measures (SUMX, CALCULATE with complex filters), query folding optimization in Power Query M to leverage SQL server performance, and dynamic parameters for drill-through analysis. Beyond technical execution, I focused on the 'so what' - my dashboard revealed that a 2% increase in service coverage would generate approximately $4M in margin improvement, directly influencing executive strategy. I'm excited to bring this combination of technical depth and business acumen to [Company], where data-driven decision-making is clearly a priority."

**Key Elements:**
- Specific tools (Power BI, DAX, SQL)
- Technical details (shows real knowledge, not buzzwords)
- Business outcome (technical work led to business value)
- Enthusiasm for their environment

---

### Body Paragraph 3 (120-140 words) - CULTURAL FIT / X-FACTOR

**Goal:** Show something unique about you that goes beyond the resume. Demonstrate cultural fit or additional value.

**Options:**

**A. Entrepreneurial Mindset (for startups/scale-ups):**
"Beyond my professional roles, I've experienced firsthand the challenges of building and scaling a business through my startup, CoachGPT. Bootstrapping a SaaS product from concept to paying customers taught me to operate with extreme resourcefulness, prioritize ruthlessly, and iterate based on user feedback rather than assumptions. I maintained 89-99% gross margins through strategic cost optimization, wore multiple hats (full-stack dev, product manager, customer support), and learned to make decisions with imperfect information. This startup experience has made me a more pragmatic analyst - I don't just deliver recommendations, I consider feasibility, trade-offs, and ROI. I believe this founder's mindset would complement [Company]'s [value/culture - e.g., 'agile, experiment-driven culture']."

**B. Learning Agility (for new industries/roles):**
"While my background is primarily in business analysis and data, I'm someone who learns quickly and dives deep. My trajectory - from IT support technician to Business Analyst at HP to building a full-stack SaaS application - demonstrates my ability to rapidly acquire new skills when motivated. I taught myself Next.js, NestJS, and GraphQL in three months while simultaneously mastering advanced Power BI and DAX. For [Company], this means I'll quickly ramp up on your specific domain, tools, and workflows, and won't be satisfied with surface-level understanding. I'm genuinely curious about [specific aspect of their business], and I'm excited to become an expert in this space."

**C. Values Alignment (for mission-driven companies):**
"What draws me most to [Company] is your commitment to [specific value - e.g., 'financial inclusion,' 'sustainable investing,' 'democratizing data']. Coming from [relevant experience or background], I've seen firsthand how [relevant observation about their mission impact]. This isn't just a career move for me - it's an opportunity to contribute to work that matters. I'm particularly impressed by [specific initiative they've done], which aligns with my own belief that [related personal value]. I'm looking for more than just a job; I'm looking for a mission I can get behind, and [Company] offers exactly that."

**Key Elements:**
- Goes beyond technical skills
- Shows self-awareness
- Authentic (not forced)
- Specific to this company/role

---

### Closing Paragraph (80-100 words) - STRONG CLOSE

**Goal:** Express enthusiasm, confidence, and clear next steps.

**Formula:**
```
[Reiterate fit and enthusiasm]
+ [Express confidence in your value]
+ [Clear call-to-action]
+ [Professional thank you]
```

**Example:**
"I'm confident that my combination of analytical rigor, technical proficiency, and business acumen makes me a strong fit for [Company]'s [Job Title] role. I'm excited about the opportunity to contribute to [specific project/goal mentioned in job description or research], and I'd welcome the chance to discuss how my experience delivering data-driven insights can support your team's objectives. I've attached my resume for your review and look forward to the possibility of speaking with you soon. Thank you for considering my application."

**Key Elements:**
- Confident but not arrogant
- Specific reference (not generic)
- Clear ask (want to discuss further)
- Professional tone

---

## Phase 4: Formatting & Polish

8. **Format the Cover Letter**

```
[Your Full Name]
[Email] | [Phone] | [City, Country] | [LinkedIn URL]

[Current Date]

[Hiring Manager Name] (if known, otherwise "Hiring Manager")
[Company Name]
[Company Address] (if known, otherwise just city)

Dear [Hiring Manager Name / Hiring Team],

[Opening Paragraph]

[Body Paragraph 1]

[Body Paragraph 2]

[Body Paragraph 3]

[Closing Paragraph]

Sincerely,
[Your Full Name]
```

9. **Quality Checks**
   - ✅ Length: 500-700 words (target: 600)
   - ✅ Company name correct throughout (copy-paste from job posting)
   - ✅ Job title exact match
   - ✅ No typos (read aloud to catch errors)
   - ✅ Professional tone (enthusiastic but not desperate)
   - ✅ Every paragraph has specific examples (no generic fluff)
   - ✅ Quantified achievements (numbers, percentages, dollars)
   - ✅ Active voice ("I led..." not "I was responsible for leading...")
   - ✅ No negative language (don't badmouth previous employers)
   - ✅ No clichés ("team player," "think outside the box," "hit the ground running")

10. **Tone Check**
    - Read as if you're the hiring manager
    - Does it feel genuine or generic?
    - Would you want to interview this person?
    - Is there a clear narrative arc?
    - Does it feel like a conversation or a resume in paragraph form?

---

## Phase 5: Save & Deliver

11. **Save to Database**
    - POST to `/api/jobs/:jobId/cover-letters`
    - Content: Full formatted cover letter
    - Auto-timestamp will be added

12. **Generate Summary Report**

```
✍️ COVER LETTER GENERATED FOR: {Company Name} - {Job Title}

📊 STATISTICS:
- Word count: {X} words
- Paragraphs: {Y}
- Key themes: [list 2-3 themes]
- Specific examples: {Z}

🎯 COVER LETTER HIGHLIGHTS:
- Opening hook: [summarize your opening strategy]
- Core competency showcased: [main skill emphasized]
- Unique differentiator: [what sets you apart]
- Company research included: [specific details referenced]

💡 RECOMMENDATIONS:
- [Tip 1 for improving application]
- [Tip 2 for interview preparation]

📁 SAVED TO DATABASE:
Job ID: {job-id}
Generated: {timestamp}

✅ NEXT STEPS:
1. Review cover letter in dashboard
2. Copy to clipboard for application portal
3. Customize if applying through referral
4. Update job status to "Applied"
```

13. **Provide Copy-Paste Version**
    - Offer plain text version for easy copying
    - Remove formatting for ATS systems if needed

---

## Best Practices for Cover Letters

### Do's ✅
- **Tell a story:** Have a narrative arc (where you've been → where you are → where you want to go)
- **Be specific:** Use names, numbers, technologies, projects
- **Show research:** Reference company news, values, challenges
- **Connect the dots:** Explicitly link your experience to their needs
- **Be conversational:** Write like you speak (professional, but human)
- **Show enthusiasm:** Genuine excitement is contagious
- **Proof of impact:** Every claim should have a result

### Don'ts ❌
- **Don't repeat resume:** Cover letter should complement, not duplicate
- **Don't be generic:** "I'm a hard worker" could apply to anyone
- **Don't focus on what you want:** Focus on what you can give them
- **Don't use templates verbatim:** Personalize heavily
- **Don't exceed 1 page:** If printed, should fit on single page
- **Don't lie:** Authenticity matters
- **Don't use exclamation points excessively:** One or two max
- **Don't apologize:** No "I know I lack X, but..." (reframe positively)

### Industry-Specific Adjustments

**Finance/Banking:**
- Tone: Professional, conservative, detail-oriented
- Emphasize: Accuracy, compliance, risk management, analytical rigor
- Avoid: Overly casual language, creative flourishes

**Tech/Startups:**
- Tone: Enthusiastic, forward-thinking, slightly casual
- Emphasize: Innovation, agility, learning, impact
- Avoid: Corporate jargon, rigid thinking

**Consulting:**
- Tone: Confident, strategic, client-focused
- Emphasize: Problem-solving, frameworks, measurable results
- Avoid: Operational details without strategic context

---

## Advanced Features

### A/B Testing Versions
- Generate 2 variants with different opening hooks
- Let user choose or combine best elements

### Follow-Up Templates
- If no response after 2 weeks, generate follow-up email
- Reference specific points from cover letter

### Interview Prep
- Based on cover letter, generate potential interview questions
- "Tell me more about the $4M margin improvement..."
- "Walk me through your stakeholder management approach..."

---

## Common Mistakes to Avoid

1. **"I am passionate about your mission"** (without showing how)
   - ❌ "I'm passionate about fintech"
   - ✅ "Having managed my own business's cash flow with limited tools, I understand the pain point your platform solves for SMBs"

2. **"I would be a great fit"** (without evidence)
   - ❌ "I believe I would be perfect for this role"
   - ✅ "My experience building financial models for executive decision-making directly aligns with the 'strategic business partner' aspect of this role"

3. **Resume bullet points in sentence form**
   - ❌ "Managed stakeholder relationships and gathered requirements"
   - ✅ "When conflicting priorities emerged between Finance and IT stakeholders, I facilitated a workshop that aligned both teams on shared success metrics, ultimately accelerating delivery by three weeks"

4. **Vague superlatives**
   - ❌ "I'm highly skilled in data analysis"
   - ✅ "I built a Power BI dashboard that processes 500K+ rows of financial data daily, with DAX calculations running in under 2 seconds"

---

## Output Format

**Deliver to user:**

1. **Full formatted cover letter** (500-700 words)
2. **Plain text version** (for copy-paste)
3. **Summary report** (key themes, statistics)
4. **Customization notes** (optional tweaks for different application channels)

**Save to database** via API

**Update job record** with "cover_letter_generated" tag

---

**Remember:** A cover letter is your chance to be human. The resume lists facts; the cover letter tells your story. Make them want to meet you.
