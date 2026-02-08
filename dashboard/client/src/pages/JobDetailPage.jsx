import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import JobDetail from '../components/jobs/JobDetail';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [job, setJob] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const [j, t] = await Promise.all([api.getJob(id), api.getTags()]);
      setJob(j);
      setAllTags(t);
    } catch {
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJob(); }, [id]);

  const handleDelete = async () => {
    if (confirm('Delete this job?')) {
      await api.deleteJob(id);
      navigate('/jobs');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Job Details" dark={dark} toggle={toggle}>
        <button
          onClick={() => navigate('/jobs')}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
        >
          <ArrowLeft size={16} /> Back to Jobs
        </button>
      </Header>
      <div className="p-6 max-w-4xl">
        {job && <JobDetail job={job} allTags={allTags} onUpdate={fetchJob} onDelete={handleDelete} />}
      </div>
    </div>
  );
}
