class EquipmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'equipment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "manufacturer_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "last_maintenance_hours_c"}},
          {"field": {"Name": "next_maintenance_hours_c"}},
          {"field": {"Name": "maintenance_interval_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "fuel_capacity_c"}},
          {"field": {"Name": "total_fuel_c"}},
{"field": {"Name": "purchase_price_c"}},
          {"field": {"Name": "current_value_c"}},
          {"field": {"Name": "serial_number_c"}},
          {"field": {"Name": "year_purchased_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "last_used_c"}},
          {"field": {"Name": "usage_logs_c"}},
          {"field": {"Name": "maintenance_history_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(equipment => ({
        Id: equipment.Id,
        name: equipment.Name,
        type: equipment.type_c,
        model: equipment.model_c,
        manufacturer: equipment.manufacturer_c,
        year: equipment.year_c,
        status: equipment.status_c,
        totalHours: equipment.total_hours_c || 0,
        lastMaintenanceHours: equipment.last_maintenance_hours_c || 0,
        nextMaintenanceHours: equipment.next_maintenance_hours_c || 0,
        maintenanceInterval: equipment.maintenance_interval_c || 0,
        lastMaintenance: equipment.last_maintenance_c,
        nextMaintenance: equipment.next_maintenance_c,
        location: equipment.location_c,
        fuelCapacity: equipment.fuel_capacity_c || 0,
        totalFuel: equipment.total_fuel_c || 0,
purchasePrice: equipment.purchase_price_c || 0,
        currentValue: equipment.current_value_c || 0,
        serialNumber: equipment.serial_number_c || 'N/A',
        yearPurchased: equipment.year_purchased_c || equipment.year_c,
        image: equipment.image_c,
        lastUsed: equipment.last_used_c,
        usageLogs: equipment.usage_logs_c ? JSON.parse(equipment.usage_logs_c) : [],
        maintenanceHistory: equipment.maintenance_history_c ? JSON.parse(equipment.maintenance_history_c) : []
      }));
    } catch (error) {
      console.error('Error fetching equipment:', error);
      throw new Error('Failed to fetch equipment');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "manufacturer_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "last_maintenance_hours_c"}},
          {"field": {"Name": "next_maintenance_hours_c"}},
          {"field": {"Name": "maintenance_interval_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "fuel_capacity_c"}},
          {"field": {"Name": "total_fuel_c"}},
          {"field": {"Name": "purchase_price_c"}},
          {"field": {"Name": "current_value_c"}},
{"field": {"Name": "image_c"}},
          {"field": {"Name": "last_used_c"}},
          {"field": {"Name": "serial_number_c"}},
          {"field": {"Name": "year_purchased_c"}},
          {"field": {"Name": "usage_logs_c"}},
          {"field": {"Name": "maintenance_history_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const equipment = response.data;
      if (!equipment) {
        return null;
      }
      
      // Transform database fields to UI format
      return {
        Id: equipment.Id,
        name: equipment.Name,
        type: equipment.type_c,
        model: equipment.model_c,
        manufacturer: equipment.manufacturer_c,
        year: equipment.year_c,
        status: equipment.status_c,
        totalHours: equipment.total_hours_c || 0,
        lastMaintenanceHours: equipment.last_maintenance_hours_c || 0,
        nextMaintenanceHours: equipment.next_maintenance_hours_c || 0,
        maintenanceInterval: equipment.maintenance_interval_c || 0,
        lastMaintenance: equipment.last_maintenance_c,
        nextMaintenance: equipment.next_maintenance_c,
        location: equipment.location_c,
        fuelCapacity: equipment.fuel_capacity_c || 0,
        totalFuel: equipment.total_fuel_c || 0,
purchasePrice: equipment.purchase_price_c || 0,
        currentValue: equipment.current_value_c || 0,
        serialNumber: equipment.serial_number_c || 'N/A',
        yearPurchased: equipment.year_purchased_c || equipment.year_c,
        image: equipment.image_c,
        lastUsed: equipment.last_used_c,
        usageLogs: equipment.usage_logs_c ? JSON.parse(equipment.usage_logs_c) : [],
        maintenanceHistory: equipment.maintenance_history_c ? JSON.parse(equipment.maintenance_history_c) : []
      };
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error);
      return null;
    }
  }

  async create(equipmentData) {
    try {
      const params = {
        records: [{
          Name: equipmentData.name,
          type_c: equipmentData.type,
          model_c: equipmentData.model,
          manufacturer_c: equipmentData.manufacturer,
          year_c: equipmentData.year,
          status_c: equipmentData.status || 'Active',
          total_hours_c: 0,
          last_maintenance_hours_c: 0,
          next_maintenance_hours_c: equipmentData.nextMaintenanceHours || 0,
          maintenance_interval_c: equipmentData.maintenanceInterval || 300,
          last_maintenance_c: equipmentData.lastMaintenance,
          next_maintenance_c: equipmentData.nextMaintenance,
          location_c: equipmentData.location,
          fuel_capacity_c: equipmentData.fuelCapacity || 0,
          total_fuel_c: 0,
          purchase_price_c: equipmentData.purchasePrice || 0,
current_value_c: equipmentData.currentValue || 0,
          image_c: equipmentData.image,
          serial_number_c: equipmentData.serialNumber,
          year_purchased_c: equipmentData.yearPurchased || equipmentData.year,
          last_used_c: equipmentData.lastUsed,
          usage_logs_c: JSON.stringify([]),
          maintenance_history_c: JSON.stringify([])
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`);
          throw new Error('Failed to create equipment');
        }
        
        const newEquipment = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: newEquipment.Id,
          name: newEquipment.Name,
          type: newEquipment.type_c,
          model: newEquipment.model_c,
          manufacturer: newEquipment.manufacturer_c,
          year: newEquipment.year_c,
          status: newEquipment.status_c,
          totalHours: newEquipment.total_hours_c || 0,
          lastMaintenanceHours: newEquipment.last_maintenance_hours_c || 0,
          nextMaintenanceHours: newEquipment.next_maintenance_hours_c || 0,
          maintenanceInterval: newEquipment.maintenance_interval_c || 0,
          lastMaintenance: newEquipment.last_maintenance_c,
          nextMaintenance: newEquipment.next_maintenance_c,
          location: newEquipment.location_c,
          fuelCapacity: newEquipment.fuel_capacity_c || 0,
          totalFuel: newEquipment.total_fuel_c || 0,
purchasePrice: newEquipment.purchase_price_c || 0,
          currentValue: newEquipment.current_value_c || 0,
          serialNumber: newEquipment.serial_number_c || 'N/A',
          yearPurchased: newEquipment.year_purchased_c || newEquipment.year_c,
          image: newEquipment.image_c,
          lastUsed: newEquipment.last_used_c,
          usageLogs: [],
          maintenanceHistory: []
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating equipment:', error);
      throw new Error('Failed to create equipment');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.model !== undefined) updateData.model_c = data.model;
      if (data.manufacturer !== undefined) updateData.manufacturer_c = data.manufacturer;
      if (data.year !== undefined) updateData.year_c = data.year;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.totalHours !== undefined) updateData.total_hours_c = data.totalHours;
      if (data.lastMaintenanceHours !== undefined) updateData.last_maintenance_hours_c = data.lastMaintenanceHours;
      if (data.nextMaintenanceHours !== undefined) updateData.next_maintenance_hours_c = data.nextMaintenanceHours;
      if (data.maintenanceInterval !== undefined) updateData.maintenance_interval_c = data.maintenanceInterval;
      if (data.lastMaintenance !== undefined) updateData.last_maintenance_c = data.lastMaintenance;
      if (data.nextMaintenance !== undefined) updateData.next_maintenance_c = data.nextMaintenance;
      if (data.location !== undefined) updateData.location_c = data.location;
      if (data.fuelCapacity !== undefined) updateData.fuel_capacity_c = data.fuelCapacity;
      if (data.totalFuel !== undefined) updateData.total_fuel_c = data.totalFuel;
      if (data.purchasePrice !== undefined) updateData.purchase_price_c = data.purchasePrice;
if (data.currentValue !== undefined) updateData.current_value_c = data.currentValue;
      if (data.image !== undefined) updateData.image_c = data.image;
      if (data.serialNumber !== undefined) updateData.serial_number_c = data.serialNumber;
      if (data.yearPurchased !== undefined) updateData.year_purchased_c = data.yearPurchased;
      if (data.lastUsed !== undefined) updateData.last_used_c = data.lastUsed;
      if (data.usageLogs !== undefined) updateData.usage_logs_c = JSON.stringify(data.usageLogs);
      if (data.maintenanceHistory !== undefined) updateData.maintenance_history_c = JSON.stringify(data.maintenanceHistory);
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`);
          throw new Error('Failed to update equipment');
        }
        
        const updatedEquipment = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: updatedEquipment.Id,
          name: updatedEquipment.Name,
          type: updatedEquipment.type_c,
          model: updatedEquipment.model_c,
          manufacturer: updatedEquipment.manufacturer_c,
          year: updatedEquipment.year_c,
          status: updatedEquipment.status_c,
          totalHours: updatedEquipment.total_hours_c || 0,
          lastMaintenanceHours: updatedEquipment.last_maintenance_hours_c || 0,
          nextMaintenanceHours: updatedEquipment.next_maintenance_hours_c || 0,
          maintenanceInterval: updatedEquipment.maintenance_interval_c || 0,
          lastMaintenance: updatedEquipment.last_maintenance_c,
          nextMaintenance: updatedEquipment.next_maintenance_c,
          location: updatedEquipment.location_c,
fuelCapacity: updatedEquipment.fuel_capacity_c || 0,
          totalFuel: updatedEquipment.total_fuel_c || 0,
          serialNumber: updatedEquipment.serial_number_c || 'N/A',
          yearPurchased: updatedEquipment.year_purchased_c || updatedEquipment.year_c,
          purchasePrice: updatedEquipment.purchase_price_c || 0,
          currentValue: updatedEquipment.current_value_c || 0,
          image: updatedEquipment.image_c,
          lastUsed: updatedEquipment.last_used_c,
          usageLogs: updatedEquipment.usage_logs_c ? JSON.parse(updatedEquipment.usage_logs_c) : [],
          maintenanceHistory: updatedEquipment.maintenance_history_c ? JSON.parse(updatedEquipment.maintenance_history_c) : []
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating equipment ${id}:`, error);
      throw new Error('Failed to update equipment');
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`);
          throw new Error('Failed to delete equipment');
        }
        
        return successful[0];
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting equipment ${id}:`, error);
      throw new Error('Failed to delete equipment');
    }
  }

  async logUsage(id, usageData) {
    try {
      // First get the current equipment
      const equipment = await this.getById(id);
      if (!equipment) {
        throw new Error(`Equipment with Id ${id} not found`);
      }

      const usageLog = {
        id: Date.now(),
        date: usageData.date || new Date().toISOString(),
        hours: parseFloat(usageData.hours) || 0,
        fuelUsed: parseFloat(usageData.fuelUsed) || 0,
        operator: usageData.operator || '',
        notes: usageData.notes || '',
        maintenancePerformed: usageData.maintenancePerformed || false
      };

      const updatedUsageLogs = [...(equipment.usageLogs || []), usageLog];
      const updatedTotalHours = (equipment.totalHours || 0) + usageLog.hours;
      const updatedTotalFuel = (equipment.totalFuel || 0) + usageLog.fuelUsed;
      
      // Update maintenance status based on hours
      let updatedStatus = equipment.status;
      if (updatedTotalHours >= equipment.nextMaintenanceHours) {
        updatedStatus = 'Maintenance Due';
      }

      // Update the equipment record
      return await this.update(id, {
        usageLogs: updatedUsageLogs,
        totalHours: updatedTotalHours,
        totalFuel: updatedTotalFuel,
        lastUsed: usageLog.date,
        status: updatedStatus
      });
    } catch (error) {
      console.error(`Error logging usage for equipment ${id}:`, error);
      throw new Error('Failed to log usage');
    }
  }

  async scheduleMaintenance(id, maintenanceData) {
    try {
      // First get the current equipment
      const equipment = await this.getById(id);
      if (!equipment) {
        throw new Error('Equipment not found');
      }

      const maintenanceRecord = {
        Id: Date.now(),
        equipmentId: equipment.Id,
        serviceType: maintenanceData.type,
        date: maintenanceData.scheduledDate + 'T10:00:00Z',
        estimatedCost: parseFloat(maintenanceData.estimatedCost) || 0,
        priority: maintenanceData.priority,
        notes: maintenanceData.notes,
        status: 'scheduled',
        createdDate: new Date().toISOString()
      };

      const updatedMaintenanceHistory = [...(equipment.maintenanceHistory || []), maintenanceRecord];

      // Update the equipment record
      await this.update(id, {
        maintenanceHistory: updatedMaintenanceHistory
      });

      return maintenanceRecord;
    } catch (error) {
      console.error(`Error scheduling maintenance for equipment ${id}:`, error);
      throw new Error('Failed to schedule maintenance');
    }
  }

  async getMaintenanceHistory() {
    try {
      const equipment = await this.getAll();
      
      const allRecords = [];
      equipment.forEach(item => {
        if (item.maintenanceHistory) {
          allRecords.push(...item.maintenanceHistory);
        }
      });
      
      return allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
      throw new Error('Failed to fetch maintenance history');
    }
  }

  async getMaintenanceAlerts() {
    try {
      const equipment = await this.getAll();
      
      const alerts = [];
      const currentDate = new Date();
      
      equipment.forEach(item => {
        const nextMaintenanceDate = new Date(item.nextMaintenance);
        const daysUntilMaintenance = Math.ceil((nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24));
        const hoursUntilMaintenance = item.nextMaintenanceHours - item.totalHours;
        
        let priority = 'low';
        let status = 'upcoming';
        
        if (daysUntilMaintenance < 0 || hoursUntilMaintenance <= 0) {
          priority = 'high';
          status = 'overdue';
        } else if (daysUntilMaintenance <= 7 || hoursUntilMaintenance <= 50) {
          priority = 'medium';
          status = 'due-soon';
        }
        
        if (daysUntilMaintenance <= 30 || hoursUntilMaintenance <= 100) {
          alerts.push({
            Id: `alert-${item.Id}`,
            equipmentId: item.Id,
            equipmentName: item.name,
            equipmentType: item.type,
            nextMaintenanceDate: item.nextMaintenance,
            daysUntilMaintenance,
            hoursUntilMaintenance,
            priority,
            status,
            location: item.location,
            lastMaintenance: item.lastMaintenance
          });
        }
      });
      
      return alerts.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.daysUntilMaintenance - b.daysUntilMaintenance;
      });
    } catch (error) {
      console.error('Error fetching maintenance alerts:', error);
      throw new Error('Failed to fetch maintenance alerts');
    }
  }

  async updateMaintenanceRecord(id, updates) {
    try {
      const equipment = await this.getAll();
      
      for (let item of equipment) {
        if (item.maintenanceHistory) {
          const recordIndex = item.maintenanceHistory.findIndex(record => record.Id === parseInt(id));
          if (recordIndex !== -1) {
            item.maintenanceHistory[recordIndex] = {
              ...item.maintenanceHistory[recordIndex],
              ...updates,
              updatedDate: new Date().toISOString()
            };
            
            await this.update(item.Id, {
              maintenanceHistory: item.maintenanceHistory
            });
            
            return item.maintenanceHistory[recordIndex];
          }
        }
      }
      
      throw new Error('Maintenance record not found');
    } catch (error) {
      console.error(`Error updating maintenance record ${id}:`, error);
      throw new Error('Maintenance record not found');
    }
}

  // ROI Calculation Methods
  calculateROI(equipment) {
    try {
      const purchasePrice = equipment.purchasePrice || 0;
      const currentValue = equipment.currentValue || 0;
      const totalHours = equipment.totalHours || 0;
      const currentYear = new Date().getFullYear();
      const purchaseYear = equipment.yearPurchased || equipment.year || currentYear;
      const yearsOwned = Math.max(currentYear - purchaseYear, 1);

      // Calculate total maintenance costs
      const totalMaintenanceCost = (equipment.maintenanceHistory || [])
        .reduce((sum, record) => sum + (record.actualCost || record.estimatedCost || 0), 0);

      // Cost per hour calculation
      const totalCost = purchasePrice - currentValue + totalMaintenanceCost;
      const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;

      // Annual depreciation
      const totalDepreciation = purchasePrice - currentValue;
      const annualDepreciation = totalDepreciation / yearsOwned;
      const depreciationRate = purchasePrice > 0 ? (totalDepreciation / purchasePrice) * 100 : 0;

      // ROI Percentage (negative indicates depreciation)
      const roi = purchasePrice > 0 ? ((currentValue - purchasePrice) / purchasePrice) * 100 : 0;

      // Additional metrics
      const maintenanceCostPerHour = totalHours > 0 ? totalMaintenanceCost / totalHours : 0;
      const totalCostOfOwnership = purchasePrice + totalMaintenanceCost;

      return {
        costPerHour: Math.round(costPerHour * 100) / 100,
        annualDepreciation: Math.round(annualDepreciation * 100) / 100,
        depreciationRate: Math.round(depreciationRate * 100) / 100,
        roi: Math.round(roi * 100) / 100,
        totalMaintenanceCost: Math.round(totalMaintenanceCost * 100) / 100,
        maintenanceCostPerHour: Math.round(maintenanceCostPerHour * 100) / 100,
        totalCostOfOwnership: Math.round(totalCostOfOwnership * 100) / 100,
        yearsOwned,
        totalDepreciation: Math.round(totalDepreciation * 100) / 100
      };
    } catch (error) {
      console.error('Error calculating ROI:', error);
      return {
        costPerHour: 0,
        annualDepreciation: 0,
        depreciationRate: 0,
        roi: 0,
        totalMaintenanceCost: 0,
        maintenanceCostPerHour: 0,
        totalCostOfOwnership: 0,
        yearsOwned: 1,
        totalDepreciation: 0
      };
    }
  }

  // Export functionality
  async exportROIData(format = 'csv', dateRange = null) {
    try {
      const equipment = await this.getAll();
      const roiData = equipment.map(item => {
        const roi = this.calculateROI(item);
        return {
          name: item.name,
          type: item.type,
          manufacturer: item.manufacturer,
          model: item.model,
          year: item.year,
          serialNumber: item.serialNumber,
          purchasePrice: item.purchasePrice,
          currentValue: item.currentValue,
          totalHours: item.totalHours,
          costPerHour: roi.costPerHour,
          annualDepreciation: roi.annualDepreciation,
          depreciationRate: roi.depreciationRate,
          roi: roi.roi,
          totalMaintenanceCost: roi.totalMaintenanceCost,
          maintenanceCostPerHour: roi.maintenanceCostPerHour,
          totalCostOfOwnership: roi.totalCostOfOwnership,
          yearsOwned: roi.yearsOwned,
          totalDepreciation: roi.totalDepreciation
        };
      });

      if (format === 'csv') {
        return this.generateCSV(roiData);
      } else if (format === 'excel') {
        return this.generateExcel(roiData);
      } else if (format === 'pdf') {
        return this.generatePDF(roiData);
      }

      return roiData;
    } catch (error) {
      console.error('Error exporting ROI data:', error);
      throw new Error('Failed to export ROI data');
    }
  }

  generateCSV(data) {
    const headers = [
      'Equipment Name', 'Type', 'Manufacturer', 'Model', 'Year', 'Serial Number',
      'Purchase Price', 'Current Value', 'Total Hours', 'Cost Per Hour',
      'Annual Depreciation', 'Depreciation Rate (%)', 'ROI (%)', 
      'Total Maintenance Cost', 'Maintenance Cost Per Hour', 'Total Cost of Ownership',
      'Years Owned', 'Total Depreciation'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name}"`,
        `"${item.type}"`,
        `"${item.manufacturer}"`,
        `"${item.model}"`,
        item.year,
        `"${item.serialNumber}"`,
        item.purchasePrice,
        item.currentValue,
        item.totalHours,
        item.costPerHour,
        item.annualDepreciation,
        item.depreciationRate,
        item.roi,
        item.totalMaintenanceCost,
        item.maintenanceCostPerHour,
        item.totalCostOfOwnership,
        item.yearsOwned,
        item.totalDepreciation
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  generateExcel(data) {
    // For web implementation, return CSV format with Excel MIME type
    // In a full implementation, you would use a library like SheetJS
    const csvContent = this.generateCSV(data);
    return {
      content: csvContent,
      mimeType: 'application/vnd.ms-excel',
      filename: `equipment_roi_${new Date().toISOString().split('T')[0]}.xls`
    };
  }

  generatePDF(data) {
    // For web implementation, return formatted text
    // In a full implementation, you would use a library like jsPDF
    const content = `
EQUIPMENT ROI ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

${data.map(item => `
${item.name} (${item.type})
- Manufacturer: ${item.manufacturer} ${item.model}
- Purchase Price: $${item.purchasePrice.toLocaleString()}
- Current Value: $${item.currentValue.toLocaleString()}
- Cost Per Hour: $${item.costPerHour}
- Annual Depreciation: $${item.annualDepreciation.toLocaleString()}
- ROI: ${item.roi}%
- Years Owned: ${item.yearsOwned}
`).join('')}
    `;

    return {
      content,
      mimeType: 'application/pdf',
      filename: `equipment_roi_report_${new Date().toISOString().split('T')[0]}.pdf`
    };
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;