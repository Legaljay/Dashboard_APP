import React, { forwardRef, useRef, useState, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  field: {
    onChange: (value: any) => void;
    value: string;
    name: string;
  };
  length?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(({
  field,
  length = 6,
  disabled = false,
  error,
  className,
}, ref) => {
  const [otp, setOtp] = useState<string[]>(field.value?.split('').slice(0, length) || Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multi-character input
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    const otpString = newOtp.join('');
    field.onChange(otpString);

    // Auto-focus next input if value is entered
    if (value && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const newOtp = [...otp];
    
    pastedData.split('').forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);
    field.onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    focusInput(nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1);
  };

  //TODO: add error message
  return (
    <div ref={ref} className={cn('flex gap-2 justify-between items-center', className)}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500',
            'dark:bg-gray-800 text-gray-500 dark:text-white',
            error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600',
            disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          )}
        />
      ))}
    </div>
  );
});

OTPInput.displayName = 'OTPInput';

export default React.memo(OTPInput);
