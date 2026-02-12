import { Router } from 'express';
import { callMcpTool, checkMcpStatus } from '../mcp-client.js';
import db from '../db.js';
import { autoTagJob } from '../utils/autoTag.js';

const router = Router();

const insertJobStmt = db.prepare(`
  INSERT OR IGNORE INTO jobs (
    title, company, location, salary, description, apply_url, linkedin_url, linkedin_job_id, status,
    skills, salary_range, seniority_level, employment_type, remote_status, benefits,
    applicants_count, posted_date, company_url, auto_imported
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'saved', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

function parseJobListings(raw) {
  const lines = raw.split('\n').filter(l => l.trim());
  const parsed = [];
  let current = {};

  for (const line of lines) {
    if (line.includes('Title:') || line.includes('title:')) {
      if (current.title) parsed.push(current);
      current = { title: line.split(/[Tt]itle:\s*/)[1]?.trim() || '' };
    } else if (line.includes('Company:') || line.includes('company:')) {
      current.company = line.split(/[Cc]ompany:\s*/)[1]?.trim() || '';
    } else if (line.includes('Location:') || line.includes('location:')) {
      current.location = line.split(/[Ll]ocation:\s*/)[1]?.trim() || '';
    } else if (line.includes('URL:') || line.includes('url:') || line.includes('linkedin.com/jobs')) {
      const urlMatch = line.match(/https?:\/\/[^\s)]+/);
      if (urlMatch) {
        current.linkedin_url = urlMatch[0];
        const idMatch = urlMatch[0].match(/(\d{5,})/);
        if (idMatch) current.linkedin_job_id = idMatch[1];
      }
    } else if (line.includes('Salary:') || line.includes('salary:')) {
      current.salary = line.split(/[Ss]alary:\s*/)[1]?.trim() || '';
    }
  }
  if (current.title) parsed.push(current);
  return parsed;
}

router.get('/status', async (req, res) => {
  const status = await checkMcpStatus();
  res.json(status);
});

router.post('/search-jobs', async (req, res) => {
  const { keywords, location, limit } = req.body;
  if (!keywords) return res.status(400).json({ error: 'keywords is required' });

  try {
    const result = await callMcpTool('search_jobs', {
      keywords,
      location: location || '',
      limit: limit || 25,
    });

    const raw = result.content?.[0]?.text || '';
    const jobs = parseJobListings(raw);

    // Auto-save all parsed jobs to the database
    const saved = [];
    for (const job of jobs) {
      if (!job.title || !job.company) continue;
      try {
        const info = insertJobStmt.run(
          job.title, job.company, job.location || null, job.salary || null,
          null, null, job.linkedin_url || null, job.linkedin_job_id || null,
          null, null, null, null, null, null, null, null, null  // Enhanced fields (will be populated when details are fetched)
        );

        // Auto-tag newly imported job
        if (info.changes > 0 && job.linkedin_job_id) {
          const dbJob = db.prepare('SELECT * FROM jobs WHERE linkedin_job_id = ?').get(job.linkedin_job_id);
          if (dbJob) {
            autoTagJob(dbJob.id);
            saved.push(dbJob);
          }
        } else if (job.linkedin_job_id) {
          const dbJob = db.prepare('SELECT * FROM jobs WHERE linkedin_job_id = ?').get(job.linkedin_job_id);
          if (dbJob) saved.push(dbJob);
        } else {
          saved.push(job);
        }
      } catch {
        saved.push(job);
      }
    }

    res.json({ raw, jobs: saved, autoSaved: saved.length });
  } catch (err) {
    console.error('MCP search_jobs failed:', err);
    res.status(502).json({ error: 'MCP server error: ' + err.message });
  }
});

router.post('/job-details', async (req, res) => {
  const { job_id } = req.body;
  if (!job_id) return res.status(400).json({ error: 'job_id is required' });

  try {
    const result = await callMcpTool('get_job_details', { job_id: String(job_id) });

    // The enhanced scraper now returns structured data
    let jobData = null;
    if (result.content) {
      const content = result.content[0];
      if (content.type === 'text') {
        // Try to parse as JSON first (structured response)
        try {
          jobData = JSON.parse(content.text);
        } catch {
          // Fallback to text response
          jobData = { raw: content.text };
        }
      }
    }

    // If this job exists in DB, update it with enhanced data
    const existing = db.prepare('SELECT * FROM jobs WHERE linkedin_job_id = ?').get(String(job_id));
    if (existing && jobData) {
      const updateStmt = db.prepare(`
        UPDATE jobs SET
          description = COALESCE(?, description),
          skills = COALESCE(?, skills),
          salary_range = COALESCE(?, salary_range),
          seniority_level = COALESCE(?, seniority_level),
          employment_type = COALESCE(?, employment_type),
          remote_status = COALESCE(?, remote_status),
          benefits = COALESCE(?, benefits),
          applicants_count = COALESCE(?, applicants_count),
          posted_date = COALESCE(?, posted_date),
          company_url = COALESCE(?, company_url),
          date_updated = datetime('now')
        WHERE id = ?
      `);

      updateStmt.run(
        jobData.job_description || null,
        jobData.skills ? JSON.stringify(jobData.skills) : null,
        jobData.salary_range || null,
        jobData.seniority_level || null,
        jobData.employment_type || null,
        jobData.remote_status || null,
        jobData.benefits || null,
        jobData.applicants_count_numeric || null,
        jobData.posted_date || null,
        jobData.company_linkedin_url || null,
        existing.id
      );
    }

    res.json(jobData || { raw: result.content?.[0]?.text || '' });
  } catch (err) {
    console.error('MCP get_job_details failed:', err);
    res.status(502).json({ error: 'MCP server error: ' + err.message });
  }
});

router.post('/import-job', async (req, res) => {
  const { title, company, location, salary, description, apply_url, linkedin_url, linkedin_job_id } = req.body;
  if (!title || !company) return res.status(400).json({ error: 'title and company are required' });

  try {
    const stmt = db.prepare(`
      INSERT INTO jobs (title, company, location, salary, description, apply_url, linkedin_url, linkedin_job_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'saved')
    `);

    const info = stmt.run(
      title, company, location || null, salary || null,
      description || null, apply_url || null, linkedin_url || null,
      linkedin_job_id || null
    );

    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(job);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Job already imported' });
    }
    throw err;
  }
});

export default router;
