import { Button } from "@/components/ui/button/button";
import { memo, useCallback } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Purse from '@/assets/svg/purse.svg';

const CurrentPlanCard = () => {
  const navigate = useNavigate();

  const handleViewPlan = useCallback(() => {
    navigate("/dashboard/billing/plans");
  }, []);

  const currentPlanName = "Basic";
  return (
    <div
      className="w-[373px] h-[168px] py-6 px-5 rounded-xl flex flex-col justify-between gap-1 p-6"
      style={{
        boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)",
        background: "linear-gradient(160deg,#F8C4D326 2%,  #1774FD08 68%)",
      }}
    >
      <div className="flex justify-between">
        <div>
          <img src={Purse} alt="wallet" height={24} width={24} loading="lazy"/>
        </div>
        <Button variant="ghost" className="flex gap-1 text-BLUE-_200">
          <p className="text-xs text-BLUE-_200" onClick={handleViewPlan}>
            View To Upgrade Plan
          </p>
          <BsArrowRight className="" />
        </Button>
      </div>
      <p className="text-BLACK-_300 text-xs">Current Plan</p>
      <p className="text-[20px] leading-[24px] text-[#052C67] font-semibold">
        {currentPlanName}
      </p>
    </div>
  );
};

export default memo(CurrentPlanCard);
