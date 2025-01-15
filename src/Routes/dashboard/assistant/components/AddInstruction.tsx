import React, { useEffect, useRef, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Help from "@/assets/svg/help2.svg";
import Head from "@/assets/svg/Shape65.svg";
import { CgSpinner } from "react-icons/cg";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { useToast } from "@/contexts/ToastContext";
import FeatureForm from "./instructions-tabs-common/components/instruction-forms/FeatureForm";
import { createAppInstruction } from "@/redux-slice/app-instructions/app-instructions.slice";
import ScheduledForm, { ScheduledFormValues } from "./instructions-tabs-common/components/instruction-forms/ScheduledForm";
import { Instruction } from "./sections/Instructions";

const instructionSteps = [
  {
    selector: ".instructionstep-1",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Give your Instruction a Title. This is solely so you can reference it
          later. E.g. “When Customers ask for Pricing”
        </p>
        <p className="text-[#7F7F81]">Step 1 of 5 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-2",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Enter a detailed and informative description that accurately explains
          the content or purpose
        </p>

        <p className="text-[#7F7F81]">Step 2 of 5 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-3",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>Try to be specific when creating an Instruction or Guideline:</p>
        <p>
          e.g. “Whenever a user wants to see a product demo, direct them to our
          demo link”
        </p>

        <p className="text-[#7F7F81]">Step 3 of 5 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },

  {
    selector: ".instructionstep-4",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Provide an optional channel to redirect users to. This could be
          anything from a phone number to call or a website link to follow. You
          can add up to 3 channels.
        </p>

        <p className="text-[#7F7F81]">Step 4 of 5 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },

  {
    selector: ".instructionstep-5",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Good Job</p>
        </div>
        <p>
          You have completed the Instructions guided tour, If you need to go
          through the tour again, you can find it here.
        </p>
        <p className="text-[#7F7F81]">Step 5 of 5 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
];

const scheduledSteps = [
  {
    selector: ".instructionstep-1",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Give your Instruction a Title. This is solely so you can reference it
          later. E.g. “When Customers ask for Pricing”
        </p>
        <p className="text-[#7F7F81]">Step 1 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-2",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Enter a detailed and informative description that accurately explains
          the content or purpose
        </p>

        <p className="text-[#7F7F81]">Step 2 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-3",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>Try to be specific when creating an Instruction or Guideline:</p>
        <p>
          e.g. “Whenever a user wants to see a product demo, direct them to our
          demo link”
        </p>

        <p className="text-[#7F7F81]">Step 3 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },

  {
    selector: ".instructionstep-4",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Provide an optional channel to redirect users to. This could be
          anything from a phone number to call or a website link to follow. You
          can add up to 3 channels.
        </p>

        <p className="text-[#7F7F81]">Step 4 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-6",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know your Instructions</p>
        </div>
        <p>
          Set an optional start date for Scheduled Instructions. Your
          Instruction will only be active within the start and end date.
        </p>

        <p className="text-[#7F7F81]">Step 5 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-7",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Get to know Instructions</p>
        </div>
        <p>
          Set an optional End date for Scheduled Instructions. Your Instruction
          will only be active within the start and end date.
        </p>
        <p className="text-[#7F7F81]">Step 6 of 7 </p>
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
  {
    selector: ".instructionstep-5",
    content: (
      <div className="text-[12px] leading-[18px] rounded-[20px] flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <img src={Head} alt="Image" className="h-[23.63px] w-[23.63px]" />
          <p className="text-[#7F7F81]">Great Job!</p>
        </div>
        <p>
          You have completed the Instructions guided tour, If you need to go
          through the tour again, you can find it here
        </p>
        {/* <p className="text-[#7F7F81]">Step 1 of 4 </p> */}
      </div>
    ),
    position: "right",
    arrow: "disabled",
    isAgentStep: false,
  },
];

const AddInstruction: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { state, search, pathname } = useLocation();
  const {
    assistantId: applicationId = "",
    instructionType = "",
    id: categoryId = "",
  } = useParams();
  const loading = useAppSelector(
    (state) => state.appInstructions.loading.createInstruction
  );

  const seenTourS = localStorage.getItem("tourS") == "false";
  const seenTourOthers = localStorage.getItem("tourOthers") == "false";
  const seenTour = pathname.includes("Scheduled") ? seenTourS : seenTourOthers;
  // const isDataAvailable = agentDataDetails?.length > 0 && seenTour;


  const formRef = useRef(null);

  const handleFormSubmit = () => {
    if (formRef.current) {
      // formRef.current.submitForm();
    }
  };

  // const convertToISO = (dat) => {
  //   const date = new Date(dat);
  //   const now = new Date();
  //   date.setHours(
  //     now.getHours(),
  //     now.getMinutes(),
  //     now.getSeconds(),
  //     now.getMilliseconds()
  //   );
  //   const isoString = date.toISOString();
  //   return isoString;
  // };

  // console.log({
  //   name: instructionName,
  //   description: instructionDescription,
  //   how_it_works: instructionManual,
  //   support_channel: support.map((each) => ({
  //     support_channel: each.support_channel,
  //     website:
  //       each.support_channel === "Phone Number"
  //         ? `${countryCode}${each.website}`
  //         : each.website,
  //   })),
  // })

  // const { setIsOpen, setSteps } = tour();
  // const { resetTour, setCurrentStep } = useTour();
  // const openStartPop = () => {
  //   resetTour();
  //   setIsOpen(true);
  // };

  // useEffect(() => {
  //   setCurrentStep(0);
  //   if (pathname.includes("Scheduled")) {
  //     setSteps(scheduledSteps);
  //   } else {
  //     setSteps(instructionSteps);
  //   }
  // }, []);

  const createInstruction = async (instructionData: Partial<Instruction>) => {
    if (!applicationId) {
      addToast(
        "error",
        "Please provide a valid application ID!"
      );
    }

    try {
      

      // if (type === "Scheduled Instructions") {
      //   instructionData.start_date = convertToISO(startDate);
      //   instructionData.end_date = convertToISO(endDate);
      // }

      const res = await dispatch(
        createAppInstruction({ applicationId, categoryId, instructionData }) //TODO: change instructData type to accomodate both scheduled and feature forms
      );
      // axios.post(
      //   `${URL}/dashboard/applications/${applicationId}/category/${id}/instructions`,
      //   instructionData,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // setLoading(false);

      // if (applicationId) {
      //   dispatch(getApplicationDraft(applicationId));
      // }
      // navigate(`/agent/${type}/${id}`);
    } catch (error: any) {
      addToast(
        "error",
        error?.response?.data?.message || "Error creating instruction"
      );
    }
  };
  useEffect(() => {
    // handle template
    const queryParams = new URLSearchParams(search);
    const template = queryParams.get("template");

    if (template) {
      const realTemplate = JSON.parse(template);

      console.log("is template present", realTemplate);
      // setInstructionName(realTemplate.name);
      // setInstructionDescription(realTemplate.description);
      // setInstructionManual(realTemplate.instruction);
    }
  }, []);

  // useEffect(() => {
  //   // if (!isDataAvailable && pathname.includes("Scheduled")) {
  //   //   setGiveInstruction(prev => ({...prev, Scheduled: true }));
  //   // } else if(!isDataAvailable && !pathname.includes("Sheduled")) {
  //   //   setGiveInstruction(prev => ({...prev, Others: true }));
  //   // } else {
  //   //   setGiveInstruction({
  //   //     Scheduled : false,
  //   //     Others: false,
  //   //   });
  //   // }
  //   if (!isDataAvailable) {
  //     setGiveInstruction(true);
  //   } else {
  //     setGiveInstruction(false);
  //   }
  // }, [isDataAvailable]);

  return (
    <main className="font-figtree pr-10 pb-10 mb-7 w-full">
      <section className="flex justify-between w-full items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-[24px] font-medium text-[#121212] dark:text-WHITE-_400 font-figtree">
            Add Instruction
          </h1>
        </div>
        <div className="flex gap-[20px]">
          <div
            className="instructionstep-5 flex items-center bg-[#F7F7F7] rounded-[35px] gap-2 p-[11px] cursor-pointer"
            // onClick={openStartPop}
          >
            <img src={Help} alt="help" />
            <p className="text-[12px] leading-[14.4px] font-medium text-[#0359D8]">
              Take Guided Tour
            </p>
          </div>
          <div className="flex items-center gap-3">
            {loading ? (
              <button className="outline-none py-3 w-[139px] px-5 bg-[#121212] dark:text-gray-300 rounded-lg text-white text-[14px] font-bold flex justify-center">
                <CgSpinner className=" animate-spin text-lg " />
              </button>
            ) : (
              <button
                onClick={handleFormSubmit}
                className="cursor-pointer outline-none py-3 w-auto px-5 bg-[#121212] dark:bg-gray-800 dark:text-gray-300 rounded-lg text-white text-[14px] font-bold"
              >
                Add Instruction
              </button>
            )}
          </div>
        </div>
      </section>
      <div className="-mt-5">
        <section className="flex justify-between">
          {instructionType.includes("Scheduled Instructions") ? (
            <ScheduledForm ref={formRef} action={createInstruction} />
          ) : (
            <FeatureForm ref={formRef} action={createInstruction} />
          )}
          <div
          className="border border-[#D0D5DD] dark:border-stone-600 h-fit w-[330px] mt-[70px] px-[20px] py-[14px] rounded-[8px]"
          style={{
            boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)",
            background: "linear-gradient(160deg,#F8C4D326 2%,  #1774FD08 68%)",
          }}
        >
          <div className="flex gap-[8px] items-center">
            <img src={Head} alt="shape" className="w-[23.63px] h-[23.63px]" />
            <p className="text-[#828282] text-[12px] leading-[18px]">Example</p>
          </div>
          <div className="text-[12px] leading-[20px] mt-[10px]">
            <p>Try to be specific when creating an Instruction or Guideline:</p>
            <p>
              For e.g: “Whenever a user wants to see a product demo, direct them
              to our demo link
            </p>
            <p>
              Make sure to{" "}
              <span className="font-medium">
                provide links referred to in the instructions under support
                channels.
              </span>
            </p>
          </div>
        </div>
        </section>
      </div>

    </main>

    // <ModalPop isOpen={giveInstruction}>
    //   {/* checkPathValue */}
    //   <GiveInstructionModal
    //     // refresh={refresh}
    //     handleClose={() => {
    //       // if (pathname.includes("Scheduled")) {
    //       //   setGiveInstruction(prev => ({ ...prev, Scheduled: false }));
    //       // } else {
    //       //   setGiveInstruction(prev => ({ ...prev, Others: false }));
    //       // }
    //       setGiveInstruction(false);
    //     }}
    //   />
    // </ModalPop>
  );
};

export default AddInstruction;
