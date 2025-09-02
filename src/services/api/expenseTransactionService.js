class ExpenseTransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'expense_transaction_c';
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
          {"field": {"Name": "category_c"}},
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
      return response.data.map(expense => ({
        Id: expense.Id,
        name: expense.name_c,
        date: expense.date_c,
        amount: expense.amount_c,
        category: expense.category_c,
        description: expense.description_c,
        fieldId: expense.field_id_c?.Id || expense.field_id_c,
        fieldName: expense.field_id_c?.Name || 'All Fields',
        createdOn: expense.CreatedOn,
        modifiedOn: expense.ModifiedOn
      }));
    } catch (error) {
      console.error('Error fetching expense transactions:', error);
      throw new Error('Failed to fetch expense transactions');
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
          {"field": {"Name": "category_c"}},
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
      
      const expense = response.data;
      if (!expense) {
        throw new Error("Expense transaction not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: expense.Id,
        name: expense.name_c,
        date: expense.date_c,
        amount: expense.amount_c,
        category: expense.category_c,
        description: expense.description_c,
        fieldId: expense.field_id_c?.Id || expense.field_id_c,
        fieldName: expense.field_id_c?.Name || 'All Fields',
        createdOn: expense.CreatedOn,
        modifiedOn: expense.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching expense transaction ${id}:`, error);
      throw new Error('Expense transaction not found');
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
          {"field": {"Name": "category_c"}},
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
      
      return response.data.map(expense => ({
        Id: expense.Id,
        name: expense.name_c,
        date: expense.date_c,
        amount: expense.amount_c,
        category: expense.category_c,
        description: expense.description_c,
        fieldId: expense.field_id_c?.Id || expense.field_id_c,
        fieldName: expense.field_id_c?.Name || 'All Fields',
        createdOn: expense.CreatedOn,
        modifiedOn: expense.ModifiedOn
      }));
    } catch (error) {
      console.error(`Error fetching expense transactions for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field expense transactions');
    }
  }

  async getTotalByCategory() {
    try {
      const expenses = await this.getAll();
      const totals = {};
      
      expenses.forEach(expense => {
        const category = expense.category || 'Other';
        totals[category] = (totals[category] || 0) + parseFloat(expense.amount || 0);
      });
      
      return totals;
    } catch (error) {
      console.error('Error calculating expense totals by category:', error);
      throw new Error('Failed to calculate expense totals');
    }
  }

  async create(expenseData) {
    try {
      const params = {
        records: [{
          Name: expenseData.name?.substring(0, 80) || 'Expense',
          name_c: expenseData.name,
          date_c: expenseData.date,
          amount_c: parseFloat(expenseData.amount),
          category_c: expenseData.category,
          description_c: expenseData.description,
          field_id_c: expenseData.fieldId ? parseInt(expenseData.fieldId) : null
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
          throw new Error('Failed to create expense transaction');
        }
        
        const newExpense = successful[0].data;
        return {
          Id: newExpense.Id,
          name: newExpense.name_c,
          date: newExpense.date_c,
          amount: newExpense.amount_c,
          category: newExpense.category_c,
          description: newExpense.description_c,
          fieldId: newExpense.field_id_c?.Id || newExpense.field_id_c,
          fieldName: newExpense.field_id_c?.Name || 'All Fields',
          createdOn: newExpense.CreatedOn,
          modifiedOn: newExpense.ModifiedOn
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating expense transaction:', error);
      throw new Error('Failed to create expense transaction');
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
        updateData.Name = data.name.substring(0, 80) || 'Expense';
      }
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.amount !== undefined) updateData.amount_c = parseFloat(data.amount);
      if (data.category !== undefined) updateData.category_c = data.category;
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
          throw new Error('Failed to update expense transaction');
        }
        
        const updatedExpense = successful[0].data;
        return {
          Id: updatedExpense.Id,
          name: updatedExpense.name_c,
          date: updatedExpense.date_c,
          amount: updatedExpense.amount_c,
          category: updatedExpense.category_c,
          description: updatedExpense.description_c,
          fieldId: updatedExpense.field_id_c?.Id || updatedExpense.field_id_c,
          fieldName: updatedExpense.field_id_c?.Name || 'All Fields',
          createdOn: updatedExpense.CreatedOn,
          modifiedOn: updatedExpense.ModifiedOn
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating expense transaction ${id}:`, error);
      throw new Error('Failed to update expense transaction');
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
          throw new Error('Failed to delete expense transaction');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting expense transaction ${id}:`, error);
      throw new Error('Failed to delete expense transaction');
    }
  }
}

export default new ExpenseTransactionService();