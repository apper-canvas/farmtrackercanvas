import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Crops = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Crop Management</h1>
          <p className="text-gray-600 mt-1">Manage planting schedules and crop rotation plans</p>
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Planting Calendar</h3>
            <p className="text-gray-600 text-sm">Schedule and track planting dates for optimal crop timing</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="RotateCcw" className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Rotation</h3>
            <p className="text-gray-600 text-sm">Plan crop rotation strategies for soil health optimization</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Package" className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Harvest Tracking</h3>
            <p className="text-gray-600 text-sm">Monitor harvest schedules and yield predictions</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Sprout" className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seed Management</h3>
            <p className="text-gray-600 text-sm">Track seed inventory and planting requirements</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Bug" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pest Control</h3>
            <p className="text-gray-600 text-sm">Monitor and manage pest control schedules</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Droplets" className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Irrigation Planning</h3>
            <p className="text-gray-600 text-sm">Plan and schedule irrigation for optimal water usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-forest/5 to-fresh/5">
        <CardContent className="p-8 text-center">
          <ApperIcon name="Clock" className="w-12 h-12 text-forest mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">Coming Soon</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            We're working hard to bring you comprehensive crop management features. 
            This section will include planting calendars, crop rotation planning, harvest tracking, and more.
          </p>
          <p className="text-sm text-gray-500">
            For now, you can manage your crops through the Fields section where you can track crop types and growth stages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crops;