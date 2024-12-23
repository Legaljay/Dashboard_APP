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
        className="block w-full px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm capitalize"
      />
      <div className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer">
        <CopyButton textToCopy={selectedAssistantID} text="Copy" />
      </div>
    </div>
  );
};

export default AssistantIDField;
