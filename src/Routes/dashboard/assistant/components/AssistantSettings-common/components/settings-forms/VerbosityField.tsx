import React, { useEffect } from 'react';
import { ChooseIcon } from "@/assets/svg";
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface VerbosityFieldProps {
  field: any;
  form: UseFormReturn<FieldValues>;
  handleVerbosityModal: () => void;
  selectedVerbosity?: string;
}

const VerbosityField: React.FC<VerbosityFieldProps> = ({
  field,
  form,
  handleVerbosityModal,
  selectedVerbosity,
}) => {
  // Update form value when selectedVerbosity changes
  useEffect(() => {
    if (selectedVerbosity) {
      form.setValue('verbose', selectedVerbosity, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedVerbosity, form]);

  const formattedValue = selectedVerbosity?.split("-")?.join(" ") || field.value;

  return (
    <>
      <div className="relative">
        <input
          {...field}
          type="text"
          value={formattedValue}
          readOnly
          className="block px-3 py-2 w-full text-gray-600 capitalize bg-white rounded-md border border-gray-300 shadow-sm dark:border-secondary-800 dark:bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div
          onClick={handleVerbosityModal}
          className="flex absolute inset-y-0 right-0 items-center px-2 cursor-pointer"
        >
          <ChooseIcon />
        </div>
      </div>
      <p className="text-gray-400 text-[11px]">
        You can change this information anytime in your "Assistant Settings"
      </p>
    </>
  );
};

export default VerbosityField;
