import { useState } from 'react';
import { ExternalLink, Trash2, Edit3 } from 'lucide-react';
import StatusBadge, { STATUS_OPTIONS } from './StatusBadge';
import TagInput from '../ui/TagInput';
import CoverLetterGenerator from '../cover-letter/CoverLetterGenerator';
import CoverLetterViewer from '../cover-letter/CoverLetterViewer';
import { api } from '../../lib/api';
import { format } from 'date-fns';

export default function JobDetail({ job, allTags, onUpdate, onDelete }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(job.notes || '');
  const [coverLetters, setCoverLetters] = useState(job.cover_letters || []);

  const handleStatusChange = async (newStatus) => {
    await api.updateJob(job.id, { status: newStatus });
    onUpdate();
  };

  const handleNotesSave = async () => {
    await api.updateJob(job.id, { notes });
    setEditingNotes(false);
    onUpdate();
  };

  const handleAddTag = async (tagId) => {
    await api.addJobTag(job.id, tagId);
    onUpdate();
  };

  const handleRemoveTag = async (tagId) => {
    await api.removeJobTag(job.id, tagId);
    onUpdate();
  };

  const handleCreateTag = async (name) => {
    const tag = await api.createTag({ name });
    await api.addJobTag(job.id, tag.id);
    onUpdate();
  };

  const handleCoverLetterGenerated = (letter) => {
    setCoverLetters(prev => [letter, ...prev]);
  };

  const handleDeleteCoverLetter = async (id) => {
    await api.deleteCoverLetter(id);
    setCoverLetters(prev => prev.filter(cl => cl.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">{job.company}</p>
          {job.location && <p className="text-sm text-gray-500">{job.location}</p>}
          {job.salary && <p className="text-sm text-green-600 dark:text-green-400 font-medium">{job.salary}</p>}
        </div>
        <div className="flex items-center gap-2">
          {job.apply_url && (
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <ExternalLink size={18} />
            </a>
          )}
          <button onClick={onDelete} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Status:</label>
        <select
          value={job.status}
          onChange={e => handleStatusChange(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <StatusBadge status={job.status} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Tags</label>
        <TagInput
          tags={job.tags || []}
          allTags={allTags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          onCreateTag={handleCreateTag}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div><span className="text-gray-500">Added:</span> {format(new Date(job.date_added), 'MMM d, yyyy')}</div>
        {job.date_applied && <div><span className="text-gray-500">Applied:</span> {format(new Date(job.date_applied), 'MMM d, yyyy')}</div>}
        <div><span className="text-gray-500">Updated:</span> {format(new Date(job.updated_at), 'MMM d, yyyy')}</div>
      </div>

      {job.description && (
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="prose dark:prose-invert max-w-none text-sm bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Notes</h3>
          <button onClick={() => setEditingNotes(!editingNotes)} className="text-xs text-primary-600 hover:text-primary-700">
            <Edit3 size={14} />
          </button>
        </div>
        {editingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <div className="flex gap-2">
              <button onClick={handleNotesSave} className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
              <button onClick={() => { setEditingNotes(false); setNotes(job.notes || ''); }} className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {job.notes || 'No notes yet.'}
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Cover Letters</h3>
        <CoverLetterGenerator jobId={job.id} onGenerated={handleCoverLetterGenerated} />
        <div className="mt-4 space-y-3">
          {coverLetters.map(cl => (
            <CoverLetterViewer key={cl.id} letter={cl} onDelete={() => handleDeleteCoverLetter(cl.id)} />
          ))}
        </div>
      </div>

      {job.interviews && job.interviews.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Interviews</h3>
          <div className="space-y-2">
            {job.interviews.map(iv => (
              <div key={iv.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-sm">
                <span className="font-medium">{format(new Date(iv.interview_date), 'MMM d, yyyy')}</span>
                {iv.interview_time && <span className="text-gray-500">{iv.interview_time}</span>}
                <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs">{iv.type}</span>
                {iv.location && <span className="text-gray-500">{iv.location}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
