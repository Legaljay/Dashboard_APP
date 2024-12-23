import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import PublishModal from "./PublishModal";
import { AppDraft, fetchDraft } from "@/redux-slice/app-draft/app-draft.slice";

import useChangeDetector, {
  ChangeCategory,
  ChangeType,
  DetailedChange,
} from "@/hooks/useChangeDetector";

// interface ChangesBannerProps {
//     setPropShowPopUp: React.Dispatch<React.SetStateAction<boolean>>;
//     navigateToIntegrations?: () => void;
// }

// const ChangesBanner: React.FC<ChangesBannerProps> = ({ setPropShowPopUp ,navigateToIntegrations}) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { openModal } = useModal();
//   const { assistantId = "" } = useParams();
//   const assistant = useAppSelector((state) => state.applications.selectedApplication) as string;
//   const activeAssistant = useAppSelector((state) => state.applications.applications.find((app) => app.id === (assistantId || assistant)));

//   const appDraftchanges = useAppSelector((state) => state.appDraft.draft);

//   const [draftchanges, Setdraftchanges] = useState(3);

//   const getDraft = async () => {
//     dispatch(fetchDraft(assistantId || assistant));
//   };

//   useEffect(() => {
//     if(assistantId || assistant){
//         getDraft();
//     }
//   }, [assistantId, assistant]);

// //   const appDraftchanges = appDetail.draftChanges;
//   const openPublishModal = () => {
//     openModal(
//         MODAL_IDS.custom("publish-modal"),
//         <PublishModal/>, { preventScroll: true }
//     );
//   };

//   return (
//     <div className="mb-4">
//       {!!appDraftchanges?.length && (
//         <div className="bg-lightGold px-10 py-2 flex justify-between items-center">
//           <div>
//             <p className="text-darkBrown text-sm font-medium">
//               {appDraftchanges.length} change{appDraftchanges.length > 1 && "s"}{" "}
//               detected!
//             </p>
//             <p className="text-xs text-dBrown">
//               We detected a few changes. You can
//               <span
//                 className="underline cursor-pointer mx-1"
//                 onClick={() => {
//                   setPropShowPopUp(true);
//                 }}
//               >
//                 Test these changes
//               </span>
//               or Publish them now to your
//               <span
//                 className="underline cursor-pointer mx-1"
//                 onClick={() => {
//                   navigateToIntegrations && navigateToIntegrations();
//                   navigate("/agent", { state: "Integrations/Deploy" });
//                 }}
//               >
//                 Channels
//               </span>
//             </p>
//           </div>
//           <p
//             className="underline text-sm cursor-pointer"
//             onClick={openPublishModal}
//           >
//             Publish Changes
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChangesBanner;

// // Change Banner Component
// export default function ChangesBanner({
//     currentData,
//     previousData
//   }: {
//     currentData: Record<ChangeCategory, any>,
//     previousData: Record<ChangeCategory, any>
//   }) {
//     const changes = useChangeDetector(currentData, previousData);

//     // Render changes with detailed information
//     const renderChanges = () => {
//       if (changes.length === 0) {
//         return null;
//       }

//       return (
//         <div className="changes-banner">
//           <h2>Detected Changes</h2>
//           {changes.map(categorySummary => (
//             <div
//               key={categorySummary.category}
//               className="category-changes"
//             >
//               <h3>
//                 {categorySummary.category.toUpperCase()}
//                 {` (${categorySummary.totalChanges} change${categorySummary.totalChanges !== 1 ? 's' : ''})`}
//               </h3>
//               <ul>
//                 {categorySummary.detailedChanges.map((change, index) => (
//                   <li key={index}>
//                     <strong>Path:</strong> {change.path.join(' > ')}
//                     <br />
//                     <strong>Type:</strong> {change.type}
//                     <br />
//                     <strong>Old Value:</strong> {JSON.stringify(change.oldValue)}
//                     <br />
//                     <strong>New Value:</strong> {JSON.stringify(change.newValue)}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       );
//     };

//     return renderChanges();
//   }

interface ChangesBannerProps {
  setPropShowPopUp?: React.Dispatch<React.SetStateAction<boolean>>;
  navigateToIntegrations?: () => void;
  currentData?: Record<ChangeCategory, any>;
  previousData?: Record<ChangeCategory, any>;
}

