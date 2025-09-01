import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "status-healthy text-white",
    warning: "status-attention text-white",
    danger: "status-harvest text-white",
    info: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-200 text-gray-900",
    healthy: "status-healthy text-white",
    attention: "status-attention text-white",
    harvest: "status-harvest text-white",
    inactive: "status-inactive text-white",
  };

  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium";
  
  const badgeClasses = cn(
    baseStyles,
    variants[variant],
    className
  );

  return (
    <span
      className={badgeClasses}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;