import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";
import SupportContent from "./SupportContent";
import { ClickState } from "../types";
import { useInitialState } from "../hooks/useInitialState";

// Define initial state
const initialState: ClickState = {
  Pricing: false,
  Faqs: false,
  Contact_Us: false,
  Speak_with_CEO: false,
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Support: React.FC = () => {
  const { clickItem, handleCheckboxChange } = useInitialState();

  // Memoize the support content props
  const supportContentProps = useMemo(
    () => ({
      handleCheckboxChange,
      clickItem,
    }),
    [handleCheckboxChange, clickItem]
  );

  return (
    <motion.section
      className="px-10 py-2"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <SupportContent {...supportContentProps} />
      </AnimatePresence>
    </motion.section>
  );
};

export default React.memo(Support);
