import React from "react";
import { cn } from "../../../lib/utils";

interface FormFieldValue {
  onChange: (value: string) => void;
  value: string;
  name: string;
}

interface FormInputProps {
  field: FormFieldValue;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  field,
  type = "text",
  placeholder,
  className,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <input
        type={type}
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
          "bg-white dark:bg-gray-800 text-gray-500 dark:text-white",
          error ? "border-red-500" : "border-gray-300 dark:border-gray-700",
          disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default React.memo(FormInput);
