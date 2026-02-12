import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableJobCard from './SortableJobCard';

export default function KanbanColumn({ id, label, color, jobs }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] rounded-lg border ${
        isOver
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      } transition-colors`}
    >
      {/* Column Header */}
      <div className={`${color} text-white px-3 py-2 rounded-t-lg flex justify-between items-center`}>
        <h3 className="font-medium text-sm">{label}</h3>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-medium">
          {jobs.length}
        </span>
      </div>

      {/* Jobs List */}
      <div className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext
          items={jobs.map(job => job.id)}
          strategy={verticalListSortingStrategy}
        >
          {jobs.map((job) => (
            <SortableJobCard key={job.id} job={job} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
            Drop jobs here
          </div>
        )}
      </div>
    </div>
  );
}