function ChangesBanner({
  currentData,
  previousData,
  setPropShowPopUp,
  navigateToIntegrations,
}: ChangesBannerProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { assistantId = "" } = useParams();

  const assistant = useAppSelector(
    (state) => state.applications.selectedApplication
  ) as string;

  const activeAssistant = useAppSelector((state) =>
    state.applications.applications.find(
      (app) => app.id === (assistantId || assistant)
    )
  );

  const memory = useAppSelector((state) => state.memory.memoryFiles);

  const instructions = useAppSelector(
    (state) => state.appInstructions.instructions
  );

  const appDraftchanges = useAppSelector((state) => state.appDraft.draft);

  const plugins = useAppSelector((state) => state.plugins.plugins);

  const getDraft = async () => {
    dispatch(fetchDraft(assistantId || assistant));
  };

  useEffect(() => {
    if (assistantId || assistant) {
      getDraft();
    }
  }, [assistantId, assistant, dispatch]);

  const openPublishModal = () => {
    openModal(MODAL_IDS.custom("publish-modal"), <PublishModal />, {
      preventScroll: true,
      size: "2xl",
    });
  };

  // Format value for display
  const formatValue = (value: any): string => {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Render single change
  const renderChange = useCallback((change: DetailedChange) => {
    const pathString = change.path.join(" > ");

    switch (change.type) {
      case ChangeType.ADDED:
        return `Added ${pathString}: ${formatValue(change.newValue)}`;
      case ChangeType.REMOVED:
        return `Removed ${pathString}: ${formatValue(change.oldValue)}`;
      case ChangeType.UPDATED:
        return `Changed ${pathString} from ${formatValue(
          change.oldValue
        )} to ${formatValue(change.newValue)}`;
      case ChangeType.ARRAY_CHANGED:
        return `Array changed at ${pathString}`;
      default:
        return "Unknown change type";
    }
  }, []);

  const getDraftCategory = useCallback(() => {
    if (appDraftchanges) {
      if (appDraftchanges.application?.length > 0)
        return ChangeCategory.APPLICATION;
      if (appDraftchanges.plugins?.length > 0) return ChangeCategory.PLUGINS;
      if (appDraftchanges.memory?.length > 0) return ChangeCategory.MEMORY;
      if (appDraftchanges.instructions?.length > 0)
        return ChangeCategory.INSTRUCTIONS;
    }
    return null;
  }, [appDraftchanges]);

  const draftCategory = getDraftCategory();
  const checkPreviousData = useCallback(() => {
    if (draftCategory) {
      switch (draftCategory) {
        case ChangeCategory.APPLICATION:
          return {
            application: [activeAssistant],
            plugins: [],
            memory: [],
            instructions: []
          };
        case ChangeCategory.INSTRUCTIONS:
          return {
            application: [],
            plugins: [],
            memory: [],
            instructions: instructions
          };
        case ChangeCategory.MEMORY:
          return {
            application: [],
            plugins: [],
            memory: memory,
            instructions: []
          };
        case ChangeCategory.PLUGINS:
          return {
            application: [],
            plugins: plugins,
            memory: [],
            instructions: []
          };
        default:
          return {
            application: [activeAssistant],
            plugins: [],
            memory: [],
            instructions: []
          };
      }
    }
    return {
      application: [activeAssistant],
      plugins: [],
      memory: [],
      instructions: []
    };
  }, [activeAssistant, instructions, memory, plugins, getDraftCategory]);

  const changes = useChangeDetector(
    appDraftchanges as AppDraft,
    checkPreviousData() as Record<ChangeCategory, any>
  );

  if (changes.length === 0) return null;

  return (
    <div className="changes-banner p-4 bg-lightGold">
      <div className="px-10 py-2 flex justify-between items-center">
        <div>
          <p className="text-xs text-dBrown">
            We detected {changes.map((categorySummary) => (
              <span key={categorySummary.category}>
                <span className="font-medium text-blue-600">
                  {` (${categorySummary.totalChanges} change${
                      categorySummary.totalChanges !== 1 ? "s" : ""
                    })`}{" "}to{" "}
                    {categorySummary.category.toUpperCase()}
                </span>
                </span>
            ))}. You can
            <span
              className="underline cursor-pointer mx-1"
              onClick={() => {
                setPropShowPopUp?.(true);
              }}
            >
              Test these changes
            </span>
            or Publish them now to your
            <span
              className="underline cursor-pointer mx-1"
              onClick={() => {
                navigateToIntegrations && navigateToIntegrations();
                navigate("/agent", { state: "Integrations/Deploy" });
              }}
            >
              Channels
            </span>
          </p>
        </div>
        <p
          className="underline text-sm cursor-pointer"
          onClick={openPublishModal}
        >
          Publish Changes
        </p>
      </div>
    </div>
  );
}

export default ChangesBanner;
