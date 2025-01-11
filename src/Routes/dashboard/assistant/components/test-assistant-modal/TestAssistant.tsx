import { useAppSelector } from "@/redux-slice/hooks";
import { memo, useCallback, useState } from "react";
import { TourOverlay } from "./TourOverlay";
import { AgentButton } from "./AgentButton";
import { Application } from "@/types/applications.types";
import { TestAssistantPopup } from "./TestAssistantPopup";
import { AnimatePresence, motion } from "framer-motion";

interface TestAssistantProps {
  propShowPopUp: boolean;
  setPropShowPopUp: (show: boolean) => void;
}

const TestAssistant: React.FC<TestAssistantProps> = ({
  propShowPopUp,
  setPropShowPopUp,
}) => {
  //TODO: identify what application(assistant) is selected and render info based on that
  //TODO: activate this modal only if the memory is non-empty
  //TODO: global state management for opening and closing this modal
  const activeAssistantID = useAppSelector(
    (state) => state.applications.selectedApplication
  );
  const assistant = useAppSelector((state) =>
    state.applications.applications.find((app) => app.id === activeAssistantID)
  );
  const memory = useAppSelector((state) => state.memory.memoryFiles);
  //   const showTour = useAppSelector((state) => state.chat.testEmployeeTour);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [isMinimizing, setIsMinimizing] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    localStorage.setItem("testEmployeePopup", "true");
    setShowPopUp(true);
  }, [setShowPopUp]);

  const handleClose = useCallback(() => {
    setIsMinimizing(true);
    setTimeout(() => {
      setShowPopUp(false);
      setIsMinimizing(false);
      setPropShowPopUp(false);
    }, 500);
  }, [setShowPopUp, setPropShowPopUp, setIsMinimizing]);

  return (
    <main className="font-figtree">
      {/* {
        // showTour && (
        <TourOverlay
          onTest={handleOpen}
          onClose={() => {}
            // () => dispatch(showTestemployeeTour(false))
        }
        />
      )} */}
      <AnimatePresence mode="wait">
        {(!showPopUp || !propShowPopUp) && (
          <motion.aside
            initial={{ opacity: 0, x: 200 }}
            exit={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.8 }}
            className="fixed z-10 bottom-10 right-[26px]"
          >
            <AgentButton
              agent={assistant as Application}
              onClick={handleOpen}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(showPopUp || propShowPopUp) && (
          <TestAssistantPopup
            handleClose={handleClose}
            isMinimizing={isMinimizing}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default memo(TestAssistant);
