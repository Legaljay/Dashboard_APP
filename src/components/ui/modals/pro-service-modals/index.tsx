import { Add } from "@/assets/svg";
import ProServiceButton from "../../button/ProServiceButton";
import { memo, useCallback } from "react";
import useProFeatures from "./hook/useProFeatures";
import { ModalChainStep, useModalChain } from "@/hooks/useModalChain";
import { MODAL_IDS } from "@/constants/modalIds";
import { ConfirmModal, Modal } from "../../modal/Modal";
import UpgradePlanPromptModal from "./components/UpgradePlanPromptModal";
import UpgradePlan from "./components/UpgradePlan";
import { Subscription } from "@/redux-slice/business-subscription/business-subscription.slice";
import PayModal from "./components/PayModal";
import RedeemGiftModal from "./components/RedeemGiftModal";
import RedeemSuccessModal from "./components/RedeemSuccessModal";

interface ProFeaturesProps {
  className?: string;
  icon: () => React.ReactNode;
  originalButton: React.ReactNode;
  text: string;
  type: "assistant" | "integrate" | "team";
}

const ProFeatures: React.FC<ProFeaturesProps> = ({
  className,
  text,
  icon,
  originalButton,
  type = "assistant",
}) => {
  const {
    buttonRef,
    currentPlan,
    is_BasePlan,
    is_ProPlan,
    isLoading,
    planAfter,
    planBefore,
    subscriptions,
    giftBalance,
    fetchSomeData,
    walletBalanceValue,
    is_sufficientBalance
  } = useProFeatures();
  const modalChain = useModalChain();
  const handleClose = useCallback(() => {
    modalChain.closeChain()
  }, [])
  const handleNext = useCallback(() => {
    modalChain.nextInChain();
  }, [])
  const handlePrevious = useCallback(() => {
    modalChain.previousInChain();
  }, [])

  const handleStartModalChain = useCallback(() => {
    const steps = [
      {
        id: MODAL_IDS.custom("chain-1"),
        component: (
          <UpgradePlanPromptModal
            handleClose={handleClose}
            amount={planAfter?.monthly_amount as string}
            nextPlanName={planAfter?.name as string}
            handleNext={handleNext}
            type={type}
          />
        ),
        options:{
          preventScroll: true,
          size: "xl",
        }
      },
      {
        id: MODAL_IDS.custom("chain-2"),
        component: (
          <UpgradePlan
            handleClose={handleClose}
            handleNext={handleNext}
            data={planAfter as Subscription}
            giftBalance={giftBalance}
            walletCredit={walletBalanceValue}
            refresh={fetchSomeData}
            is_sufficientBalance={is_sufficientBalance}
          />
        ),
        options:{
          preventScroll: true,
          size: "xl",
        }
      },
      {
        id: MODAL_IDS.custom("chain-2"),
        component: (
          <PayModal
            handleClose={handleClose}
            handleNext={handleNext}
            payAmount={planAfter?.monthly_amount as unknown as number}
            is_sufficient={is_sufficientBalance}
          />
        ),
        options:{
          preventScroll: true,
          size: "xl",
        }
      },
      {
        id: MODAL_IDS.custom("chain-2"),
        component: (
          <RedeemGiftModal
            handleClose={handleClose}
            handleNext={handleNext}
            back={handlePrevious}
            refresh={() => {}}
            setAmount={() => {}}
            setOpenRedeemSuccess={() => {}}
            // payAmount={planAfter?.monthly_amount as unknown as number}
            // is_sufficient={is_sufficientBalance}
          />
        ),
        options:{
          preventScroll: true,
          size: "xl",
        }
      },
      {
        id: MODAL_IDS.custom("chain-2"),
        component: (
          <RedeemSuccessModal
            handleClose={handleClose}
            title={"Upgrade Successful"}
            text1={"You have successfully upgraded to the Business Plan"}
            label={"Done"}
            redirectPath="/settings?page=billing&category=plan"
            // payAmount={planAfter?.monthly_amount as unknown as number}
            // is_sufficient={is_sufficientBalance}
          />
        ),
        options:{
          preventScroll: true,
          size: "xl",
        }
      },
      {
        id: MODAL_IDS.custom("chain-3"),
        component: (
          <ConfirmModal
            title="Final Step"
            message="Would you like to complete this process?"
            onConfirm={() => {
              console.log("Confirm clicked in final modal");
              modalChain.closeChain();
            }}
            onCancel={() => {
              console.log("Back clicked in final modal");
              modalChain.previousInChain();
            }}
            confirmText="Complete"
            cancelText="Back"
            type="info"
          />
        ),
      },
    ];

    console.log("Starting modal chain with steps:", steps);
    modalChain.startChain(steps as ModalChainStep[]);
  }, []);

  if (is_ProPlan) {
    return originalButton;
  }

  return (
    <ProServiceButton
      ref={buttonRef}
      onClick={handleStartModalChain}
      text={text}
      icon={icon || Add}
      className={className}
    />
  );
};

export default memo(ProFeatures);
