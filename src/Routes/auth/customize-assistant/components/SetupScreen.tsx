import React, { useEffect } from "react";
import { BiChevronRight } from "react-icons/bi";
import CircleIso from "@/assets/svg/circleisotoxal.svg";
import Gradient from "@/assets/svg/radialgrad.svg";
import { WanoProfilePicture, ChooseIcon } from "@/assets/svg";
import DefaultImage1 from "@/assets/DefaultImage.png";
import { Form } from "@/components/ui/form/Form";
import { Button } from "@/components/ui/Button";
import { SetupScreenProps, ApplicationSetupData } from "./types";
import { z } from "zod";
import { FormField } from "@/components/ui/form/types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PersonalityField from "./PersonalityField";

const formSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "Image is required"),
  name: z.string().min(1, "Assistant name is required"),
  personality_type: z.string().min(1, "Personality is required"),
  type: z.enum(["customer", "sales", "generalist"]),
});

const SetupScreen: React.FC<SetupScreenProps> = ({
  selectedImage2,
  data,
  selectedPersonality,
  handleImageChange,
  handleUploadAssistant,
  handlePersonalityModal,
}) => {
  const { businessId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isFromDashboard = location.state?.fromDashboard;

  const handleBack = () => {
    navigate(-1);
  };

  const fields: FormField[] | any[] = [
    {
      name: "file",
      label: "Assistant Image",
      type: "custom",
      validation: formSchema.shape.file,
      render: (field) => (
        <div className="space-y-3">
          <div className="flex gap-5 items-end">
            <div className="relative">
              <WanoProfilePicture />
              {selectedImage2 ? (
                <img
                  src={selectedImage2}
                  alt="Uploaded"
                  className="absolute top-0 h-[40px] w-[40px] object-cover rounded-[6.4px]"
                />
              ) : (
                <img
                  src={data.icon_url || DefaultImage1}
                  alt="Default"
                  className="absolute top-0 h-[40px] rounded-[6.4px] shadow-md w-[40px] object-cover"
                />
              )}
            </div>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    field.onChange(files?.[0]);
                    handleImageChange(files?.[0]);
                  }
                }}
                id="choosefile"
                className="hidden"
                accept="image/*"
              />
              <label
                htmlFor="choosefile"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Choose File
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "name",
      label: "Give your Assistant a name",
      type: "text",
      validation: formSchema.shape.name,
      className:
        "mt-1 block w-full px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
      defaultValue: data?.name || "",
    },
    {
      name: "type",
      label: "Assistant Type",
      type: "select",
      validation: formSchema.shape.type,
      options: [
        { label: "Customer", value: "customer" },
        { label: "Sales", value: "sales" },
        { label: "Generalist", value: "generalist" },
      ],
      defaultValue: data?.type || "customer",
      className: "text-gray-600 text-sm",
    },
    {
      name: "personality_type",
      label: "Assistant's Personality",
      type: "custom",
      validation: formSchema.shape.personality_type,
      data,
    },
  ];

  const handleSubmit = (
    formData: Omit<ApplicationSetupData, "businessId" | "sale_agent_name">
  ) => {
    const completeData: ApplicationSetupData = {
      ...formData,
      businessId,
      sale_agent_name: formData.name,
    };
    console.log(completeData, "assistantData");
    handleUploadAssistant(completeData);
  };

  const renderHeader = () => (
    <div className="relative">
      {isFromDashboard && (
        <button
          className="absolute  top-16 left-16  border rounded-lg py-2.5 px-4 bg-white border-[#D7D7D7]  flex justify-center items-center font-medium  text-[#868686] text-sm"
          type="button"
          onClick={handleBack}
        >
          Cancel
        </button>
      )}

      <img src={Gradient} alt="gradient" className="w-full" />
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 border border-[#D0D5DD] w-[175px] rounded-[54px] p-2">
        <img src={CircleIso} alt="isotoxal" />
        <p className="text-xs font-semibold text-[#121212]">
          Setup Your Assistant
        </p>
      </div>
      <h1 className="text-3xl text-black dark:text-gray-400 font-semibold leading-[38.4px] text-center mt-[50px] mb-6">
        Customize Your Support Assistant
      </h1>
    </div>
  );

  const renderFooter = () => (
    <div className="flex justify-center">
      <Button type="submit" variant="black" className="flex items-center gap-2">
        Next
        <BiChevronRight size={20} />
      </Button>
    </div>
  );

  return (
    <Form
      fields={fields}
      onSubmit={handleSubmit}
      schema={formSchema}
      className="max-w-4xl mx-auto shadow pt-0 pb-7 px-0 rounded-xl bg-white dark:bg-gray-800"
      fieldGroupClassName="mx-auto max-w-sm"
      renderHeader={renderHeader}
      renderFooter={renderFooter}
      hideSubmitButton
      renderField={(field, form) => {
        if (field.type === "custom" && field.name === "personality_type") {
          return (
            <PersonalityField
              field={field}
              selectedPersonality={selectedPersonality}
              handlePersonalityModal={handlePersonalityModal}
              form={form}
            />
          );
        }
        return field.render?.(field) || <div />;
      }}
    />
  );
};

export default SetupScreen;
