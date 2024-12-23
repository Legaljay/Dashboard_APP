import { useCallback, useState, useRef, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import type { ModalOptions } from '@/contexts/ModalContext';

/**
 * Represents a single step in a modal chain sequence
 */
export interface ModalChainStep {
  /** Unique identifier for the modal */
  id: string;
  /** React component to render in the modal */
  component: React.ReactNode;
  /** Optional configuration for the modal */
  options?: ModalOptions;
}

/**
 * A hook for managing sequences of modals in a step-by-step flow.
 * Provides functionality for navigating forward, backward, and closing the entire chain.
 * 
 * @returns An object containing methods and state for managing the modal chain
 * 
 * @example
 * ```tsx
 * // Multi-step form wizard
 * function OnboardingWizard() {
 *   const {
 *     startChain,
 *     nextInChain,
 *     previousInChain,
 *     isFirst,
 *     isLast,
 *     currentStep
 *   } = useModalChain();
 * 
 *   useEffect(() => {
 *     const steps: ModalChainStep[] = [
 *       {
 *         id: 'welcome',
 *         component: <WelcomeModal onNext={nextInChain} />,
 *         options: { closeOnClickOutside: false }
 *       },
 *       {
 *         id: 'userInfo',
 *         component: (
 *           <UserInfoForm
 *             onBack={previousInChain}
 *             onNext={nextInChain}
 *           />
 *         )
 *       },
 *       {
 *         id: 'preferences',
 *         component: (
 *           <PreferencesModal
 *             onBack={previousInChain}
 *             onComplete={handleComplete}
 *           />
 *         )
 *       }
 *     ];
 * 
 *     startChain(steps);
 *   }, []);
 * 
 *   return null;
 * }
 * 
 * // Dynamic modal chain based on user actions
 * function CheckoutFlow() {
 *   const { startChain, nextInChain } = useModalChain();
 * 
 *   const handleCheckout = useCallback(() => {
 *     const steps = [
 *       {
 *         id: 'cart-review',
 *         component: (
 *           <CartReview
 *             items={cartItems}
 *             onConfirm={nextInChain}
 *           />
 *         )
 *       },
 *       {
 *         id: 'shipping',
 *         component: (
 *           <ShippingForm
 *             onSubmit={(address) => {
 *               saveAddress(address);
 *               nextInChain();
 *             }}
 *           />
 *         ),
 *         options: { size: 'lg' }
 *       },
 *       {
 *         id: 'payment',
 *         component: (
 *           <PaymentForm
 *             amount={total}
 *             onSuccess={handlePaymentSuccess}
 *           />
 *         ),
 *         options: { closeOnClickOutside: false }
 *       }
 *     ];
 * 
 *     startChain(steps);
 *   }, [cartItems, total]);
 * 
 *   return (
 *     <Button onClick={handleCheckout}>
 *       Checkout
 *     </Button>
 *   );
 * }
 * ```
 * 
 * @remarks
 * - Maintains modal sequence state
 * - Handles modal transitions
 * - Manages cleanup on chain completion
 * - Preserves modal history
 * - Supports dynamic chain updates
 * 
 * @bestPractices
 * - Define unique IDs for each step
 * - Handle back/forward navigation
 * - Provide clear progress indicators
 * - Consider mobile responsiveness
 * - Implement proper error handling
 * - Use consistent modal sizes
 * - Add loading states for async operations
 * 
 * @performance
 * - Efficient state management
 * - Minimal re-renders
 * - Proper cleanup on unmount
 * - Memory leak prevention
 * - Optimized modal transitions
 * 
 * @accessibility
 * - Maintain focus management
 * - Support keyboard navigation
 * - Provide ARIA labels
 * - Handle screen readers
 * - Support reduced motion
 */
export const useModalChain = () => {
  const { openModal, closeModal } = useModal();
  const chainRef = useRef<ModalChainStep[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Update refs when state changes
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  /**
   * Initiates a new modal chain sequence
   * @param steps Array of modal steps to display in sequence
   */
  const startChain = useCallback((steps: ModalChainStep[]) => {
    if (steps.length === 0) return;
    
    console.log('Starting chain with steps:', steps);
    chainRef.current = steps;
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    
    const firstStep = steps[0];
    openModal(firstStep.id, firstStep.component, {
      ...firstStep.options,
      onClose: () => {
        firstStep.options?.onClose?.();
        if (currentIndexRef.current === 0) { // Only reset if we're still on first step
          currentIndexRef.current = -1;
          chainRef.current = [];
          setCurrentIndex(-1);
        }
      }
    });
  }, [openModal]);

  /**
   * Advances to the next modal in the chain
   */
  const nextInChain = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    const chain = chainRef.current;
    
    console.log('Next in chain called. Current index:', currentIdx, 'Chain length:', chain.length);
    
    if (currentIdx >= 0 && currentIdx < chain.length - 1) {
      const nextIndex = currentIdx + 1;
      const nextStep = chain[nextIndex];
      
      console.log('Moving to next step:', nextStep);
      closeModal(chain[currentIdx].id);
      
      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      
      openModal(nextStep.id, nextStep.component, {
        ...nextStep.options,
        onClose: () => {
          nextStep.options?.onClose?.();
          if (currentIndexRef.current === nextIndex) { // Only reset if we're still on this step
            currentIndexRef.current = -1;
            chainRef.current = [];
            setCurrentIndex(-1);
          }
        }
      });
    }
  }, [closeModal, openModal]);

  /**
   * Returns to the previous modal in the chain
   */
  const previousInChain = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    const chain = chainRef.current;
    
    console.log('Previous in chain called. Current index:', currentIdx);
    
    if (currentIdx > 0) {
      const prevIndex = currentIdx - 1;
      const prevStep = chain[prevIndex];
      
      console.log('Moving to previous step:', prevStep);
      closeModal(chain[currentIdx].id);
      
      currentIndexRef.current = prevIndex;
      setCurrentIndex(prevIndex);
      
      openModal(prevStep.id, prevStep.component, {
        ...prevStep.options,
        onClose: () => {
          prevStep.options?.onClose?.();
          if (currentIndexRef.current === prevIndex) { // Only reset if we're still on this step
            currentIndexRef.current = -1;
            chainRef.current = [];
            setCurrentIndex(-1);
          }
        }
      });
    }
  }, [closeModal, openModal]);

  /**
   * Closes the entire modal chain
   */
  const closeChain = useCallback(() => {
    const currentIdx = currentIndexRef.current;
    const chain = chainRef.current;
    
    console.log('Closing chain. Current index:', currentIdx);
    
    if (currentIdx >= 0 && currentIdx < chain.length) {
      closeModal(chain[currentIdx].id);
      currentIndexRef.current = -1;
      chainRef.current = [];
      setCurrentIndex(-1);
    }
  }, [closeModal]);

  return {
    startChain,
    nextInChain,
    previousInChain,
    closeChain,
    currentStep: currentIndex >= 0 ? chainRef.current[currentIndex] : null,
    isFirst: currentIndex === 0,
    isLast: currentIndex === chainRef.current.length - 1,
    chainLength: chainRef.current.length,
    currentIndex,
  };
};
