import React from "react";
import { CgSpinner } from "react-icons/cg";


const DeleteInstructionModal: React.FC<any> = ({ handleClose, deleteSource, loading }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="bg-white p-8 w-[496px] text-center rounded-lg shadow-lg">
        {/* Your content goes here */}
        <h1 className="text-2xl font-medium mt-8">Delete Source</h1>
        <p className="text-[#828282] text-sm mt-12">
          Are you sure you want to delete this source? Doing this removes
          information from your assistant's memory permanently.
        </p>
        <div className="w-full grid grid-cols-2 items-center justify-end mt-14 gap-3">
          <button
            onClick={handleClose}
            className="cursor-pointer outline-none py-[10px] w-auto px-5 border border-[#D0D5DD] rounded-lg text-[#828282] text-xs font-semibold"
          >
            Cancel
          </button>
          {loading ? (
            <button className="outline-none py-[10px] w-auto px-5 bg-[#AF202D] rounded-lg text-white text-xs font-semibold flex justify-center">
              <CgSpinner className=" animate-spin text-lg " />
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
    </div>
  );
}

export default DeleteInstructionModal;
