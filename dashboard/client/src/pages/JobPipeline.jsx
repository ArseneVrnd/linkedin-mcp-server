import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Header from '../components/layout/Header';
import KanbanColumn from '../components/jobs/KanbanColumn';
import JobCard from '../components/jobs/JobCard';
import { useJobs } from '../hooks/useJobs';
import { useTheme } from '../hooks/useTheme';
import { api } from '../lib/api';

const STATUS_COLUMNS = [
  { id: 'saved', label: 'Saved', color: 'bg-gray-500' },
  { id: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { id: 'phone_screen', label: 'Phone Screen', color: 'bg-yellow-500' },
  { id: 'technical_interview', label: 'Technical', color: 'bg-orange-500' },
  { id: 'onsite', label: 'On-site', color: 'bg-purple-500' },
  { id: 'offer', label: 'Offer', color: 'bg-green-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

export default function JobPipeline() {
  const { dark, toggle } = useTheme();
  const { jobs, loading, refetch } = useJobs();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group jobs by status
  const jobsByStatus = STATUS_COLUMNS.reduce((acc, column) => {
    acc[column.id] = jobs.filter(job => job.status === column.id);
    return acc;
  }, {});

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const jobId = active.id;
    let newStatus = over.id;

    // If dropped on a column, use column ID
    if (STATUS_COLUMNS.find(col => col.id === newStatus)) {
      // Already a column ID, great!
    } else {
      // Dropped on another job card - find which column that job is in
      const targetJob = jobs.find(j => j.id === over.id);
      if (targetJob) {
        newStatus = targetJob.status;
      } else {
        setActiveId(null);
        return;
      }
    }

    // Only update if status actually changed
    const currentJob = jobs.find(j => j.id === jobId);
    if (currentJob && currentJob.status !== newStatus) {
      try {
        await api.updateJob(jobId, { status: newStatus });
        await refetch();
      } catch (err) {
        console.error('Failed to update job status:', err);
        alert('Failed to update job status. Please try again.');
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeJob = activeId ? jobs.find(job => job.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Job Pipeline" dark={dark} toggle={toggle} />
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Drag and drop jobs between columns to update their status
          </p>
          <div className="text-sm font-medium">
            Total: {jobs.length} jobs
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto">
            {STATUS_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                jobs={jobsByStatus[column.id] || []}
              />
            ))}
          </div>

          <DragOverlay>
            {activeJob ? (
              <JobCard job={activeJob} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
