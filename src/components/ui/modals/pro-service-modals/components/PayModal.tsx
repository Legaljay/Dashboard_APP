import React, { memo, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { Radio } from "@mui/material";
import { CgSpinner } from "react-icons/cg";
import Flutterwave from "@/assets/img/flutterwave_icon.jpeg.svg";
import Stripe from "@/assets/img/stripe_icon.jpeg.svg";
import { useAppDispatch } from "@/redux-slice/hooks";
import { Modal } from "@/components/ui/modal/Modal";
import useExchangeCalculator from "../hook/useExchangeCalculator";
import { generateTopup } from "@/redux-slice/topup/topup.slice";

interface PaymentOptionProps {
  icon: string;
  label: string;
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}

interface PayProps {
  setOpenRedeemGift?: React.Dispatch<React.SetStateAction<boolean>>;
  is_sufficient?: boolean;
  payAmount: number;
  handleClose: () => void;
  handleNext: () => void;
}

// Payment option component
const PaymentOption: React.FC<PaymentOptionProps> = ({
  icon,
  label,
  checked,
  onClick,
  disabled,
}) => (
  <div className="bg-[#f9f9f966] flex items-center justify-between rounded-lg border border-[#E5E5E5] py-[24px] px-[20px]">
    <div className="flex items-center gap-[10px]">
      <img src={icon} alt={`${label} icon`} className="w-[29px] h-[29px]" />
      <p className="text-[#121212] text-base font-medium">{label}</p>
    </div>
    {/* <RadioGroup value={checked} onChange={onChange} name="payment-option">
      <RadioGroup.Option value={checked} disabled={disabled}>
        {({ checked }) => (
          <span className={checked ? "checked-class" : "unchecked-class"}>
            {label}
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup> */}
    {/* <Radio
      checked={checked}
      onChange={onChange}
      name="payment-option"
      inputProps={{ "aria-label": label }}
      disabled={disabled}
    /> */}
    <Radio
      sx={{
        height: 19,
        width: 19,
        background: "white",
      }}
      // checkedIcon={<CheckedIcon />}
      checked={checked}
      onClick={onClick}
      name="radio-buttons"
      inputProps={{ "aria-label": "A" }}
    />
  </div>
);

const PayModal: React.FC<PayProps> = ({
  handleClose,
  handleNext,
  setOpenRedeemGift,
  payAmount,
  is_sufficient = false,
}) => {
  const dispatch = useAppDispatch();
  const { calculateExchange, loading } = useExchangeCalculator({ from: "USD", to: "NGN" }); //TODO: change the loading that from store to the right one
  const [paymentMethod, setPaymentMethod] = useState("dollar");
  

  const submitForm = () => {
    const requestData = {
      amount: paymentMethod === "naira" ? calculateExchange(payAmount) : payAmount * 100,
      currency: paymentMethod === "dollar" ? "USD" : "NGN",
    };

    dispatch(generateTopup(requestData)).unwrap().then((res) => {
      console.log(res);
      window.location.href = res.link;
    });
  };

  
  return (
    <Modal title="Pay" onClose={handleClose} childClassName="p-0">
      <Modal.Body className="p-0">
        {is_sufficient && (
          <div className="bg-[#AF202D] text-white py-[14px]">
            <p className="text-[15px] leading-[19.2px] font-medium text-center">
              Insufficient Balance, Top Up your credits to pay for the
              subscription
            </p>
          </div>
        )}
        <div className="p-10">
          <p className="text-lg font-medium text-[#121212]">
            For Payment: ${payAmount}
          </p>
          <div className="mt-[31px] gap-[31px] flex flex-col">
            <PaymentOption
              icon={Flutterwave}
              label="Pay With Flutterwave"
              checked={paymentMethod === "naira"}
              onClick={() => setPaymentMethod("naira")}
            />
            <PaymentOption
              icon={Stripe}
              label="Pay With Stripe"
              checked={paymentMethod === "dollar"}
              onClick={() => setPaymentMethod("dollar")}
              disabled={true} 
            />
            <p
              className="text-[12px] leading-[14.4px] font-[medium] text-[#1774FD] cursor-pointer"
              onClick={() => {
                // setOpenRedeemGift(true);
                handleNext();
              }}
            >
              Redeem Gift Credits
            </p>
            <div className="w-[420px] mx-auto flex flex-col gap-[12px]">
              <button
                className="w-[420px] h-[40px] py-3 px-5 rounded-lg flex justify-center items-center font-medium bg-BLACK-_500 text-WHITE-_100 text-sm"
                type="submit"
                onClick={submitForm}
              >
                <p className="text-WHITE-_100 text-sm font-bold">
                  {loading.rates ? (
                    <CgSpinner className="animate-spin text-lg" />
                  ) : (
                    "Proceed to Pay"
                  )}
                </p>
              </button>
              <button
                className="w-[420px] flex justify-center items-center font-medium text-[#868686] text-sm"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default memo(PayModal);
