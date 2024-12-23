import React, { useState } from 'react';
import { Modal } from './Modal';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  component: React.ReactNode;
  description?: string;
}

interface MultiStepModalProps {
  steps: Step[];
  onClose: () => void;
  onComplete?: (data: any) => void;
  initialStep?: number;
  className?: string;
  showStepIndicator?: boolean;
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  steps,
  onClose,
  onComplete,
  initialStep = 0,
  className,
  showStepIndicator = true,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleNext = (stepData?: Record<string, any>) => {
    if (stepData) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep === steps.length - 1) {
      onComplete?.(formData);
      return;
    }
    
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
    }
  };

  return (
    <Modal
      className={cn('w-full max-w-2xl', className)}
      onClose={onClose}
      title={steps[currentStep].title}
    >
      {showStepIndicator && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div 
                  className={cn(
                    'flex flex-col items-center cursor-pointer',
                    {
                      'text-blue-600': index === currentStep,
                      'text-gray-500': index !== currentStep,
                      'cursor-pointer': index < currentStep,
                      'cursor-not-allowed': index > currentStep
                    }
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <div 
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center border-2',
                      {
                        'border-blue-600 bg-blue-600 text-white': index === currentStep,
                        'border-blue-600 bg-white text-blue-600': index < currentStep,
                        'border-gray-300 bg-gray-100 text-gray-500': index > currentStep
                      }
                    )}
                  >
                    {index + 1}
                  </div>
                  {step.description && (
                    <span className="mt-2 text-xs">{step.description}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={cn(
                      'flex-1 h-0.5 mx-4',
                      {
                        'bg-blue-600': index < currentStep,
                        'bg-gray-300': index >= currentStep
                      }
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <Modal.Body>
        {React.isValidElement(steps[currentStep].component)
          ? React.cloneElement(steps[currentStep].component as React.ReactElement, {
              onNext: handleNext,
              onBack: handleBack,
              formData,
              isFirstStep: currentStep === 0,
              isLastStep: currentStep === steps.length - 1,
            })
          : steps[currentStep].component}
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-between w-full">
          <button
            onClick={handleBack}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'text-gray-700 bg-white border border-gray-300',
              'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              { 'opacity-50 cursor-not-allowed': currentStep === 0 }
            )}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            onClick={() => handleNext()}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md',
              'text-white bg-blue-600',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            )}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
