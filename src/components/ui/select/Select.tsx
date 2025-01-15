import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps<T extends string = string> {
  label?: string;
  options: SelectOption[];
  value?: T | T[] | string | string[];
  onChange: (value: T | T[] | string | string[]) => void;
  transformValue?: (value: string | string[]) => T;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  classObj?: { placeholderClass?: string; trigger?: string };
  id?: string;
  name?: string;
  "aria-label"?: string;
  onBlur?: () => void;
  multiple?: boolean;
  maxSelections?: number;
  trackValue?: string;
}

export const Select = React.memo(
  <T extends string = string>({
    label,
    options,
    value = [],
    onChange,
    placeholder = "Select an option",
    error,
    disabled = false,
    required = false,
    className,
    classObj,
    id,
    name,
    "aria-label": ariaLabel,
    onBlur,
    transformValue,
    multiple = false,
    maxSelections,
  }: SelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLUListElement>(null);

    // Ensure value is always an array for consistent handling
    // const valueArray = Array.isArray(value) ? value : value ? [value] : [];
    const valueArray = Array.isArray(value)
      ? value
      : value
      ? [value as string | T]
      : [];

    // Find selected option(s) based on multiple or single selection
    //   const selectedOptions = options.filter(option => {
    //     console.dir(option);
    //     return (
    //     multiple
    //       ? valueArray.includes(option.value)
    //       : option.value === value
    // )});

    // Modify selectedOptions filtering
    const selectedOptions = options.filter((option) =>
      multiple ? valueArray.includes(option.value as T) : option.value === value
    );

    // console.dir(valueArray, selectedOptions);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onBlur?.();
        }
      },
      [onBlur]
    );

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleOptionClick = useCallback(
      (optionValue: string) => {
        if (multiple) {
          // If multiple selection is enabled
          const newValueArray = valueArray.includes(optionValue)
            ? valueArray.filter((v) => v !== optionValue)
            : [...valueArray, optionValue];

          // Enforce max selections if specified
          if (!maxSelections || newValueArray.length <= maxSelections) {
            const finalValue = transformValue
              ? transformValue(newValueArray)
              : newValueArray;
            onChange(finalValue);
          }
        } else {
          // Single selection logic
          const finalValue = transformValue
            ? transformValue(optionValue)
            : optionValue;
          onChange(finalValue);
        }

        // Close dropdown and trigger onBlur
        setIsOpen(false);
        onBlur?.();
      },
      [multiple, valueArray, onChange, maxSelections, onBlur, transformValue]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (disabled) return;

        switch (event.key) {
          case "Enter":
          case " ":
            event.preventDefault();
            if (isOpen && highlightedIndex !== -1) {
              handleOptionClick(options[highlightedIndex].value);
            } else {
              setIsOpen((prev) => !prev);
            }
            break;
          case "ArrowUp":
          case "ArrowDown":
            event.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
              break;
            }
            const newIndex =
              highlightedIndex + (event.key === "ArrowDown" ? 1 : -1);
            if (newIndex >= 0 && newIndex < options.length) {
              setHighlightedIndex(newIndex);
              const element = listboxRef.current?.children[newIndex];
              element?.scrollIntoView({ block: "nearest" });
            }
            break;
          case "Escape":
            setIsOpen(false);
            break;
          default:
            // Handle character search
            const char = event.key.toLowerCase();
            if (char.length === 1) {
              const matchIndex = options.findIndex((option) =>
                option.label.toLowerCase().startsWith(char)
              );
              if (matchIndex !== -1) {
                setHighlightedIndex(matchIndex);
                const element = listboxRef.current?.children[matchIndex];
                element?.scrollIntoView({ block: "nearest" });
              }
            }
            break;
        }
      },
      [disabled, isOpen, highlightedIndex, options, handleOptionClick]
    );

    // Determine display text
    const displayText = multiple
      ? selectedOptions.map((opt) => opt.label).join(", ") || placeholder
      : selectedOptions[0]?.label || placeholder;

    return (
      <div className={cn("relative w-full", className)} ref={containerRef}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div>
          <button
            type="button"
            id={id}
            name={name}
            aria-label={ariaLabel || label}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={`${id}-listbox`}
            aria-disabled={disabled}
            className={cn(
              "relative w-full cursor-pointer rounded-lg text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 border px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm",
              {
                "border-red-300": error,
                "border-gray-300": !error,
                "dark:border-gray-700": !error,
                "opacity-50 cursor-not-allowed": disabled,
                "text-gray-400": !selectedOptions.length,
                "text-gray-700": selectedOptions.length > 0,
              },
              classObj?.trigger
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          >
            <span className={cn("block truncate", classObj?.placeholderClass)}>
              {displayText}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className={cn("h-4 w-4 text-gray-400 transition-transform", {
                  "transform rotate-180": isOpen,
                })}
                aria-hidden="true"
              />
            </span>
          </button>

          {isOpen && (
            <ul
              ref={listboxRef}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              tabIndex={-1}
              role="listbox"
              id={`${id}-listbox`}
              aria-labelledby={id}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 dark:text-white",
                    {
                      "bg-blue-100 dark:bg-secondary-800": highlightedIndex === index,
                      "bg-blue-50 dark:bg-secondary-800": multiple
                        ? valueArray.includes(option.value)
                        : option.value === value,
                    }
                  )}
                  role="option"
                  aria-selected={
                    multiple
                      ? valueArray.includes(option.value)
                      : option.value === value
                  }
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span
                    className={cn("block truncate", {
                      "font-semibold": multiple
                        ? valueArray.includes(option.value)
                        : option.value === value,
                    })}
                  >
                    {option.label}
                  </span>
                  {(multiple
                    ? valueArray.includes(option.value)
                    : option.value === value) && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-WHITE-_100">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
