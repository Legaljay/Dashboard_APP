import React, { useCallback, useMemo, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  useForm,
  DefaultValues,
  Path,
  Controller,
  UseFormReturn,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProps, FormField, FormRef } from "./types";
import { cn } from "../../../lib/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const FormFieldComponent = React.memo(
  ({
    field,
    form,
    loading,
    renderField,
  }: {
    field: FormField;
    form: UseFormReturn<FieldValues>;
    loading: boolean;
    renderField?: (
      field: FormField,
      form: UseFormReturn<FieldValues>
    ) => React.ReactElement;
  }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = useCallback((e: React.MouseEvent) => {
      e.preventDefault(); // Prevent form submission
      setShowPassword(!showPassword);
    }, [showPassword]);
    
    const {
      register,
      formState: { errors, touchedFields },
      control,
    } = form;
    const error = errors[field.name]?.message as string;
    const isTouched = touchedFields[field.name];

    if (field.type === "custom") {
      if (renderField) {
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField, fieldState: { error } }) =>
              renderField({ ...field, ...controllerField }, form)
            }
          />
        );
      }
      return <div />;
    }

    const commonProps = {
      id: field.name,
      placeholder: field.placeholder,
      disabled: loading || field.disabled,
      autoFocus: field.autoFocus,
      className: cn(
        "w-full px-3 py-2 border rounded-lg border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none",
        "bg-white dark:bg-gray-800",
        error && isTouched ? "border-red-500" : "dark:border-gray-700",
        field.className
      ),
      ...register(field.name),
    };

    switch (field.type) {
      case "select":
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return <textarea {...commonProps} rows={field.rows}/>;

      case "checkbox":
        return (
          <input
            type="checkbox"
            {...register(field.name)}
            disabled={loading || field.disabled}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500",
              field.className
            )}
          />
        );

      case "radio":
        return field.options?.map((option) => (
          <label key={option.value} className="inline-flex items-center mr-4">
            <input
              type="radio"
              {...register(field.name)}
              value={option.value}
              disabled={loading || field.disabled}
              className={cn(
                "h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-secondary-700",
                field.className
              )}
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
              {option.label}
            </span>
          </label>
        ));

      case "password":
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        );
      
      case "others":
        return <div>{field.render && field.render(field)}</div>

      default:
        return <input type={field.type} {...commonProps} />;
    }
  }
);

FormFieldComponent.displayName = "FormFieldComponent";

const FormComponent = forwardRef(<T extends z.ZodType>({
  fields,
  onSubmit,
  onFormReady,
  schema,
  defaultValues,
  submitLabel = "Submit",
  className = "",
  fieldGroupClassName = "",
  loading = false,
  children,
  renderField,
  renderFieldGroup,
  renderHeader,
  renderFooter,
  renderButton,
  hideSubmitButton = false,
  marginTop, 
  mode = "onTouched",
}: FormProps<T>, ref: React.Ref<FormRef>) => {
  type FormData = z.infer<T>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<FormData>,
    mode,
  });

  useImperativeHandle(ref, () => ({
    submit: form.handleSubmit(onSubmit),
  }));

  useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const formClassName = useMemo(
    () =>
      cn(
        "w-full rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg",
        "border border-gray-200 dark:border-gray-700",
        className
      ),
    [className]
  );

  const buttonClassName = useMemo(
    () =>
      cn(
        "w-full rounded-lg bg-primary-500 px-4 py-2 text-white",
        "hover:bg-primary-600 focus:outline-none focus:ring-2",
        "focus:ring-primary-500 focus:ring-offset-2",
        "dark:bg-primary-600 dark:hover:bg-primary-700",
        "dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800",
        "disabled:opacity-50 disabled:cursor-not-allowed"
      ),
    []
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={formClassName}
      noValidate
    >
      {renderHeader && <div className="mb-6">{renderHeader(form)}</div>}

      <div className={cn("space-y-4", fieldGroupClassName)}>
        {renderFieldGroup
          ? renderFieldGroup(fields, form)
          : fields.map((field) => (
              <div
                key={field.name}
                className={cn("space-y-1", field.containerClassName)}
              >
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {field.customLabel ? field.customLabel(field) : field.label}
                </label>
                {field.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {field.description}
                  </p>
                )}
                <FormFieldComponent
                  field={field}
                  form={form}
                  loading={loading}
                  renderField={renderField}
                />
                {errors[field.name] && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors[field.name]?.message as string}
                  </p>
                )}
              </div>
            ))}
        {children}
      </div>

      {!hideSubmitButton && (
        <div className="mt-6">
          <button
            type="submit"
            className={buttonClassName}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </button>
        </div>
      )}

      {renderButton && <div className={marginTop || "mt-6"}>{renderButton(form)}</div>}

      {renderFooter && <div className="mt-6">{renderFooter(form)}</div>}
    </form>
  );
});

export const Form = React.memo(FormComponent) as typeof FormComponent;
