import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import cropScheduleService from "@/services/api/cropScheduleService";
import fieldService from "@/services/api/fieldService";
import { toast } from "react-toastify";

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
      const newSchedule = await cropScheduleService.create({
        ...scheduleData,
        date: selectedDate.toISOString().split('T')[0]
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
            onClick={() => setShowAddModal(true)}
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

// Add Schedule Modal Component
const AddScheduleModal = ({ isOpen, onClose, onAdd, selectedDate, fields }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    type: 'planting',
    fieldId: '',
    notes: '',
    expectedYield: ''
  });

  const cropOptions = [
    'Tomatoes', 'Lettuce', 'Carrots', 'Peas', 'Beans', 'Squash',
    'Peppers', 'Cucumbers', 'Corn', 'Broccoli', 'Spinach', 'Radishes'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cropName || !formData.fieldId) {
      toast.error('Please fill in all required fields');
      return;
    }
    onAdd(formData);
    setFormData({
      cropName: '',
      variety: '',
      type: 'planting',
      fieldId: '',
      notes: '',
      expectedYield: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Add Crop Schedule - {selectedDate?.toLocaleDateString()}
            </h3>
            <Button variant="ghost" size="icon" icon="X" onClick={onClose} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type *
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                value={formData.cropName}
                onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
                required
              >
                <option value="">Select crop...</option>
                {cropOptions.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variety
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                value={formData.variety}
                onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                placeholder="e.g., Cherokee Purple"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="planting">Planting</option>
                <option value="harvest">Harvest</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field *
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                value={formData.fieldId}
                onChange={(e) => setFormData(prev => ({ ...prev, fieldId: parseInt(e.target.value) }))}
                required
              >
                <option value="">Select field...</option>
                {fields.map(field => (
                  <option key={field.Id} value={field.Id}>
                    {field.name} ({field.size} acres)
                  </option>
                ))}
              </select>
            </div>

            {formData.type === 'harvest' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Yield
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                  value={formData.expectedYield}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedYield: e.target.value }))}
                  placeholder="e.g., 50 lbs"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Add Schedule
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crops;