// Settings Service - ApperClient Integration
// Manages settings_c table operations for farm and application preferences

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.tableName = 'settings_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  // Get all settings
  async getAll() {
    await delay(300);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "description_c"}}
        ],
        orderBy: [{"fieldName": "name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Settings fetch failed:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching settings:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Get setting by ID
  async getById(id) {
    await delay(200);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "description_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error("Setting fetch failed:", response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching setting ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Get setting by name (key)
  async getByName(settingName) {
    await delay(250);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: [{"FieldName": "name_c", "Operator": "EqualTo", "Values": [settingName]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Settings search failed:", response.message);
        throw new Error(response.message);
      }

      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error(`Error searching setting ${settingName}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Create new setting
  async create(settingData) {
    await delay(400);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          name_c: settingData.name_c || "",
          value_c: settingData.value_c || "",
          description_c: settingData.description_c || ""
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Setting creation failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} settings:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating setting:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Update existing setting
  async update(id, settingData) {
    await delay(400);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: settingData.name_c || "",
          value_c: settingData.value_c || "",
          description_c: settingData.description_c || ""
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Setting update failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} settings:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating setting:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Update or create setting by name
  async upsert(settingName, value, description = "") {
    try {
      const existingSetting = await this.getByName(settingName);
      
      if (existingSetting) {
        return await this.update(existingSetting.Id, {
          name_c: settingName,
          value_c: value,
          description_c: description
        });
      } else {
        return await this.create({
          name_c: settingName,
          value_c: value,
          description_c: description
        });
      }
    } catch (error) {
      console.error(`Error upserting setting ${settingName}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  // Delete setting
  async delete(id) {
    await delay(300);
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Setting deletion failed:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} settings:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length === 1;
      }
    } catch (error) {
      console.error("Error deleting setting:", error?.response?.data?.message || error);
      throw error;
    }
  }

  // Get settings by category (helper method)
  async getByCategory(category) {
    try {
      const allSettings = await this.getAll();
      return allSettings.filter(setting => 
        setting.name_c && setting.name_c.toLowerCase().includes(category.toLowerCase())
      );
    } catch (error) {
      console.error(`Error fetching settings for category ${category}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new SettingsService();