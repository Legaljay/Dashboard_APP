import React from "react";
import backgroundImage from "@/assets/img/backdrop.svg";

interface ConfirmModalProps {
  handleClose: () => void;
  handleDontShow: () => void;
  handleUploadTrain: () => void;
  purpose: string;
  id?: string;
}

interface TrainingStep {
  text: string;
  key: string;
}

const TRAINING_STEPS: TrainingStep[] = [
  {
    key: "simplification",
    text: "Data will be simplified for your Digital Assistant to understand.",
  },
  {
    key: "filtering",
    text: "Any data unrelated to the '{purpose}' category will be removed from document.",
  },
  {
    key: "processing",
    text: "Complete training may take up to 48 hours and you'll be notified on completion. You will also be notified where one or more context is required.",
  },
];

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  handleClose,
  handleDontShow,
  handleUploadTrain,
  purpose,
}) => {
  const renderTrainingSteps = () => (
    <ul className="UlListStyle pl-9 flex flex-col gap-7">
      {TRAINING_STEPS.map((step) => (
        <li key={step.key}>
          {step.text.replace("{purpose}", purpose)}
        </li>
      ))}
    </ul>
  );

  const renderActionButtons = () => (
    <div className="flex justify-between w-full items-center mt-12">
      <button
        className="bg-transparent border border-[#D0D5DD] text-[#828282] py-[10px] px-5 rounded-lg font-semibold text-xs hover:bg-gray-50 transition-colors"
        onClick={handleClose}
        type="button"
      >
        Cancel
      </button>
      <button
        className="bg-[#121212] text-white py-3 px-4 rounded-lg text-xs font-semibold hover:bg-[#2a2a2a] transition-colors"
        onClick={handleUploadTrain}
        type="button"
      >
        Continue
      </button>
    </div>
  );

  return (
    <div className="bg-WHITE-_100 rounded-lg w-[617px] h-fit mt-[75px]">
      <div
        className="w-full flex justify-end h-[175px] px-6"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="mt-7">
          <button
            className="bg-white text-[#7F7F81] text-xs rounded-lg flex cursor-pointer justify-end items-center p-2 hover:bg-gray-50 transition-colors"
            onClick={handleDontShow}
            type="button"
          >
            Don't show this again
          </button>
        </div>
      </div>
      
      <div className="pb-10 pt-3 px-10">
        <h2 className="text-bamboo text-[22px] mb-8 text-center font-semibold">
          What Happens When You Train
        </h2>
        
        {renderTrainingSteps()}
        
        <div className="mt-10 px-2 py-3 bg-[#F6F7FF] w-fit mx-auto text-skyBlue text-xs">
          Note: Your Digital Assistant will be fully operational while it trains on your data
        </div>

        {renderActionButtons()}
      </div>
    </div>
  );
};

export default ConfirmModal;

