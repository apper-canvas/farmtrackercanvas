import inspectionsData from "@/services/mockData/inspections.json";

class InspectionService {
  constructor() {
    this.inspections = [...inspectionsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.inspections];
  }

  async getById(id) {
    await this.delay(200);
    const inspection = this.inspections.find(i => i.Id === parseInt(id));
    if (!inspection) {
      throw new Error("Inspection not found");
    }
    return { ...inspection };
  }

  async getByFieldId(fieldId) {
    await this.delay(250);
    return this.inspections
      .filter(i => i.fieldId === parseInt(fieldId))
      .map(i => ({ ...i }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(inspectionData) {
    await this.delay(400);
    const newId = Math.max(...this.inspections.map(i => i.Id)) + 1;
    const newInspection = {
      Id: newId,
      ...inspectionData,
      fieldId: parseInt(inspectionData.fieldId),
      date: inspectionData.date || new Date().toISOString()
    };
    this.inspections.push(newInspection);
    return { ...newInspection };
  }

  async update(id, data) {
    await this.delay(300);
    const index = this.inspections.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Inspection not found");
    }
    this.inspections[index] = { ...this.inspections[index], ...data };
    return { ...this.inspections[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.inspections.findIndex(i => i.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Inspection not found");
    }
    this.inspections.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new InspectionService();