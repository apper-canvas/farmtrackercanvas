import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
const navigationItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard",
      current: location.pathname === "/"
    },
    {
      name: "Fields",
      href: "/fields",
      icon: "MapPin",
      current: location.pathname === "/fields"
    },
    {
      name: "Crops",
      href: "/crops",
      icon: "Sprout",
      current: location.pathname === "/crops"
    },
    {
      name: "Equipment",
      href: "/equipment",
      icon: "Wrench",
      current: location.pathname === "/equipment"
    },
    {
      name: "Financial",
      href: "/financial",
      icon: "DollarSign",
      current: location.pathname === "/financial"
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "BarChart3",
      current: location.pathname === "/reports"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "Settings",
      current: location.pathname === "/settings"
    }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-1 min-h-0 bg-forest">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-forest/90">
          <ApperIcon name="Tractor" className="w-8 h-8 text-white mr-3" />
          <span className="text-xl font-bold text-white font-display">FarmTracker Pro</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  item.current
                    ? "bg-amber text-white"
                    : "text-gray-200 hover:bg-forest/70 hover:text-white",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                )}
              >
                <ApperIcon
                  name={item.icon}
                  className={cn(
                    item.current ? "text-white" : "text-gray-300 group-hover:text-white",
                    "mr-3 flex-shrink-0 h-5 w-5"
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <ApperIcon name="Tractor" className="w-8 h-8 text-forest mr-3" />
          <span className="text-xl font-bold text-forest font-display">FarmTracker Pro</span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <ApperIcon name="Menu" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex flex-col w-64 bg-forest transform transition-transform">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-forest/90">
              <ApperIcon name="Tractor" className="w-8 h-8 text-white mr-3" />
              <span className="text-xl font-bold text-white font-display">FarmTracker Pro</span>
              <button
                type="button"
                className="ml-auto text-white hover:text-gray-200"
                onClick={() => setIsMobileOpen(false)}
              >
                <ApperIcon name="X" className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      item.current
                        ? "bg-amber text-white"
                        : "text-gray-200 hover:bg-forest/70 hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <ApperIcon
                      name={item.icon}
                      className={cn(
                        item.current ? "text-white" : "text-gray-300 group-hover:text-white",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;