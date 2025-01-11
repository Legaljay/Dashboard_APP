import { Modal } from "@/components/ui/modal/Modal";
import React from "react";
import { CgSpinner } from "react-icons/cg";

interface DeleteInstructionProps {
  handleClose: () => void;
  deleteSource: () => void;
  loading: boolean;
}
const DeleteInstructionModal: React.FC<DeleteInstructionProps> = ({ handleClose, deleteSource, loading }) => {
  return (
    <Modal title="Delete Source" onClose={handleClose}>
      <div className="p-2 text-center">
        <p className="text-[#828282] text-sm mt-12">
          Are you sure you want to delete this source? Doing this removes
          information from your assistant's memory permanently.
        </p>
        <div className="grid grid-cols-2 gap-3 justify-end items-center mt-14 w-full">
          <button
            onClick={handleClose}
            className="cursor-pointer outline-none py-[10px] w-auto px-5 border border-[#D0D5DD] rounded-lg text-[#828282] text-xs font-semibold"
          >
            Cancel
          </button>
          {loading ? (
            <button className="outline-none py-[10px] w-auto px-5 bg-[#AF202D] rounded-lg text-white text-xs font-semibold flex justify-center">
              <CgSpinner className="text-lg animate-spin" />
            </button>
          ) : (
            <button
              onClick={deleteSource}
              className="cursor-pointer outline-none py-[10px] w-auto px-5 bg-[#AF202D] rounded-lg text-white text-xs font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default DeleteInstructionModal;
