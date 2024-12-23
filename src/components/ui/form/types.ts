import { z } from 'zod';
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';

export type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'custom' | 'others';

export interface Option {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  options?: Option[];
  validation?: z.ZodTypeAny;
  defaultValue?: any;
  className?: string;
  containerClassName?: string;
  fieldGroupClassName?: string;
  error?: string;
  render?: (field: any) => JSX.Element;
  customLabel?: (field: any) => JSX.Element;
  autoFocus?: boolean;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  step?: number;
  required?: boolean;
  id?: string;
}

export interface FormProps<T extends z.ZodType> {
  fields: FormField[];
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  onFormReady?: (form: UseFormReturn<z.infer<T>>) => void;
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  // defaultValues?: DefaultValues<z.infer<T>>;
  submitLabel?: string;
  className?: string;
  fieldGroupClassName?: string;
  marginTop?: string;
  loading?: boolean;
  children?: React.ReactNode;
  renderField?: (field: FormField, form: UseFormReturn<FieldValues>) => React.ReactElement;
  renderFieldGroup?: (fields: FormField[], form: UseFormReturn<FieldValues>) => React.ReactElement;
  renderHeader?: (form: UseFormReturn<FieldValues>) => React.ReactElement;
  renderFooter?: (form: UseFormReturn<FieldValues>) => React.ReactElement;
  renderButton?: (form: UseFormReturn<FieldValues>) => React.ReactElement;
  hideSubmitButton?: boolean;
  mode?: "onSubmit" | "onChange" | "onBlur" | "onTouched" | "all";
}
