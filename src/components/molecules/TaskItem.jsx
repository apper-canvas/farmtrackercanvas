import React from 'react';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

const TaskItem = ({ task, onComplete, showOverdue = false }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'planting': return 'Sprout';
      case 'harvesting': return 'Package';
      case 'maintenance': return 'Settings';
      case 'inspection': return 'Eye';
      case 'treatment': return 'Shield';
      default: return 'CheckSquare';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'planting': return 'text-green-600 bg-green-50';
      case 'harvesting': return 'text-amber-600 bg-amber-50';
      case 'maintenance': return 'text-blue-600 bg-blue-50';
      case 'inspection': return 'text-purple-600 bg-purple-50';
      case 'treatment': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDueDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d');
    } catch (error) {
      return dateString;
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today && task.status !== 'completed';
  };

  const handleCheckboxChange = () => {
    if (onComplete) {
      onComplete(task.Id);
    }
  };

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border ${
      task.status === 'completed' 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    } transition-colors`}>
      {/* Completion Checkbox */}
      <div className="flex-shrink-0">
        <button
          onClick={handleCheckboxChange}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {task.status === 'completed' && (
            <ApperIcon name="Check" className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Priority Indicator */}
      <div className="flex-shrink-0">
        <div 
          className={`w-2 h-8 rounded-full ${getPriorityColor(task.priority)}`}
          title={`${task.priority} priority`}
        />
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              task.status === 'completed' 
                ? 'line-through text-gray-500' 
                : 'text-gray-900'
            }`}>
              {task.title}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              {/* Category Badge */}
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                <ApperIcon name={getCategoryIcon(task.category)} className="w-3 h-3 mr-1" />
                {task.category}
              </div>
              
              {/* Field Name */}
              <span className="text-xs text-gray-500">
                {task.fieldName}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex-shrink-0 ml-2">
            <span className={`text-xs font-medium ${
              isOverdue(task.dueDate) && task.status !== 'completed'
                ? 'text-red-600'
                : task.status === 'completed'
                ? 'text-gray-500'
                : 'text-gray-600'
            }`}>
              {formatDueDate(task.dueDate)}
            </span>
            {(showOverdue || isOverdue(task.dueDate)) && task.status !== 'completed' && (
              <div className="flex items-center mt-1">
                <ApperIcon name="AlertTriangle" className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600 ml-1">Overdue</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;