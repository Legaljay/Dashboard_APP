import backArrow from "@/assets/svg/backArrow.svg";
import { Button } from "@/components/ui/button/button";
import React, { memo, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Instruction } from "../../sections/Instructions";
import { useAppDispatch } from "@/redux-slice/hooks";
import { AppCategory, createAppCategory } from "@/redux-slice/app-categories/app-categories.slice";
import { ServiceBlocksData } from "../../hooks/useInstructionData";
import { Select } from "@/components/ui/select";


interface InstructionTemplateFormProps {
  data: AppCategory[];
  setViewTemplate: (view: "table" | "form" | false) => void;
  selectedTemplate: Instruction;
}

const options = [
  { label: "Email Address", value: "Email Address" },
  { label: "Instagram Handle", value: "Instagram Handle" },
  { label: "App Store (IOS)", value: "App Store (IOS)" },
  { label: "Android PlayStore", value: "Android PlayStore" },
  { label: "Twitter Handle", value: "Twitter Handle" },
  { label: "WhatsApp Link", value: "WhatsApp Link" },
  { label: "Phone Number", value: "Phone Number" },
  { label: "Website", value: "Website" },
];

const InstructionTableForm: React.FC<InstructionTemplateFormProps> = ({
  data,
  setViewTemplate,
  selectedTemplate,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { assistantId: applicationId = "" } = useParams();
  const [support, setSupport] = useState<string[]>([]);

  const handleBack = useCallback(() => {
    setViewTemplate("table");
  }, [setViewTemplate]);

  const handleEdit = useCallback(async() => {
    try {
      const createdTemplate = data.find(
        (each) =>
          each.name.toLowerCase() === selectedTemplate.category.toLowerCase()
      );

      if (createdTemplate) {
        navigate(
          `/dashboard/assistant/${selectedTemplate.category}/${
            createdTemplate.id
          }/add-instruction?template=${JSON.stringify(selectedTemplate)}`
        );
      } else {
        setIsLoading(true);

        const { category = {} } = await dispatch(createAppCategory({
          applicationId,
          categoryData:{ 
            name: selectedTemplate.category,
            description: selectedTemplate.description,
          }
        })).unwrap();

        navigate(
          `/dashboard/assistant/${selectedTemplate.category}/${
            category.data.id
          }/add-instruction?template=${JSON.stringify(selectedTemplate)}`
        );
      }
    } catch (e: any) {
      addToast('error', e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = useCallback((selectedLabel: any) => {
    setSupport((prevSupport: any) => [
      ...selectedLabel
      // { support_channel: selectedLabel, website: '' }
    ]);
  },[]); 
  
  return (
    <div className="mb-60">
      <nav className="flex gap-1 items-center mb-4 ">
        <div
          className="flex gap-1 cursor-pointer"
          onClick={handleBack}
        >
          <img src={backArrow} alt="Images" />

          <p className="text-[#121212] text-sm font-normal ">View Templates</p>
        </div>
      </nav>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h2 className=" text-2xl font-medium">Opening Conversations</h2>
          <p className="text-[#7F7F81] text-xs font-normal">
            Schedule detailed instructions or guidelines for your assistants
            within a given time period.
          </p>
        </div>
        <div>
          <Button
            onClick={handleEdit}
            className="bg-BLACK-_100 text-xs py-3 px-5 cursor-pointer rounded-lg font-semibold text-WHITE-_100"
            type="button"
            disabled={isLoading}
          >
            Edit Instruction
          </Button>
        </div>
      </div>
      <form className={`mt-11 flex flex-col gap-6 w-8/12`}>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-figtree text-[#101828] flex items-end">
            Name
            <span className="text-red-700 pl-[2px] pt-1.5">*</span>
          </label>
          <input
            type="text"
            value={selectedTemplate.name}
            disabled
            className={`instructionstep-2 text-[#101828] border rounded-lg border-[#D0D5DD] py-1.5 px-3 bg-white focus:outline-none w-full`}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-figtree text-[#101828] flex items-center">
            Description
          </label>
          <textarea
            value={selectedTemplate.description}
            disabled
            className={` text-[#101828] border rounded-lg border-[#D0D5DD] py-4 px-3 bg-white focus:outline-none w-full`}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-figtree text-[#101828] flex items-center">
            Enter Instructions
            <span className="text-[#7F7F81] ml-[5px] ">
              ( Provide a Step by Step of your Instruction)
            </span>
          </label>
          <textarea
            rows={10}
            value={selectedTemplate.how_it_works}
            disabled
            className={` text-[#101828] border rounded-lg border-[#D0D5DD] py-4 px-3 bg-white focus:outline-none w-full`}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-xs font-figtree text-[#101828] instructionstep-5">
            Support Channel{" "}
            <span className="text-[#7F7F81]">
              (Select where you’d like your assistant to redirect your customers
              to. Maximum of 3 channels)
            </span>
          </label>
          <div className="instructionstep-4">
            <Select
              name="support"
              options={options}
              placeholder="Select Support Channel"
              onChange={handleSelect}
              multiple
              maxSelections={3}
              value={support}
              classObj ={{placeholderClass:"text-BLACK-_100", trigger: "outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"}}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default memo(InstructionTableForm);
