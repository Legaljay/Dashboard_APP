import React, { forwardRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { cn } from "../../../lib/utils";

interface PasswordInputProps {
  field: {
    onChange: (value: any) => void;
    value: string;
    name: string;
  };
  placeholder?: string;
  className?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ field, placeholder, className = "", error }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="space-y-1">
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-transparent dark:bg-gray-800 dark:border-gray-700 text-gray-500 dark:text-white",
              error && "border-red-500",
              className
            )}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {/* {error && <span className="text-red-500 text-xs">{error}</span>} */}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default React.memo(PasswordInput);
