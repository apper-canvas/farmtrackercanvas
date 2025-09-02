import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "default" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Unable to connect to server. Please check your internet connection and try again.",
        };
      case "notFound":
        return {
          icon: "Search",
          title: "Not Found", 
          description: "The requested item could not be found.",
        };
      case "permission":
        return {
          icon: "Lock",
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
        };
      case "server":
        return {
          icon: "Server",
          title: "Server Error",
          description: "The server encountered an error. Please try again later.",
        };
      case "timeout":
        return {
          icon: "Clock",
          title: "Request Timeout",
          description: "The request took too long to complete. Please try again.",
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Error",
          description: message,
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-lg shadow-md">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-forest text-white px-6 py-2 rounded-lg hover:bg-forest/90 transition-colors btn-hover"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;