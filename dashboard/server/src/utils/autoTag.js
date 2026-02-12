import db from '../db.js';

/**
 * Auto-tagging rules
 * Each rule has:
 * - tagName: The tag to apply
 * - tagColor: Color for the tag (if it needs to be created)
 * - condition: Function that returns true if the rule matches
 */
const AUTO_TAG_RULES = [
  {
    tagName: 'Remote',
    tagColor: '#10b981',
    condition: (job) => {
      const location = (job.location || '').toLowerCase();
      const remote_status = (job.remote_status || '').toLowerCase();
      return location.includes('remote') || remote_status === 'remote';
    }
  },
  {
    tagName: 'Hybrid',
    tagColor: '#f59e0b',
    condition: (job) => {
      const location = (job.location || '').toLowerCase();
      const remote_status = (job.remote_status || '').toLowerCase();
      return location.includes('hybrid') || remote_status === 'hybrid';
    }
  },
  {
    tagName: 'High Salary',
    tagColor: '#10b981',
    condition: (job) => {
      const salary = job.salary_range || job.salary || '';
      // Look for salary > $150k
      const match = salary.match(/\$(\d+)[kK]/);
      if (match) {
        const amount = parseInt(match[1]);
        return amount >= 150;
      }
      return false;
    }
  },
  {
    tagName: 'Senior',
    tagColor: '#8b5cf6',
    condition: (job) => {
      const seniority = (job.seniority_level || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      return seniority.includes('senior') ||
             seniority.includes('executive') ||
             seniority.includes('lead') ||
             title.includes('senior') ||
             title.includes('lead') ||
             title.includes('staff') ||
             title.includes('principal');
    }
  },
  {
    tagName: 'Entry Level',
    tagColor: '#3b82f6',
    condition: (job) => {
      const seniority = (job.seniority_level || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      return seniority.includes('entry') ||
             seniority.includes('junior') ||
             title.includes('junior') ||
             title.includes('entry');
    }
  },
  {
    tagName: 'Contract',
    tagColor: '#f59e0b',
    condition: (job) => {
      const employment = (job.employment_type || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      return employment.includes('contract') ||
             employment.includes('temporary') ||
             title.includes('contract') ||
             title.includes('contractor');
    }
  },
  {
    tagName: 'Full-time',
    tagColor: '#6366f1',
    condition: (job) => {
      const employment = (job.employment_type || '').toLowerCase();
      return employment.includes('full') ||
             employment.includes('full-time') ||
             employment.includes('permanent');
    }
  },
  {
    tagName: 'Hot',
    tagColor: '#ef4444',
    condition: (job) => {
      // Tag as "Hot" if recently posted (within last 3 days) and has few applicants
      const posted = job.posted_date || '';
      const applicants = job.applicants_count || 9999;

      if (posted.includes('hour') || posted.includes('today') || posted.includes('1 day')) {
        return true;
      }

      if ((posted.includes('2 day') || posted.includes('3 day')) && applicants < 50) {
        return true;
      }

      return false;
    }
  },
  {
    tagName: 'Competitive',
    tagColor: '#f59e0b',
    condition: (job) => {
      // High number of applicants
      const applicants = job.applicants_count || 0;
      return applicants > 200;
    }
  },
];

/**
 * Ensure a tag exists in the database
 */
function ensureTag(tagName, tagColor) {
  try {
    // Try to get existing tag
    let tag = db.prepare('SELECT * FROM tags WHERE name = ?').get(tagName);

    if (!tag) {
      // Create tag if it doesn't exist
      const info = db.prepare('INSERT INTO tags (name, color) VALUES (?, ?)').run(tagName, tagColor);
      tag = db.prepare('SELECT * FROM tags WHERE id = ?').get(info.lastInsertRowid);
    }

    return tag;
  } catch (err) {
    console.error(`Error ensuring tag "${tagName}":`, err);
    return null;
  }
}

/**
 * Apply auto-tagging rules to a single job
 */
export function autoTagJob(jobId) {
  const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
  if (!job) return { success: false, error: 'Job not found' };

  const tagsApplied = [];

  for (const rule of AUTO_TAG_RULES) {
    if (rule.condition(job)) {
      const tag = ensureTag(rule.tagName, rule.tagColor);
      if (tag) {
        try {
          db.prepare('INSERT OR IGNORE INTO job_tags (job_id, tag_id) VALUES (?, ?)').run(jobId, tag.id);
          tagsApplied.push(tag.name);
        } catch (err) {
          console.error(`Error applying tag "${tag.name}" to job ${jobId}:`, err);
        }
      }
    }
  }

  return { success: true, tagsApplied };
}

/**
 * Apply auto-tagging rules to multiple jobs
 */
export function autoTagJobs(jobIds) {
  const results = [];

  for (const jobId of jobIds) {
    const result = autoTagJob(jobId);
    results.push({ jobId, ...result });
  }

  return results;
}

/**
 * Apply auto-tagging rules to all jobs
 */
export function autoTagAllJobs() {
  const jobs = db.prepare('SELECT id FROM jobs').all();
  const jobIds = jobs.map(j => j.id);
  return autoTagJobs(jobIds);
}

/**
 * Add a custom auto-tag rule
 */
export function addAutoTagRule(rule) {
  AUTO_TAG_RULES.push(rule);
}

export default {
  autoTagJob,
  autoTagJobs,
  autoTagAllJobs,
  addAutoTagRule,
};
