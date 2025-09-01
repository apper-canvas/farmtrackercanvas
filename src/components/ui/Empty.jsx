import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item.", 
  actionText = "Add Item",
  onAction,
  icon = "Package",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "fields":
        return {
          icon: "MapPin",
          title: "No Fields Added",
          description: "Start managing your farm by adding your first field. Track crops, monitor growth stages, and manage your agricultural operations efficiently.",
          actionText: "Add Field",
        };
      case "inspections":
        return {
          icon: "ClipboardList",
          title: "No Inspections Yet",
          description: "Record field inspections to track crop health and identify issues early.",
          actionText: "Add Inspection",
        };
      case "activities":
        return {
          icon: "Activity",
          title: "No Recent Activities",
          description: "Field activities will appear here as you perform inspections and updates.",
          actionText: null,
        };
      case "search":
        return {
          icon: "Search",
          title: "No Results Found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          actionText: null,
        };
      default:
        return { icon, title, description, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-white rounded-lg shadow-md">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={content.icon} className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{content.description}</p>
      {content.actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-forest text-white px-6 py-2 rounded-lg hover:bg-forest/90 transition-colors btn-hover"
        >
          {content.actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;