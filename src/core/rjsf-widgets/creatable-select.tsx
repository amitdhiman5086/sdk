import { useMemo, useState } from "react";
import { WidgetProps } from "@rjsf/utils";
import CreatableSelect from "react-select/creatable";

interface Option {
  readonly label: string;
  readonly value: string;
}



export const CreatableSelectWidget = ({
  id,
  options: { enumOptions },
  value,
  disabled,
  onChange,
  onBlur,
  onFocus,
  required,
  placeholder,
}: WidgetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultOptions = useMemo(() => {
    if (!enumOptions) return [];
    return enumOptions.map(option => ({
      label: option.label || String(option.value),
      value: String(option.value)
    }));
  }, [enumOptions]);
  
  const [options, setOptions] = useState<Option[]>(defaultOptions);

  const selectedValue = useMemo(() => {
    console.log(value); 
    console.log(options);
    return options.find((option) => option.value === value);
  }, [options]);

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
  });

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions(prev => [...prev, newOption]);
      onChange(newOption.value);
    }, 1000);
  };

  const handleChange = (selectedOption: Option | null) => {
    if (!selectedOption) {
      onChange(undefined);
      return;
    }
    onChange(selectedOption.value);
  };

  return (
    <div className="w-full">
      <CreatableSelect
        id={id}
        className={cn("react-select-container truncate line-clamp-1 ")}
        classNamePrefix="react-select"
        options={options}
        value={selectedValue}
        onChange={handleChange}
        onBlur={(e) => {
          onBlur(id, e);
        }}
        onFocus={(e) => {
          onFocus(id, e);
        }}
        isDisabled={disabled || isLoading}
        isLoading={isLoading}
        placeholder={placeholder || "Select..."}
        isClearable={!required}
        onCreateOption={handleCreate}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? `No options found for "${inputValue}"` : "No options available"
        }
        menuPortalTarget={document.body}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "30px",
            height: "30px",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
          }),
          valueContainer: (base) => ({
            ...base,
            height: "100%",
            padding: "0 8px",
          }),
          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            fontSize: "0.875rem",
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          option: (base) => ({
            ...base,
            fontSize: "0.875rem",
            padding: "6px 12px",
          }),
          dropdownIndicator: (base) => ({
            ...base,
            padding: "4px",
          }),
          clearIndicator: (base) => ({
            ...base,
            padding: "4px",
          }),
        }}
      />
    </div>
  );
};

// Simple cn utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
