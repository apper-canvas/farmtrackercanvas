class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(activity => ({
        Id: activity.Id,
        fieldId: activity.field_id_c?.Id || activity.field_id_c,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw new Error('Failed to fetch activities');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const activity = response.data;
      if (!activity) {
        throw new Error("Activity not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: activity.Id,
        fieldId: activity.field_id_c?.Id || activity.field_id_c,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c
      };
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error);
      throw new Error('Activity not found');
    }
  }

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}],
        orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(activity => ({
        Id: activity.Id,
        fieldId: activity.field_id_c?.Id || activity.field_id_c,
        type: activity.type_c,
        description: activity.description_c,
        timestamp: activity.timestamp_c
      }));
    } catch (error) {
      console.error(`Error fetching activities for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field activities');
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Name: activityData.description?.substring(0, 50) || 'Activity',
          type_c: activityData.type,
          description_c: activityData.description,
          timestamp_c: activityData.timestamp || new Date().toISOString(),
          field_id_c: parseInt(activityData.fieldId)
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
          throw new Error('Failed to create activity');
        }
        
        const newActivity = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: newActivity.Id,
          fieldId: newActivity.field_id_c?.Id || newActivity.field_id_c,
          type: newActivity.type_c,
          description: newActivity.description_c,
          timestamp: newActivity.timestamp_c
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.description !== undefined) {
        updateData.description_c = data.description;
        updateData.Name = data.description.substring(0, 50) || 'Activity';
      }
      if (data.timestamp !== undefined) updateData.timestamp_c = data.timestamp;
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
          throw new Error('Failed to update activity');
        }
        
        const updatedActivity = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: updatedActivity.Id,
          fieldId: updatedActivity.field_id_c?.Id || updatedActivity.field_id_c,
          type: updatedActivity.type_c,
          description: updatedActivity.description_c,
          timestamp: updatedActivity.timestamp_c
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating activity ${id}:`, error);
      throw new Error('Failed to update activity');
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
          throw new Error('Failed to delete activity');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error);
      throw new Error('Failed to delete activity');
    }
  }
}

export default new ActivityService();