import { Calendar, MapPin, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const typeColors = {
  phone: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  technical: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  onsite: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  behavioral: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  final: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function InterviewList({ interviews, onDelete }) {
  if (interviews.length === 0) {
    return <p className="text-center text-gray-500 py-8">No interviews scheduled.</p>;
  }

  return (
    <div className="space-y-3">
      {interviews.map(iv => (
        <div key={iv.id} className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <div className="text-center min-w-[50px]">
              <div className="text-2xl font-bold text-primary-600">{format(new Date(iv.interview_date), 'd')}</div>
              <div className="text-xs text-gray-500 uppercase">{format(new Date(iv.interview_date), 'MMM')}</div>
            </div>
            <div>
              <div className="font-medium">{iv.job_title}</div>
              <div className="text-sm text-gray-500">{iv.job_company}</div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[iv.type] || typeColors.other}`}>
                  {iv.type}
                </span>
                {iv.interview_time && (
                  <span className="flex items-center gap-1"><Clock size={12} /> {iv.interview_time}</span>
                )}
                {iv.location && (
                  <span className="flex items-center gap-1"><MapPin size={12} /> {iv.location}</span>
                )}
              </div>
              {iv.notes && <p className="text-xs text-gray-500 mt-1">{iv.notes}</p>}
            </div>
          </div>
          <button
            onClick={() => onDelete(iv.id)}
            className="p-1.5 text-red-400 hover:text-red-600 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
