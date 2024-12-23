import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from './button';


interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  text?: string;
  textToCopy: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'ghost';
  className?: string;
  onCopied?: () => void;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  textToCopy,
  icon = <Copy className="h-4 w-4" />,
  variant = 'ghost',
  className,
  onCopied,
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopied?.();

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={cn(
        "gap-2 px-2 py-1",
        text ? "h-auto" : "h-8 w-8",
        className
      )}
      {...props}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          {text && <span className="text-green-500">{text}</span>}
        </>
      ) : (
        <>
          {icon}
          {text && <span>{text}</span>}
        </>
      )}
    </Button>
  );
};
