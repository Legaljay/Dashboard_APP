import React from "react";
import Select, {
  StylesConfig,
  ActionMeta,
  components,
  Options,
  GroupBase,
  MultiValue,
  SingleValue,
} from "react-select";
import { FaCheck } from "react-icons/fa";

// Improved type definitions
interface Option {
  value: string;
  label: string;
}

// Refined type handling
type SelectValue<IsMulti extends boolean> = IsMulti extends true
  ? string[]
  : string | null;

// Refined type for field prop
interface FormSelectFieldProps<IsMulti extends boolean> {
  onChange: (value: SelectValue<IsMulti>) => void;
  value: SelectValue<IsMulti>;
  name: string;
}

// Updated Props interface
interface FormSelectProps<IsMulti extends boolean = false> {
  field: FormSelectFieldProps<IsMulti>;
  options: Option[];
  placeholder?: string;
  className?: string;
  error?: string;
  isMulti?: IsMulti;
  maxSelections?: number;
  disabled?: boolean;
}

function FormSelect<IsMulti extends boolean = false>({
  field,
  options,
  placeholder = "Select...",
  className,
  error,
  isMulti = false as IsMulti,
  maxSelections = isMulti ? 3 : 1,
  disabled = false,
}: FormSelectProps<IsMulti>) {
  // Custom styles
  const customStyles: StylesConfig<Option, IsMulti, GroupBase<Option>> = {
    control: (provided, state) => ({
      ...provided,
      border: error
        ? "1px solid #ef4444 !important"
        : "1px solid #e5e7eb !important",
      backgroundColor: disabled ? "#f3f4f6" : "transparent",
      borderColor: error ? "#ef4444" : "#e5e7eb",
      boxShadow: state.isFocused
        ? `0 0 0 1px ${error ? "#ef4444" : "#6366f1"}`
        : "none",
      borderRadius: "0.5rem",
      opacity: disabled ? 0.7 : 1,
      pointerEvents: disabled ? "none" : "auto",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--bg-dropdown)",
      borderRadius: "0.5rem",
      marginTop: "0.5rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#fafafa"
        : state.isFocused
        ? "#f3f4f6"
        : "transparent",
      color: state.isSelected ? "text-gray-700" : "var(--text-primary)",
      "&:hover": {
        backgroundColor: state.isSelected ? "#fafafa" : "#f3f4f6",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--text-primary)",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--text-primary)",
    }),
  };

  // Custom option component
  const CustomOption = ({ children, ...props }: any) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{children}</span>
          {props.isSelected && (
            <span className="rounded-full p-1 shadow-lg ml-[10px] bg-blue-600">
              <FaCheck size={12} color="#fff" />
            </span>
          )}
        </div>
      </components.Option>
    );
  };

  // Improved value retrieval method with type safety
  const getValue = (): MultiValue<Option> | SingleValue<Option> => {
    if (!field.value) return isMulti ? [] : null;

    if (isMulti) {
      // Handle multi-select with array of values
      const multiValues = (field.value as string[])
        .map((value) => options.find((option) => option.value === value))
        .filter((option): option is Option => option !== undefined);

      return multiValues as MultiValue<Option>;
    } else {
      // Handle single select
      const singleValue = options.find(
        (option) => option.value === field.value
      );
      return singleValue || null;
    }
  };

  return (
    <div className="space-y-1">
      <Select<Option, IsMulti>
        value={getValue()}
        onChange={(
          newValue: MultiValue<Option> | SingleValue<Option>,
          actionMeta: ActionMeta<Option>
        ) => {
          if (isMulti) {
            // Multi-select handling
            const selectedOptions = newValue as MultiValue<Option>;
            const limitedOptions = maxSelections
              ? selectedOptions.slice(0, maxSelections)
              : selectedOptions;

            const selectedValues = limitedOptions.map((option) => option.value);

            // Explicit type assertion with type guard
            field.onChange(selectedValues as SelectValue<IsMulti>);
          } else {
            // Single select handling
            const option = newValue as SingleValue<Option>;

            // Explicit type assertion with type guard
            field.onChange(
              (option ? option.value : null) as SelectValue<IsMulti>
            );
          }

          // Handle clear action
          if (actionMeta.action === "clear") {
            field.onChange((isMulti ? [] : null) as SelectValue<IsMulti>);
          }
        }}
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        className={className}
        classNamePrefix="react-select"
        isSearchable
        isClearable
        isMulti={isMulti}
        hideSelectedOptions={false}
        isDisabled={disabled}
        isOptionDisabled={(option: Option) => {
          if (!isMulti) return false;

          const currentValues = field.value as string[];
          return (
            currentValues.length >= maxSelections &&
            !currentValues.includes(option.value)
          );
        }}
        components={{
          Option: CustomOption,
        }}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary25: "#f3f4f6",
            primary: "#6366f1",
          },
        })}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

export default React.memo(FormSelect) as typeof FormSelect;
