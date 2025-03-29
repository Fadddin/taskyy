
import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { Task, Status, updateTaskStatus } from '../store/tasksSlice';
import { TaskColumn } from './TaskColumn';
import { TaskForm } from './TaskForm';
import { TaskFilter, SortOption } from './TaskFilter';
import { Priority } from '../store/tasksSlice';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import "../components/buttons/addTask.css"

export function TaskBoard() {
  const tasks = useAppSelector(state => state.tasks.tasks);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filtering and sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('created-desc');

  // Filtered and sorted tasks
  const filteredTasks = tasks.filter(task => {
    const matchesQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    return matchesQuery && matchesPriority && matchesStatus;
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === 'created-asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === 'created-desc') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'due-asc' && a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOption === 'due-desc' && a.dueDate && b.dueDate) {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    } else if ((sortOption === 'due-asc' || sortOption === 'due-desc') && a.dueDate && !b.dueDate) {
      return -1;
    } else if ((sortOption === 'due-asc' || sortOption === 'due-desc') && !a.dueDate && b.dueDate) {
      return 1;
    }
    return 0;
  });

  // Group tasks by status
  const todoTasks = sortedTasks.filter(task => task.status === 'todo');
  const inProgressTasks = sortedTasks.filter(task => task.status === 'in-progress');
  const doneTasks = sortedTasks.filter(task => task.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid area
    if (!destination) return;

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Update task status if moved to a different column
    if (destination.droppableId !== source.droppableId) {
      dispatch(updateTaskStatus({
        taskId: draggableId,
        newStatus: destination.droppableId as Status
      }));

      toast({
        title: "Task Updated",
        description: `Task moved to ${destination.droppableId === 'todo' ? 'To Do' :
          destination.droppableId === 'in-progress' ? 'In Progress' : 'Done'}`,
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleOpenForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="mb-2">

        <div className='flex justify-between'>

          <h1 className="text-6xl font-devonshire font-bold">Tasky</h1>

          <div>
            <button
              onClick={handleOpenForm}
              className="animate-bounce-light box-show font-handwritten font-bold flex bg-blue-400 py-2 px-4 rounded border-2 border-white items-center text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              ADD NEW TASK
            </button>
          </div>
        </div>


      </div>

      <TaskFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 z-10">
          <TaskColumn
            status="todo"
            tasks={todoTasks}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status="in-progress"
            tasks={inProgressTasks}
            onEditTask={handleEditTask}
          />
          <TaskColumn
            status="done"
            tasks={doneTasks}
            onEditTask={handleEditTask}
          />
        </div>
      </DragDropContext>

      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingTask={editingTask}
      />
    </div>
  );
}
