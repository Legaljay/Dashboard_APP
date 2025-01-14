import { memo } from "react";
import isotoxal from "@/assets/svg/isotoxal.svg";
import { Modal } from "@/components/ui/modal/Modal";
import { useNavigate } from "react-router-dom";

interface UpgradePlanPromptModalProps {
  handleClose: () => void;
  amount: string;
  type: "assistant" | "integrate" | "team";
  nextPlanName: string;
  handleNext: () => void;
}

const PromptDetailTypeWithData = {
  assistant: {
    image: isotoxal,
    text: "Get monthly technical support from an AI specialist on the ready for all your setup needs and more!",
    title: "Setup Assistance",
  },
  integrate: {
    image: isotoxal,
    text: "Add your assistant to WhatsApp for your customers to interact with fast and easy",
    title: "Integrate To WhatsApp",
  },
  team: {
    image: isotoxal,
    text: "Add your team members for easy collaboration and support",
    title: "Invite Team Members",
  },
} as const;

const UpgradePlanPromptModal: React.FC<UpgradePlanPromptModalProps> = ({
  handleClose,
  amount,
  nextPlanName,
  handleNext,
  type,
}) => {
  const navigate = useNavigate();
  return (
    <Modal title={`Upgrade To ${nextPlanName ?? "Plan"}`} onClose={handleClose}>
      <Modal.Body>
        <div>
          <div className="flex justify-center items-center">
            <img
              src={PromptDetailTypeWithData[type].image}
              alt="isotoxal"
              className="w-[85.98px] h-[86px]"
            />
            <span className="bg-[#1774FD] text-white rounded-[80px] py-[2px] px-[6px] text-[10px] self-end ml-[-30px]">
              {nextPlanName ?? "Plan"}
            </span>
          </div>
          <div className="flex flex-col gap-[22px] my-[32px]">
            <div className="flex flex-col gap-[15px]">
              <h1 className="text-[20px] font-medium leading-[21.5px] text-[#101828] dark:text-WHITE-_100 text-center">
                {PromptDetailTypeWithData[type].title}
              </h1>
              <p className="text-[14px] text-[#828282] leading-[19px] text-center">
                {PromptDetailTypeWithData[type].text}
              </p>
            </div>
            <p className="text-[14px] text-[#828282] leading-[9px] text-center">
              for
            </p>
            <div className="flex justify-center items-center">
              <p className="dark:text-WHITE-_100">${amount}</p>{" "}
              <span className="text-[12px] leading-[16.62px] text-[#828282]">
                / per month
              </span>
            </div>
          </div>
          <div className="flex justify-center" onClick={handleNext}>
            <button className="w-full px-5 py-1.5 rounded-lg bg-[#1774FD] text-[12px] text-[#ffffff]">
              Upgrade to plan
            </button>
          </div>
          <p
            className="text-[10px] leading-[12.85px] text-[#1774FD] text-center underline mt-[12px] cursor-pointer"
            onClick={() => navigate("/settings?page=billing&category=plan")}
          >
            View Other Plans
          </p>
        </div>
        </Modal.Body>
    </Modal>
  );
};

export default memo(UpgradePlanPromptModal);
