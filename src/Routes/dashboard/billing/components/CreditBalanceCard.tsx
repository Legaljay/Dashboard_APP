import React, { memo, useCallback, useMemo } from "react";
import { BsPlus } from "react-icons/bs";
import Purse from "@/assets/svg/purse.svg";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button/button";
import { MODAL_IDS } from "@/constants/modalIds";
import RedeemGiftModal from "@/components/ui/modals/pro-service-modals/components/RedeemGiftModal";
import RedeemSuccessModal from "@/components/ui/modals/pro-service-modals/components/RedeemSuccessModal";
import { ModalChainStep, useModalChain } from "@/hooks/useModalChain";
import TopupModal from "@/components/ui/modals/pro-service-modals/components/TopupModal";
import PayModal from "@/components/ui/modals/pro-service-modals/components/PayModal";

interface CreditBalanceCardProps {
    walletBalance: any;
    giftBalance: any;
    setOpenTopUp?: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenRedeemGift?: React.Dispatch<React.SetStateAction<boolean>>;
    setCheckWhere?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreditBalanceCard: React.FC<CreditBalanceCardProps> = ({
    walletBalance,
    giftBalance,
    setOpenTopUp,
    setOpenRedeemGift,
    setCheckWhere,
}) => {
  const navigate = useNavigate();
  const { startChain, closeChain, nextInChain } = useModalChain();
  const [amount, setAmount] = React.useState<number>(0);
  const convertedCredit = useMemo(
    () =>
      parseFloat(walletBalance || 0)
        .toFixed(2)
        .toLocaleString(),
    [walletBalance]
  );
  const handleNavigate = useCallback(() => {
    navigate("/dashboard/wallet");
  }, [navigate]);

  const handleClose = useCallback(() => {
    closeChain();
  }, [])

  const handleRedeem = useCallback(() => {
    const steps = [
        {
            id: MODAL_IDS.custom("chain-1"),
            component: (
                <RedeemGiftModal
                    handleClose={handleClose}
                    refresh={handleNavigate}
                    back={handleClose}
                    handleNext={nextInChain}
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
        {
            id: MODAL_IDS.custom("chain-2"),
            component: (
              <RedeemSuccessModal
                handleClose={handleClose}
                title={"Redeem Successful"}
                text1={"You have successfully redeemed your Gift Credits"}
                label={"Done"}
                redirectPath="/dashboard/billing"
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
    ]

    startChain(steps as ModalChainStep[]);
  }, []);

  const handleTopUp = useCallback(() => {
    const steps = [
        {
            id: MODAL_IDS.custom("chain-1"),
            component: (
                <TopupModal
                handleClose={handleClose}
                handleNext={nextInChain}
                setAmount={setAmount}
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
          {
            id: MODAL_IDS.custom("chain-2"),
            component: (
              <PayModal
                handleClose={handleClose}
                handleNext={nextInChain}
                payAmount={amount}
                is_sufficient
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
    ]
    startChain(steps as ModalChainStep[]);
  }, []);

  return (
    <div
      className="min-w-[373px] basis-1 py-5 px-3.5 rounded-xl step-1 space-y-2"
      style={{
        boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)",
        background:
          "linear-gradient(90deg, #F7F7F7 0%, rgba(250, 250, 250, 0.48) 52.26%, #F7F7F7 100.19%)",
      }}
    >
      <div className="flex justify-between">
        <img src={Purse} alt="wallet" />
        <button className="flex gap-1" onClick={handleTopUp}>
          <BsPlus className="text-BLUE-_200" />
          <p className="text-xs text-BLUE-_200">Top-up</p>
        </button>
      </div>
      <div className="flex flex-col w-[119px] gap-2">
        <p className="text-xs text-BLACK-_300">Credits</p>
        <p className="text-2xl font-semibold text-BLACK-_600">
          ${convertedCredit.toLowerCase() !== "nan" ? convertedCredit : 0}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-BLACK-_300">
          Gift Balance <span>${giftBalance}</span>
        </p>
        <Button
          className="flex gap-1 p-0 h-fit"
          onClick={handleRedeem}
          variant="link"
          type="button"
        >
          <p className="text-xs text-BLUE-_200">Redeem Gift Credits</p>
        </Button>
      </div>
    </div>
  );
};

export default memo(CreditBalanceCard);
