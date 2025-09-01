import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import fieldService from '@/services/api/fieldService';

const TaskModal = ({ 
  task = null, 
  onClose, 
  onAdd, 
  onUpdate,
  preselectedFieldId = null 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium',
    dueDate: '',
    fieldId: preselectedFieldId || ''
  });
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'planting', label: 'Planting', icon: 'Sprout', color: 'green' },
    { value: 'harvesting', label: 'Harvesting', icon: 'Package', color: 'amber' },
    { value: 'maintenance', label: 'Maintenance', icon: 'Settings', color: 'blue' },
    { value: 'inspection', label: 'Inspection', icon: 'Eye', color: 'purple' },
    { value: 'treatment', label: 'Treatment', icon: 'Shield', color: 'red' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'green' },
    { value: 'medium', label: 'Medium Priority', color: 'amber' },
    { value: 'high', label: 'High Priority', color: 'red' }
  ];

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'maintenance',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        fieldId: task.fieldId || preselectedFieldId || ''
      });
    }
  }, [task, preselectedFieldId]);

  const loadFields = async () => {
    try {
      setFieldsLoading(true);
      const fieldsData = await fieldService.getAll();
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading fields:', error);
    } finally {
      setFieldsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (!formData.fieldId) {
      newErrors.fieldId = 'Field selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (task && onUpdate) {
        await onUpdate(task.Id, formData);
      } else if (onAdd) {
        await onAdd(formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ApperIcon name="Plus" className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {task ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-sm text-gray-600">
                  {task ? 'Update task details' : 'Add a new farm task'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <FormField label="Task Title" error={errors.title} required>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              className={errors.title ? 'border-red-300' : ''}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </FormField>

          {/* Field Selection */}
          <FormField label="Field" error={errors.fieldId} required>
            <Select
              value={formData.fieldId}
              onChange={(value) => handleChange('fieldId', value)}
              className={errors.fieldId ? 'border-red-300' : ''}
              disabled={fieldsLoading || !!preselectedFieldId}
            >
              <option value="">
                {fieldsLoading ? 'Loading fields...' : 'Select a field...'}
              </option>
              {fields.map(field => (
                <option key={field.Id} value={field.Id}>
                  {field.name} - {field.cropType}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Category */}
          <FormField label="Category" required>
            <div className="grid grid-cols-1 gap-2">
              {categories.map(category => (
                <label
                  key={category.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.category === category.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={formData.category === category.value}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-1 rounded mr-3 ${
                    category.color === 'green' ? 'bg-green-100 text-green-600' :
                    category.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                    category.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    category.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <ApperIcon name={category.icon} className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{category.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* Priority */}
          <FormField label="Priority Level" required>
            <div className="grid grid-cols-1 gap-2">
              {priorities.map(priority => (
                <label
                  key={priority.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.priority === priority.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    priority.color === 'green' ? 'bg-green-500' :
                    priority.color === 'amber' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{priority.label}</span>
                </label>
              ))}
            </div>
          </FormField>

          {/* Due Date */}
          <FormField label="Due Date" error={errors.dueDate} required>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={errors.dueDate ? 'border-red-300' : ''}
            />
          </FormField>

          {/* Error Message */}
          {errors.submit && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon={task ? "Save" : "Plus"}
            >
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;