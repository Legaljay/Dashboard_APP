import { useEffect } from "react";
import { StepType, PopoverContentProps, StylesObj, TourProps, KeyboardParts, ProviderProps, useTour, Position } from "@reactour/tour";

interface UseTourGuideProps {
  steps: StepType[];
  isOpen: boolean;
  onRequestClose: () => void;
  onStepChange?: (step: number) => void;
  onTourEnd?: () => void;
  showCloseButton?: boolean;
  showNavigation?: boolean;
  disableInteraction?: boolean;
  maskClassName?: string;
  className?: string;
}

const useTourGuide = ({
  steps,
  isOpen,
  onRequestClose,
  onStepChange,
  onTourEnd,
  showCloseButton = true,
  showNavigation = true,
  disableInteraction = false,
  maskClassName,
  className,
}: UseTourGuideProps) => {
  const { setSteps, setCurrentStep, setIsOpen } = useTour();

  useEffect(() => {
    setSteps(steps);
    setCurrentStep(0); // Start at the first step
    setIsOpen(isOpen); // Control the visibility of the tour
  }, [steps, isOpen, setSteps, setCurrentStep, setIsOpen]);

  // Handle closing the tour
  useEffect(() => {
    if (!isOpen) {
      onRequestClose();
      if (onTourEnd) {
        onTourEnd();
      }
    }
  }, [isOpen, onRequestClose, onTourEnd]);

  // Handle step change
  useEffect(() => {
    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);
};

export default useTourGuide;


// type StylesKeys = 'badge' | 'controls' | 'navigation' | 'button' | 'arrow' | 'dot' | 'close' | 'svg';
// type StylesObj = {
//     [key in StylesKeys]?: StyleFn;
// };
// type StyleFn = (props: {
//     [key: string]: any;
// }, state?: {
//     [key: string]: any;
// }) => React.CSSProperties;

// type BadgeProps$1 = {
//     styles?: StylesObj;
// };

// type CloseProps = {
//     styles?: StylesObj;
//     onClick?: () => void;
//     disabled?: boolean;
// };

// type ContentProps = {
//     content: any;
//     setCurrentStep: Dispatch<React__default.SetStateAction<number>>;
//     setIsOpen?: Dispatch<React__default.SetStateAction<boolean>>;
//     currentStep: number;
//     transition?: boolean;
//     isHighlightingObserved?: boolean;
// };

// type BaseProps = {
//     styles?: StylesObj;
// };
// type NavigationProps = BaseProps & {
//     setCurrentStep: Dispatch<React__default.SetStateAction<number>>;
//     steps: StepType[];
//     currentStep: number;
//     disableDots?: boolean;
//     nextButton?: (props: BtnFnProps) => ReactNode | null;
//     prevButton?: (props: BtnFnProps) => ReactNode | null;
//     setIsOpen: Dispatch<React__default.SetStateAction<boolean>>;
//     hideButtons?: boolean;
//     hideDots?: boolean;
//     disableAll?: boolean;
//     rtl?: boolean;
//     Arrow?: ComponentType<ArrowProps>;
// };

// type ArrowProps = BaseProps & {
//     inverted?: boolean;
//     disabled?: boolean;
// };

// interface PopoverComponents {
//     Badge: ComponentType<BadgeProps$1>;
//     Close: ComponentType<CloseProps>;
//     Content: ComponentType<ContentProps>;
//     Navigation: ComponentType<NavigationProps>;
//     Arrow: ComponentType<ArrowProps>;
// }
// type PopoverComponentsType = Partial<PopoverComponents>;
// declare const components: {
//     Badge: React$1.FC<React$1.PropsWithChildren<BadgeProps$1>>;
//     Close: React$1.FC<CloseProps>;
//     Content: React$1.FC<ContentProps>;
//     Navigation: React$1.FC<NavigationProps>;
//     Arrow: React$1.FC<ArrowProps>;
// };

// type SharedProps = KeyboardHandler & {
//     steps: StepType[];
//     styles?: StylesObj & PopoverStylesObj & MaskStylesObj;
//     padding?: Padding;
//     position?: Position;
//     disableInteraction?: boolean | ((clickProps: Pick<ClickProps, 'currentStep' | 'steps' | 'meta'>) => boolean);
//     disableFocusLock?: boolean;
//     disableDotsNavigation?: boolean;
//     disableKeyboardNavigation?: boolean | KeyboardParts[];
//     className?: string;
//     maskClassName?: string;
//     highlightedMaskClassName?: string;
//     maskId?: string;
//     clipId?: string;
//     nextButton?: (props: BtnFnProps) => ReactNode | null;
//     prevButton?: (props: BtnFnProps) => ReactNode | null;
//     afterOpen?: (target: Element | null) => void;
//     beforeClose?: (target: Element | null) => void;
//     onClickMask?: (clickProps: ClickProps) => void;
//     onClickClose?: (clickProps: ClickProps) => void;
//     onClickHighlighted?: (e: MouseEvent, clickProps: ClickProps) => void;
//     badgeContent?: (badgeProps: BadgeProps) => any;
//     showNavigation?: boolean;
//     showPrevNextButtons?: boolean;
//     showCloseButton?: boolean;
//     showBadge?: boolean;
//     showDots?: boolean;
//     scrollSmooth?: boolean;
//     inViewThreshold?: number | {
//         x?: number;
//         y?: number;
//     };
//     accessibilityOptions?: A11yOptions;
//     rtl?: boolean;
//     components?: PopoverComponentsType;
//     ContentComponent?: ComponentType<PopoverContentProps>;
//     Wrapper?: ComponentType;
// };
// type PopoverContentProps = {
//     styles?: StylesObj & PopoverStylesObj & MaskStylesObj;
//     badgeContent?: (badgeProps: BadgeProps) => any;
//     components?: PopoverComponentsType;
//     accessibilityOptions?: A11yOptions;
//     disabledActions?: boolean;
//     onClickClose?: (clickProps: ClickProps) => void;
//     setCurrentStep: Dispatch<React.SetStateAction<number>>;
//     currentStep: number;
//     transition?: boolean;
//     isHighlightingObserved?: boolean;
//     setIsOpen: Dispatch<React.SetStateAction<boolean>>;
//     steps: StepType[];
//     setSteps?: Dispatch<React.SetStateAction<StepType[]>>;
//     showNavigation?: boolean;
//     showPrevNextButtons?: boolean;
//     showCloseButton?: boolean;
//     showBadge?: boolean;
//     showDots?: boolean;
//     nextButton?: (props: BtnFnProps) => ReactNode | null;
//     prevButton?: (props: BtnFnProps) => ReactNode | null;
//     disableDotsNavigation?: boolean;
//     rtl?: boolean;
//     meta?: string;
//     setMeta?: Dispatch<React.SetStateAction<string>>;
// };
// type A11yOptions = {
//     ariaLabelledBy?: string;
//     closeButtonAriaLabel: string;
//     showNavigationScreenReaders: boolean;
// };
// type ComponentPadding = number | number[];
// type Padding = number | {
//     mask?: ComponentPadding;
//     popover?: ComponentPadding;
//     wrapper?: ComponentPadding;
// };
// type KeyboardParts = 'esc' | 'left' | 'right';
// type ClickProps = {
//     setIsOpen: Dispatch<React.SetStateAction<boolean>>;
//     setCurrentStep: Dispatch<React.SetStateAction<number>>;
//     currentStep: number;
//     steps?: StepType[];
//     setSteps?: Dispatch<React.SetStateAction<StepType[]>>;
//     meta?: string;
//     setMeta?: Dispatch<React.SetStateAction<string>>;
// };
// type KeyboardHandler = {
//     keyboardHandler?: (e: KeyboardEvent, clickProps?: ClickProps, status?: {
//         isEscDisabled?: boolean;
//         isRightDisabled?: boolean;
//         isLeftDisabled?: boolean;
//     }) => void;
// };
// type TourProps = SharedProps & ClickProps & {
//     isOpen: boolean;
//     disabledActions: boolean;
//     disableWhenSelectorFalsy?: boolean;
//     setDisabledActions: Dispatch<React.SetStateAction<boolean>>;
//     onTransition?: (postionsProps: PositionProps, prev: RectResult) => 'top' | 'right' | 'bottom' | 'left' | 'center' | [number, number];
// };
// type BadgeProps = {
//     totalSteps: number;
//     currentStep: number;
//     transition?: boolean;
// };
// type ProviderProps = SharedProps & {
//     children: React.ReactNode;
//     defaultOpen?: boolean;
//     startAt?: number;
//     setCurrentStep?: Dispatch<React.SetStateAction<number>>;
//     currentStep?: number;
//     meta?: string;
//     setMeta?: Dispatch<React.SetStateAction<string>>;
// };
// type StepType = {
//     selector: string | Element;
//     content: ReactElement | string | ((props: PopoverContentProps) => void);
//     position?: Position;
//     highlightedSelectors?: string[];
//     mutationObservables?: string[];
//     resizeObservables?: string[];
//     navDotAriaLabel?: string;
//     stepInteraction?: boolean;
//     action?: (elem: Element | null) => void;
//     actionAfter?: (elem: Element | null) => void;
//     disableActions?: boolean;
//     padding?: Padding;
//     bypassElem?: boolean;
//     styles?: StylesObj & PopoverStylesObj & MaskStylesObj;
// };
// type BtnFnProps = {
//     Button: React.FC<React.PropsWithChildren<NavButtonProps>>;
//     setCurrentStep: Dispatch<React.SetStateAction<number>>;
//     stepsLength: number;
//     currentStep: number;
//     setIsOpen: Dispatch<React.SetStateAction<boolean>>;
//     steps?: StepType[];
// };
// type NavButtonProps = {
//     onClick?: () => void;
//     kind?: 'next' | 'prev';
//     hideArrow?: boolean;
// };