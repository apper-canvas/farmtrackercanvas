import fieldsData from "@/services/mockData/fields.json";

class FieldService {
  constructor() {
    this.fields = [...fieldsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.fields];
  }

  async getById(id) {
    await this.delay(200);
    const field = this.fields.find(f => f.Id === parseInt(id));
    if (!field) {
      throw new Error("Field not found");
    }
    return { ...field };
  }

  async create(fieldData) {
    await this.delay(400);
    const newId = Math.max(...this.fields.map(f => f.Id)) + 1;
    const newField = {
      Id: newId,
      ...fieldData,
      lastInspection: new Date().toISOString().split('T')[0],
      notes: fieldData.notes || []
    };
    this.fields.push(newField);
    return { ...newField };
  }

  async update(id, data) {
    await this.delay(300);
    const index = this.fields.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Field not found");
    }
    this.fields[index] = { ...this.fields[index], ...data };
    return { ...this.fields[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.fields.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Field not found");
    }
    this.fields.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new FieldService();