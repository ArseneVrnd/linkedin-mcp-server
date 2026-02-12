import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SkillsGapAnalysis({ jobs }) {
  const skillsData = useMemo(() => {
    const skillCounts = {};
    const mySkills = new Set(); // TODO: Get from user profile/resume

    jobs.forEach(job => {
      if (job.skills) {
        try {
          const skills = typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills;
          if (Array.isArray(skills)) {
            skills.forEach(skill => {
              const skillName = skill.trim();
              if (skillName) {
                skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
              }
            });
          }
        } catch (e) {
          // Skip invalid skills data
        }
      }
    });

    // Convert to array and sort by frequency
    return Object.entries(skillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        hasSkill: mySkills.has(skill.toLowerCase()),
        percentage: (count / jobs.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 skills
  }, [jobs]);

  const missingSkills = skillsData.filter(s => !s.hasSkill);
  const mostInDemand = skillsData.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-medium mb-4">Skills Gap Analysis</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {skillsData.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unique Skills</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {missingSkills.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Skills to Learn</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {mostInDemand[0]?.skill || 'N/A'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Most In Demand</div>
        </div>
      </div>

      {/* Skills Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Top Skills in Your Job Searches</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={skillsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {skillsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.hasSkill ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>You have this skill</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Skill gap</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {missingSkills.length > 0 && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h4 className="text-sm font-medium mb-2">🎯 Recommended Skills to Learn</h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.slice(0, 8).map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-white dark:bg-gray-800 rounded border border-yellow-200 dark:border-yellow-800 text-xs">
                {skill.skill} ({skill.count} jobs)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
