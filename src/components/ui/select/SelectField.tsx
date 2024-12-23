import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectProps } from './Select';

interface SelectFieldProps<T = any> extends Omit<SelectProps<string>, 'value' | 'onChange'> {
  name: string;
}

export const SelectField = React.memo(<T,>({ name, ...props }: SelectFieldProps<T>) => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref } }) => (
        <Select
          {...props}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={errors[name]?.message as string}
        />
      )}
    />
  );
});

SelectField.displayName = 'SelectField';
