import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Equipment = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Equipment Management</h1>
          <p className="text-gray-600 mt-1">Track machinery status and maintenance schedules</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" disabled>
            Coming Soon
          </Button>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Wrench" className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Tracking</h3>
            <p className="text-gray-600 text-sm">Schedule and track equipment maintenance and repairs</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Gauge" className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Monitoring</h3>
            <p className="text-gray-600 text-sm">Monitor equipment usage hours and performance metrics</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="AlertTriangle" className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Alerts</h3>
            <p className="text-gray-600 text-sm">Receive alerts for upcoming maintenance and service needs</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Records</h3>
            <p className="text-gray-600 text-sm">Maintain detailed service history and documentation</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="DollarSign" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Tracking</h3>
            <p className="text-gray-600 text-sm">Track maintenance costs and equipment ROI</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="MapPin" className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Tracking</h3>
            <p className="text-gray-600 text-sm">Track equipment location and field assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Equipment List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 font-display">Equipment Overview (Preview)</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "John Deere 8R Tractor", type: "Tractor", status: "Active", lastService: "2024-01-15" },
              { name: "Case IH Combine Harvester", type: "Harvester", status: "Maintenance", lastService: "2024-01-10" },
              { name: "New Holland Planter", type: "Planter", status: "Active", lastService: "2024-01-20" },
              { name: "Kubota Utility Tractor", type: "Tractor", status: "Active", lastService: "2024-01-08" }
            ].map((equipment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg">
                    <ApperIcon name="Wrench" className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{equipment.name}</h4>
                    <p className="text-sm text-gray-600">{equipment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Last Service</p>
                    <p className="text-sm text-gray-600">{equipment.lastService}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    equipment.status === "Active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {equipment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-forest/5 to-fresh/5">
        <CardContent className="p-8 text-center">
          <ApperIcon name="Clock" className="w-12 h-12 text-forest mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">Coming Soon</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Comprehensive equipment management features are in development. 
            This section will include maintenance scheduling, usage tracking, service alerts, and cost monitoring.
          </p>
          <p className="text-sm text-gray-500">
            The preview above shows how your equipment inventory will be organized and tracked.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Equipment;