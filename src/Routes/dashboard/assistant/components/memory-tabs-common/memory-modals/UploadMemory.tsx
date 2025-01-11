import React from "react";
import UploadGif from "@/assets/gif/uploadAnimation.gif";
import LoadingGif from "@/assets/gif/loading.gif";
import { Modal } from "@/components/ui/modal/Modal";
import { useAppSelector } from "@/redux-slice/hooks";
import { Progress } from "@/components/ui/progress";

const UploadMemory: React.FC<any> = ({ handleClose, key }) => {
  const progress = useAppSelector((state) => state.memory.progress);
  return (
    <Modal key={key} onClose={handleClose}>
      <Modal.Body className="flex flex-col justify-center items-center">
        <img src={UploadGif} alt="upload" className="w-[100px] h-[100px]" />
        <div className="flex flex-col justify-center items-center gap-[32px]">
          <p className="text-[#101828] font-medium text-2xl">Building Memory</p>
          <p className="text-[#7F7F81] text-base">Training Assistant</p>
        </div>
        <div className="pb-[26px]">
          <Progress value={progress} className="!bg-BLUE-_100" />
          {/* <img src={LoadingGif} alt="loading" className="w-[287px] h-[4px] " /> */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(UploadMemory);
