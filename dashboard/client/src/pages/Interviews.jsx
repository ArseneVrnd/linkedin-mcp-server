import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import InterviewList from '../components/interviews/InterviewList';
import InterviewForm from '../components/interviews/InterviewForm';
import Modal from '../components/ui/Modal';
import { useInterviews } from '../hooks/useInterviews';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function Interviews() {
  const { dark, toggle } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { interviews, loading, refetch } = useInterviews();

  useEffect(() => {
    api.getJobs({}).then(setJobs).catch(() => {});
  }, []);

  const handleCreate = async (data) => {
    await api.createInterview(data);
    setShowForm(false);
    refetch();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this interview?')) {
      await api.deleteInterview(id);
      refetch();
    }
  };

  return (
    <div>
      <Header title="Interviews" dark={dark} toggle={toggle}>
        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
        >
          <Plus size={16} /> Add Interview
        </button>
      </Header>
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <InterviewList interviews={interviews} onDelete={handleDelete} />
        )}
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add Interview">
        <InterviewForm jobs={jobs} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      </Modal>
    </div>
  );
}
