import React, { memo, useCallback, useEffect, useState } from "react";
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

const dummyPlans: BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    features: [
      "1,000 API calls/month",
      "Basic analytics",
      "Email support",
      "2 team members",
    ],
    isCurrent: true,
  },
  {
    id: "pro",
    name: "Professional",
    price: 99,
    features: [
      "10,000 API calls/month",
      "Advanced analytics",
      "Priority support",
      "Unlimited team members",
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    features: [
      "Unlimited API calls",
      "Custom analytics",
      "24/7 dedicated support",
      "Custom integrations",
    ],
  },
];

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

const PlanCard: React.FC<{
  idx: number;
  plan: BillingPlan;
  onSelect: (id: string) => void;
}> = ({ plan, onSelect }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`plan-card ${plan.isPopular ? "popular" : ""} ${
        plan.isCurrent ? "current" : ""
      }`}
    >
      {plan.isPopular && <div className="popular-badge">Most Popular</div>}
      {plan.isCurrent && <div className="current-badge">Current Plan</div>}
      <h3>{plan.name}</h3>
      <div className="price">
        <span className="currency">$</span>
        <span className="amount">{plan.price}</span>
        <span className="period">/month</span>
      </div>
      <ul className="features">
        {plan.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button
        className="select-plan-button"
        onClick={() => onSelect(plan.id)}
        disabled={plan.isCurrent}
      >
        {plan.isCurrent ? "Current Plan" : "Select Plan"}
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
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { openModal, closeModal } = useModal();
  const isProcessing = useAppSelector(
    (state) => state.topup.loading.notification
  );
  const [plans] = useState<BillingPlan[]>(dummyPlans);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

  useEffect(() => {
    handlePaymentCallback();
  }, [location.search, handlePaymentCallback]);

  useEffect(() => {
    if (location.state?.paymentSuccess) {
      handleOpenModal();
    }
  }, [location.state, handleOpenModal]);

  return (
    <motion.section
      className="px-10 py-2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="billing-container">
        <div className="billing-header">
          <h1>Billing & Plans</h1>
          <p>Choose the plan that best fits your needs</p>
        </div>

        <motion.div
          // variants={containerVariants}
          // initial="hidden"
          // animate="show"
          className="plans-grid"
        >
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              idx={index}
              plan={plan}
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
