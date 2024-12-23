import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/Modal";
import React from "react";
import { CgSpinner } from "react-icons/cg";

interface DeleteServiceProps {
  loading: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  key: string;
}

const DeleteService: React.FC<DeleteServiceProps> = ({
  loading,
  handleClose,
  handleDelete,
  key,
}) => {
  return (
    <Modal title="Remove Instruction" onClose={handleClose} key={key}>
      <Modal.Body>
        <p className="text-center text-sm font-medium text-[#828282]">
          Are you sure you want to remove this instruction? Doing this removes
          the instruction from your Assistant’s Instruction list and would
          require that you create it again if you need it later.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className=" flex gap-[24px] mt-12">
          <Button
            onClick={handleClose}
            className="!border !border-[#D0D5DD] w-full py-2 rounded-lg text-sm font-semibold !text-[#7F7f81]"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={handleDelete}
            className="w-full py-2 rounded-lg !bg-[#AF202D] text-sm !text-white font-bold"
          >
            {loading ? (
              <span className="flex justify-center w-full">
                <CgSpinner className=" animate-spin text-lg text-WHITE-_100" />
              </span>
            ) : (
              <p className="text-WHITE-_100 text-[12px] font-medium">Remove</p>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteService;
