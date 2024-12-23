import React, { createContext, useContext, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

// Types for our modal system
export type ModalType = {
  id: string;
  isOpen: boolean;
  component: React.ReactNode;
  options?: ModalOptions;
};

export type ModalOptions = {
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
  onClose?: () => void;
  className?: string;
};

type ModalContextType = {
  openModal: (id: string, component: React.ReactNode, options?: ModalOptions) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  modals: ModalType[];
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Base styles for different modal sizes
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  "2xl": 'max-w-2xl',
  "3xl": 'max-w-3xl',
  "4xl": 'max-w-4xl',
  "5xl": 'max-w-5xl',
  "6xl": 'max-w-6xl',
  "7xl": 'max-w-7xl',
  full: 'max-w-full'
};

// Base styles for different modal positions
const positionClasses = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-20',
  right: 'items-center justify-end',
  bottom: 'items-end justify-center pb-20',
  left: 'items-center justify-start'
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalType[]>([]);

  const openModal = useCallback((id: string, component: React.ReactNode, options?: ModalOptions) => {
    setModals(prev => [...prev, { id, isOpen: true, component, options }]);
    if (options?.preventScroll) {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const modalToClose = prev.find(modal => modal.id === id);
      if (modalToClose?.options?.preventScroll) {
        document.body.style.overflow = 'unset';
      }
      return prev.filter(modal => modal.id !== id);
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
    document.body.style.overflow = 'unset';
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const lastModal = modals[modals.length - 1];
      if (lastModal && lastModal.options?.closeOnEsc !== false) {
        closeModal(lastModal.id);
      }
    }
  }, [modals, closeModal]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals, modals }}>
      {children}
      {modals.map(({ id, component, options = {} }) => {
        const {
          size = 'md',
          position = 'center',
          closeOnClickOutside = true,
          className = ''
        } = options;

        return createPortal(
          <div
            key={id}
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby={`modal-${id}`}
            role="dialog"
            aria-modal="true"
            onClick={() => {
              closeOnClickOutside && closeModal(id)
            }}
          >
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity max-w-l`}
              // onClick={() => {
              //   console.log('closeOnClickOutside:', closeOnClickOutside);
              //   console.log('Modal ID:', id);
              //   closeOnClickOutside && closeModal(id)
              // }}
            />
            <div className={`fixed inset-0 flex ${positionClasses[position]}`}>
              <div
                className={`relative ${sizeClasses[size]} w-full m-4 ${className}`}
                onClick={e => e.stopPropagation()}
              >
                {component}
              </div>
            </div>
          </div>,
          document.body
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
