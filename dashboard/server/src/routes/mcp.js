import { Router } from 'express';
import { callMcpTool, checkMcpStatus } from '../mcp-client.js';
import db from '../db.js';

const router = Router();

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

    const content = result.content?.[0]?.text || '';
    res.json({ raw: content });
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
    const content = result.content?.[0]?.text || '';
    res.json({ raw: content });
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
