import { useCallback } from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';
import { SelectOption } from '../Select';

interface UseSelectFieldProps {
  name: string;
  rules?: RegisterOptions;
  options: SelectOption[];
}

export const useSelectField = ({ name, rules, options }: UseSelectFieldProps) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  // Register the field
  register(name, rules);

  // Get current value
  const value = watch(name);

  // Handle value change
  const handleChange = useCallback((newValue: string) => {
    setValue(name, newValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [name, setValue]);

  return {
    value,
    onChange: handleChange,
    error: errors[name]?.message as string | undefined,
    options,
  };
};
