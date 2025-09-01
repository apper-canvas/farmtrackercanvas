import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze farm performance and generate insights</p>
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
              <ApperIcon name="BarChart3" className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Yield Analysis</h3>
            <p className="text-gray-600 text-sm">Analyze crop yields and identify productivity trends</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="DollarSign" className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Reports</h3>
            <p className="text-gray-600 text-sm">Track costs, revenue, and profitability by field and crop</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Calendar" className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seasonal Comparison</h3>
            <p className="text-gray-600 text-sm">Compare performance across different growing seasons</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Metrics</h3>
            <p className="text-gray-600 text-sm">Monitor key performance indicators and efficiency metrics</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="PieChart" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource Usage</h3>
            <p className="text-gray-600 text-sm">Analyze water, fertilizer, and other resource consumption</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Reports</h3>
            <p className="text-gray-600 text-sm">Generate custom reports for specific analysis needs</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Charts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 font-display">Yield by Field (Preview)</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { field: "North Field", crop: "Corn", yield: "185 bu/acre", trend: "up" },
                { field: "South Field", crop: "Wheat", yield: "68 bu/acre", trend: "down" },
                { field: "East Field", crop: "Soybeans", yield: "52 bu/acre", trend: "up" },
                { field: "West Field", crop: "Corn", yield: "178 bu/acre", trend: "stable" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.field}</p>
                    <p className="text-sm text-gray-600">{item.crop}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-900">{item.yield}</span>
                    <ApperIcon 
                      name={item.trend === "up" ? "TrendingUp" : item.trend === "down" ? "TrendingDown" : "Minus"} 
                      className={`w-4 h-4 ${
                        item.trend === "up" ? "text-green-500" : 
                        item.trend === "down" ? "text-red-500" : "text-gray-400"
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 font-display">Monthly Costs (Preview)</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Seeds", amount: "$12,450", percentage: 35 },
                { category: "Fertilizer", amount: "$8,920", percentage: 25 },
                { category: "Fuel", amount: "$6,340", percentage: 18 },
                { category: "Maintenance", amount: "$4,280", percentage: 12 },
                { category: "Labor", amount: "$3,560", percentage: 10 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="font-semibold text-gray-900">{item.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-forest to-fresh h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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
            Advanced reporting and analytics features are in development. 
            This section will provide comprehensive insights into your farm's performance, costs, and productivity.
          </p>
          <p className="text-sm text-gray-500">
            The previews above show sample reports that will help you make data-driven farming decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;