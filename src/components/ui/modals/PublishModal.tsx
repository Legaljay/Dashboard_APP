import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useToast } from "@/contexts/ToastContext";
import {
  AppDraft,
  fetchDraft,
  publishDraft,
} from "@/redux-slice/app-draft/app-draft.slice";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useLocation, useParams } from "react-router";
import { Modal } from "../modal/Modal";
import { Button } from "../button/button";
import useChangeDetector, {
  ChangeCategory,
  ChangeType,
  DetailedChange,
} from "@/hooks/useChangeDetector";

const keys = {
   "icon_url" : "Assistant Image",
   "app_key" : "Assistant Application Key", 
   "type" : "Assistant Type",
   "name" : "Assistant Name",
   "deactivated" : "Deactivated Assistant",
   "is_deleted" : "Deleted Assistant", 
   "sale_agent_name" : "Assistant Sale Name",
   "switch_app_type" : "Switched Assistant Type",
   "description" : "Assistant Description",
   "personality_type" : "Assistant Personality",
   "is_light" : "Assistant Theme",
   "verbose" : "Assistant Verbosity",
} as const;

const PublishModal: React.FC<any> = () => {
  //   const location = useLocation();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const { assistantId = "" } = useParams();

  const assistant = useAppSelector(
    (state) => state.applications.selectedApplication
  ) as string;

  const appDrafts = useAppSelector((state) => state.appDraft.draft);
  const loading = useAppSelector(
    (state) => state.appDraft.loading.publish
  ) as boolean;

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
  }, [assistantId, assistant]);

  // Format value for display
  const formatValue = (value: any): string => {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Render single change
  const renderChange = useCallback((change: DetailedChange) => {
    // const pathString = change.path.join(" > ");
    const key = change.path[change.path.length - 1];
    const parent = change.path[0];
    const pathString = parent + " : " + keys[key as keyof typeof keys];


    switch (change.type) {
      case ChangeType.ADDED:
        return (
          <code>
            <span className="text-sm font-bold text-PRIMARY">Added</span>{" "}
            {pathString}
            {""}: <strong>{formatValue(change.newValue)}</strong>
          </code>
        );
      case ChangeType.REMOVED:
        return (
          <code>
            <span className="text-sm font-bold text-PRIMARY">Removed</span>{" "}
            {pathString}
            {""}: <strong>{formatValue(change.oldValue)}</strong>
          </code>
        );
      case ChangeType.UPDATED:
        return (
          <code>
            <span className="text-sm font-bold text-PRIMARY">Changed</span>{" "}
            {pathString} from <strong>{formatValue(change.oldValue)}</strong> to{" "}
            <strong>{formatValue(change.newValue)}</strong>
          </code>
        );
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
            instructions: [],
          };
        case ChangeCategory.INSTRUCTIONS:
          return {
            application: [],
            plugins: [],
            memory: [],
            instructions: instructions,
          };
        case ChangeCategory.MEMORY:
          return {
            application: [],
            plugins: [],
            memory: memory,
            instructions: [],
          };
        case ChangeCategory.PLUGINS:
          return {
            application: [],
            plugins: plugins,
            memory: [],
            instructions: [],
          };
        default:
          return {
            application: [activeAssistant],
            plugins: [],
            memory: [],
            instructions: [],
          };
      }
    }
    return {
      application: [activeAssistant],
      plugins: [],
      memory: [],
      instructions: [],
    };
  }, [activeAssistant, instructions, memory, plugins, getDraftCategory]);

  console.log(checkPreviousData()); //TODO: remove later

  const changes = useChangeDetector(
    appDraftchanges as AppDraft,
    checkPreviousData() as Record<ChangeCategory, any>
  );

  const handlePublish = useCallback(async () => {
    // if (!assistantId || !assistant) return;
    try {
      await dispatch(publishDraft(assistantId || assistant)).unwrap();
      await dispatch(fetchDraft(assistantId || assistant));
      //   .then(() => {
      //     if (location.pathname.includes("plugins")){ //this checks the path before getting new data
      //       dispatch(getAllPlugins({ applicationId }))
      //   .then(() => {
      //     if (location.pathname.includes("plugins")){ //this checks the path before getting new data
      //       dispatch(getAllPlugins({ applicationId }))
      //     }else if (location.pathname.includes("dashboard")){// this checks the path and stores the new data
      //       dispatch(getApplicationById()).then((res) => {
      //         // console.log(res, "tag res");
      //         dispatch(setAgent(res?.payload?.data[0]))
      //       })
      //     }
      //   });
      //TODO: close modal
      addToast("success", "Changes Published Successfully");
      handleClose();
    } catch (e: any) {
      addToast("error", e.data.message);
    }
  }, [assistantId, assistant]);

  const handleClose = useCallback(() => {
    closeModal(MODAL_IDS.custom("publish-modal"));
  }, [closeModal]);

  if (changes.length === 0) return null;

  return (
    <Modal
      title="Publish Changes"
      description="Are you sure you want to make your changes live?"
      onClose={handleClose}
    >
      <Modal.Body>
        <div className="bg-white dark:bg-background-dark rounded-xl h-fit">
          <p className="text-sm font-medium">Review Changes</p>
          <div className="overflow-y-scroll max-h-[300px]">
            {changes.map((categorySummary) => (
              <div key={categorySummary.category} className="mb-4">
                <h3 className="font-medium text-blue-600">
                  {categorySummary.category.toUpperCase()}
                  {` (${categorySummary.totalChanges} change${
                    categorySummary.totalChanges !== 1 ? "s" : ""
                  })`}
                </h3>
                <ul className="mt-2 space-y-2">
                  {categorySummary.detailedChanges.map((change, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {renderChange(change)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex gap-2 justify-end mt-8">
            <Button
              disabled={loading}
              variant="outlined"
              className="bg-WHITE-_100 !hover:bg-opacity-95 border w-full border-gray h-[34px] rounded-lg"
              onClick={handleClose}
            >
              <p className="text-[#828282] text-[12px] font-medium">Cancel</p>
            </Button>
            <Button
              disabled={loading}
              variant="black"
              className="bg-BLACK-_500 w-full h-[34px] rounded-lg !hover:bg-opacity-95"
              onClick={handlePublish}
            >
              {loading ? (
                <span className="flex justify-center w-full">
                  <CgSpinner className="text-lg animate-spin text-WHITE-_100" />
                </span>
              ) : (
                <p className="text-WHITE-_100 text-[12px] font-medium">
                  Publish
                </p>
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PublishModal;
