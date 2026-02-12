import cron from 'node-cron';
import db from './db.js';
import { callMcpTool } from './mcp-client.js';

const activeJobs = new Map();

function parseJobListings(raw) {
  const lines = raw.split('\n').filter(l => l.trim());
  const parsed = [];
  let current = {};

  for (const line of lines) {
    if (line.includes('Title:') || line.includes('title:')) {
      if (current.title) parsed.push(current);
      current = { title: line.split(/[Tt]itle:\s*/)[1]?.trim() || '' };
    } else if (line.includes('Company:') || line.includes('company:')) {
      current.company = line.split(/[Cc]ompany:\s*/)[1]?.trim() || '';
    } else if (line.includes('Location:') || line.includes('location:')) {
      current.location = line.split(/[Ll]ocation:\s*/)[1]?.trim() || '';
    } else if (line.includes('URL:') || line.includes('url:') || line.includes('linkedin.com/jobs')) {
      const urlMatch = line.match(/https?:\/\/[^\s)]+/);
      if (urlMatch) {
        current.linkedin_url = urlMatch[0];
        const idMatch = urlMatch[0].match(/(\d{5,})/);
        if (idMatch) current.linkedin_job_id = idMatch[1];
      }
    } else if (line.includes('Salary:') || line.includes('salary:')) {
      current.salary = line.split(/[Ss]alary:\s*/)[1]?.trim() || '';
    }
  }
  if (current.title) parsed.push(current);
  return parsed;
}

async function executeSearch(search) {
  console.log(`[Scheduler] Executing saved search: ${search.name}`);

  try {
    const result = await callMcpTool('search_jobs', {
      keywords: search.keywords,
      location: search.location || '',
      limit: 25,
    });

    const raw = result.content?.[0]?.text || '';
    const jobs = parseJobListings(raw);

    const insertJobStmt = db.prepare(`
      INSERT OR IGNORE INTO jobs (
        title, company, location, salary, description, apply_url, linkedin_url, linkedin_job_id, status,
        skills, salary_range, seniority_level, employment_type, remote_status, benefits,
        applicants_count, posted_date, company_url, auto_imported
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'saved', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    let imported = 0;
    for (const job of jobs) {
      if (!job.title || !job.company) continue;
      try {
        const info = insertJobStmt.run(
          job.title, job.company, job.location || null, job.salary || null,
          null, null, job.linkedin_url || null, job.linkedin_job_id || null,
          null, null, null, null, null, null, null, null, null
        );
        if (info.changes > 0) imported++;
      } catch (err) {
        // Job might already exist
        console.log(`[Scheduler] Skipped duplicate job: ${job.title}`);
      }
    }

    // Update last_run timestamp
    db.prepare('UPDATE saved_searches SET last_run = datetime(\'now\') WHERE id = ?').run(search.id);

    console.log(`[Scheduler] Search "${search.name}" complete: ${imported} new jobs imported`);
    return { success: true, imported, total: jobs.length };

  } catch (err) {
    console.error(`[Scheduler] Error executing search "${search.name}":`, err);
    return { success: false, error: err.message };
  }
}

function scheduleSearch(search) {
  if (!search.schedule || !search.is_active) return;

  // Stop existing job if any
  if (activeJobs.has(search.id)) {
    activeJobs.get(search.id).stop();
  }

  // Parse schedule (cron format: "0 9 * * *" = every day at 9 AM)
  try {
    const job = cron.schedule(search.schedule, () => {
      executeSearch(search);
    }, {
      scheduled: true,
      timezone: "America/Los_Angeles" // Adjust as needed
    });

    activeJobs.set(search.id, job);
    console.log(`[Scheduler] Scheduled search "${search.name}" with cron: ${search.schedule}`);
  } catch (err) {
    console.error(`[Scheduler] Invalid cron schedule for "${search.name}":`, err.message);
  }
}

export function initScheduler() {
  console.log('[Scheduler] Initializing job search scheduler...');

  // Load all active saved searches with auto_import enabled
  const searches = db.prepare(`
    SELECT * FROM saved_searches
    WHERE is_active = 1 AND auto_import = 1 AND schedule IS NOT NULL
  `).all();

  for (const search of searches) {
    scheduleSearch(search);
  }

  console.log(`[Scheduler] Loaded ${searches.length} scheduled searches`);
}

export function stopScheduler() {
  console.log('[Scheduler] Stopping all scheduled jobs...');
  for (const [id, job] of activeJobs) {
    job.stop();
  }
  activeJobs.clear();
}

export function refreshScheduler() {
  stopScheduler();
  initScheduler();
}

export { executeSearch };
