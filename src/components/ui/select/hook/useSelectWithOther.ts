import { useState, useCallback } from 'react';

interface UseSelectWithOtherProps {
  onChange: (value: string) => void;
  otherOptionValue?: string;
}

export const useSelectWithOther = ({
  onChange,
  otherOptionValue = 'Other(Please Specify):',
}: UseSelectWithOtherProps) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [otherValue, setOtherValue] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleSelectChange = useCallback((value: string) => {
    setSelectedValue(value);
    setShowOtherInput(value === otherOptionValue);
    
    if (value !== otherOptionValue) {
      onChange(value);
      setOtherValue('');
    }
  }, [onChange, otherOptionValue]);

  const handleOtherValueChange = useCallback((value: string) => {
    setOtherValue(value);
    onChange(value);
  }, [onChange]);

  return {
    selectedValue,
    otherValue,
    showOtherInput,
    handleSelectChange,
    handleOtherValueChange,
  };
};
