import { FileText, Trash2, CheckCircle, Circle } from 'lucide-react';
import { api } from '../../lib/api';
import { format } from 'date-fns';

export default function ResumeViewer({ resume, onActivate, onDelete }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-red-500" />
        <div>
          <a
            href={api.getResumeUrl(resume.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm hover:text-primary-600"
          >
            {resume.filename}
          </a>
          <p className="text-xs text-gray-500">
            Uploaded {format(new Date(resume.uploaded_at), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onActivate(resume.id)}
          className={`p-1.5 rounded-lg ${resume.is_active ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
          title={resume.is_active ? 'Active resume' : 'Set as active'}
        >
          {resume.is_active ? <CheckCircle size={18} /> : <Circle size={18} />}
        </button>
        <button
          onClick={() => onDelete(resume.id)}
          className="p-1.5 text-red-400 hover:text-red-600 rounded-lg"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
