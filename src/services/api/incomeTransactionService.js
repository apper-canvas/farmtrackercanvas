class IncomeTransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'income_transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(income => ({
        Id: income.Id,
        name: income.name_c,
        date: income.date_c,
        amount: income.amount_c,
        source: income.source_c,
        description: income.description_c,
        fieldId: income.field_id_c?.Id || income.field_id_c,
        fieldName: income.field_id_c?.Name || 'All Fields',
        createdOn: income.CreatedOn,
        modifiedOn: income.ModifiedOn
      }));
    } catch (error) {
      console.error('Error fetching income transactions:', error);
      throw new Error('Failed to fetch income transactions');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const income = response.data;
      if (!income) {
        throw new Error("Income transaction not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: income.Id,
        name: income.name_c,
        date: income.date_c,
        amount: income.amount_c,
        source: income.source_c,
        description: income.description_c,
        fieldId: income.field_id_c?.Id || income.field_id_c,
        fieldName: income.field_id_c?.Name || 'All Fields',
        createdOn: income.CreatedOn,
        modifiedOn: income.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching income transaction ${id}:`, error);
      throw new Error('Income transaction not found');
    }
  }

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data.map(income => ({
        Id: income.Id,
        name: income.name_c,
        date: income.date_c,
        amount: income.amount_c,
        source: income.source_c,
        description: income.description_c,
        fieldId: income.field_id_c?.Id || income.field_id_c,
        fieldName: income.field_id_c?.Name || 'All Fields',
        createdOn: income.CreatedOn,
        modifiedOn: income.ModifiedOn
      }));
    } catch (error) {
      console.error(`Error fetching income transactions for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field income transactions');
    }
  }

  async getTotalBySource() {
    try {
      const incomes = await this.getAll();
      const totals = {};
      
      incomes.forEach(income => {
        const source = income.source || 'Other';
        totals[source] = (totals[source] || 0) + parseFloat(income.amount || 0);
      });
      
      return totals;
    } catch (error) {
      console.error('Error calculating income totals by source:', error);
      throw new Error('Failed to calculate income totals');
    }
  }

  async create(incomeData) {
    try {
      const params = {
        records: [{
          Name: incomeData.name?.substring(0, 80) || 'Income',
          name_c: incomeData.name,
          date_c: incomeData.date,
          amount_c: parseFloat(incomeData.amount),
          source_c: incomeData.source,
          description_c: incomeData.description,
          field_id_c: incomeData.fieldId ? parseInt(incomeData.fieldId) : null
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
          throw new Error('Failed to create income transaction');
        }
        
        const newIncome = successful[0].data;
        return {
          Id: newIncome.Id,
          name: newIncome.name_c,
          date: newIncome.date_c,
          amount: newIncome.amount_c,
          source: newIncome.source_c,
          description: newIncome.description_c,
          fieldId: newIncome.field_id_c?.Id || newIncome.field_id_c,
          fieldName: newIncome.field_id_c?.Name || 'All Fields',
          createdOn: newIncome.CreatedOn,
          modifiedOn: newIncome.ModifiedOn
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating income transaction:', error);
      throw new Error('Failed to create income transaction');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.name !== undefined) {
        updateData.name_c = data.name;
        updateData.Name = data.name.substring(0, 80) || 'Income';
      }
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.amount !== undefined) updateData.amount_c = parseFloat(data.amount);
      if (data.source !== undefined) updateData.source_c = data.source;
      if (data.description !== undefined) updateData.description_c = data.description;
      if (data.fieldId !== undefined) updateData.field_id_c = data.fieldId ? parseInt(data.fieldId) : null;
      
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
          throw new Error('Failed to update income transaction');
        }
        
        const updatedIncome = successful[0].data;
        return {
          Id: updatedIncome.Id,
          name: updatedIncome.name_c,
          date: updatedIncome.date_c,
          amount: updatedIncome.amount_c,
          source: updatedIncome.source_c,
          description: updatedIncome.description_c,
          fieldId: updatedIncome.field_id_c?.Id || updatedIncome.field_id_c,
          fieldName: updatedIncome.field_id_c?.Name || 'All Fields',
          createdOn: updatedIncome.CreatedOn,
          modifiedOn: updatedIncome.ModifiedOn
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating income transaction ${id}:`, error);
      throw new Error('Failed to update income transaction');
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
          throw new Error('Failed to delete income transaction');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting income transaction ${id}:`, error);
      throw new Error('Failed to delete income transaction');
    }
  }
}

export default new IncomeTransactionService();