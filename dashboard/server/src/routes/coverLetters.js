import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/jobs/:jobId/cover-letters', (req, res) => {
  const letters = db.prepare('SELECT * FROM cover_letters WHERE job_id = ? ORDER BY generated_at DESC')
    .all(req.params.jobId);
  res.json(letters);
});

router.post('/jobs/:jobId/cover-letters', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });

  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const info = db.prepare('INSERT INTO cover_letters (job_id, content) VALUES (?, ?)').run(req.params.jobId, content);
  const letter = db.prepare('SELECT * FROM cover_letters WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(letter);
});

router.delete('/cover-letters/:id', (req, res) => {
  const result = db.prepare('DELETE FROM cover_letters WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Cover letter not found' });
  res.json({ success: true });
});

export default router;
