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

router.post('/jobs/:jobId/cover-letters/generate', async (req, res) => {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const activeResume = db.prepare('SELECT * FROM resumes WHERE is_active = 1').get();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'ANTHROPIC_API_KEY not configured. Set it in server/.env' });
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey });

    const prompt = `Write a professional cover letter for the following job application.

Job Title: ${job.title}
Company: ${job.company}
Location: ${job.location || 'Not specified'}
Job Description: ${job.description || 'Not available'}

${activeResume ? 'The applicant has an active resume on file.' : 'No resume is currently uploaded.'}
${job.notes ? `Additional notes: ${job.notes}` : ''}

Write a compelling, personalized cover letter. Keep it concise (3-4 paragraphs). Do not include placeholder brackets.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0].text;

    const info = db.prepare('INSERT INTO cover_letters (job_id, content) VALUES (?, ?)').run(job.id, content);
    const letter = db.prepare('SELECT * FROM cover_letters WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(letter);
  } catch (err) {
    console.error('Cover letter generation failed:', err);
    res.status(500).json({ error: 'Failed to generate cover letter: ' + err.message });
  }
});

router.delete('/cover-letters/:id', (req, res) => {
  const result = db.prepare('DELETE FROM cover_letters WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Cover letter not found' });
  res.json({ success: true });
});

export default router;
