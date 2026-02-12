import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs.js';
import tagsRouter from './routes/tags.js';
import resumesRouter from './routes/resumes.js';
import coverLettersRouter from './routes/coverLetters.js';
import adaptedCvsRouter from './routes/adaptedCvs.js';
import interviewsRouter from './routes/interviews.js';
import analyticsRouter from './routes/analytics.js';
import mcpRouter from './routes/mcp.js';
import savedSearchesRouter from './routes/savedSearches.js';
import { initScheduler } from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api', coverLettersRouter);
app.use('/api', adaptedCvsRouter);
app.use('/api/interviews', interviewsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/mcp', mcpRouter);
app.use('/api/saved-searches', savedSearchesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Initialize the auto-search scheduler
  initScheduler();
});
