import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { cn } from '../../../lib/utils';

interface FormPhoneInputProps {
  field: {
    onChange: (value: string) => void;
    value: string;
    name: string;
  };
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  field,
  placeholder,
  className,
  error,
  disabled,
}) => {
  return (
    <div className='space-y-1'>
      <PhoneInput
        country={'ng'}
        value={field.value}
        onChange={(value) => field.onChange(value)}
        placeholder={placeholder}
        inputClass={cn("!rounded-lg !w-full !h-10 !text-gray-500 dark:!text-white !bg-transparent dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700 focus:!border-primary-500 dark:focus:!border-primary-400", className, error &&"!border-red-500 !border")}
        containerClass="!w-full"
        buttonClass={cn("!rounded-l-lg !bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-700", error &&"!border-red-500 !border")}
        dropdownClass="!bg-white dark:!bg-gray-800 !text-gray-500 dark:!text-white !rounded-lg"
        searchClass="!bg-white dark:!bg-gray-800 !text-gray-500 dark:!text-white"
        disabled={disabled}
        disableDropdown={disabled}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default React.memo(FormPhoneInput);
