import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/jobs/:jobId/adapted-cvs', (req, res) => {
  const cvs = db.prepare('SELECT * FROM adapted_cvs WHERE job_id = ? ORDER BY created_at DESC')
    .all(req.params.jobId);
  res.json(cvs);
});

router.post('/jobs/:jobId/adapted-cvs', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const info = db.prepare('INSERT INTO adapted_cvs (job_id, content) VALUES (?, ?)').run(req.params.jobId, content);
  const cv = db.prepare('SELECT * FROM adapted_cvs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(cv);
});

router.delete('/adapted-cvs/:id', (req, res) => {
  const result = db.prepare('DELETE FROM adapted_cvs WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Adapted CV not found' });
  res.json({ success: true });
});

export default router;
