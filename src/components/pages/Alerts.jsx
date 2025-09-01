import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { format } from "date-fns";
import equipmentService from "@/services/api/equipmentService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const alertData = await equipmentService.getMaintenanceAlerts();
      setAlerts(alertData);
    } catch (err) {
      console.error('Failed to load maintenance alerts:', err);
      setError('Failed to load maintenance alerts');
      toast.error('Failed to load maintenance alerts');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAlerts = () => {
    return alerts.filter(alert => {
      const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
      const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
      return priorityMatch && statusMatch;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500 text-white';
      case 'due-soon':
        return 'bg-amber-500 text-white';
      case 'upcoming':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEquipmentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'tractor':
        return 'Truck';
      case 'combine harvester':
        return 'Harvest';
      case 'utility tractor':
        return 'Settings';
      default:
        return 'Wrench';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const handleViewEquipment = () => {
    navigate('/equipment');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAlerts} />;

  const filteredAlerts = getFilteredAlerts();
  const overdueCount = alerts.filter(a => a.status === 'overdue').length;
  const dueSoonCount = alerts.filter(a => a.status === 'due-soon').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Alerts</h1>
          <p className="text-gray-600 mt-1">
            Monitor equipment maintenance schedules and overdue items
          </p>
        </div>
        <Button
          onClick={handleViewEquipment}
          icon="ArrowRight"
          className="btn-hover"
        >
          View Equipment
        </Button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <ApperIcon name="Clock" className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Due Soon</p>
                <p className="text-2xl font-bold text-amber-600">{dueSoonCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Priority
              </label>
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' }
                ]}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'due-soon', label: 'Due Soon' },
                  { value: 'upcoming', label: 'Upcoming' }
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Maintenance Alerts</h3>
            <p className="text-gray-600">
              {alerts.length === 0 
                ? "All equipment is up to date with maintenance schedules."
                : "No alerts match your current filter criteria."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card key={alert.Id} className={`border-l-4 ${
              alert.status === 'overdue' ? 'border-l-red-500' :
              alert.status === 'due-soon' ? 'border-l-amber-500' :
              'border-l-green-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-forest/10 rounded-lg">
                      <ApperIcon 
                        name={getEquipmentIcon(alert.equipmentType)} 
                        className="w-6 h-6 text-forest" 
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {alert.equipmentName}
                      </h3>
                      <p className="text-sm text-gray-600">{alert.equipmentType}</p>
                      <p className="text-sm text-gray-500">
                        <ApperIcon name="MapPin" size={14} className="inline mr-1" />
                        {alert.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)} Priority
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status === 'due-soon' ? 'Due Soon' : 
                       alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Next Maintenance</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(alert.nextMaintenanceDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Days Until Due</p>
                    <p className={`text-sm font-semibold ${
                      alert.daysUntilMaintenance < 0 ? 'text-red-600' :
                      alert.daysUntilMaintenance <= 7 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {alert.daysUntilMaintenance < 0 
                        ? `${Math.abs(alert.daysUntilMaintenance)} days overdue`
                        : `${alert.daysUntilMaintenance} days`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hours Until Service</p>
                    <p className={`text-sm font-semibold ${
                      alert.hoursUntilMaintenance <= 0 ? 'text-red-600' :
                      alert.hoursUntilMaintenance <= 50 ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {alert.hoursUntilMaintenance <= 0 
                        ? `${Math.abs(alert.hoursUntilMaintenance)} hours overdue`
                        : `${alert.hoursUntilMaintenance} hours`
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Service</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(alert.lastMaintenance)}
                    </p>
                  </div>
                </div>

                {alert.status === 'overdue' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="AlertTriangle" className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Maintenance Overdue
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          This equipment is overdue for maintenance. Consider scheduling service 
                          immediately to prevent potential breakdowns during field operations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;