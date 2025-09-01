import cropSchedulesData from "@/services/mockData/cropSchedules.json";

class CropScheduleService {
  constructor() {
    this.schedules = [...cropSchedulesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.schedules];
  }

  async getByMonth(year, month) {
    await this.delay(200);
    return this.schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month;
    });
  }

  async getBySeason(season) {
    await this.delay(250);
    const seasonMonths = {
      Spring: [2, 3, 4], // Mar, Apr, May
      Summer: [5, 6, 7], // Jun, Jul, Aug
      Fall: [8, 9, 10],  // Sep, Oct, Nov
      Winter: [11, 0, 1] // Dec, Jan, Feb
    };
    
    return this.schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return seasonMonths[season].includes(scheduleDate.getMonth());
    });
  }

  async getByField(fieldId) {
    await this.delay(200);
    return this.schedules.filter(schedule => schedule.fieldId === parseInt(fieldId));
  }

  async getById(id) {
    await this.delay(150);
    const schedule = this.schedules.find(s => s.Id === parseInt(id));
    if (!schedule) {
      throw new Error("Crop schedule not found");
    }
    return { ...schedule };
  }

  async create(scheduleData) {
    await this.delay(400);
    const newId = Math.max(...this.schedules.map(s => s.Id), 0) + 1;
    const newSchedule = {
      Id: newId,
      ...scheduleData,
      createdAt: new Date().toISOString()
    };
    this.schedules.push(newSchedule);
    return { ...newSchedule };
  }

  async update(id, data) {
    await this.delay(300);
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop schedule not found");
    }
    this.schedules[index] = { ...this.schedules[index], ...data };
    return { ...this.schedules[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop schedule not found");
    }
    this.schedules.splice(index, 1);
    return true;
  }

  async reschedule(id, newDate) {
    await this.delay(250);
    return this.update(id, { date: newDate });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CropScheduleService();