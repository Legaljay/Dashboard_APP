import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BillingPlan } from "../../../../types/dashboard";
import "./Billing.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { handleFlutterwaveNotification } from "@/redux-slice/topup/topup.slice";
import { MODAL_IDS } from "@/constants/modalIds";
import RedeemSuccessModal from "@/components/ui/modals/pro-service-modals/components/RedeemSuccessModal";
import { useModal } from "@/contexts/ModalContext";
import ManagePlan from "./ManagePlan";
import Overview from "./Overview";
import { AnimatePresence, motion } from "framer-motion";
import useProFeatures from "@/components/ui/modals/pro-service-modals/hook/useProFeatures";
import { Subscription } from "@/redux-slice/business-subscription/business-subscription.slice";
import { InfoIcon } from "lucide-react";
import { Pricing } from "../../support/components/sections";

const itemVariants = {
  hidden: {
    // opacity: 0,
    y: 20,
  },
  show: {
    // opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const BUSINESS = "Business";
const ENTERPRISE = "Enterprise";

const PlanCard: React.FC<{
  idx: number;
  plan: Subscription;
  currentPlan: Subscription;
  onSelect: (id: string) => void;
}> = ({ plan, onSelect, currentPlan }) => {
  const isCurrent = useMemo(
    () => plan.id === currentPlan.id,
    [plan.id, currentPlan.id]
  );
  const isPopular = useMemo(() => plan.name === BUSINESS, [plan.name]);

  const isEnterprise = useMemo(() => plan.name === ENTERPRISE, [plan.name]);

  return (
    <motion.div
      variants={itemVariants}
      className={`plan-card flex flex-col justify-between ${
        isPopular ? "popular" : ""
      } ${isCurrent ? "current" : ""}`}
    >
      <div>
        {isPopular && <div className="popular-badge">Most Popular</div>}
        {isCurrent && <div className="current-badge">Current Plan</div>}
        <div>
          <h3>{plan.name}</h3>
          <p>{plan.description}</p>
        </div>
        {isEnterprise ? (
          <div className="price">
            <p className="period">Let's Talk</p>
          </div>
        ) : (
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">{plan.monthly_amount}</span>
            <span className="period">/month</span>
          </div>
        )}
        <ul
          className={`${
            isEnterprise ? "overflow-y-scroll max-h-[350px]" : ""} features`}
        >
          {plan.features.map((feature, index) => (
            <li key={index}>
              {feature.prefix}
              {feature.description}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="select-plan-button"
        onClick={() => onSelect(plan.id)}
        disabled={isCurrent}
      >
        {isCurrent
          ? "Manage Plan"
          : plan.monthly_amount < currentPlan.monthly_amount
          ? "Downgrade Plan"
          : "Upgrade Plan"}
      </button>
    </motion.div>
  );
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// const containerVariants = {
//   hidden: { y: 20 },
//   show: {
//     y: 0,
//     transition: {
//       staggerChildren: 0.9
//     }
//   }
// };

const Billings: React.FC = memo(() => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  

  const {
    subscriptions = [],
    currentPlan = {},
    giftBalance,
    walletBalanceValue,
    buttonRef,
    isLoading,
  } = useProFeatures();

  const [plans] = useState<Subscription[]>(subscriptions);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = useCallback((planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  }, []);

  const handleOpenModal = useCallback(() => {
    openModal(
      MODAL_IDS.custom("success-modal"),
      <RedeemSuccessModal
        handleClose={() => closeModal(MODAL_IDS.custom("success-modal"))}
        title={"Upgrade Successful"}
        text1={"You have successfully upgraded to the Business Plan"}
        label={"Done"}
        redirectPath="/dashboard/billing"
      />
    );
  }, []);


  return (
    <motion.section
      className="px-10 py-2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="billing-container !mb-20">
        <div className="billing-header">
          <h1>Billing & Plans</h1>
          <p>Choose the plan that best fits your needs</p>
        </div>
        <div className="mb-[27px]">
          <h1 className="font-medium text-[18px] leading-[21.6px]">
            Your Plan
          </h1>
          <p className="leading-[15.42px] text-[12px] font-normal text-[#7F7F81] mt-[3px]">
            Your subscription plan, you can change your plan to suit your
            business
          </p>
          <div className="flex items-center w-fit h-[25px] bg-[#FAFBFC] rounded-[24px] px-[12px] py-[6px] mt-[8px]">
            <InfoIcon size={10} color="#1774FD" />
            <button
              className="p-1"
              onClick={() =>
                navigate("/dashboard/support", { state: { Pricing: true } })
              }
            >
              <p className="underline text-[#1774FD] text-[10px] leading-[12.85px]">
                How we charge for subscription
              </p>
            </button>
          </div>
        </div>

        <motion.div className="plans-grid">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              idx={index}
              plan={plan}
              currentPlan={currentPlan as Subscription}
              onSelect={handlePlanSelect}
            />
          ))}
        </motion.div>

        {showUpgradeModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Confirm Plan Change</h2>
              <p>Are you sure you want to change your plan?</p>
              <div className="modal-actions">
                <button
                  className="cancel-button"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={() => {
                    // Handle plan change
                    setShowUpgradeModal(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
});

export { Billings };

const Billing: React.FC = () => {
  
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isProcessing = useAppSelector(
    (state) => state.topup.loading.notification
  );
  
  const handlePaymentCallback = useCallback(async () => {
    // Get URL search parameters whenever location changes
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");
    const reference = searchParams.get("tx_ref");
    const providerId = searchParams.get("transaction_id");

    // Check if we have payment parameters and not already processing
    if (status === "successful" && reference && providerId && !isProcessing) {
      try {
        await dispatch(
          handleFlutterwaveNotification({
            status,
            reference,
            providerId,
          })
        );

        // Show success message to user
        // You might want to add a toast or notification here
        console.log("Payment processed successfully");

        // Clear URL parameters after successful processing
        navigate("/dashboard/billing", {
          replace: true,
          state: { paymentSuccess: true }, // Optional: pass success state
        });
      } catch (error) {
        console.error("Error processing payment:", error);
        // Handle error appropriately (show error message to user)
      }
    }
  }, [dispatch, location.search, isProcessing, navigate]);

  const handleOpenModal = useCallback(() => {
    openModal(
      MODAL_IDS.custom("success-modal"),
      <RedeemSuccessModal
        handleClose={() => closeModal(MODAL_IDS.custom("success-modal"))}
        title={"Upgrade Successful"}
        text1={"You have successfully upgraded to the Business Plan"}
        label={"Done"}
        redirectPath="/dashboard/billing"
      />
    );
  }, []);

  useEffect(() => {
    handlePaymentCallback();
  }, [location.search, handlePaymentCallback]);

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      handleOpenModal();
    }
  }, [location.state, handleOpenModal]);

  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/plans" element={<Billings />} />
        <Route path="/manage-plan" element={<ManagePlan />} />
      </Routes>
    </AnimatePresence>
  );
};

export default Billing;
