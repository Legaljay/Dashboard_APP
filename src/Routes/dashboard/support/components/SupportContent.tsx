import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { Pricing, Faq, ReachUs, SpeakWithCEO } from "./sections";
import { ClickState } from "../types";

interface SupportContentProps {
  handleCheckboxChange: (section: keyof ClickState) => void;
  clickItem: ClickState;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Accordion Item Component
const AccordionItem = React.memo(({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <motion.div
    variants={itemVariants}
    className={`px-6 py-5 rounded-xl ${
      isOpen
        ? "bg-white border border-[#E5E5E5] border-solid"
        : "bg-[rgba(252,252,252,0.68)]"
    } cursor-pointer`}
    onClick={onToggle}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    <div className="flex justify-between">
      <p className={`text-[16px] font-normal ${isOpen ? "text-[#121212]" : "text-[#828282]"}`}>
        {title}
      </p>
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <BsChevronUp className="text-xl text-[#828282]" />
        ) : (
          <BsChevronDown className="text-xl text-[#828282]" />
        )}
      </motion.div>
    </div>
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
));

const SupportContent: React.FC<SupportContentProps> = React.memo(({ 
  handleCheckboxChange, 
  clickItem 
}) => {
  return (
    <motion.main
      className="font-figtree mt-2 mb-32"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="text-black text-3xl font-medium"
        variants={itemVariants}
      >
        Need Help?
      </motion.h2>
      <motion.div 
        className="flex justify-between mt-2"
        variants={itemVariants}
      >
        <p className="text-[#7F7F81] text-[14px] font-normal">
          Explore the options below to find answers to your questions or get in touch with us.
        </p>
        <p className="text-[#7F7F81] text-[14px] font-normal">
          support@wano.app
        </p>
      </motion.div>
      
      <motion.section className="flex flex-col gap-6 mt-6">
        <AccordionItem
          title="Pricing"
          isOpen={clickItem.Pricing}
          onToggle={() => {
            handleCheckboxChange("Pricing");
            sessionStorage.removeItem("here");
          }}
        >
          <Pricing />
        </AccordionItem>

        <AccordionItem
          title="FAQs"
          isOpen={clickItem.Faqs}
          onToggle={() => handleCheckboxChange("Faqs")}
        >
          <Faq />
        </AccordionItem>

        <AccordionItem
          title="Contact Us"
          isOpen={clickItem.Contact_Us}
          onToggle={() => handleCheckboxChange("Contact_Us")}
        >
          <ReachUs />
        </AccordionItem>

        <AccordionItem
          title="Speak With the CEO"
          isOpen={clickItem.Speak_with_CEO}
          onToggle={() => handleCheckboxChange("Speak_with_CEO")}
        >
          <SpeakWithCEO />
        </AccordionItem>
      </motion.section>
    </motion.main>
  );
});

export default SupportContent;
