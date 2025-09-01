import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import { format } from "date-fns";
import equipmentService from "@/services/api/equipmentService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
const Equipment = () => {
const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [usageForm, setUsageForm] = useState({
    hours: '',
    fuelUsed: '',
    operator: '',
    notes: '',
    maintenancePerformed: false
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: '',
    scheduledDate: '',
    estimatedCost: '',
    notes: '',
    priority: 'medium'
  });
  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll();
      setEquipment(data);
      setError(null);
    } catch (err) {
      setError('Failed to load equipment');
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDetailModal(true);
  };

const handleLogUsage = (equipment) => {
    setSelectedEquipment(equipment);
    setUsageForm({
      hours: '',
      fuelUsed: '',
      operator: '',
      notes: '',
      maintenancePerformed: false
    });
    setShowUsageModal(true);
  };

  const handleScheduleMaintenance = (equipment) => {
    setSelectedEquipment(equipment);
    setMaintenanceForm({
      type: '',
      scheduledDate: '',
      estimatedCost: '',
      notes: '',
      priority: 'medium'
    });
    setShowMaintenanceModal(true);
  };

  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    
    if (!maintenanceForm.type || !maintenanceForm.scheduledDate) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await equipmentService.scheduleMaintenance(selectedEquipment.Id, maintenanceForm);
      toast.success('Maintenance scheduled successfully');
      setShowMaintenanceModal(false);
      loadEquipment();
      if (activeTab === 'history') {
        loadMaintenanceHistory();
      }
    } catch (err) {
      toast.error('Failed to schedule maintenance');
    }
  };

  const loadMaintenanceHistory = async () => {
    try {
      const history = await equipmentService.getMaintenanceHistory();
      setMaintenanceHistory(history);
    } catch (err) {
      console.error('Failed to load maintenance history:', err);
    }
  };

  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    
    if (!usageForm.hours || parseFloat(usageForm.hours) <= 0) {
      toast.error('Please enter valid usage hours');
      return;
    }

    try {
      await equipmentService.logUsage(selectedEquipment.Id, usageForm);
      toast.success('Usage logged successfully');
      setShowUsageModal(false);
      loadEquipment();
    } catch (err) {
      toast.error('Failed to log usage');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance Due':
        return 'bg-red-100 text-red-800';
      case 'In Service':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ['All', 'Active', 'Maintenance Due', 'In Service'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-forest" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Equipment</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadEquipment}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Track machinery status and maintenance schedules</p>
        </div>
<div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={loadEquipment}>
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'list', label: 'Equipment List', icon: 'List' },
              { id: 'calendar', label: 'Maintenance Calendar', icon: 'Calendar' },
              { id: 'history', label: 'Maintenance History', icon: 'History' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'history') {
                    loadMaintenanceHistory();
                  }
                }}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-forest text-forest'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-fresh"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.Id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name={getEquipmentIcon(item.type)} className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{item.totalHours}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Service:</span>
                  <span className="font-medium">{item.nextMaintenanceHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Used:</span>
                  <span className="font-medium">{formatDate(item.lastUsed)}</span>
                </div>
              </div>

<div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(item)}
                  className="flex-1"
                >
                  <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                  Details
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLogUsage(item)}
                  className="flex-1"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Log Usage
                </Button>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => handleScheduleMaintenance(item)}
                className="w-full mt-2"
              >
                <ApperIcon name="Wrench" className="w-4 h-4 mr-1" />
                Schedule Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && !loading && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Equipment Detail Modal */}
      {showDetailModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEquipment.name}</h2>
                  <p className="text-gray-600">{selectedEquipment.manufacturer} {selectedEquipment.model} ({selectedEquipment.year})</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Equipment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial Number:</span>
                      <span>{selectedEquipment.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year:</span>
                      <span>{selectedEquipment.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span>{selectedEquipment.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Usage Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours:</span>
                      <span>{selectedEquipment.totalHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Fuel:</span>
                      <span>{selectedEquipment.totalFuel} gallons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Location:</span>
                      <span>{selectedEquipment.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Financial</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purchase Price:</span>
                      <span>${selectedEquipment.purchasePrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Value:</span>
                      <span>${selectedEquipment.currentValue?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Maintenance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Service:</span>
                      <span>{formatDate(selectedEquipment.lastMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Service:</span>
                      <span>{formatDate(selectedEquipment.nextMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Interval:</span>
                      <span>{selectedEquipment.maintenanceInterval} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.Id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-forest/10 rounded-lg">
                        <ApperIcon name={getEquipmentIcon(item.type)} className="w-6 h-6 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-medium">{item.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Service:</span>
                      <span className="font-medium">{formatDate(item.nextMaintenance)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                      className="flex-1"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleLogUsage(item)}
                      className="flex-1"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                      Log Usage
                    </Button>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleScheduleMaintenance(item)}
                    className="w-full mt-2"
                  >
                    <ApperIcon name="Wrench" className="w-4 h-4 mr-1" />
                    Schedule Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Upcoming Maintenance</h2>
            <p className="text-gray-600">Equipment requiring maintenance within the next 30 days</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {equipment
              .filter(item => {
                const nextMaintenance = new Date(item.nextMaintenance);
                const today = new Date();
                const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                return nextMaintenance <= thirtyDaysFromNow;
              })
              .sort((a, b) => new Date(a.nextMaintenance) - new Date(b.nextMaintenance))
              .map((item) => {
                const nextMaintenance = new Date(item.nextMaintenance);
                const today = new Date();
                const daysUntil = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
                const isOverdue = daysUntil < 0;
                const isDue = daysUntil <= 7 && daysUntil >= 0;

                return (
                  <Card key={item.Id} className={`border-l-4 ${
                    isOverdue ? 'border-l-red-500' : 
                    isDue ? 'border-l-amber-500' : 
                    'border-l-green-500'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-forest/10 rounded-lg">
                            <ApperIcon name={getEquipmentIcon(item.type)} className="w-6 h-6 text-forest" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isOverdue ? 'bg-red-100 text-red-800' :
                          isDue ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                           isDue ? `Due in ${daysUntil} days` :
                           `${daysUntil} days`}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Service:</span>
                          <span className="font-medium">{formatDate(item.nextMaintenance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Interval:</span>
                          <span className="font-medium">{item.maintenanceInterval} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Hours:</span>
                          <span className="font-medium">{item.totalHours.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleScheduleMaintenance(item)}
                        className="w-full"
                      >
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                        Schedule Maintenance
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {equipment.filter(item => {
            const nextMaintenance = new Date(item.nextMaintenance);
            const today = new Date();
            const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            return nextMaintenance <= thirtyDaysFromNow;
          }).length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Equipment Up to Date</h3>
              <p className="text-gray-600">No maintenance required in the next 30 days</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Maintenance History</h2>
            <p className="text-gray-600">Complete maintenance records with cost tracking</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-forest">
                  {maintenanceHistory.reduce((sum, record) => sum + (record.actualCost || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-fresh">
                  {maintenanceHistory.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber">
                  {maintenanceHistory.filter(r => r.status === 'scheduled').length}
                </div>
                <div className="text-sm text-gray-600">Scheduled</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {maintenanceHistory.length}
                </div>
                <div className="text-sm text-gray-600">Total Records</div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance History Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {maintenanceHistory.map((record) => {
                      const equipmentItem = equipment.find(e => e.Id === record.equipmentId);
                      return (
                        <tr key={record.Id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1 bg-forest/10 rounded">
                                <ApperIcon name={getEquipmentIcon(equipmentItem?.type)} className="w-4 h-4 text-forest" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{equipmentItem?.name}</div>
                                <div className="text-sm text-gray-500">{equipmentItem?.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.serviceType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'completed' ? 'bg-green-100 text-green-800' :
                              record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.actualCost ? 
                              record.actualCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) :
                              record.estimatedCost ? 
                              `~${record.estimatedCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` :
                              'TBD'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.serviceProvider || 'Internal'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {maintenanceHistory.length === 0 && (
                <div className="text-center py-12">
                  <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
                  <p className="text-gray-600">Start scheduling maintenance to build your history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
{/* Schedule Maintenance Modal */}
      {showMaintenanceModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-forest to-fresh p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display">Schedule Maintenance</h2>
                    <p className="text-white/90">{selectedEquipment.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMaintenanceModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleMaintenanceSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={maintenanceForm.type}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                      required
                    >
                      <option value="">Select service type...</option>
                      <option value="oil-change">Oil Change</option>
                      <option value="filter-replacement">Filter Replacement</option>
                      <option value="hydraulic-service">Hydraulic Service</option>
                      <option value="belt-replacement">Belt Replacement</option>
                      <option value="preventive-maintenance">Preventive Maintenance</option>
                      <option value="engine-service">Engine Service</option>
                      <option value="tire-rotation">Tire Rotation</option>
                      <option value="annual-inspection">Annual Inspection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={maintenanceForm.scheduledDate}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={maintenanceForm.estimatedCost}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={maintenanceForm.priority}
                      onChange={(e) => setMaintenanceForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={maintenanceForm.notes}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or special instructions..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMaintenanceModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Schedule Maintenance
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Equipment Detail Modal */}
      {showDetailModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b bg-gradient-to-r from-forest to-fresh p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <ApperIcon name={getEquipmentIcon(selectedEquipment.type)} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display">{selectedEquipment.name}</h2>
                    <p className="text-white/90">{selectedEquipment.manufacturer} {selectedEquipment.model}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:bg-white/20"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEquipment.status)}`}>
                    {selectedEquipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Total Hours</h4>
                    <p className="text-2xl font-bold text-gray-900">{selectedEquipment.totalHours?.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Current Value</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedEquipment.currentValue?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Location</h4>
                    <p className="text-2xl font-bold text-gray-900">{selectedEquipment.location}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maintenance Schedule</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Service:</span>
                      <span>{formatDate(selectedEquipment.lastMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Service:</span>
                      <span>{formatDate(selectedEquipment.nextMaintenance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Interval:</span>
                      <span>{selectedEquipment.maintenanceInterval} hours</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recent Usage</h3>
                  <div className="space-y-2">
                    {selectedEquipment.usageLogs?.slice(-3).reverse().map((log) => (
                      <div key={log.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{formatDate(log.date)}</span>
                          <span className="text-gray-600">{log.hours}h</span>
                        </div>
                        <p className="text-gray-600">{log.operator}</p>
                        {log.notes && (
                          <p className="text-gray-500 text-xs mt-1">{log.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Usage Logging Modal */}
      {showUsageModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleUsageSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Log Usage</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUsageModal(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Logging usage for: <span className="font-medium text-gray-900">{selectedEquipment.name}</span>
                  </p>
                </div>

                <Input
                  label="Hours Used"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={usageForm.hours}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, hours: e.target.value }))}
                  icon="Clock"
                />

                <Input
                  label="Fuel Used (gallons)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={usageForm.fuelUsed}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, fuelUsed: e.target.value }))}
                  icon="Fuel"
                />

                <Input
                  label="Operator"
                  value={usageForm.operator}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, operator: e.target.value }))}
                  icon="User"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={usageForm.notes}
                    onChange={(e) => setUsageForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fresh"
                    placeholder="Any observations or issues..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={usageForm.maintenancePerformed}
                    onChange={(e) => setUsageForm(prev => ({ ...prev, maintenancePerformed: e.target.checked }))}
                    className="h-4 w-4 text-fresh focus:ring-fresh border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance" className="text-sm text-gray-700">
                    Maintenance was performed during this session
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUsageModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Log Usage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
        {/* Usage Logging Modal */}
      {showUsageModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleUsageSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Log Usage</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUsageModal(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Logging usage for: <span className="font-medium text-gray-900">{selectedEquipment.name}</span>
                  </p>
                </div>

                <Input
                  label="Hours Used"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={usageForm.hours}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, hours: e.target.value }))}
                  icon="Clock"
                />

                <Input
                  label="Fuel Used (gallons)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={usageForm.fuelUsed}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, fuelUsed: e.target.value }))}
                  icon="Fuel"
                />

                <Input
                  label="Operator"
                  value={usageForm.operator}
                  onChange={(e) => setUsageForm(prev => ({ ...prev, operator: e.target.value }))}
                  icon="User"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={usageForm.notes}
                    onChange={(e) => setUsageForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-fresh"
                    placeholder="Any observations or issues..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={usageForm.maintenancePerformed}
                    onChange={(e) => setUsageForm(prev => ({ ...prev, maintenancePerformed: e.target.checked }))}
                    className="h-4 w-4 text-fresh focus:ring-fresh border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance" className="text-sm text-gray-700">
                    Maintenance was performed during this session
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUsageModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  Log Usage
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;