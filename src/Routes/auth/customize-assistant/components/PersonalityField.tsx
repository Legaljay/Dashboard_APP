import React, { useEffect } from 'react';
import { ChooseIcon } from "@/assets/svg";
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface PersonalityFieldProps {
  field: any;
  form: UseFormReturn<FieldValues>;
  handlePersonalityModal: () => void;
  selectedPersonality?: string;
}

const PersonalityField: React.FC<PersonalityFieldProps> = ({
  field,
  form,
  handlePersonalityModal,
  selectedPersonality,
}) => {
  // Update form value when selectedPersonality changes
  useEffect(() => {
    if (selectedPersonality) {
      form.setValue('personality_type', selectedPersonality, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedPersonality, form]);

  const formattedValue = selectedPersonality?.split("-")?.join(" ") || field.value || "";

  return (
    <>
      <div className="relative">
        <input
          {...field}
          type="text"
          value={formattedValue}
          readOnly
          className="block w-full px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm capitalize"
        />
        <div
          onClick={handlePersonalityModal}
          className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
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

export default PersonalityField;
