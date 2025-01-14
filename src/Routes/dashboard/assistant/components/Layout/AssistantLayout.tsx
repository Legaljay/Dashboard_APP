import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Aside from "./Aside";
import LoadingSpinner from "@/LoadingFallback";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { AssistantsRoutes } from "./routes";


const Archives = lazy(() => import("../Archives"));
const AddInstruction = lazy(() => import("../AddInstruction"));
const EditFeature = lazy(() => import("../EditFeature"));
const ViewFeature = lazy(() => import("../ViewFeature"));

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};


const AssistantLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex w-full h-full">
      <nav className="pt-[35px] px-5 bg-inherit flex flex-col gap-5 select-none border-r border-[#F7F7F7] dark:border-secondary-800">
        <Aside />
      </nav>
      <main className="w-full h-full">
        <div
          className="w-full p-10 !sticky top-[0] z-0 overflow-y-scroll hide-scrollbar"
          style={{
            height: "calc(92vh)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-[80svh]">
                    <LoadingSpinner />
                  </div>
                }
              >
                <Routes location={location}>
                  {Object.values(AssistantsRoutes).map(({ path, component: Component }) => (
                    <Route
                      key={path}
                      path={path}
                      element={<Component />}
                    />
                  ))}
                  <Route index element={<Navigate to="memory" replace />}/>
                  {/* <Route path=":id/:type" element={<ViewFeature />} />
                  <Route path=":type/archives" element={<Archives />} />
                  <Route path=":type/:name/:mId/view-instruction" element={<EditFeature />} />
                  <Route path=":type/add-instruction" element={<AddInstruction />} /> */}
                </Routes>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AssistantLayout;
