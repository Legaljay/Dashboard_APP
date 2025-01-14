import React from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { CopyButton } from "@/components/ui/button/CopyButton";

interface AssistantIDFieldProps {
  field: any;
  form?: UseFormReturn<FieldValues>;
  selectedAssistantID: string;
}

const AssistantIDField: React.FC<AssistantIDFieldProps> = ({ field, form, selectedAssistantID }) => {
  return (
    <div className="relative">
      <input
        {...field}
        type="text"
        value={field.value}
        readOnly
        className="block px-3 py-2 w-full text-gray-600 capitalize bg-white rounded-md border border-gray-300 shadow-sm dark:border-secondary-800 dark:bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div className="flex absolute inset-y-0 right-0 items-center px-2 cursor-pointer">
        <CopyButton textToCopy={selectedAssistantID} text="Copy" />
      </div>
    </div>
  );
};

export default AssistantIDField;
