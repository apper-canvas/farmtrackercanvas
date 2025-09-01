class InspectionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'inspection_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(inspection => ({
        Id: inspection.Id,
        fieldId: inspection.field_id_c?.Id || inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c?.Id || inspection.user_id_c
      }));
    } catch (error) {
      console.error('Error fetching inspections:', error);
      throw new Error('Failed to fetch inspections');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const inspection = response.data;
      if (!inspection) {
        throw new Error("Inspection not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: inspection.Id,
        fieldId: inspection.field_id_c?.Id || inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c?.Id || inspection.user_id_c
      };
    } catch (error) {
      console.error(`Error fetching inspection ${id}:`, error);
      throw new Error('Inspection not found');
    }
  }

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(inspection => ({
        Id: inspection.Id,
        fieldId: inspection.field_id_c?.Id || inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c?.Id || inspection.user_id_c
      }));
    } catch (error) {
      console.error(`Error fetching inspections for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field inspections');
    }
  }

  async create(inspectionData) {
    try {
      const params = {
        records: [{
          Name: `Inspection ${new Date(inspectionData.date).toLocaleDateString()}`,
          date_c: inspectionData.date || new Date().toISOString(),
          notes_c: inspectionData.notes,
          status_c: inspectionData.status,
          user_id_c: inspectionData.userId,
          field_id_c: parseInt(inspectionData.fieldId)
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
          throw new Error('Failed to create inspection');
        }
        
        const newInspection = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: newInspection.Id,
          fieldId: newInspection.field_id_c?.Id || newInspection.field_id_c,
          date: newInspection.date_c,
          notes: newInspection.notes_c,
          status: newInspection.status_c,
          userId: newInspection.user_id_c?.Id || newInspection.user_id_c
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating inspection:', error);
      throw new Error('Failed to create inspection');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.notes !== undefined) updateData.notes_c = data.notes;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.userId !== undefined) updateData.user_id_c = data.userId;
      if (data.fieldId !== undefined) updateData.field_id_c = parseInt(data.fieldId);
      if (data.date !== undefined) updateData.Name = `Inspection ${new Date(data.date).toLocaleDateString()}`;
      
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
          throw new Error('Failed to update inspection');
        }
        
        const updatedInspection = successful[0].data;
        // Transform database fields to UI format
        return {
          Id: updatedInspection.Id,
          fieldId: updatedInspection.field_id_c?.Id || updatedInspection.field_id_c,
          date: updatedInspection.date_c,
          notes: updatedInspection.notes_c,
          status: updatedInspection.status_c,
          userId: updatedInspection.user_id_c?.Id || updatedInspection.user_id_c
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating inspection ${id}:`, error);
      throw new Error('Failed to update inspection');
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
          throw new Error('Failed to delete inspection');
        }
        
        return successful.length > 0;
      }
      
      return true;
} catch (error) {
      console.error(`Error deleting inspection ${id}:`, error);
      throw new Error('Failed to delete inspection');
    }
  }
}

export default new InspectionService();