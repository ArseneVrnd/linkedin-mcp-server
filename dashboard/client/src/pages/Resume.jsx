import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ResumeUpload from '../components/resume/ResumeUpload';
import ResumeViewer from '../components/resume/ResumeViewer';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function Resume() {
  const { dark, toggle } = useTheme();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewId, setPreviewId] = useState(null);

  const fetchResumes = async () => {
    try {
      const data = await api.getResumes();
      setResumes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleActivate = async (id) => {
    await api.activateResume(id);
    fetchResumes();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this resume?')) {
      await api.deleteResume(id);
      if (previewId === id) setPreviewId(null);
      fetchResumes();
    }
  };

  const activeResume = resumes.find(r => r.is_active);

  return (
    <div>
      <Header title="Resumes" dark={dark} toggle={toggle} />
      <div className="p-6 space-y-6">
        <ResumeUpload onUploaded={fetchResumes} />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map(r => (
              <div key={r.id}>
                <div onClick={() => setPreviewId(previewId === r.id ? null : r.id)} className="cursor-pointer">
                  <ResumeViewer resume={r} onActivate={handleActivate} onDelete={handleDelete} />
                </div>
                {previewId === r.id && (
                  <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                    <iframe
                      src={api.getResumeUrl(r.id)}
                      className="w-full h-full"
                      title={r.filename}
                    />
                  </div>
                )}
              </div>
            ))}
            {resumes.length === 0 && (
              <p className="text-center text-gray-500 py-8">No resumes uploaded yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
