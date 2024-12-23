import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/Modal";
import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useToast } from "@/contexts/ToastContext";
import { fetchDraft } from "@/redux-slice/app-draft/app-draft.slice";
import { deactivateApplication, fetchApplications } from "@/redux-slice/applications/applications.slice";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import React, { useCallback } from "react";

interface DeactivateAssistantModalProps {
  assistantId: string;
  isActive: boolean;
  // updateAssistatantState: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeactivateAssistantModal: React.FC<DeactivateAssistantModalProps> = ({
  assistantId,
  isActive,
  // updateAssistatantState,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const deactivating = useAppSelector((state) => state.applications.updating);

  const onClose = useCallback(() => {
    closeModal(MODAL_IDS.custom("deactivate-assistant-modal"));
  }, [closeModal]);

  const handleAssistantActiveStatus = async () => {
    try {
      await dispatch(deactivateApplication(assistantId)).unwrap();
      await dispatch(fetchApplications())
      // await dispatch(fetchDraft(assistantId));
      addToast("success", "Assistant deactivated successfully");
      onClose();
    } catch (error: any) {
      addToast("error", error?.message || "Failed to verify code");
    }
  };

  return (
    <Modal title="Deactivate Assistant" onClose={onClose}>
      <Modal.Body>
        <p className="text-center text-sm font-medium text-[#828282]">
          Are you sure you want to {isActive ?  "activate" : "deactivate"} this Assistant? Doing this {isActive ? "allows": "stops"}
          any interaction between the Assistant and your Customers.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2 items-end">
          <Button
            onClick={onClose}
            className="hover:bg-[#FAFAFA] !border !border-[#D0D5DD] bg-transparent w-full py-2 rounded-lg text-sm font-semibold !text-[#7F7f81]"
          >
            Cancel
          </Button>
          <Button
            variant={"black"}
            className="w-full"
            disabled={deactivating}
            onClick={handleAssistantActiveStatus}
          >
            {deactivating ? (!isActive ? "Deactivating..." : "Activating...") : (!isActive ? "Deactivate" : "Activate")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeactivateAssistantModal;
