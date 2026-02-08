import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../db.js';
import upload from '../middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get('/', (req, res) => {
  const resumes = db.prepare('SELECT * FROM resumes ORDER BY uploaded_at DESC').all();
  res.json(resumes);
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const info = db.prepare('INSERT INTO resumes (filename, filepath) VALUES (?, ?)').run(
    req.file.originalname,
    req.file.filename
  );
  const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(resume);
});

router.get('/:id/file', (req, res) => {
  const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });

  const filePath = path.join(__dirname, '..', '..', 'uploads', resume.filepath);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${resume.filename}"`);
  res.sendFile(filePath);
});

router.put('/:id/activate', (req, res) => {
  const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });

  db.prepare('UPDATE resumes SET is_active = 0').run();
  db.prepare('UPDATE resumes SET is_active = 1 WHERE id = ?').run(req.params.id);

  const updated = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const resume = db.prepare('SELECT * FROM resumes WHERE id = ?').get(req.params.id);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });

  const filePath = path.join(__dirname, '..', '..', 'uploads', resume.filepath);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM resumes WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

export default router;
