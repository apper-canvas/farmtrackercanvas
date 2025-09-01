import React from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherWidget = ({ className }) => {
  // Mock weather data - in a real app this would come from a weather API
  const weatherData = {
    current: {
      temperature: 72,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 8,
      icon: "Cloud"
    },
    forecast: [
      { day: "Today", high: 75, low: 60, icon: "Cloud", condition: "Partly Cloudy" },
      { day: "Tomorrow", high: 78, low: 62, icon: "Sun", condition: "Sunny" },
      { day: "Wed", high: 73, low: 59, icon: "CloudRain", condition: "Light Rain" },
      { day: "Thu", high: 69, low: 55, icon: "CloudRain", condition: "Showers" }
    ]
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 font-display">Weather</h3>
          <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <ApperIcon name={weatherData.current.icon} className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-3xl font-bold text-gray-900">{weatherData.current.temperature}°F</p>
                <p className="text-sm text-gray-600">{weatherData.current.condition}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Droplets" className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">{weatherData.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Wind" className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Wind</p>
              <p className="font-semibold">{weatherData.current.windSpeed} mph</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-3">4-Day Forecast</h4>
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <ApperIcon name={day.icon} className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{day.day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-900">{day.high}°</span>
                <span className="text-sm text-gray-500">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;