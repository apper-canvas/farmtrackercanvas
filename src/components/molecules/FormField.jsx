import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  type = "input",
  className,
  options = [],
  ...props 
}) => {
  const fieldClasses = cn("mb-4", className);

  if (type === "select") {
    return (
      <div className={fieldClasses}>
        <Select {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  if (type === "textarea") {
    const { label, error, required, ...textareaProps } = props;
    const textareaId = props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={fieldClasses}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fresh focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...textareaProps}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className={fieldClasses}>
      <Input {...props} />
    </div>
  );
};

export default FormField;