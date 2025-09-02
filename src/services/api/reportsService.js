import fieldService from './fieldService';
import taskService from './taskService';
import activityService from './activityService';
import equipmentService from './equipmentService';

class ReportsService {
  constructor() {
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  // Yield Analysis Report
  async getYieldAnalysis(startDate, endDate) {
    try {
      await this.delay(300);
      
      const fields = await fieldService.getAll();
      const activities = await activityService.getAll();
      
      // Filter activities by date range and type
      const yieldActivities = activities.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= startDate && 
               activityDate <= endDate && 
               (activity.type === 'harvest' || activity.type === 'yield_measurement');
      });

      // Calculate yield data per field
      const fieldYields = fields.map(field => {
        const fieldActivities = yieldActivities.filter(act => act.fieldId === field.Id);
        const totalYield = fieldActivities.reduce((sum, act) => {
          return sum + (act.yieldAmount || this.estimateYieldByFieldSize(field));
        }, 0);
        
        const yieldPerAcre = field.size ? (totalYield / field.size).toFixed(1) : '0';
        const trend = this.calculateYieldTrend(field, yieldActivities);
        
        return {
          fieldName: field.name,
          fieldId: field.Id,
          cropType: field.cropType,
          acres: field.size,
          yield: `${yieldPerAcre} bu/acre`,
          totalYield: totalYield,
          trend: trend
        };
      });

      // Sort by yield performance
      const sortedFields = fieldYields.sort((a, b) => b.totalYield - a.totalYield);
      
      return {
        fieldYields: sortedFields,
        topFields: sortedFields.slice(0, 5),
        summary: {
          totalFields: fields.length,
          totalYield: sortedFields.reduce((sum, field) => sum + field.totalYield, 0),
          averageYield: sortedFields.length > 0 ? 
            (sortedFields.reduce((sum, field) => sum + field.totalYield, 0) / sortedFields.length).toFixed(1) : 0,
          topPerformer: sortedFields[0]?.fieldName || 'N/A',
          improvementOpportunities: sortedFields.slice(-3) // Bottom 3 fields
        }
      };
    } catch (error) {
      console.error('Error generating yield analysis:', error);
      throw new Error('Failed to generate yield analysis');
    }
  }

  // Financial Reports
  async getFinancialReports(startDate, endDate) {
    try {
      await this.delay(400);
      
      const tasks = await taskService.getAll();
      const equipment = await equipmentService.getAll();
      const fields = await fieldService.getAll();
      
      // Filter tasks by date range
      const periodTasks = tasks.filter(task => {
        const taskDate = new Date(task.assignedDate || task.createdAt);
        return taskDate >= startDate && taskDate <= endDate;
      });

      // Calculate costs
      const taskCosts = this.calculateTaskCosts(periodTasks);
      const equipmentCosts = this.calculateEquipmentCosts(equipment, startDate, endDate);
      const fieldCosts = this.calculateFieldCosts(fields, periodTasks);
      
      const totalCosts = taskCosts.total + equipmentCosts.total + fieldCosts.total;
      
      // Estimate revenue (simplified calculation)
      const totalRevenue = this.estimateRevenue(fields, startDate, endDate);
      const netProfit = totalRevenue - totalCosts;
      
      const costBreakdown = [
        { category: 'Seeds & Supplies', amount: `$${taskCosts.supplies.toLocaleString()}`, percentage: Math.round((taskCosts.supplies / totalCosts) * 100) },
        { category: 'Equipment', amount: `$${equipmentCosts.total.toLocaleString()}`, percentage: Math.round((equipmentCosts.total / totalCosts) * 100) },
        { category: 'Labor', amount: `$${taskCosts.labor.toLocaleString()}`, percentage: Math.round((taskCosts.labor / totalCosts) * 100) },
        { category: 'Maintenance', amount: `$${equipmentCosts.maintenance.toLocaleString()}`, percentage: Math.round((equipmentCosts.maintenance / totalCosts) * 100) },
        { category: 'Field Operations', amount: `$${fieldCosts.total.toLocaleString()}`, percentage: Math.round((fieldCosts.total / totalCosts) * 100) }
      ].sort((a, b) => b.percentage - a.percentage);

      return {
        totalRevenue: `$${totalRevenue.toLocaleString()}`,
        totalCosts: `$${totalCosts.toLocaleString()}`,
        netProfit: `$${netProfit.toLocaleString()}`,
        profitMargin: totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}%` : '0%',
        costBreakdown: costBreakdown,
        revenueByField: fields.map(field => ({
          fieldName: field.name,
          revenue: `$${this.estimateFieldRevenue(field, startDate, endDate).toLocaleString()}`,
          costs: `$${this.calculateSingleFieldCosts(field, periodTasks).toLocaleString()}`
        }))
      };
    } catch (error) {
      console.error('Error generating financial reports:', error);
      throw new Error('Failed to generate financial reports');
    }
  }

  // Seasonal Comparison Report
  async getSeasonalComparison(startDate, endDate) {
    try {
      await this.delay(350);
      
      const fields = await fieldService.getAll();
      const activities = await activityService.getAll();
      
      const currentYear = new Date().getFullYear();
      const years = [currentYear - 2, currentYear - 1, currentYear];
      
      const yearComparison = years.map(year => {
        const yearActivities = activities.filter(activity => {
          const activityYear = new Date(activity.timestamp).getFullYear();
          return activityYear === year;
        });
        
        const yearYield = this.calculateYearYield(fields, yearActivities);
        const previousYear = year - 1;
        const previousYearActivities = activities.filter(activity => {
          const activityYear = new Date(activity.timestamp).getFullYear();
          return activityYear === previousYear;
        });
        const previousYearYield = this.calculateYearYield(fields, previousYearActivities);
        
        const change = previousYearYield > 0 ? 
          ((yearYield - previousYearYield) / previousYearYield * 100).toFixed(1) : 0;
        
        return {
          year: year.toString(),
          yield: `${yearYield.toFixed(1)} bu`,
          change: parseFloat(change),
          activities: yearActivities.length
        };
      });

      // Seasonal patterns
      const monthlyData = this.calculateMonthlyPatterns(activities, fields);
      
      return {
        yearComparison: yearComparison,
        monthlyPatterns: monthlyData,
        bestSeason: monthlyData.reduce((best, month) => 
          month.productivity > best.productivity ? month : best, monthlyData[0]
        ),
        trends: {
          overallTrend: yearComparison.length > 1 ? 
            (yearComparison[yearComparison.length - 1].change > 0 ? 'improving' : 'declining') : 'stable',
          averageGrowth: yearComparison.reduce((sum, year) => sum + year.change, 0) / yearComparison.length
        }
      };
    } catch (error) {
      console.error('Error generating seasonal comparison:', error);
      throw new Error('Failed to generate seasonal comparison');
    }
  }

  // Performance Metrics Report
  async getPerformanceMetrics(startDate, endDate) {
    try {
      await this.delay(300);
      
      const fields = await fieldService.getAll();
      const tasks = await taskService.getAll();
      const activities = await activityService.getAll();
      const equipment = await equipmentService.getAll();
      
      // Calculate KPIs
      const totalYield = this.calculateTotalYield(fields, activities, startDate, endDate);
      const totalRevenue = this.estimateRevenue(fields, startDate, endDate);
      const totalCosts = this.calculateTotalCosts(tasks, equipment, fields, startDate, endDate);
      const netProfit = totalRevenue - totalCosts;
      
      const completedTasks = tasks.filter(task => 
        task.status === 'completed' && 
        new Date(task.completedDate || task.dueDate) >= startDate &&
        new Date(task.completedDate || task.dueDate) <= endDate
      ).length;
      
      const totalTasks = tasks.filter(task => 
        new Date(task.assignedDate || task.createdAt) >= startDate &&
        new Date(task.assignedDate || task.createdAt) <= endDate
      ).length;
      
      const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
      
      // Equipment utilization
      const avgUtilization = equipment.length > 0 ? 
        equipment.reduce((sum, eq) => sum + (eq.utilizationRate || 0), 0) / equipment.length : 0;
      
      const kpis = [
        { label: 'Yield/Acre', value: `${(totalYield / Math.max(fields.reduce((sum, f) => sum + f.size, 0), 1)).toFixed(1)} bu` },
        { label: 'Profit Margin', value: `${totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%` },
        { label: 'Task Completion', value: `${taskCompletionRate}%` },
        { label: 'Equipment Usage', value: `${avgUtilization.toFixed(1)}%` },
        { label: 'Cost per Acre', value: `$${(totalCosts / Math.max(fields.reduce((sum, f) => sum + f.size, 0), 1)).toFixed(0)}` },
        { label: 'Revenue per Acre', value: `$${(totalRevenue / Math.max(fields.reduce((sum, f) => sum + f.size, 0), 1)).toFixed(0)}` }
      ];

      return {
        summary: {
          totalYield: `${totalYield.toFixed(1)} bu`,
          totalRevenue: `$${totalRevenue.toLocaleString()}`,
          totalCosts: `$${totalCosts.toLocaleString()}`,
          netProfit: `$${netProfit.toLocaleString()}`,
          yieldTrend: netProfit > 0 ? 'up' : netProfit < 0 ? 'down' : 'stable',
          yieldChange: `${((totalYield / Math.max(fields.length, 1))).toFixed(1)} bu avg`,
          revenueTrend: totalRevenue > totalCosts ? 'up' : 'down',
          revenueChange: `${((totalRevenue / Math.max(fields.length, 1)) / 1000).toFixed(1)}K avg`,
          costsTrend: totalCosts < totalRevenue ? 'down' : 'up',
          costsChange: `${((totalCosts / Math.max(fields.length, 1)) / 1000).toFixed(1)}K avg`,
          profitTrend: netProfit > 0 ? 'up' : 'down',
          profitChange: `${(netProfit / 1000).toFixed(1)}K total`
        },
        kpis: kpis,
        efficiency: {
          taskEfficiency: taskCompletionRate,
          equipmentUtilization: avgUtilization.toFixed(1),
          costEfficiency: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0,
          yieldEfficiency: fields.length > 0 ? (totalYield / fields.length).toFixed(1) : 0
        }
      };
    } catch (error) {
      console.error('Error generating performance metrics:', error);
      throw new Error('Failed to generate performance metrics');
    }
  }

  // Resource Usage Report
  async getResourceUsage(startDate, endDate) {
    try {
      await this.delay(250);
      
      const tasks = await taskService.getAll();
      const equipment = await equipmentService.getAll();
      const fields = await fieldService.getAll();
      
      // Filter tasks by date range
      const periodTasks = tasks.filter(task => {
        const taskDate = new Date(task.assignedDate || task.createdAt);
        return taskDate >= startDate && taskDate <= endDate;
      });

      // Calculate resource usage from tasks and equipment
      const resourceUsage = this.calculateResourceUsage(periodTasks, equipment, fields);
      
      const totalUsage = resourceUsage.reduce((sum, resource) => sum + resource.cost, 0);
      
      const resources = resourceUsage.map(resource => ({
        name: resource.name,
        amount: resource.unit ? `${resource.quantity} ${resource.unit}` : `$${resource.cost.toLocaleString()}`,
        cost: resource.cost,
        percentage: totalUsage > 0 ? Math.round((resource.cost / totalUsage) * 100) : 0
      })).sort((a, b) => b.cost - a.cost);

      return {
        resources: resources,
        totalCost: `$${totalUsage.toLocaleString()}`,
        efficiency: {
          costPerAcre: `$${(totalUsage / Math.max(fields.reduce((sum, f) => sum + f.size, 0), 1)).toFixed(0)}`,
          utilizationRate: equipment.length > 0 ? 
            `${(equipment.reduce((sum, eq) => sum + (eq.utilizationRate || 0), 0) / equipment.length).toFixed(1)}%` : '0%'
        },
        recommendations: this.generateResourceRecommendations(resources)
      };
    } catch (error) {
      console.error('Error generating resource usage report:', error);
      throw new Error('Failed to generate resource usage report');
    }
  }

  // Custom Reports
  async getCustomReports(startDate, endDate) {
    try {
      await this.delay(200);
      
      // Return template for custom reports
      return {
        availableMetrics: [
          'Yield by Field',
          'Cost Analysis',
          'Equipment Efficiency',
          'Task Performance',
          'Seasonal Trends',
          'Profitability Analysis'
        ],
        templates: [
          { name: 'Executive Summary', description: 'High-level overview for management' },
          { name: 'Operational Report', description: 'Detailed operational metrics' },
          { name: 'Financial Analysis', description: 'Cost and revenue breakdown' },
          { name: 'Efficiency Report', description: 'Resource utilization and efficiency' }
        ],
        recentCustomReports: []
      };
    } catch (error) {
      console.error('Error loading custom reports:', error);
      throw new Error('Failed to load custom reports');
    }
  }

  // Export Report
  async exportReport(reportType, format, startDate, endDate) {
    try {
      let reportData;
      
      switch (reportType) {
        case 'yield':
          reportData = await this.getYieldAnalysis(startDate, endDate);
          break;
        case 'financial':
          reportData = await this.getFinancialReports(startDate, endDate);
          break;
        case 'seasonal':
          reportData = await this.getSeasonalComparison(startDate, endDate);
          break;
        case 'performance':
          reportData = await this.getPerformanceMetrics(startDate, endDate);
          break;
        case 'resources':
          reportData = await this.getResourceUsage(startDate, endDate);
          break;
        case 'all':
          reportData = {
            yield: await this.getYieldAnalysis(startDate, endDate),
            financial: await this.getFinancialReports(startDate, endDate),
            performance: await this.getPerformanceMetrics(startDate, endDate),
            resources: await this.getResourceUsage(startDate, endDate)
          };
          break;
        default:
          throw new Error('Invalid report type');
      }

      if (format === 'csv') {
        return this.generateCSV(reportType, reportData);
      } else if (format === 'pdf') {
        return this.generatePDF(reportType, reportData);
      }
      
      return reportData;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }

  // Helper Methods
  estimateYieldByFieldSize(field) {
    // Simple estimation based on field size and crop type
    const baseYields = {
      'corn': 150,
      'wheat': 60,
      'soybeans': 45,
      'default': 100
    };
    const baseYield = baseYields[field.cropType?.toLowerCase()] || baseYields.default;
    return (field.size || 1) * baseYield * (0.8 + Math.random() * 0.4); // Add some variation
  }

  calculateYieldTrend(field, activities) {
    // Simple trend calculation
    if (activities.length < 2) return 'stable';
    
    const recentYield = activities.slice(-2).reduce((sum, act) => sum + (act.yieldAmount || 0), 0);
    const previousYield = activities.slice(0, -2).reduce((sum, act) => sum + (act.yieldAmount || 0), 0);
    
    if (recentYield > previousYield * 1.1) return 'up';
    if (recentYield < previousYield * 0.9) return 'down';
    return 'stable';
  }

  calculateTaskCosts(tasks) {
    const supplies = tasks.reduce((sum, task) => sum + (task.supplyCost || 0), 0);
    const labor = tasks.reduce((sum, task) => sum + (task.laborCost || 0), 0);
    return {
      supplies: supplies || 15000, // Default values for demonstration
      labor: labor || 8000,
      total: supplies + labor || 23000
    };
  }

  calculateEquipmentCosts(equipment, startDate, endDate) {
    const total = equipment.reduce((sum, eq) => {
      const roi = equipmentService.calculateROI(eq);
      return sum + roi.totalCostOfOwnership / 12; // Monthly cost approximation
    }, 0);
    
    return {
      total: total || 12000,
      maintenance: total * 0.3 || 3600,
      depreciation: total * 0.5 || 6000,
      fuel: total * 0.2 || 2400
    };
  }

  calculateFieldCosts(fields, tasks) {
    const total = fields.reduce((sum, field) => {
      const fieldTasks = tasks.filter(task => task.fieldId === field.Id);
      return sum + fieldTasks.reduce((taskSum, task) => taskSum + (task.cost || 0), 0);
    }, 0);
    
    return {
      total: total || 8000
    };
  }

  estimateRevenue(fields, startDate, endDate) {
    return fields.reduce((sum, field) => {
      return sum + this.estimateFieldRevenue(field, startDate, endDate);
    }, 0);
  }

  estimateFieldRevenue(field, startDate, endDate) {
    const pricePerBushel = {
      'corn': 4.50,
      'wheat': 6.20,
      'soybeans': 12.00,
      'default': 5.00
    };
    
    const price = pricePerBushel[field.cropType?.toLowerCase()] || pricePerBushel.default;
    const estimatedYield = this.estimateYieldByFieldSize(field);
    
    return estimatedYield * price;
  }

  calculateSingleFieldCosts(field, tasks) {
    const fieldTasks = tasks.filter(task => task.fieldId === field.Id);
    return fieldTasks.reduce((sum, task) => sum + (task.cost || 0), 0) || (field.size * 200); // Default $200/acre
  }

  calculateYearYield(fields, activities) {
    return activities.reduce((sum, activity) => {
      if (activity.type === 'harvest' || activity.type === 'yield_measurement') {
        return sum + (activity.yieldAmount || 0);
      }
      return sum;
    }, 0) || fields.reduce((sum, field) => sum + this.estimateYieldByFieldSize(field), 0) / 4; // Quarterly estimate
  }

  calculateMonthlyPatterns(activities, fields) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return months.map((month, index) => {
      const monthActivities = activities.filter(activity => 
        new Date(activity.timestamp).getMonth() === index
      );
      
      return {
        month: month,
        activities: monthActivities.length,
        productivity: monthActivities.length * (Math.random() * 50 + 50) // Simulated productivity score
      };
    });
  }

  calculateTotalYield(fields, activities, startDate, endDate) {
    const relevantActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= startDate && 
             activityDate <= endDate && 
             (activity.type === 'harvest' || activity.type === 'yield_measurement');
    });
    
    return relevantActivities.reduce((sum, activity) => {
      return sum + (activity.yieldAmount || 0);
    }, 0) || fields.reduce((sum, field) => sum + this.estimateYieldByFieldSize(field), 0);
  }

  calculateTotalCosts(tasks, equipment, fields, startDate, endDate) {
    const taskCosts = this.calculateTaskCosts(tasks.filter(task => {
      const taskDate = new Date(task.assignedDate || task.createdAt);
      return taskDate >= startDate && taskDate <= endDate;
    }));
    
    const equipmentCosts = this.calculateEquipmentCosts(equipment, startDate, endDate);
    const fieldCosts = this.calculateFieldCosts(fields, tasks);
    
    return taskCosts.total + equipmentCosts.total + fieldCosts.total;
  }

  calculateResourceUsage(tasks, equipment, fields) {
    const resources = [
      {
        name: 'Seeds',
        quantity: tasks.filter(t => t.type === 'planting').length * 50,
        unit: 'lbs',
        cost: tasks.filter(t => t.type === 'planting').length * 500
      },
      {
        name: 'Fertilizer',
        quantity: fields.reduce((sum, f) => sum + f.size, 0) * 100,
        unit: 'lbs',
        cost: fields.reduce((sum, f) => sum + f.size, 0) * 45
      },
      {
        name: 'Fuel',
        quantity: equipment.reduce((sum, eq) => sum + (eq.totalHours || 0), 0) * 2.5,
        unit: 'gallons',
        cost: equipment.reduce((sum, eq) => sum + (eq.totalHours || 0), 0) * 7.5
      },
      {
        name: 'Water',
        quantity: fields.reduce((sum, f) => sum + f.size, 0) * 15000,
        unit: 'gallons',
        cost: fields.reduce((sum, f) => sum + f.size, 0) * 25
      },
      {
        name: 'Labor',
        quantity: tasks.length * 4,
        unit: 'hours',
        cost: tasks.length * 60
      }
    ];
    
    return resources.filter(r => r.cost > 0);
  }

  generateResourceRecommendations(resources) {
    const recommendations = [];
    
    // Find highest cost resource
    const highestCost = resources[0];
    if (highestCost) {
      recommendations.push(`Consider optimizing ${highestCost.name.toLowerCase()} usage to reduce costs`);
    }
    
    // General recommendations
    recommendations.push('Monitor resource consumption trends monthly');
    recommendations.push('Implement precision agriculture to optimize resource application');
    recommendations.push('Consider bulk purchasing for frequently used supplies');
    
    return recommendations;
  }

  generateCSV(reportType, data) {
    let csvContent = '';
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (reportType === 'yield' && data.fieldYields) {
      csvContent = [
        'Field Name,Crop Type,Acres,Yield per Acre,Total Yield,Trend',
        ...data.fieldYields.map(field => 
          `"${field.fieldName}","${field.cropType}",${field.acres},"${field.yield}",${field.totalYield},"${field.trend}"`
        )
      ].join('\n');
    } else if (reportType === 'financial' && data.costBreakdown) {
      csvContent = [
        'Category,Amount,Percentage',
        ...data.costBreakdown.map(item =>
          `"${item.category}","${item.amount}",${item.percentage}`
        )
      ].join('\n');
    } else if (reportType === 'all') {
      // Combined report
      csvContent = `Farm Report - ${timestamp}\n\n`;
      csvContent += 'Report Type,Metric,Value\n';
      
      if (data.performance?.summary) {
        csvContent += `Performance,Total Yield,${data.performance.summary.totalYield}\n`;
        csvContent += `Performance,Total Revenue,${data.performance.summary.totalRevenue}\n`;
        csvContent += `Performance,Net Profit,${data.performance.summary.netProfit}\n`;
      }
    }
    
    return csvContent;
  }

  generatePDF(reportType, data) {
    const timestamp = new Date().toLocaleDateString();
    
    let content = `FARM REPORT - ${reportType.toUpperCase()}\n`;
    content += `Generated: ${timestamp}\n\n`;
    
    if (reportType === 'yield' && data.fieldYields) {
      content += 'YIELD ANALYSIS\n';
      content += '================\n\n';
      
      data.fieldYields.forEach(field => {
        content += `${field.fieldName} (${field.cropType})\n`;
        content += `- Acres: ${field.acres}\n`;
        content += `- Yield: ${field.yield}\n`;
        content += `- Trend: ${field.trend}\n\n`;
      });
    } else if (reportType === 'financial' && data.costBreakdown) {
      content += 'FINANCIAL ANALYSIS\n';
      content += '==================\n\n';
      content += `Total Revenue: ${data.totalRevenue}\n`;
      content += `Total Costs: ${data.totalCosts}\n`;
      content += `Net Profit: ${data.netProfit}\n\n`;
      
      content += 'Cost Breakdown:\n';
      data.costBreakdown.forEach(item => {
        content += `- ${item.category}: ${item.amount} (${item.percentage}%)\n`;
      });
    }
    
    return {
      content,
      mimeType: 'application/pdf',
      filename: `farm_${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`
    };
  }
}

const reportsService = new ReportsService();
export default reportsService;