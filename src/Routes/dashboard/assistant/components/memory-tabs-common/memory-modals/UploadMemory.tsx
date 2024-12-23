import React from "react";
import UploadGif from "@/assets/gif/uploadAnimation.gif";
import LoadingGif from "@/assets/gif/loading.gif";
import { Modal } from "@/components/ui/modal/Modal";

const UploadMemory: React.FC<any> = ({ handleClose, key }) => {
  return (
    <Modal key={key} onClose={handleClose}>
      <img src={UploadGif} alt="upload" className="w-[100px] h-[100px]" />
      <div className="flex flex-col justify-center items-center gap-[32px]">
        <p className="text-[#101828] font-medium text-2xl">Building Memory</p>
        <p className="text-[#7F7F81] text-base">Training Assistant</p>
      </div>
      <div className="pb-[26px]">
        <img src={LoadingGif} alt="loading" className="w-[287px] h-[4px] " />
      </div>
    </Modal>
  );
};

export default React.memo(UploadMemory);
