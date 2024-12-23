import React, { memo, useCallback } from "react";
import GiftBox from "@/assets/svg/giftbox.svg";
import { Modal } from "@/components/ui/modal/Modal";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { redeemGiftCard } from "@/redux-slice/business/business.slice";
import { useToast } from "@/contexts/ToastContext";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button/button";

interface RedeemSuccessProps {
  handleClose: () => void;
  refresh: () => void;
  setOpenRedeemSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
  setAmount?: () => void;
  back: () => void;
  handleNext: () => void;
  title?: string;
  text1?: string;
  text2?: string;
  label?: string;
  redirectPath?: string;
}

const giftFormSchema = z.object({
  code: z.string().min(6, "Gift Code must be at least 6 characters"),
});

const giftFormFields = [
  {
    name: "code",
    label: "Enter Code",
    className: "bg-transparent text-gray-500",
    type: "text" as const,
    placeholder: "Enter code to redeem gift",
  },
];
type GiftFormValues = z.infer<typeof giftFormSchema>;

const RedeemGiftModal: React.FC<RedeemSuccessProps> = ({
  handleClose,
  setOpenRedeemSuccess,
  refresh,
  setAmount,
  back,
  handleNext,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const businessId = useAppSelector(
    (state) => state.business.activeBusiness?.id
  ) as string;

  const handleRedeem = useCallback(
    async (data: GiftFormValues) => {
      await dispatch(redeemGiftCard({ businessId, ...data }))
        .unwrap()
        .then((res) => {
          handleNext();
          refresh();
          //   setAmount();
          console.log(res)
          addToast('success', res.message)
        })
        .catch((error) => {
          console.log(error);
          addToast("error", error.message);
        });
    },
    [dispatch, businessId, refresh, setAmount]
  );

  const openRedeemSuccessPop = () => {
    setOpenRedeemSuccess?.(true);
    handleClose();
  };

  return (
    <Modal title="Redeem Gift Credits" onClose={handleClose}>
      <div className="flex flex-col gap-[72px]">
        <div>
          <div className="flex justify-center mb-[35px]">
            <img
              src={GiftBox}
              alt="gift box"
              className="w-[200px] h-[187px]"
              loading="lazy"
            />
          </div>
          <Form
            fields={giftFormFields}
            schema={giftFormSchema}
            onSubmit={handleRedeem}
            className="border-none shadow-none"
            hideSubmitButton
            renderButton={() => (
              <div>
                <Button
                  variant="black"
                  className="bg-BLACK-_500 w-full text-center flex justify-center items-center rounded-lg h-[40px] p-2"
                  type="submit"
                >
                  <p className="text-center font-semibold text-sm text-WHITE-_100">
                    Redeem
                  </p>
                </Button>
                <p
                  className="text-[14px] leading-[24px] font-medium text-[#868686] text-center mt-[8px] cursor-pointer"
                  onClick={back}
                >
                  Back
                </p>
              </div>
            )}
          />
          <p className="text-[12px] leading-[14.4px] text-[#828282]">
            Note: These credits will only apply to subscriptions and not task
            credits.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default memo(RedeemGiftModal);
