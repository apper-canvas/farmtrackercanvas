class CropScheduleService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_schedule_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "expected_yield_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(schedule => ({
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c?.Id || schedule.field_id_c,
        notes: schedule.notes_c,
        expectedYield: schedule.expected_yield_c,
        createdAt: schedule.created_at_c
      }));
    } catch (error) {
      console.error('Error fetching crop schedules:', error);
      throw new Error('Failed to fetch crop schedules');
    }
  }

  async getByMonth(year, month) {
    try {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "expected_yield_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
          {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(schedule => ({
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c?.Id || schedule.field_id_c,
        notes: schedule.notes_c,
        expectedYield: schedule.expected_yield_c,
        createdAt: schedule.created_at_c
      }));
    } catch (error) {
      console.error(`Error fetching crop schedules for ${year}-${month}:`, error);
      throw new Error('Failed to fetch crop schedules by month');
    }
  }

  async getBySeason(season) {
    try {
      const seasonMonths = {
        Spring: [2, 3, 4], // Mar, Apr, May
        Summer: [5, 6, 7], // Jun, Jul, Aug
        Fall: [8, 9, 10],  // Sep, Oct, Nov
        Winter: [11, 0, 1] // Dec, Jan, Feb
      };
      
      const allSchedules = await this.getAll();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return seasonMonths[season].includes(scheduleDate.getMonth());
      });
    } catch (error) {
      console.error(`Error fetching crop schedules for season ${season}:`, error);
      throw new Error('Failed to fetch crop schedules by season');
    }
  }

  async getByField(fieldId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "expected_yield_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(schedule => ({
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c?.Id || schedule.field_id_c,
        notes: schedule.notes_c,
        expectedYield: schedule.expected_yield_c,
        createdAt: schedule.created_at_c
      }));
    } catch (error) {
      console.error(`Error fetching crop schedules for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field crop schedules');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "expected_yield_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const schedule = response.data;
      if (!schedule) {
        throw new Error("Crop schedule not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c?.Id || schedule.field_id_c,
        notes: schedule.notes_c,
        expectedYield: schedule.expected_yield_c,
        createdAt: schedule.created_at_c
      };
    } catch (error) {
      console.error(`Error fetching crop schedule ${id}:`, error);
      throw new Error('Crop schedule not found');
    }
  }

  async create(scheduleData) {
    try {
      const params = {
        records: [{
          Name: `${scheduleData.cropName} ${scheduleData.type}`,
          crop_name_c: scheduleData.cropName,
          variety_c: scheduleData.variety || '',
          type_c: scheduleData.type,
          date_c: scheduleData.date,
          notes_c: scheduleData.notes || '',
          expected_yield_c: scheduleData.expectedYield || '',
          created_at_c: new Date().toISOString(),
          field_id_c: parseInt(scheduleData.fieldId)
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
          throw new Error('Failed to create crop schedule');
        }
        
        const newSchedule = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: newSchedule.Id,
          cropName: newSchedule.crop_name_c,
          variety: newSchedule.variety_c,
          type: newSchedule.type_c,
          date: newSchedule.date_c,
          fieldId: newSchedule.field_id_c?.Id || newSchedule.field_id_c,
          notes: newSchedule.notes_c,
          expectedYield: newSchedule.expected_yield_c,
          createdAt: newSchedule.created_at_c
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating crop schedule:', error);
      throw new Error('Failed to create crop schedule');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.cropName !== undefined) {
        updateData.crop_name_c = data.cropName;
        updateData.Name = `${data.cropName} ${data.type || 'Schedule'}`;
      }
      if (data.variety !== undefined) updateData.variety_c = data.variety;
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.notes !== undefined) updateData.notes_c = data.notes;
      if (data.expectedYield !== undefined) updateData.expected_yield_c = data.expectedYield;
      if (data.createdAt !== undefined) updateData.created_at_c = data.createdAt;
      if (data.fieldId !== undefined) updateData.field_id_c = parseInt(data.fieldId);
      
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
          throw new Error('Failed to update crop schedule');
        }
        
        const updatedSchedule = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: updatedSchedule.Id,
          cropName: updatedSchedule.crop_name_c,
          variety: updatedSchedule.variety_c,
          type: updatedSchedule.type_c,
          date: updatedSchedule.date_c,
          fieldId: updatedSchedule.field_id_c?.Id || updatedSchedule.field_id_c,
          notes: updatedSchedule.notes_c,
          expectedYield: updatedSchedule.expected_yield_c,
          createdAt: updatedSchedule.created_at_c
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating crop schedule ${id}:`, error);
      throw new Error('Failed to update crop schedule');
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
          throw new Error('Failed to delete crop schedule');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting crop schedule ${id}:`, error);
      throw new Error('Failed to delete crop schedule');
    }
  }

  async reschedule(id, newDate) {
    try {
      return await this.update(id, { date: newDate });
    } catch (error) {
      console.error(`Error rescheduling crop schedule ${id}:`, error);
      throw new Error('Failed to reschedule crop schedule');
    }
}
}

export default new CropScheduleService();