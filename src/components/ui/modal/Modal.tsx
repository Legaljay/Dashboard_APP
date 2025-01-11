import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalSubComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  renderCustomHeader?: () => React.ReactNode;
  className?: string;
  childClassName?: string;
  showCloseButton?: boolean;
}

type ModalComponent = React.FC<ModalProps> & {
  Header: React.FC<ModalSubComponentProps>;
  Body: React.FC<ModalSubComponentProps>;
  Footer: React.FC<ModalSubComponentProps>;
};

export const Modal: ModalComponent = ({
  title,
  description,
  children,
  footer,
  onClose,
  renderCustomHeader,
  className,
  childClassName,
  showCloseButton = true,
}) => {
  return (
    <div className={cn(
      'overflow-hidden bg-white rounded-lg shadow-xl transition-all transform',
      className
    )}>
      {/* Header */}
      {renderCustomHeader ? renderCustomHeader() : ((title || showCloseButton) && (
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            {title && (
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-xs text-gray-500">
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      {/* Content */}
      <div className={cn("px-6 py-4", childClassName)}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

// Compound components for modal
Modal.Header = function ModalHeader({ 
  children, 
  className 
}: ModalSubComponentProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

Modal.Body = function ModalBody({ 
  children, 
  className 
}: ModalSubComponentProps) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ 
  children, 
  className 
}: ModalSubComponentProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};

export const ConfirmModal: React.FC<{
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'neutral';
}> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}) => {
  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    neutral: 'bg-transparent text-gray-800 hover:text-white hover:bg-black outline-none focus:outline-none',
  };

  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-sm font-medium text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
              buttonColors[type]
            )}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-sm text-gray-500">{message}</p>
    </Modal>
  );
};
