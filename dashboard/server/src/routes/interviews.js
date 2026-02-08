import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { upcoming } = req.query;

  let query = `
    SELECT i.*, j.title as job_title, j.company as job_company
    FROM interviews i
    JOIN jobs j ON i.job_id = j.id
  `;

  if (upcoming === 'true') {
    query += ` WHERE i.interview_date >= date('now') ORDER BY i.interview_date ASC, i.interview_time ASC`;
  } else {
    query += ` ORDER BY i.interview_date DESC, i.interview_time DESC`;
  }

  const interviews = db.prepare(query).all();
  res.json(interviews);
});

router.get('/:id', (req, res) => {
  const interview = db.prepare(`
    SELECT i.*, j.title as job_title, j.company as job_company
    FROM interviews i
    JOIN jobs j ON i.job_id = j.id
    WHERE i.id = ?
  `).get(req.params.id);

  if (!interview) return res.status(404).json({ error: 'Interview not found' });
  res.json(interview);
});

router.post('/', (req, res) => {
  const { job_id, interview_date, interview_time, type, location, notes } = req.body;
  if (!job_id || !interview_date) return res.status(400).json({ error: 'job_id and interview_date are required' });

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(job_id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const info = db.prepare(`
    INSERT INTO interviews (job_id, interview_date, interview_time, type, location, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(job_id, interview_date, interview_time || null, type || 'phone', location || null, notes || null);

  const interview = db.prepare(`
    SELECT i.*, j.title as job_title, j.company as job_company
    FROM interviews i
    JOIN jobs j ON i.job_id = j.id
    WHERE i.id = ?
  `).get(info.lastInsertRowid);

  res.status(201).json(interview);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM interviews WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Interview not found' });

  const fields = ['interview_date', 'interview_time', 'type', 'location', 'notes'];
  const updates = [];
  const params = [];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = ?`);
      params.push(req.body[field]);
    }
  }

  if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
  params.push(req.params.id);

  db.prepare(`UPDATE interviews SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const interview = db.prepare(`
    SELECT i.*, j.title as job_title, j.company as job_company
    FROM interviews i
    JOIN jobs j ON i.job_id = j.id
    WHERE i.id = ?
  `).get(req.params.id);

  res.json(interview);
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM interviews WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Interview not found' });
  res.json({ success: true });
});

export default router;
