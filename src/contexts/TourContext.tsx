import React, { createContext, useContext, useState } from "react";
import { TourProvider as ReactourProvider, StepType } from "@reactour/tour";

type TourContextType = {
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

export const steps: StepType[] = [
  {
    selector: '[data-tour="dashboard"]',
    content:
      "Welcome to your dashboard! Here you can view all your important information at a glance.",
  },
  {
    selector: '[data-tour="profile"]',
    content: "View and manage your profile settings here.",
  },
  // Add more steps as needed for different dashboard sections
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <TourContext.Provider
      value={{
        isTourOpen,
        setIsTourOpen,
        currentStep,
        setCurrentStep,
      }}
    > 
      <ReactourProvider
        steps={steps}
        onClickClose={() => setIsTourOpen(false)}
        currentStep={currentStep}
        onClickMask={() => setIsTourOpen(false)}
        setCurrentStep={setCurrentStep}
        disableInteraction
        disableKeyboardNavigation={false}
        showNavigation
        disableDotsNavigation={false}
        showBadge={false}
        showDots={false}
        className="rounded-lg"
        maskClassName="rounded-lg"
        highlightedMaskClassName="rounded-lg"
        padding={{ mask: 8, wrapper: 8 }}
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#0077FF",
            borderRadius: 8,
            maxWidth: 350,
          }),
          maskArea: (base) => ({
            ...base,
            rx: 8,
          }),
        }}
        accessibilityOptions={{
          closeButtonAriaLabel: "Close tour",
          showNavigationScreenReaders: true,
        }}
      >
        {children}
      </ReactourProvider>
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};


/// STEPTYPE 
// type StepType = {
//   selector: string | Element;
//   content: ReactElement | string | ((props: PopoverContentProps) => void);
//   position?: Position;
//   highlightedSelectors?: string[];
//   mutationObservables?: string[];
//   resizeObservables?: string[];
//   navDotAriaLabel?: string;
//   stepInteraction?: boolean;
//   action?: (elem: Element | null) => void;
//   actionAfter?: (elem: Element | null) => void;
//   disableActions?: boolean;
//   padding?: Padding;
//   bypassElem?: boolean;
//   styles?: StylesObj & PopoverStylesObj & MaskStylesObj;
// };