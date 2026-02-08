import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import Header from '../components/layout/Header';
import JobTable from '../components/jobs/JobTable';
import JobFilters from '../components/jobs/JobFilters';
import JobForm from '../components/jobs/JobForm';
import JobImport from '../components/jobs/JobImport';
import Modal from '../components/ui/Modal';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

export default function Jobs() {
  const { dark, toggle } = useTheme();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const { jobs, loading, refetch } = useJobs({ search, status, tag: selectedTag });

  useEffect(() => {
    api.getTags().then(setTags).catch(() => {});
  }, []);

  const handleCreate = async (data) => {
    await api.createJob(data);
    setShowAddForm(false);
    refetch();
  };

  return (
    <div>
      <Header title="Jobs" dark={dark} toggle={toggle}>
        <button
          onClick={() => setShowImport(true)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
        >
          <Download size={16} /> Import from LinkedIn
        </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-3 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-1.5"
        >
          <Plus size={16} /> Add Job
        </button>
      </Header>

      <div className="p-6 space-y-4">
        <JobFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          tags={tags}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : (
          <JobTable jobs={jobs} />
        )}
      </div>

      <Modal open={showAddForm} onClose={() => setShowAddForm(false)} title="Add Job">
        <JobForm onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} />
      </Modal>

      <Modal open={showImport} onClose={() => setShowImport(false)} title="Import from LinkedIn">
        <JobImport onImported={() => { refetch(); }} />
      </Modal>
    </div>
  );
}
