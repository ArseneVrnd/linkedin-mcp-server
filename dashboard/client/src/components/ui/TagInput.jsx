import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function TagInput({ tags, allTags, onAdd, onRemove, onCreateTag }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const availableTags = allTags.filter(t => !tags.find(jt => jt.id === t.id));

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
          <button onClick={() => onRemove(tag.id)} className="hover:opacity-75">
            <X size={12} />
          </button>
        </span>
      ))}
      {showAdd ? (
        <div className="flex items-center gap-1">
          <select
            className="text-xs border rounded px-1 py-1 dark:bg-gray-700 dark:border-gray-600"
            onChange={e => { if (e.target.value) { onAdd(Number(e.target.value)); setShowAdd(false); } }}
            defaultValue=""
          >
            <option value="">Select tag...</option>
            {availableTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="New tag"
              className="text-xs border rounded px-1 py-1 w-20 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              onClick={() => {
                if (newTagName.trim()) {
                  onCreateTag(newTagName.trim());
                  setNewTagName('');
                  setShowAdd(false);
                }
              }}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              Create
            </button>
          </div>
          <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-primary-600 border border-dashed border-gray-300 dark:border-gray-600 rounded-full"
        >
          <Plus size={12} /> Tag
        </button>
      )}
    </div>
  );
}
