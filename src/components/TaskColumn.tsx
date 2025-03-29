
import { useMemo } from 'react';
import { Task, Status, updateTaskStatus } from '../store/tasksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface TaskColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const statusTitles: Record<Status, string> = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'done': 'Done'
};

const statusIcons: Record<Status, string> = {
  'todo': '📋',
  'in-progress': '⏳',
  'done': '✅'
};

// Background colors for columns
const statusColors: Record<Status, string> = {
  'todo': 'bg-[#faaa9d]/70 hover:bg-[#faaa9d]/80',
  'in-progress': 'bg-[#ffd18a]/70 hover:bg-[#ffd18a]/80',
  'done': 'bg-[#9ad0ec]/70 hover:bg-[#9ad0ec]/80'
};

export function TaskColumn({ status, tasks, onEditTask }: TaskColumnProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={cn(
      "task-column rounded-md flex flex-col h-full animate-fade-in transition-all duration-300 border-2 shadow-[3px_4px_0px_1px_#000000] border-black",
      statusColors[status]
    )}>
      <h2 className="text-xl font-handwritten font-semibold mb-4 flex items-center">
        <span className="mr-2">{statusIcons[status]}</span>
        {statusTitles[status]} 
        <span className="ml-2 text-sm bg-secondary rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </h2>
      
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 min-h-[200px] space-y-3 rounded-xl p-2 transition-colors border-2 border-transparent",
              snapshot.isDraggingOver ? 'bg-slate-100/60 backdrop-blur-sm border-2 border-dashed border-pastel-orange/70' : ''
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      snapshot.isDragging ? 'opacity-70 rotate-1 scale-105' : ''
                    )}
                  >
                    <TaskCard 
                      task={task} 
                      onEdit={onEditTask} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="text-center p-4 text-muted-foreground italic subtle-pattern rounded-lg">
                Drag tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
