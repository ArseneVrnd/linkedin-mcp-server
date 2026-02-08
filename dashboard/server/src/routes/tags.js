import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const tags = db.prepare('SELECT * FROM tags ORDER BY name').all();
  res.json(tags);
});

router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const info = db.prepare('INSERT INTO tags (name, color) VALUES (?, ?)').run(name, color || '#6366f1');
    const tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(tag);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({ error: 'Tag already exists' });
    }
    throw err;
  }
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Tag not found' });
  res.json({ success: true });
});

export default router;
