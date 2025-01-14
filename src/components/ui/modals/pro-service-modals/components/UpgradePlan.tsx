import React, { memo, useCallback, useMemo } from "react";
import info from "@/assets/svg/infocircle.svg";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import {
  Subscription,
  upgradeSubscription,
} from "@/redux-slice/business-subscription/business-subscription.slice";
import { Modal } from "@/components/ui/modal/Modal";

interface UpgradePlanProps {
  handleClose: () => void;
  handleNext: () => void;
  refresh: () => void;
  data: Subscription;
  giftBalance: string;
  walletCredit: string;
  is_sufficientBalance: boolean;
}

const UpgradePlan: React.FC<UpgradePlanProps> = ({
  data,
  giftBalance,
  handleClose,
  handleNext,
  refresh,
  walletCredit,
  is_sufficientBalance,
}) => {
  const {
    name = "",
    description = "",
    features = [],
    monthly_amount = 0,
  } = data || {}; 

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const business = useAppSelector((state) => state.business.activeBusiness);
  const businessID = business?.id;


  const handleUpgrade = useCallback(async () => {
    if (is_sufficientBalance) {
        handleNext();
      //   setSufficient(true);
      //   setOpenPayModal(true);
      return;
    } else {
      await dispatch(upgradeSubscription(businessID as string)).unwrap();
      //   api
      //     .post(`/business-subscription/upgrade/${id}`)
      //     .then((res) => {
      //       openRedeemSuccessPop();
      //       refresh();
      //     })
      //     .catch((error) => console.log(`We could not process because ${error}`));
    }
  }, [is_sufficientBalance]);

  //   console.log(sufficient < Number(monthly_amount), "totalll");

  //   console.log(sufficient, giftBalance, Number(tokens), "sufficient");

  const openRedeemSuccessPop = useCallback(() => {
    // setOpenRedeemSuccess(true);
    handleClose();
  }, [handleClose]);

  const handleOpenPricing = useCallback(() => {
    navigate("/dashboard/support", { state: { Pricing: true }});
    handleClose();
  }, [navigate]);

  {
    /* <div className="w-[523.61px] h-[505px] bg-white rounded-[6.47px] flex flex-col justify-between mt-[100px]"> */
  }
  return (
    <Modal title="Upgrade Plan" onClose={handleClose}>
      <Modal.Body>
        <div className="flex flex-col justify-between">
          <div className="">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl leading-[21.5px] text-[#101828] dark:text-WHITE-_100 font-medium">
                  {name}
                </h1>
                <p className="text-[#828282] text-sm leading-[28px]">
                  {description}
                </p>
              </div>

              <div className="flex items-center self-end">
                <h1 className="text-2xl text-[#101828] dark:text-WHITE-_100 font-medium leading-[28.12px]">
                  ${monthly_amount}
                </h1>
                <span className="text-[#828282] text-sm leading-[36.62px]">
                  /per month
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1 mt-4">
                <img src={info} alt="info circle" />
                <button className="p-0" onClick={handleOpenPricing}>
                  <p className="text-[10px] leading-[12.85px] text-[#1774FD] underline">
                    How we charge for subscription
                  </p>
                </button>
              </div>
              <div className="text-[12px] leading-[28px] text-[#828282] flex gap-[2px]">
                <span className="">Next Cycle:</span>
                <span className="">July 23, 2024</span>
              </div>
            </div>
            <ul className="list-disc pl-5 text-[#828282] text-[12px] mt-[9px]">
              {features?.map((item, listItemIndex) => (
                <li key={listItemIndex}>
                  <p className="text-[12px] leading-[25px] font-normal text-[#828282]">
                    {item.prefix} {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="pb-[20px]">
            <hr />
            <p className="text-[12px] leading-[20px] font-normal text-[#828282] mt-[25px]">
              You will be charged monthly on the 23rd from your credits wallet.
              By tapping the button below, you agree to the details above, our{" "}
              <span className="text-[#1774FD]">Terms</span>, our{" "}
              <span className="text-[#1774FD]">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-center">
          <button
            onClick={handleUpgrade}
            className="bg-[#121212] dark:bg-gray-800 text-[#FFFFFF] w-[435px] py-[8px] px-[20px] text-[12px] leading-[24px] font-semibold mx-auto rounded-lg"
          >
            Confirm Upgrade Plan
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(UpgradePlan);
