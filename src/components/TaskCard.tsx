
import { useState } from 'react';
import { Task, Priority, toggleTaskCompletion, deleteTask } from '../store/tasksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { cn } from '@/lib/utils';
import { Check, Trash, Edit, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = () => {
    dispatch(toggleTaskCompletion(task.id));
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      dispatch(deleteTask(task.id));
    }, 300);
  };

  const priorityClassMap: Record<Priority, string> = {
    low: 'priority-low',
    medium: 'priority-medium',
    high: 'priority-high',
  };

  return (
    <div className='border-2 border-black rounded-sm task-card'>
    <div 
      className={cn(
        ' animate-fade-in group ',
        priorityClassMap[task.priority],
        task.completed ? 'opacity-70' : '',
        isDeleting ? 'scale-95 opacity-0' : '',
      )}
      data-task-id={task.id}
    >
      
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 
            className={cn(
              "text-lg font-handwritten font-medium mb-1 line-clamp-2",
              task.completed ? "line-through text-muted-foreground" : ""
            )}
          >
            {task.title}
          </h3>
          
          <p className={cn(
            "text-sm text-muted-foreground mb-2 line-clamp-2",
            task.completed ? "line-through" : ""
          )}>
            {task.description}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            <div className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              task.priority === 'low' ? "bg-task-low text-blue-800" : "",
              task.priority === 'medium' ? "bg-task-medium text-yellow-800" : "",
              task.priority === 'high' ? "bg-task-high text-pink-800" : "",
            )}>
              {task.priority}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => onEdit(task)}
          className="h-8 w-8"
        >
          <Edit size={16} />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleDelete}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
    </div>
  );
}
