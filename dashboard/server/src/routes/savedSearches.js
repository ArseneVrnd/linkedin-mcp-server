import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get all saved searches
router.get('/', (req, res) => {
  const searches = db.prepare('SELECT * FROM saved_searches ORDER BY created_at DESC').all();
  res.json(searches);
});

// Get a single saved search
router.get('/:id', (req, res) => {
  const search = db.prepare('SELECT * FROM saved_searches WHERE id = ?').get(req.params.id);
  if (!search) return res.status(404).json({ error: 'Search not found' });
  res.json(search);
});

// Create a new saved search
router.post('/', (req, res) => {
  const { name, keywords, location, filters, auto_import, schedule } = req.body;

  if (!name || !keywords) {
    return res.status(400).json({ error: 'name and keywords are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO saved_searches (name, keywords, location, filters, auto_import, schedule, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `);

  const info = stmt.run(
    name,
    keywords,
    location || null,
    filters ? JSON.stringify(filters) : null,
    auto_import || 0,
    schedule || null
  );

  const search = db.prepare('SELECT * FROM saved_searches WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(search);
});

// Update a saved search
router.put('/:id', (req, res) => {
  const { name, keywords, location, filters, auto_import, schedule, is_active } = req.body;

  const stmt = db.prepare(`
    UPDATE saved_searches
    SET name = ?, keywords = ?, location = ?, filters = ?, auto_import = ?, schedule = ?, is_active = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  const info = stmt.run(
    name,
    keywords,
    location || null,
    filters ? JSON.stringify(filters) : null,
    auto_import || 0,
    schedule || null,
    is_active !== undefined ? is_active : 1,
    req.params.id
  );

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Search not found' });
  }

  const search = db.prepare('SELECT * FROM saved_searches WHERE id = ?').get(req.params.id);
  res.json(search);
});

// Delete a saved search
router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM saved_searches WHERE id = ?');
  const info = stmt.run(req.params.id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Search not found' });
  }

  res.status(204).send();
});

// Execute a saved search
router.post('/:id/execute', async (req, res) => {
  const search = db.prepare('SELECT * FROM saved_searches WHERE id = ?').get(req.params.id);

  if (!search) {
    return res.status(404).json({ error: 'Search not found' });
  }

  // Update last_run timestamp
  db.prepare('UPDATE saved_searches SET last_run = datetime(\'now\') WHERE id = ?').run(search.id);

  // Forward the search parameters to the MCP search-jobs endpoint
  res.json({
    search_id: search.id,
    keywords: search.keywords,
    location: search.location,
    filters: search.filters ? JSON.parse(search.filters) : null,
    message: 'Execute this search using the /api/mcp/search-jobs endpoint'
  });
});

export default router;
