import React, { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import MessageB from "@/assets/svg/message-b.svg";
import { useAppDispatch } from "@/redux-slice/hooks";
import { Form } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal/Modal";
import { z } from "zod";
import useExchangeCalculator from "../hook/useExchangeCalculator";
import useProFeatures from "../hook/useProFeatures";
// import { generateTopup } from "@/redux-slice/topup/topup.slice";

interface TopupModalProps {
  handleClose: () => void;
  handleNext: () => void;
  setAmount?: (amount: number) => void;
}

const topUpSchema = z.object({
  amount: z
    .number()
    .min(10, "Amount must be at least 10")
    .max(100000000, "Amount must be less than 100000000"),
});

const topUpFormFields = [
  {
    name: "amount",
    // label: "Amount",
    customLabel: () => (
      <p className="ml-4 text-xs font-medium text-BLACK-_200">Enter Amount</p>
    ),
    className:
      "bg-transparent text-gray-500 border-none placeholder:text-gray-500 placeholder:text-xl placeholder:font-medium placeholder:tracking-wider",
    type: "number" as const,
    placeholder: "$0",
  },
];

type TopUpFormValues = z.infer<typeof topUpSchema>;

const TopupModal: React.FC<TopupModalProps> = ({
  handleClose,
  handleNext,
  setAmount,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { calculateExchange } = useExchangeCalculator({
    from: "USD",
    to: "NGN",
  });
  const { walletBalanceValue, giftBalance, currentPlan, buttonRef } =
    useProFeatures();
  const [openMore, setOpenMore] = useState(false);

  console.dir(walletBalanceValue, "walletBalanceValue");
  console.dir(giftBalance, "giftBalance");
  console.dir(currentPlan, "currentPlan");

  //   const [credit, setCredit] = useState("");
  //   const [exchangeAmount, setExchangeAmount] = useState(0);

  //   const userDetails = useSelector((state) => state.userLogin);
  //   const { data } = userDetails?.user;

  //   const { loading } = useSelector((state) => state.walletGenerate);
  //   const plan = useSelector((state) => state.getCurrentPlan.data);
  //   const { subscriptions, currentPlan: current } = plan;
  //   // const currentPlanTaskAmount = current?.subscription_details?.features?.[3]?.prefix;
  //   const currentPlanTaskAmount = current?.subscription_details?.features?.find(data => data?.description == "per resolution")?.prefix;
  //   console.log(currentPlanTaskAmount, "currTask")

  //   const OpenMoreInfo = () => {
  //     setOpenMore((prev) => !prev);
  //   };

  //   useEffect(() => {
  //     dispatch(getCurrentPlan());
  //   },[])

  //   // const handleFlutterPayment =  useFlutterwave(config);

  const handleSubmit = useCallback(async (values: TopUpFormValues) => {
    const data = {
      amount: values?.amount * 100,
      currency: "USD",
    };
    setAmount?.(values?.amount as number);
    handleNext();
  }, []);

  //   useEffect(() => {
  //     // Assuming 1 dollar = 100 cents
  //     const centsPerDollar = 100;

  //     // Conversion rate
  //     const creditsPerCent = 1;

  //     if (exchangeAmount > 0) {
  //       // Calculate credits
  //       const numOfCredits = exchangeAmount * centsPerDollar * creditsPerCent;
  //       // const numOfCredits = exchangeAmount * 5000;
  //       setCredit(numOfCredits);
  //     } else {
  //       const zero = 0;
  //       setCredit(zero);
  //     }
  //   }, [exchangeAmount]);

  //   function calculatingCredits(values) {
  //     setExchangeAmount(values);
  //   }

  // function dollarsToCredits(dollarAmount) {
  //     // Assuming 1 dollar = 100 cents
  //     const centsPerDollar = 100;

  //     // Conversion rate
  //     const creditsPerCent = 1;

  //     // Calculate credits
  //     const credits = dollarAmount * centsPerDollar * creditsPerCent;

  //     return credits;
  //   }

  //   const dollarValue = 0.01;
  //   const credits = dollarsToCredits(dollarValue);

  //   console.log(⁠ ${dollarValue} dollar(s) is equal to ${credits} credits. ⁠);

  //   const openBulk = () => {
  //     setShow(true);
  //     handleClose();
  //   };

  //   const openPayment = () => {
  //     setOpenPay(true);
  //     handleClose();
  //   };

  return (
    <Modal title="Top Up Wallet" onClose={handleClose}>
      <div
        className="bg-WHITE-_100 w-[578px] h-[545px] overflow-y-scroll rounded-lg hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-center justify-center mt-[33px]">
          <div
            className="h-[413px] w-[472px] mx-auto rounded-lg"
            style={{ boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)" }}
          >
            <div
              className="px-[24px] py-[24px]"
              style={{ background: "rgba(205, 222, 248, 0.20)" }}
            >
              <div>
                <div className="flex flex-col gap-3.5">
                  <p className="text-[14px] leading-[16.8px] font-medium text-BLACK-_500">
                    Pay-As-You-Go
                  </p>
                  <div className="flex gap-2.5">
                    <p className="font-medium text-[35px] leading-[42px] text-BLACK-_500">
                      {/* {currentPlanTaskAmount}{" "} */}0
                    </p>
                    <p className="text-sm text-BLACK-_300 mt-2.5">
                      per resolution
                    </p>
                  </div>
                </div>
                <span className="text-[#1774FD] text-[12px] mt-[12px]">
                  Subscription charges will be taken from this wallet. Find out
                  more{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={() =>
                      navigate("/settings?page=billing&category=plan")
                    }
                  >
                    Here
                  </span>
                </span>
              </div>

              {openMore && (
                <div
                  style={
                    {
                      // transform: openMore ? "translateY(0)" : "translateY(0)",
                      // transition: "transform 0.9s ease-in-out",
                    }
                  }
                  className="flex flex-col mt-[30px] gap-3"
                >
                  <div className="w-[364px]">
                    <p className="text-sm font-medium text-BLACK-_300">
                      Purchase Credits in advance and use them to pay for
                      resolutions completed by your Digital Assistant. Each
                      credit is worth $0.01 and each Resolution completed by
                      your assistant is worth 10 Credits which equates to $0.1
                      per Resolution. Here is a breakdown of the cost:
                    </p>
                  </div>
                  <div className="w-[374px] flex flex-col gap-6">
                    <div className="flex gap-1 items-center">
                      <img
                        src={MessageB}
                        alt="message"
                        className="w-[10px] h-[10px]"
                      />
                      <p className="text-BLACK-_300 font-medium text-sm leading-3">
                        $0.01 per Credit
                      </p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <img
                        src={MessageB}
                        alt="message"
                        className="w-[10px] h-[10px]"
                      />
                      <p className="text-BLACK-_300 font-medium text-sm leading-3">
                        10 Credits per Resolution
                      </p>
                    </div>
                    <div className="flex gap-1 items-center">
                      <img
                        src={MessageB}
                        alt="message"
                        className="w-[10px] h-[10px]"
                      />
                      <p className="text-BLACK-_300 font-medium text-sm leading-3">
                        $0.1 per Resolution
                      </p>
                    </div>
                    <div className="flex gap-1 items-start">
                      <img
                        src={MessageB}
                        alt="message"
                        className="w-[10px] h-[10px]"
                      />
                      <p className="text-BLACK-_300 font-medium text-sm leading-3">
                        Minimum funding amount is 10$ or 1,000 <br />{" "}
                        <span className="leading-normal">credits</span>
                      </p>
                    </div>
                  </div>
                  <div className="w-[364px] mt-8">
                    <p className="text-xs font-normal text-BLACK-_300">
                      You can find out more about our credits and our pricing
                      per resolution in{" "}
                      <span
                        className="underline text-BLUE-_100 cursor-pointer"
                        onClick={() =>
                          navigate("/support", { state: { Pricing: true } })
                        }
                      >
                        support.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-[28px]">
              <Form
                fields={topUpFormFields}
                schema={topUpSchema}
                onSubmit={handleSubmit}
                className="shadow-none border-none outline-none"
                hideSubmitButton
                renderButton={(form) => (
                  <>
                    <hr />
                    <p
                      className={`${
                        form?.getValues("amount") < 10
                          ? "text-RED-_100"
                          : "text-BLACK-_200"
                      } flex justify-end text-xs font-medium mt-[5px]`}
                    >
                      Minimum funding amount is $10
                    </p>
                    <div className="flex justify-center mt-[59px]">
                      <button
                        className="bg-BLACK-_500 w-[362px] rounded-lg h-[45px] p-2 "
                        type="submit"
                      >
                        <p className="text-center font-semibold text-sm text-WHITE-_100">
                          Top Up Now
                        </p>
                      </button>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(TopupModal);
