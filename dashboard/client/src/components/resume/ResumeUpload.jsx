import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function ResumeUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setUploading(true);
    try {
      await api.uploadResume(file);
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
        dragOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
      }`}
      onClick={() => fileRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
      {uploading ? (
        <Loader2 size={32} className="mx-auto animate-spin text-primary-500" />
      ) : (
        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {uploading ? 'Uploading...' : 'Drop a PDF here or click to browse'}
      </p>
    </div>
  );
}
