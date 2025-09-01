import equipmentData from "@/services/mockData/equipment.json";
class EquipmentService {
  constructor() {
    this.equipment = [...equipmentData];
  }

  async getAll() {
    await this.delay(300);
    return this.equipment.map(item => ({ ...item }));
  }

  async getById(id) {
    await this.delay(200);
    const equipment = this.equipment.find(item => item.Id === parseInt(id));
    return equipment ? { ...equipment } : null;
  }

  async create(equipmentData) {
    await this.delay(500);
    const newEquipment = {
      ...equipmentData,
      Id: Math.max(...this.equipment.map(e => e.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      totalHours: 0,
      totalFuel: 0,
      usageLogs: []
    };
    this.equipment.push(newEquipment);
    return { ...newEquipment };
  }

  async update(id, data) {
    await this.delay(400);
    const index = this.equipment.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Equipment with Id ${id} not found`);
    }
    
    this.equipment[index] = {
      ...this.equipment[index],
      ...data,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.equipment[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.equipment.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Equipment with Id ${id} not found`);
    }
    
    const deleted = this.equipment.splice(index, 1)[0];
    return { ...deleted };
  }

  async logUsage(id, usageData) {
    await this.delay(400);
    const equipment = this.equipment.find(item => item.Id === parseInt(id));
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

    if (!equipment.usageLogs) {
      equipment.usageLogs = [];
    }
    
    equipment.usageLogs.push(usageLog);
    equipment.totalHours = (equipment.totalHours || 0) + usageLog.hours;
    equipment.totalFuel = (equipment.totalFuel || 0) + usageLog.fuelUsed;
    equipment.lastUsed = usageLog.date;
    
    // Update maintenance status based on hours
    if (equipment.totalHours >= equipment.nextMaintenanceHours) {
      equipment.status = 'Maintenance Due';
}

    return { ...equipment };
  }

  async scheduleMaintenance(id, maintenanceData) {
    await this.delay(500);
    
    const equipment = this.equipment.find(item => item.Id === parseInt(id));
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

    // Initialize maintenance history if it doesn't exist
    if (!equipment.maintenanceHistory) {
      equipment.maintenanceHistory = [];
    }

    equipment.maintenanceHistory.push(maintenanceRecord);
return maintenanceRecord;
  }

  async getMaintenanceHistory() {
    await this.delay(300);
    
    const allRecords = [];
    this.equipment.forEach(equipment => {
      if (equipment.maintenanceHistory) {
        allRecords.push(...equipment.maintenanceHistory);
      }
    });
    });
return allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async updateMaintenanceRecord(id, updates) {
    await this.delay(400);
    
    for (let equipment of this.equipment) {
      if (equipment.maintenanceHistory) {
        const recordIndex = equipment.maintenanceHistory.findIndex(record => record.Id === parseInt(id));
        const recordIndex = equipment.maintenanceHistory.findIndex(record => record.Id === parseInt(id));
        if (recordIndex !== -1) {
          equipment.maintenanceHistory[recordIndex] = {
            ...equipment.maintenanceHistory[recordIndex],
            ...updates,
            updatedDate: new Date().toISOString()
          };
          return equipment.maintenanceHistory[recordIndex];
        }
      }
    }
throw new Error('Maintenance record not found');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;