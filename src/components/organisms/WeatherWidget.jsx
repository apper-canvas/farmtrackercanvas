import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import weatherService from "@/services/api/weatherService";
import ApperIcon from "@/components/ApperIcon";

const WeatherWidget = ({ className }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeatherData();
    
    // Set up hourly updates
    const interval = setInterval(loadWeatherData, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);

  const loadWeatherData = async () => {
    try {
      setError("");
      const data = await weatherService.getCurrentWeather();
      
      // Check for new alerts
      if (data.alerts && data.alerts.length > 0) {
        data.alerts.forEach(alert => {
          if (alert.severity === "severe") {
            toast.warning(`Weather Alert: ${alert.title}`);
          }
        });
      }
      
      setWeatherData(data);
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Weather error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-display">Weather</h3>
            <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card className={className}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 font-display">Weather</h3>
            <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <ApperIcon name="CloudOff" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load weather data</p>
            <button 
              onClick={loadWeatherData}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 font-display">Agricultural Weather</h3>
          <div className="flex items-center space-x-2">
            <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Updated {weatherData.lastUpdated}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {/* Weather Alerts Banner */}
        {weatherData.alerts && weatherData.alerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            {weatherData.alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-2">
                <ApperIcon 
                  name={alert.severity === "severe" ? "AlertTriangle" : "Info"} 
                  className={`w-4 h-4 mt-0.5 ${
                    alert.severity === "severe" ? "text-amber-600" : "text-blue-600"
                  }`} 
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Conditions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ApperIcon name={weatherData.current.icon} className="w-12 h-12 text-blue-500" />
            <div>
              <p className="text-4xl font-bold text-gray-900">{weatherData.current.temperature}°F</p>
              <p className="text-sm text-gray-600">{weatherData.current.condition}</p>
              <p className="text-xs text-gray-500">Feels like {weatherData.current.feelsLike}°F</p>
            </div>
          </div>
        </div>

        {/* Current Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
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
              <p className="font-semibold">{weatherData.current.windSpeed} mph {weatherData.current.windDirection}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Thermometer" className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">UV Index</p>
              <p className="font-semibold">{weatherData.current.uvIndex}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Eye" className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Visibility</p>
              <p className="font-semibold">{weatherData.current.visibility} mi</p>
            </div>
          </div>
        </div>

        {/* Agricultural Metrics */}
        <div className="bg-green-50 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-green-800">Crop Conditions</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-600">Growing Degree Days</p>
              <p className="font-semibold text-green-800">{weatherData.agricultural.growingDegreeDays}</p>
              <p className="text-xs text-green-600">Base 50°F</p>
            </div>
            <div>
              <p className="text-sm text-green-600">Weekly Rainfall</p>
              <p className="font-semibold text-green-800">{weatherData.agricultural.weeklyRainfall}"</p>
              <p className="text-xs text-green-600">Last 7 days</p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">7-Day Forecast</h4>
          <div className="space-y-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <ApperIcon name={day.icon} className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">{day.day}</span>
                    {day.precipitation > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <ApperIcon name="CloudRain" className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">{day.precipitation}" rain</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-900">{day.high}°</span>
                  <span className="text-sm text-gray-500">{day.low}°</span>
                  <span className="text-xs text-gray-400 w-8">{day.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Work Recommendations */}
        {weatherData.fieldWorkRecommendations && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Field Work Recommendations</h4>
            <ul className="space-y-1">
              {weatherData.fieldWorkRecommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                  <ApperIcon name="CheckCircle" className="w-3 h-3 text-blue-600 mt-0.5" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;