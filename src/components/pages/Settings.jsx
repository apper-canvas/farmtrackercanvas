import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your farm profile and application preferences</p>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="User" className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Farm Profile</h3>
            <p className="text-gray-600 text-sm">Configure farm information, location, and contact details</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Bell" className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600 text-sm">Set up alerts for maintenance, weather, and field activities</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Palette" className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appearance</h3>
            <p className="text-gray-600 text-sm">Customize theme, layout, and display preferences</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Database" className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
            <p className="text-gray-600 text-sm">Import, export, and backup your farm data</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Shield" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy & Security</h3>
            <p className="text-gray-600 text-sm">Manage data privacy and security preferences</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Smartphone" className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Sync</h3>
            <p className="text-gray-600 text-sm">Configure mobile app synchronization settings</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Settings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 font-display">Farm Profile (Preview)</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Farm Name</p>
                  <p className="text-sm text-gray-600">Green Valley Farm</p>
                </div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">Iowa, United States</p>
                </div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Total Acreage</p>
                  <p className="text-sm text-gray-600">450 acres</p>
                </div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Farm Type</p>
                  <p className="text-sm text-gray-600">Row Crops</p>
                </div>
                <Button variant="outline" size="sm" disabled>Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 font-display">Notification Settings (Preview)</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Weather Alerts</p>
                  <p className="text-sm text-gray-600">Severe weather notifications</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Maintenance Reminders</p>
                  <p className="text-sm text-gray-600">Equipment service alerts</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Harvest Notifications</p>
                  <p className="text-sm text-gray-600">Crop ready alerts</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Field Inspections</p>
                  <p className="text-sm text-gray-600">Inspection reminders</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-forest/5 to-fresh/5">
        <CardContent className="p-8 text-center">
          <ApperIcon name="Clock" className="w-12 h-12 text-forest mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">Coming Soon</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Comprehensive settings and configuration options are in development. 
            This section will allow you to customize your farm profile, notification preferences, and application settings.
          </p>
          <p className="text-sm text-gray-500">
            The previews above show sample settings that will be available to personalize your FarmTracker Pro experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;