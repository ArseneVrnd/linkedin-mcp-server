import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { status, search, tag, sort = 'date_added', order = 'desc' } = req.query;
  const allowedSorts = ['date_added', 'date_applied', 'date_updated', 'title', 'company', 'status', 'created_at'];
  const sortCol = allowedSorts.includes(sort) ? sort : 'date_added';
  const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

  let query = `SELECT DISTINCT j.* FROM jobs j`;
  const params = [];
  const conditions = [];

  if (tag) {
    query += ` JOIN job_tags jt ON j.id = jt.job_id JOIN tags t ON jt.tag_id = t.id`;
    conditions.push(`t.name = ?`);
    params.push(tag);
  }

  if (status) {
    conditions.push(`j.status = ?`);
    params.push(status);
  }

  if (search) {
    conditions.push(`(j.title LIKE ? OR j.company LIKE ? OR j.location LIKE ?)`);
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY j.${sortCol} ${sortOrder}`;

  const jobs = db.prepare(query).all(...params);

  const tagStmt = db.prepare(`
    SELECT t.* FROM tags t
    JOIN job_tags jt ON t.id = jt.tag_id
    WHERE jt.job_id = ?
  `);

  const result = jobs.map(job => ({
    ...job,
    tags: tagStmt.all(job.id),
  }));

  res.json(result);
});

router.get('/:id', (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const tags = db.prepare(`
    SELECT t.* FROM tags t
    JOIN job_tags jt ON t.id = jt.tag_id
    WHERE jt.job_id = ?
  `).all(job.id);

  const coverLetters = db.prepare('SELECT * FROM cover_letters WHERE job_id = ? ORDER BY generated_at DESC').all(job.id);
  const interviews = db.prepare('SELECT * FROM interviews WHERE job_id = ? ORDER BY interview_date ASC').all(job.id);

  res.json({ ...job, tags, cover_letters: coverLetters, interviews });
});

router.post('/', (req, res) => {
  const { title, company, location, salary, description, status, apply_url, linkedin_url, linkedin_job_id, notes, date_applied } = req.body;
  if (!title || !company) return res.status(400).json({ error: 'Title and company are required' });

  const stmt = db.prepare(`
    INSERT INTO jobs (title, company, location, salary, description, status, apply_url, linkedin_url, linkedin_job_id, notes, date_applied)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const info = stmt.run(
      title, company, location || null, salary || null, description || null,
      status || 'saved', apply_url || null, linkedin_url || null,
      linkedin_job_id || null, notes || null, date_applied || null
    );
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(job);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Job already exists (duplicate LinkedIn job ID)' });
    }
    throw err;
  }
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Job not found' });

  const fields = ['title', 'company', 'location', 'salary', 'description', 'status', 'apply_url', 'linkedin_url', 'notes', 'date_applied'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

  updates.push(`updated_at = datetime('now')`);
  updates.push(`date_updated = datetime('now')`);
  params.push(req.params.id);

  db.prepare(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  res.json(job);
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Job not found' });
  res.json({ success: true });
});

router.post('/:id/tags', (req, res) => {
  const { tag_id } = req.body;
  if (!tag_id) return res.status(400).json({ error: 'tag_id is required' });

  try {
    db.prepare('INSERT INTO job_tags (job_id, tag_id) VALUES (?, ?)').run(req.params.id, tag_id);
    res.status(201).json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint') || err.message.includes('PRIMARY')) {
      return res.status(409).json({ error: 'Tag already assigned' });
    }
    throw err;
  }
});

router.delete('/:id/tags/:tagId', (req, res) => {
  db.prepare('DELETE FROM job_tags WHERE job_id = ? AND tag_id = ?').run(req.params.id, req.params.tagId);
  res.json({ success: true });
});

export default router;
