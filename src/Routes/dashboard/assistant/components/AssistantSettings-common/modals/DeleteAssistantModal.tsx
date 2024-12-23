import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/Modal";
import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useToast } from "@/contexts/ToastContext";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import React, { useCallback } from "react";

const DeleteAssistantModal: React.FC<any> = () => {
 const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const data = useAppSelector((state) => state.mfa);
  

  const onClose = useCallback(() => {
    closeModal(MODAL_IDS.custom("delete-assistant-modal"));
  }, [closeModal]);

  return (
    <Modal title="Delete Assistant" onClose={onClose}>
      <Modal.Header>
        <p></p>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center text-sm font-medium text-[#828282]">
          Enter the code from your authenticator app
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className=" flex gap-[24px] mt-12">
          <Button
            onClick={onClose}
            className="!border !border-[#D0D5DD] w-full py-2 rounded-lg text-sm font-semibold !text-[#7F7f81]"
          >
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAssistantModal;