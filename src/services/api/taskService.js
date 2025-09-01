class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        category: task.category_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        fieldId: task.field_id_c?.Id || task.field_id_c,
        fieldName: task.field_id_c?.Name || 'Unknown Field',
        createdDate: task.created_date_c
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "created_date_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      const task = response.data;
      if (!task) {
        throw new Error("Task not found");
      }
      
      // Transform database fields to UI format
      return {
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        category: task.category_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        fieldId: task.field_id_c?.Id || task.field_id_c,
        fieldName: task.field_id_c?.Name || 'Unknown Field',
        createdDate: task.created_date_c
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw new Error('Task not found');
    }
  }

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        category: task.category_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        fieldId: task.field_id_c?.Id || task.field_id_c,
        fieldName: task.field_id_c?.Name || 'Unknown Field',
        createdDate: task.created_date_c
      }));
    } catch (error) {
      console.error(`Error fetching tasks for field ${fieldId}:`, error);
      throw new Error('Failed to fetch field tasks');
    }
  }

  async getTodaysTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        where: [{"FieldName": "due_date_c", "Operator": "EqualTo", "Values": [today]}],
        orderBy: [{"fieldName": "priority_c", "sorttype": "DESC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        category: task.category_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        fieldId: task.field_id_c?.Id || task.field_id_c,
        fieldName: task.field_id_c?.Name || 'Unknown Field',
        createdDate: task.created_date_c
      }));
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      throw new Error('Failed to fetch today\'s tasks');
    }
  }

  async getOverdueTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        where: [
          {"FieldName": "due_date_c", "Operator": "LessThan", "Values": [today]},
          {"FieldName": "status_c", "Operator": "NotEqualTo", "Values": ["completed"]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        description: task.description_c,
        category: task.category_c,
        priority: task.priority_c,
        status: task.status_c,
        dueDate: task.due_date_c,
        fieldId: task.field_id_c?.Id || task.field_id_c,
        fieldName: task.field_id_c?.Name || 'Unknown Field',
        createdDate: task.created_date_c
      }));
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      throw new Error('Failed to fetch overdue tasks');
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title?.substring(0, 50) || 'Task',
          title_c: taskData.title,
          description_c: taskData.description,
          category_c: taskData.category,
          priority_c: taskData.priority,
          status_c: taskData.status || 'pending',
          due_date_c: taskData.dueDate,
          field_id_c: parseInt(taskData.fieldId),
          created_date_c: new Date().toISOString().split('T')[0]
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
          throw new Error('Failed to create task');
        }
        
        const newTask = successful[0].data;
        return {
          Id: newTask.Id,
          title: newTask.title_c,
          description: newTask.description_c,
          category: newTask.category_c,
          priority: newTask.priority_c,
          status: newTask.status_c,
          dueDate: newTask.due_date_c,
          fieldId: newTask.field_id_c?.Id || newTask.field_id_c,
          fieldName: newTask.field_id_c?.Name || 'Unknown Field',
          createdDate: newTask.created_date_c
        };
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async update(id, data) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      // Only include updateable fields
      if (data.title !== undefined) {
        updateData.title_c = data.title;
        updateData.Name = data.title.substring(0, 50) || 'Task';
      }
      if (data.description !== undefined) updateData.description_c = data.description;
      if (data.category !== undefined) updateData.category_c = data.category;
      if (data.priority !== undefined) updateData.priority_c = data.priority;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.dueDate !== undefined) updateData.due_date_c = data.dueDate;
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
          throw new Error('Failed to update task');
        }
        
        const updatedTask = successful[0].data;
        return {
          Id: updatedTask.Id,
          title: updatedTask.title_c,
          description: updatedTask.description_c,
          category: updatedTask.category_c,
          priority: updatedTask.priority_c,
          status: updatedTask.status_c,
          dueDate: updatedTask.due_date_c,
          fieldId: updatedTask.field_id_c?.Id || updatedTask.field_id_c,
          fieldName: updatedTask.field_id_c?.Name || 'Unknown Field',
          createdDate: updatedTask.created_date_c
        };
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw new Error('Failed to update task');
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
          throw new Error('Failed to delete task');
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw new Error('Failed to delete task');
    }
  }

  async toggleComplete(id) {
    try {
      // First get current task to check status
      const currentTask = await this.getById(id);
      const newStatus = currentTask.status === 'completed' ? 'pending' : 'completed';
      
      return await this.update(id, { status: newStatus });
    } catch (error) {
      console.error(`Error toggling task completion ${id}:`, error);
      throw new Error('Failed to update task status');
    }
  }
}

export default new TaskService();