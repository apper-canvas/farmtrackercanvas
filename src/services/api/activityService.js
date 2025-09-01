import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async getAll() {
    await this.delay(300);
    return this.activities
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await this.delay(200);
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async getByFieldId(fieldId) {
    await this.delay(250);
    return this.activities
      .filter(a => a.fieldId === parseInt(fieldId))
      .map(a => ({ ...a }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async create(activityData) {
    await this.delay(300);
    const newId = Math.max(...this.activities.map(a => a.Id)) + 1;
    const newActivity = {
      Id: newId,
      ...activityData,
      fieldId: parseInt(activityData.fieldId),
      timestamp: activityData.timestamp || new Date().toISOString()
    };
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, data) {
    await this.delay(300);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    this.activities[index] = { ...this.activities[index], ...data };
    return { ...this.activities[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    this.activities.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ActivityService();