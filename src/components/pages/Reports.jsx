import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/Card";
import { format, subDays, subMonths } from "date-fns";
import { toast } from "react-toastify";
import reportsService from "@/services/api/reportsService";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Fields from "@/components/pages/Fields";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reports, setReports] = useState({});
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [exportingFormat, setExportingFormat] = useState("");

  const reportTypes = [
    { value: "all", label: "All Reports" },
    { value: "yield", label: "Yield Analysis" },
    { value: "financial", label: "Financial Reports" },
    { value: "seasonal", label: "Seasonal Comparison" },
    { value: "performance", label: "Performance Metrics" },
    { value: "resources", label: "Resource Usage" },
    { value: "custom", label: "Custom Reports" }
  ];

  const dateRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "90days", label: "Last 3 Months" },
    { value: "365days", label: "Last Year" },
    { value: "custom", label: "Custom Range" }
  ];

  useEffect(() => {
    loadReports();
  }, [selectedReportType, dateRange, customStartDate, customEndDate]);

  const getDateRangeValues = () => {
    const today = new Date();
    switch (dateRange) {
      case "7days":
        return { startDate: subDays(today, 7), endDate: today };
      case "30days":
        return { startDate: subDays(today, 30), endDate: today };
      case "90days":
        return { startDate: subDays(today, 90), endDate: today };
      case "365days":
        return { startDate: subDays(today, 365), endDate: today };
      case "custom":
        return { 
          startDate: customStartDate ? new Date(customStartDate) : subDays(today, 30),
          endDate: customEndDate ? new Date(customEndDate) : today
        };
      default:
        return { startDate: subDays(today, 30), endDate: today };
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { startDate, endDate } = getDateRangeValues();
      let reportData = {};

      if (selectedReportType === "all" || selectedReportType === "yield") {
        reportData.yieldAnalysis = await reportsService.getYieldAnalysis(startDate, endDate);
      }
      if (selectedReportType === "all" || selectedReportType === "financial") {
        reportData.financialReports = await reportsService.getFinancialReports(startDate, endDate);
      }
      if (selectedReportType === "all" || selectedReportType === "seasonal") {
        reportData.seasonalComparison = await reportsService.getSeasonalComparison(startDate, endDate);
      }
      if (selectedReportType === "all" || selectedReportType === "performance") {
        reportData.performanceMetrics = await reportsService.getPerformanceMetrics(startDate, endDate);
      }
      if (selectedReportType === "all" || selectedReportType === "resources") {
        reportData.resourceUsage = await reportsService.getResourceUsage(startDate, endDate);
      }
      if (selectedReportType === "all" || selectedReportType === "custom") {
        reportData.customReports = await reportsService.getCustomReports(startDate, endDate);
      }

      setReports(reportData);
    } catch (err) {
      setError("Failed to load reports");
      console.error("Reports error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (reportType, format) => {
    try {
      setExportingFormat(`${reportType}-${format}`);
      const { startDate, endDate } = getDateRangeValues();
      
      const exportData = await reportsService.exportReport(reportType, format, startDate, endDate);
      
if (format === 'csv') {
        const blob = new Blob([exportData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // Handle PDF export
        const blob = new Blob([exportData.content], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = exportData.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
      
      toast.success(`${reportType} report exported successfully!`);
    } catch (err) {
      toast.error(`Failed to export ${reportType} report`);
      console.error("Export error:", err);
    } finally {
      setExportingFormat("");
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadReports} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Farm Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and insights for your farm operations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <Select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            options={reportTypes}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={dateRanges}
            className="w-full"
          />
        </div>
        
        {dateRange === "custom" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* Report Summary Metrics */}
      {reports.performanceMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Yield"
            value={reports.performanceMetrics.summary?.totalYield || "0 bu"}
            icon="Package"
            color="forest"
            trend={reports.performanceMetrics.summary?.yieldTrend}
            trendValue={reports.performanceMetrics.summary?.yieldChange}
            description="Across all fields"
          />
          <MetricCard
            title="Total Revenue"
            value={reports.performanceMetrics.summary?.totalRevenue || "$0"}
            icon="DollarSign"
            color="fresh"
            trend={reports.performanceMetrics.summary?.revenueTrend}
            trendValue={reports.performanceMetrics.summary?.revenueChange}
            description="This period"
          />
          <MetricCard
            title="Total Costs"
            value={reports.performanceMetrics.summary?.totalCosts || "$0"}
            icon="TrendingDown"
            color="amber"
            trend={reports.performanceMetrics.summary?.costsTrend}
            trendValue={reports.performanceMetrics.summary?.costsChange}
            description="Operational expenses"
          />
          <MetricCard
            title="Net Profit"
            value={reports.performanceMetrics.summary?.netProfit || "$0"}
            icon="TrendingUp"
            color="blue"
            trend={reports.performanceMetrics.summary?.profitTrend}
            trendValue={reports.performanceMetrics.summary?.profitChange}
description="Revenue - Costs"
          />
        </div>
      )}

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Yield Analysis */}
        {(selectedReportType === "all" || selectedReportType === "yield") && reports.yieldAnalysis && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="BarChart3" className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Yield Analysis</h3>
                    <p className="text-sm text-gray-600">Crop productivity trends</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon="Download"
                    onClick={() => handleExport('yield', 'csv')}
                    loading={exportingFormat === 'yield-csv'}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.yieldAnalysis.fieldYields?.slice(0, 4).map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{field.fieldName}</p>
                      <p className="text-sm text-gray-600">{field.cropType}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">{field.yield}</span>
                      <ApperIcon 
                        name={field.trend === "up" ? "TrendingUp" : field.trend === "down" ? "TrendingDown" : "Minus"} 
                        className={`w-4 h-4 ${
                          field.trend === "up" ? "text-green-500" : 
                          field.trend === "down" ? "text-red-500" : "text-gray-400"
                        }`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Financial Reports */}
        {(selectedReportType === "all" || selectedReportType === "financial") && reports.financialReports && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="DollarSign" className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
                    <p className="text-sm text-gray-600">Revenue and cost analysis</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon="Download"
                    onClick={() => handleExport('financial', 'csv')}
                    loading={exportingFormat === 'financial-csv'}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{reports.financialReports.totalRevenue}</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">{reports.financialReports.totalCosts}</div>
                    <div className="text-sm text-gray-600">Total Costs</div>
                  </div>
                </div>
                <div className="text-center pt-2 border-t border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{reports.financialReports.netProfit}</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                </div>
                {reports.financialReports.costBreakdown?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{item.category}</span>
                    <span className="font-semibold text-gray-900">{item.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Seasonal Comparison */}
        {(selectedReportType === "all" || selectedReportType === "seasonal") && reports.seasonalComparison && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Calendar" className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Seasonal Comparison</h3>
                    <p className="text-sm text-gray-600">Year-over-year analysis</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  icon="Download"
                  onClick={() => handleExport('seasonal', 'csv')}
                  loading={exportingFormat === 'seasonal-csv'}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.seasonalComparison.yearComparison?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">{item.year}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.yield}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.change > 0 ? 'bg-green-100 text-green-800' : 
                        item.change < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        {(selectedReportType === "all" || selectedReportType === "performance") && reports.performanceMetrics && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="TrendingUp" className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                    <p className="text-sm text-gray-600">KPI dashboard</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  icon="Download"
                  onClick={() => handleExport('performance', 'csv')}
                  loading={exportingFormat === 'performance-csv'}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {reports.performanceMetrics.kpis?.slice(0, 4).map((kpi, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-gray-900">{kpi.value}</div>
                    <div className="text-xs text-gray-600">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Usage */}
        {(selectedReportType === "all" || selectedReportType === "resources") && reports.resourceUsage && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="PieChart" className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Resource Usage</h3>
                    <p className="text-sm text-gray-600">Resource consumption</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  icon="Download"
                  onClick={() => handleExport('resources', 'csv')}
                  loading={exportingFormat === 'resources-csv'}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reports.resourceUsage.resources?.slice(0, 4).map((resource, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                      <span className="text-sm text-gray-600">{resource.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-forest to-fresh h-2 rounded-full"
                        style={{ width: `${resource.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Reports */}
        {(selectedReportType === "all" || selectedReportType === "custom") && (
          <Card className="card-hover" hover>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="FileText" className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Custom Reports</h3>
                    <p className="text-sm text-gray-600">Build custom analytics</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  icon="Plus"
                  onClick={() => toast.info("Custom report builder coming soon!")}
                >
                  Create
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <ApperIcon name="Settings" className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">Create custom reports tailored to your specific needs</p>
                <Button variant="outline" size="sm">
                  Build Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
</div>

      {/* Detailed Report Sections */}
      {reports.yieldAnalysis && (selectedReportType === "all" || selectedReportType === "yield") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
<CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 font-display">Top Performing Fields</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.yieldAnalysis.topFields?.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{field.fieldName}</p>
                      <p className="text-sm text-gray-600">{field.cropType} • {field.acres} acres</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">{field.yield}</span>
                      <ApperIcon 
                        name={field.trend === "up" ? "TrendingUp" : field.trend === "down" ? "TrendingDown" : "Minus"} 
                        className={`w-4 h-4 ${
                          field.trend === "up" ? "text-green-500" : 
                          field.trend === "down" ? "text-red-500" : "text-gray-400"
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
              <h3 className="text-lg font-semibold text-gray-900 font-display">Cost Breakdown</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.financialReports?.costBreakdown?.map((item, index) => (
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
      )}

      {/* Export All Reports */}
      <Card className="bg-gradient-to-r from-forest/5 to-fresh/5">
        <CardContent className="p-8 text-center">
          <ApperIcon name="Download" className="w-12 h-12 text-forest mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">Export Reports</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Download comprehensive reports in various formats for further analysis or sharing with stakeholders.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline" 
              icon="FileText"
              onClick={() => handleExport('all', 'csv')}
              loading={exportingFormat === 'all-csv'}
            >
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              icon="File"
              onClick={() => handleExport('all', 'pdf')}
              loading={exportingFormat === 'all-pdf'}
            >
              Export PDF
</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;