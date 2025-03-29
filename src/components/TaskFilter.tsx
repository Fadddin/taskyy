import { useState } from 'react';
import { Priority, Status } from '../store/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';

export type SortOption = 'created-asc' | 'created-desc' | 'due-asc' | 'due-desc';

interface TaskFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priorityFilter: Priority | 'all';
  setPriorityFilter: (priority: Priority | 'all') => void;
  statusFilter: Status | 'all';
  setStatusFilter: (status: Status | 'all') => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

export function TaskFilter({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption
}: TaskFilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 border-2 border-black rounded-sm shadow-[2px_3px_0px_1px_#000000]"
        />
      </div>
      
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 border-2 border-black rounded-sm shadow-[2px_3px_0px_1px_#000000]">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value as Priority | 'all')}
              >
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as Status | 'all')}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="w-full mt-2 " 
              variant="outline"
              onClick={() => {
                setPriorityFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover open={sortOpen} onOpenChange={setSortOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2 border-2 border-black rounded-sm shadow-[2px_3px_0px_1px_#000000]">
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">Sort</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-4">
          <div className="space-y-2">
            <Label htmlFor="sort-option">Sort By</Label>
            <Select
              value={sortOption}
              onValueChange={(value) => setSortOption(value as SortOption)}
            >
              <SelectTrigger id="sort-option">
                <SelectValue placeholder="Sort tasks by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created-desc">Created (Newest)</SelectItem>
                <SelectItem value="created-asc">Created (Oldest)</SelectItem>
                <SelectItem value="due-asc">Due Date (Earliest)</SelectItem>
                <SelectItem value="due-desc">Due Date (Latest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
