import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/summary', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  const applied = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status != 'saved'").get().count;
  const interviews = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status IN ('phone_screen','technical_interview','onsite')").get().count;
  const offers = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status IN ('offer','negotiation','accepted')").get().count;
  const rejected = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'rejected'").get().count;
  const ghosted = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'ghosted'").get().count;
  const responseRate = applied > 0 ? Math.round(((applied - db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status IN ('applied','ghosted')").get().count) / applied) * 100) : 0;

  const statusCounts = db.prepare('SELECT status, COUNT(*) as count FROM jobs GROUP BY status').all();

  res.json({
    total,
    applied,
    interviews,
    offers,
    rejected,
    ghosted,
    responseRate,
    statusCounts,
  });
});

router.get('/timeline', (req, res) => {
  const data = db.prepare(`
    SELECT date(date_added) as date, COUNT(*) as count
    FROM jobs
    GROUP BY date(date_added)
    ORDER BY date ASC
    LIMIT 90
  `).all();
  res.json(data);
});

router.get('/pipeline', (req, res) => {
  const stages = [
    'saved', 'applied', 'phone_screen', 'technical_interview',
    'onsite', 'offer', 'negotiation', 'accepted', 'rejected', 'ghosted'
  ];

  const data = stages.map(stage => {
    const count = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get(stage).count;
    return { stage, count };
  });

  res.json(data);
});

export default router;
