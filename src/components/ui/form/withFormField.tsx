import React, { forwardRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { FormField } from './types';

interface WithFormFieldProps {
  field: FormField;
  form: UseFormReturn<FieldValues>;
}

type FormFieldValue = {
  onChange: (value: any) => void;
  value: string;
  name: string;
};

export function withFormField<P extends { field: FormFieldValue, form: UseFormReturn<FieldValues> }>(
  WrappedComponent: React.ComponentType<P>
) {
  return forwardRef<HTMLInputElement, WithFormFieldProps>(function FormFieldHOC(
    { field, form }: WithFormFieldProps,
    ref
  ) {
    const error = form.formState.errors[field.name]?.message as string;
    
    const formField = {
      onChange: async (value: any) => {
        await form.setValue(field.name, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
        form.trigger(field.name);
      },
      value: form.watch(field.name) || "",
      name: field.name,
    };

    const componentProps = {
      field: formField,
      error,
      ref,
      ...field,
    } as unknown as P;

    return (
      <WrappedComponent
        {...componentProps}
      />
    );
  });
}

/**
 * FormPasswordInput Component
 * 
 * A higher-order component that wraps the PasswordInput component with form field functionality.
 * 
 * @component
 * 
 * @example
 * ```tsx
 * <FormPasswordInput
 *   field={{
 *     name: "password",
 *     onChange: async (value) => void,
 *     value: string
 *   }}
 *   error="Optional error message"
 *   placeholder="Enter your password"
 * />
 * ```
 * 
 * @typedef {Object} FormPasswordInputProps
 * @property {Object} field - The form field configuration object
 * @property {string} field.name - The name identifier for the form field
 * @property {(value: string) => Promise<void>} field.onChange - Async callback function when value changes
 * @property {string} field.value - Current value of the password field
 * @property {string} [error] - Optional error message to display
 * @property {string} [placeholder] - Optional placeholder text for the input
 */
// const FormPasswordInput = withFormField(({ field, error, placeholder }: { 
//   field: { 
//     onChange: (value: string) => Promise<void>; 
//     value: string; 
//     name: string; 
//   }; 
//   error?: string;
//   placeholder?: string;
// }) => (
//   <PasswordInput
//     field={field}
//     error={error}
//     placeholder={placeholder}
//   />
// ));
