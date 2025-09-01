import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  icon,
  iconPosition = "left",
  children,
  disabled,
  loading,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-forest text-white hover:bg-forest/90 border-forest",
    primary: "bg-fresh text-white hover:bg-fresh/90 border-fresh",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border-gray-200",
    accent: "bg-amber text-white hover:bg-amber/90 border-amber",
    outline: "border-forest text-forest hover:bg-forest hover:text-white",
    ghost: "hover:bg-gray-100 text-gray-900",
    danger: "bg-red-500 text-white hover:bg-red-600 border-red-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-lg",
    xl: "h-14 px-8 py-4 text-xl",
    icon: "h-10 w-10",
  };

  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 border btn-hover disabled:opacity-50 disabled:pointer-events-none";
  
  const buttonClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const iconSize = size === "sm" ? 16 : size === "lg" || size === "xl" ? 20 : 18;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
          Loading...
        </>
      );
    }

    if (size === "icon" && icon) {
      return <ApperIcon name={icon} size={iconSize} />;
    }

    if (icon && children) {
      return iconPosition === "left" ? (
        <>
          <ApperIcon name={icon} size={iconSize} className="mr-2" />
          {children}
        </>
      ) : (
        <>
          {children}
          <ApperIcon name={icon} size={iconSize} className="ml-2" />
        </>
      );
    }

    return children;
  };

  return (
    <button
      className={buttonClasses}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = "Button";

export default Button;