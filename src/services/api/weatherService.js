class WeatherService {
  constructor() {
    this.lastUpdate = null;
    this.cachedData = null;
  }

  async getCurrentWeather() {
    // Simulate API delay
    await this.delay(500);
    
    // Cache data for 1 hour
    const now = new Date();
    if (this.cachedData && this.lastUpdate && (now - this.lastUpdate) < 60 * 60 * 1000) {
      return this.cachedData;
    }

    const weatherData = {
      lastUpdated: this.formatTime(now),
      current: {
        temperature: this.getRandomTemp(68, 78),
        feelsLike: this.getRandomTemp(70, 80),
        condition: this.getRandomCondition(),
        humidity: this.getRandomBetween(45, 75),
        windSpeed: this.getRandomBetween(3, 15),
        windDirection: this.getRandomWindDirection(),
        uvIndex: this.getRandomBetween(1, 8),
        visibility: this.getRandomBetween(8, 15),
        icon: this.getWeatherIcon()
      },
      alerts: this.generateAlerts(),
      agricultural: {
        growingDegreeDays: this.calculateGDD(),
        weeklyRainfall: this.getRandomRainfall(),
        soilMoisture: this.getRandomBetween(35, 65),
        evapotranspiration: this.getRandomBetween(0.15, 0.35)
      },
      forecast: this.generate7DayForecast(),
      fieldWorkRecommendations: this.generateFieldWorkRecommendations()
    };

    this.cachedData = weatherData;
    this.lastUpdate = now;
    
    return weatherData;
  }

  generate7DayForecast() {
    const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const forecast = [];
    
    for (let i = 0; i < 7; i++) {
      forecast.push({
        day: i < 2 ? days[i] : this.getDayName(i),
        high: this.getRandomTemp(65, 82),
        low: this.getRandomTemp(45, 65),
        humidity: this.getRandomBetween(40, 80),
        precipitation: this.getRandomRainfall(0, 1.5),
        condition: this.getRandomCondition(),
        icon: this.getWeatherIcon(),
        windSpeed: this.getRandomBetween(2, 12)
      });
    }
    
    return forecast;
  }

  generateAlerts() {
    const alerts = [];
    const temp = this.getRandomTemp(68, 78);
    const rainfall = this.getRandomRainfall();
    
    // Frost warning
    if (temp < 35) {
      alerts.push({
        severity: "severe",
        title: "Frost Warning",
        description: "Protect sensitive crops from frost damage tonight"
      });
    }
    
    // Drought conditions
    if (rainfall < 0.5) {
      alerts.push({
        severity: "moderate",
        title: "Low Precipitation Alert",
        description: "Consider irrigation for moisture-sensitive crops"
      });
    }
    
    // High wind warning
    if (this.getRandomBetween(0, 20) > 15) {
      alerts.push({
        severity: "moderate",
        title: "High Wind Advisory",
        description: "Avoid field spraying operations - wind speeds above 15 mph"
      });
    }
    
    // Heat stress warning
    if (temp > 90) {
      alerts.push({
        severity: "moderate",
        title: "Heat Stress Warning",
        description: "Monitor livestock and crops for heat stress symptoms"
      });
    }

    return alerts;
  }

  generateFieldWorkRecommendations() {
    const recommendations = [];
    const currentHour = new Date().getHours();
    const temp = this.getRandomTemp(68, 78);
    const humidity = this.getRandomBetween(45, 75);
    
    // Time-based recommendations
    if (currentHour >= 6 && currentHour <= 10) {
      recommendations.push("Optimal time for field spraying - low wind, good conditions");
    }
    
    // Weather-based recommendations
    if (temp > 75 && humidity < 60) {
      recommendations.push("Good conditions for hay cutting and drying");
    }
    
    if (temp < 70 && humidity > 70) {
      recommendations.push("Delay fungicide applications until conditions improve");
    }
    
    // Seasonal recommendations
    const month = new Date().getMonth();
    if (month >= 3 && month <= 5) { // Spring
      recommendations.push("Monitor soil temperature for planting windows");
    } else if (month >= 6 && month <= 8) { // Summer
      recommendations.push("Schedule irrigation during early morning or evening");
    } else if (month >= 9 && month <= 11) { // Fall
      recommendations.push("Track harvest conditions and grain moisture levels");
    }

    return recommendations.slice(0, 3); // Return max 3 recommendations
  }

  calculateGDD() {
    // Growing Degree Days calculation (Base 50°F)
    const baseTemp = 50;
    const high = this.getRandomTemp(65, 82);
    const low = this.getRandomTemp(45, 65);
    const avgTemp = (high + low) / 2;
    
    return Math.max(0, Math.round(avgTemp - baseTemp));
  }

  getRandomTemp(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  getRandomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  getRandomRainfall(min = 0, max = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  getRandomCondition() {
    const conditions = [
      "Clear", "Partly Cloudy", "Cloudy", "Light Rain", 
      "Showers", "Sunny", "Overcast", "Drizzle"
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  getRandomWindDirection() {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  getWeatherIcon() {
    const icons = ["Sun", "Cloud", "CloudRain", "CloudSnow", "Zap"];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  getDayName(dayOffset) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new WeatherService();