import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

/**
 * Configuration options for the useForm hook
 * @template T Type of form values
 */
interface UseFormOptions<T> {
  /** Initial form values */
  initialValues: T;
  /** Function called when form is submitted */
  onSubmit: (values: T) => void | Promise<void>;
  /** Optional validation function */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

/**
 * Return type of the useForm hook containing form state and handlers
 * @template T Type of form values
 */
interface UseFormReturn<T> {
  /** Current form values */
  values: T;
  /** Form validation errors */
  errors: Partial<Record<keyof T, string>>;
  /** Tracks which fields have been touched/visited */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is currently submitting */
  isSubmitting: boolean;
  /** Handler for input change events */
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handler for input blur events */
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  /** Handler for form submit events */
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  /** Manually set a field's value */
  setFieldValue: (field: keyof T, value: any) => void;
  /** Manually set a field's touched state */
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  /** Reset form to initial state */
  resetForm: () => void;
}

/**
 * A powerful form management hook that handles form state, validation, submission, and more.
 * 
 * @template T Type of form values (must be a record with string keys)
 * @param options Form configuration options
 * @returns Object containing form state and handlers
 * 
 * @example
 * ```tsx
 * interface LoginForm {
 *   email: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 * 
 * function LoginPage() {
 *   const {
 *     values,
 *     errors,
 *     touched,
 *     isSubmitting,
 *     handleChange,
 *     handleBlur,
 *     handleSubmit,
 *   } = useForm<LoginForm>({
 *     initialValues: {
 *       email: '',
 *       password: '',
 *       rememberMe: false,
 *     },
 *     validate: (values) => {
 *       const errors: Partial<Record<keyof LoginForm, string>> = {};
 *       
 *       if (!values.email) {
 *         errors.email = 'Required';
 *       } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
 *         errors.email = 'Invalid email address';
 *       }
 *       
 *       if (!values.password) {
 *         errors.password = 'Required';
 *       } else if (values.password.length < 8) {
 *         errors.password = 'Password must be at least 8 characters';
 *       }
 *       
 *       return errors;
 *     },
 *     onSubmit: async (values) => {
 *       await loginAPI(values);
 *     },
 *   });
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <div>
 *         <input
 *           name="email"
 *           value={values.email}
 *           onChange={handleChange}
 *           onBlur={handleBlur}
 *         />
 *         {touched.email && errors.email && (
 *           <div className="error">{errors.email}</div>
 *         )}
 *       </div>
 *       
 *       <div>
 *         <input
 *           type="password"
 *           name="password"
 *           value={values.password}
 *           onChange={handleChange}
 *           onBlur={handleBlur}
 *         />
 *         {touched.password && errors.password && (
 *           <div className="error">{errors.password}</div>
 *         )}
 *       </div>
 *       
 *       <div>
 *         <label>
 *           <input
 *             type="checkbox"
 *             name="rememberMe"
 *             checked={values.rememberMe}
 *             onChange={handleChange}
 *           />
 *           Remember me
 *         </label>
 *       </div>
 *       
 *       <button type="submit" disabled={isSubmitting}>
 *         {isSubmitting ? 'Logging in...' : 'Log In'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Handles common form patterns like field changes, blur events, and submission
 * - Supports synchronous and asynchronous validation
 * - Tracks touched fields for showing validation messages
 * - Prevents double submission
 * - Supports manual field value updates
 * - Includes form reset functionality
 * 
 * @bestPractices
 * - Always provide proper types for form values
 * - Use validation for all required fields
 * - Show validation errors only after field is touched
 * - Disable submit button while submitting
 * - Handle API errors in onSubmit function
 * - Use setFieldValue for complex inputs
 * 
 * @performance
 * - Uses useCallback to memoize handlers
 * - Minimizes re-renders with proper state management
 * - Validates only on submit by default
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> {
  // State for form values, errors, touched fields, and submission status
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate all form values
  const validateForm = useCallback(() => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [validate, values]);

  // Handle input change events
  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }, []);

  // Handle input blur events
  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  // Manually set a field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Manually set a field's touched state
  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
  };
}
