
import { Provider } from 'react-redux';
import { store } from '../store';
import { TaskBoard } from '../components/TaskBoard';
import { DragDropContext } from 'react-beautiful-dnd';


const Index = () => {
  return (
    <Provider store={store}>
      <div className="h-full p-4 md:p-8 relative">
        <div className="absolute inset-0 z-0 overflow-hidden min-h-full">
          {/* Pastel orange background */}
          <div className="absolute inset-0 bg-[#ffede6] opacity-70 min-h-screen" />
        </div>
        
        <div className="container mx-auto lg:h-[calc(100vh-4rem)] relative z-10">
          <TaskBoard />
        </div>
      </div>
    </Provider>
  );
};

export default Index;
