import { Building2, MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job, isDragging = false }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!isDragging) {
      navigate(`/jobs/${job.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-xl rotate-2' : ''
      }`}
    >
      {/* Title */}
      <h4 className="font-medium text-sm mb-1 line-clamp-2 text-gray-900 dark:text-gray-100">
        {job.title}
      </h4>

      {/* Company */}
      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
        <Building2 className="w-3 h-3" />
        <span className="truncate">{job.company}</span>
      </div>

      {/* Location & Remote Status */}
      {(job.location || job.remote_status) && (
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {job.remote_status || job.location}
          </span>
        </div>
      )}

      {/* Salary */}
      {(job.salary_range || job.salary) && (
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mb-2">
          <DollarSign className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{job.salary_range || job.salary}</span>
        </div>
      )}

      {/* Meta Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        {job.posted_date && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{job.posted_date}</span>
          </div>
        )}

        {job.applicants_count && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{job.applicants_count}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
