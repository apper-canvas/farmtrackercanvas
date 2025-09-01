import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import fieldService from "@/services/api/fieldService";
import cropScheduleService from "@/services/api/cropScheduleService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Crops = () => {
  const [schedules, setSchedules] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadData();
  }, [selectedSeason]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedulesData, fieldsData] = await Promise.all([
        selectedSeason === 'All' ? cropScheduleService.getAll() : cropScheduleService.getBySeason(selectedSeason),
        fieldService.getAll()
      ]);
      setSchedules(schedulesData);
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load crop schedules');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSchedulesForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateStr);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowAddModal(true);
  };

  const handleDragStart = (e, schedule) => {
    setDraggedEvent(schedule);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, date) => {
    e.preventDefault();
    if (!draggedEvent || !date) return;

    const newDate = date.toISOString().split('T')[0];
    if (newDate === draggedEvent.date) return;

    try {
      await cropScheduleService.reschedule(draggedEvent.Id, newDate);
      setSchedules(prev => prev.map(schedule => 
        schedule.Id === draggedEvent.Id 
          ? { ...schedule, date: newDate }
          : schedule
      ));
      toast.success(`${draggedEvent.cropName} ${draggedEvent.type} rescheduled successfully`);
    } catch (error) {
      console.error('Error rescheduling:', error);
      toast.error('Failed to reschedule event');
    }
    
    setDraggedEvent(null);
  };

const handleAddSchedule = async (scheduleData) => {
    try {
      // Prevent null reference error by using fallback date
      const dateToUse = selectedDate || new Date();
      const newSchedule = await cropScheduleService.create({
        ...scheduleData,
        date: dateToUse.toISOString().split('T')[0]
      });
      setSchedules(prev => [...prev, newSchedule]);
      setShowAddModal(false);
      setSelectedDate(null);
      toast.success(`${newSchedule.cropName} ${newSchedule.type} added to calendar`);
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast.error('Failed to add crop schedule');
    }
  };

  const handleDeleteSchedule = async (schedule) => {
    if (!window.confirm(`Are you sure you want to delete this ${schedule.cropName} ${schedule.type}?`)) {
      return;
    }

    try {
      await cropScheduleService.delete(schedule.Id);
      setSchedules(prev => prev.filter(s => s.Id !== schedule.Id));
      toast.success(`${schedule.cropName} ${schedule.type} deleted successfully`);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-forest" />
        <span className="ml-2 text-gray-600">Loading crop calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Crop Calendar</h1>
          <p className="text-gray-600 mt-1">Plan and track planting and harvest schedules</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button 
variant="outline" 
            icon="Plus" 
            onClick={() => {
              // Set default date for Quick Add to prevent null errors
              if (!selectedDate) {
                setSelectedDate(new Date());
              }
              setShowAddModal(true);
            }}
          >
            Quick Add
          </Button>
        </div>
      </div>

      {/* Season Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2 mt-2">Season:</span>
            {seasons.map(season => (
              <Button
                key={season}
                size="sm"
                variant={selectedSeason === season ? "default" : "outline"}
                onClick={() => setSelectedSeason(season)}
              >
                {season}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              icon="ChevronLeft"
              onClick={() => navigateMonth(-1)}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              variant="outline"
              size="icon"
              icon="ChevronRight"
              onClick={() => navigateMonth(1)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {getDaysInMonth(currentDate).map((date, index) => {
              const daySchedules = date ? getSchedulesForDate(date) : [];
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 ${
                    isToday ? 'bg-forest/5 border-forest' : ''
                  } ${!date ? 'bg-gray-50' : ''}`}
                  onClick={() => date && handleDateClick(date)}
                  onDragOver={handleDragOver}
                  onDrop={e => date && handleDrop(e, date)}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-forest' : 'text-gray-900'}`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map(schedule => (
                          <div
                            key={schedule.Id}
                            className={`text-xs p-1 rounded text-white cursor-move ${
                              schedule.type === 'planting' ? 'bg-green-500' : 'bg-orange-500'
                            }`}
                            draggable
                            onDragStart={e => handleDragStart(e, schedule)}
                            onClick={e => {
                              e.stopPropagation();
                              handleDeleteSchedule(schedule);
                            }}
                            title={`${schedule.cropName} - ${schedule.variety} (${schedule.type})`}
                          >
                            <div className="flex items-center gap-1">
                              <ApperIcon 
                                name={schedule.type === 'planting' ? 'Sprout' : 'Package'} 
                                size={10} 
                              />
                              <span className="truncate">{schedule.cropName}</span>
                            </div>
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{daySchedules.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Planting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Harvest</span>
            </div>
          </div>
        </CardContent>
      </Card>

{/* Quick Add Modal */}
      {showAddModal && (
        <AddScheduleModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedDate(null);
          }}
          onAdd={handleAddSchedule}
          selectedDate={selectedDate}
          fields={fields}
        />
      )}
    </div>
  );
};

// AddScheduleModal Component Implementation
const AddScheduleModal = ({ isOpen, onClose, onAdd, selectedDate, fields = [] }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    type: 'planting',
    fieldId: '',
    notes: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cropName: '',
        type: 'planting',
        fieldId: '',
        notes: '',
        priority: 'medium'
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cropName.trim()) {
      newErrors.cropName = 'Crop name is required';
    }
    
    if (!formData.fieldId) {
      newErrors.fieldId = 'Please select a field';
    }
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(formData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add Crop Schedule</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected Date Display */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700">
                Selected Date: {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
              </p>
              {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date}</p>}
            </div>

            {/* Crop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Name *
              </label>
              <input
                type="text"
                value={formData.cropName}
                onChange={(e) => handleInputChange('cropName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fresh focus:border-fresh"
                placeholder="Enter crop name"
              />
              {errors.cropName && <p className="text-sm text-red-600 mt-1">{errors.cropName}</p>}
            </div>

            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fresh focus:border-fresh"
              >
                <option value="planting">Planting</option>
                <option value="watering">Watering</option>
                <option value="fertilizing">Fertilizing</option>
                <option value="harvesting">Harvesting</option>
                <option value="pruning">Pruning</option>
                <option value="pest-control">Pest Control</option>
              </select>
            </div>

            {/* Field Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field *
              </label>
              <select
                value={formData.fieldId}
                onChange={(e) => handleInputChange('fieldId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fresh focus:border-fresh"
              >
                <option value="">Select a field</option>
                {fields.map(field => (
                  <option key={field.Id} value={field.Id}>
                    {field.name} ({field.size} acres)
                  </option>
                ))}
              </select>
              {errors.fieldId && <p className="text-sm text-red-600 mt-1">{errors.fieldId}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fresh focus:border-fresh"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fresh focus:border-fresh"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Schedule'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Crops;