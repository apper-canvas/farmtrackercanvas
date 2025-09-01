import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import TaskItem from '@/components/molecules/TaskItem';
import TaskModal from '@/components/organisms/TaskModal';
import taskService from '@/services/api/taskService';
import { toast } from 'react-toastify';

const TaskWidget = () => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [todaysData, overdueData, allTasks] = await Promise.all([
        taskService.getTodaysTasks(),
        taskService.getOverdueTasks(),
        taskService.getAll()
      ]);
      
      setTodaysTasks(todaysData);
      setOverdueTasks(overdueData);
      
      // Calculate statistics
      const stats = {
        total: allTasks.length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        overdue: overdueData.length
      };
      setTaskStats(stats);
      
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Task widget error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      await loadTasks(); // Refresh data
      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      await loadTasks(); // Refresh data
      toast.success('Task created successfully!');
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error; // Let modal handle the error display
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <>
      <Card className="task-widget">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ApperIcon name="CheckSquare" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Task Management</h3>
                <p className="text-sm text-gray-600">Today's priorities and overdue items</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon="Plus"
              onClick={() => setShowTaskModal(true)}
            >
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskStats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
              <div className="text-xs text-gray-600">Overdue</div>
            </div>
          </div>

          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2" />
                Overdue Tasks ({overdueTasks.length})
              </h4>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleTaskComplete}
                    showOverdue={true}
                  />
                ))}
                {overdueTasks.length > 3 && (
                  <div className="text-xs text-gray-500 pl-6">
                    +{overdueTasks.length - 3} more overdue tasks
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Today's Tasks */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              Today's Tasks ({todaysTasks.length})
            </h4>
            {todaysTasks.length > 0 ? (
              <div className="space-y-2">
                {todaysTasks.slice(0, 4).map(task => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleTaskComplete}
                  />
                ))}
                {todaysTasks.length > 4 && (
                  <div className="text-xs text-gray-500 pl-6">
                    +{todaysTasks.length - 4} more tasks today
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic pl-6">
                No tasks scheduled for today
              </div>
            )}
          </div>

          {/* View All Tasks Link */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              icon="ArrowRight"
            >
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onAdd={handleAddTask}
        />
      )}
    </>
  );
};

export default TaskWidget;