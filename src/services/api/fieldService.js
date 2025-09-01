class FieldService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'field_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_inspection_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(field => ({
        Id: field.Id,
        name: field.Name,
        size: field.size_c,
        cropType: field.crop_type_c,
        plantingDate: field.planting_date_c,
        growthStage: field.growth_stage_c,
        status: field.status_c,
        lastInspection: field.last_inspection_c,
        notes: field.notes_c ? field.notes_c.split('\n') : []
      }));
    } catch (error) {
      console.error('Error fetching fields:', error);
      throw new Error('Failed to fetch fields');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_inspection_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const field = response.data;
      if (!field) {
        throw new Error("Field not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: field.Id,
        name: field.Name,
        size: field.size_c,
        cropType: field.crop_type_c,
        plantingDate: field.planting_date_c,
        growthStage: field.growth_stage_c,
        status: field.status_c,
        lastInspection: field.last_inspection_c,
        notes: field.notes_c ? field.notes_c.split('\n') : []
      };
    } catch (error) {
      console.error(`Error fetching field ${id}:`, error);
      throw new Error('Field not found');
    }
  }

async create(fieldData) {
    try {
      const params = {
        records: [{
          Name: fieldData.name,
          size_c: parseFloat(fieldData.size),
          crop_type_c: fieldData.cropType,
          planting_date_c: this.safeISODate(fieldData.plantingDate),
          growth_stage_c: fieldData.growthStage,
          status_c: fieldData.status,
          last_inspection_c: fieldData.lastInspection || new Date().toISOString().split('T')[0],
          notes_c: Array.isArray(fieldData.notes) ? fieldData.notes.join('\n') : (fieldData.notes || '')
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
          throw new Error('Failed to create field');
        }
        
        const newField = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: newField.Id,
          name: newField.Name,
          size: newField.size_c,
          cropType: newField.crop_type_c,
          plantingDate: newField.planting_date_c,
          growthStage: newField.growth_stage_c,
          status: newField.status_c,
          lastInspection: newField.last_inspection_c,
          notes: newField.notes_c ? newField.notes_c.split('\n') : []
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating field:', error);
      throw new Error('Failed to create field');
    }
  }

async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.name !== undefined) updateData.Name = data.name;
      if (data.size !== undefined) updateData.size_c = parseFloat(data.size);
      if (data.cropType !== undefined) updateData.crop_type_c = data.cropType;
      if (data.plantingDate !== undefined) updateData.planting_date_c = this.safeISODate(data.plantingDate);
      if (data.growthStage !== undefined) updateData.growth_stage_c = data.growthStage;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.lastInspection !== undefined) updateData.last_inspection_c = data.lastInspection;
      if (data.notes !== undefined) updateData.notes_c = Array.isArray(data.notes) ? data.notes.join('\n') : (data.notes || '');
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
          throw new Error('Failed to update field');
        }
        
        const updatedField = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: updatedField.Id,
          name: updatedField.Name,
          size: updatedField.size_c,
          cropType: updatedField.crop_type_c,
          plantingDate: updatedField.planting_date_c,
          growthStage: updatedField.growth_stage_c,
          status: updatedField.status_c,
          lastInspection: updatedField.last_inspection_c,
          notes: updatedField.notes_c ? updatedField.notes_c.split('\n') : []
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating field ${id}:`, error);
      throw new Error('Failed to update field');
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
          throw new Error('Failed to delete field');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting field ${id}:`, error);
      throw new Error('Failed to delete field');
}
  }

  // Utility function for safe date conversion
  safeISODate(dateValue) {
    if (!dateValue || dateValue === '') return null;
    
    try {
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) return null;
      return date.toISOString();
    } catch (error) {
      console.error('Invalid date format:', dateValue);
      return null;
    }
  }
}

export default new FieldService();