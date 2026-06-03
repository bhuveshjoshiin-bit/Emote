import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
}

interface TaskProgressTrackerProps {
  tasks?: Task[];
}

export const TaskProgressTracker: React.FC<TaskProgressTrackerProps> = ({
  tasks = [],
}) => {
  return (
    <div className="h-full bg-gray-900 rounded-lg p-4 overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-4">Task Progress</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-800 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-semibold">
                  {task.title}
                </span>
                {task.status === 'completed' && (
                  <CheckCircle size={16} className="text-green-400" />
                )}
                {task.status === 'in_progress' && (
                  <Clock size={16} className="text-blue-400 animate-spin" />
                )}
                {task.status === 'failed' && (
                  <AlertCircle size={16} className="text-red-400" />
                )}
              </div>
              {task.progress !== undefined && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
