import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";
import equipmentService from "@/services/api/equipmentService";
const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [usageForm, setUsageForm] = useState({
    hours: '',
    fuelUsed: '',
    operator: '',
    notes: '',
    maintenancePerformed: false
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
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEquipment.status)}`}>
                      {selectedEquipment.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-2">Financial</h3>
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
                </div>

                <div className="space-y-4">
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
              </div>
            </div>
          </div>
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