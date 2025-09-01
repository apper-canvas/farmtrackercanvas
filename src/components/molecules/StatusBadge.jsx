import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, showIcon = true, className }) => {
  const statusConfig = {
    healthy: {
      variant: "healthy",
      icon: "CheckCircle",
      text: "Healthy"
    },
    "needs attention": {
      variant: "attention",
      icon: "AlertTriangle",
      text: "Needs Attention"
    },
    "ready to harvest": {
      variant: "harvest",
      icon: "Harvest",
      text: "Ready to Harvest"
    },
    inactive: {
      variant: "inactive",
      icon: "Circle",
      text: "Inactive"
    },
    planted: {
      variant: "success",
      icon: "Sprout",
      text: "Planted"
    },
    growing: {
      variant: "info",
      icon: "Leaf",
      text: "Growing"
    },
    flowering: {
      variant: "warning",
      icon: "Flower",
      text: "Flowering"
    },
    harvested: {
      variant: "secondary",
      icon: "Package",
      text: "Harvested"
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;

  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && (
        <ApperIcon 
          name={config.icon} 
          size={12} 
          className="mr-1" 
        />
      )}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;