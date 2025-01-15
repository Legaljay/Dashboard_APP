import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
  useCallback,
} from "react";
import {
  Controller,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { FeatureFormSchema } from "@/constants/FormSchemas/FeatureForm.schema";
import { useAppDispatch } from "@/redux-slice/hooks";
import { Form, FormSelect } from "@/components/ui/form";
import { z } from "zod";
import { useDebounce } from "@/hooks/useDebounce";
import { Instruction } from "../../../sections/Instructions";


// Define form fields
const FeatureFormFields = [
  {
    name: "name",
    customLabel: (field: UseFormReturn<FieldValues>) => {
      return (
        <div className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
          Name <span className="text-red-700 pl-[2px]">*</span>{" "}
        </div>
      );
    },
    className: "bg-transparent dark:bg-gray-800 text-gray-500 placeholder:text-sm",
    type: "text" as const,
    placeholder: "Card Request",
  },
  {
    name: "description",
    customLabel: (field: UseFormReturn<FieldValues>) => {
      return (
        <div className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
          Description <span className="text-red-700 pl-[2px]">*</span>{" "}
        </div>
      );
    },
    className: "bg-transparent dark:bg-gray-800 placeholder:text-sm",
    type: "text" as const,
    placeholder: "e.g. These instructions are for whenever a customer has a complaint about a Failed Transaction and would like it resolved.",
  },
  {
    name: "how_it_works",
    customLabel: (field: UseFormReturn<FieldValues>) => {
      return (
        <div className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
          Enter Instructions <span className="text-red-700 pl-[2px]">*</span>{" "}
          <span className="text-[#7F7F81] ml-[5px]">
            (Provide a Step by Step Description of how this instruction should
            work)
          </span>
        </div>
      );
    },
    className: "bg-transparent dark:bg-gray-800 text-gray-500 placeholder:text-sm",
    type: "textarea" as const,
    placeholder:
      "Enter your instructions here and press '@' to use apps in your instructions",
    rows: 10,
  },
  {
    name: "support_channel",
    customLabel: (field: UseFormReturn<FieldValues>) => {
      return (
        <div className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
          Support Channels <span className="text-red-700 pl-[2px]">*</span>{" "}
        </div>
      );
    },
    className: "bg-transparent text-gray-500 placeholder:text-sm",
    type: "custom" as const,
  },
];

type FeatureFormValues = z.infer<typeof FeatureFormSchema>;


const supportChannelOptions = [
  { label: "Email Address", value: "Email Address" },
  { label: "Instagram Handle", value: "Instagram Handle" },
  { label: "App Store (IOS)", value: "App Store (IOS)" },
  { label: "Android PlayStore", value: "Android PlayStore" },
  { label: "Twitter Handle", value: "Twitter Handle" },
  { label: "WhatsApp Link", value: "WhatsApp Link" },
  { label: "Phone Number", value: "Phone Number" },
  { label: "Website", value: "Website" },
];

// Extract DynamicSupportChannels Component
const DynamicSupportChannels = ({
  form,
  errors,
  selectedChannels,
  setSelectedChannels,
}: {
  form: UseFormReturn<FieldValues>;
  errors: any;
  selectedChannels: string[];
  setSelectedChannels: (channels: string[]) => void;
}) => {
  const { setValue, watch, formState } = form;
  const supportChannels: { support_channel: string; value: string }[] = watch("support_channels") || [];

  const handleInputChange = useCallback(
   (channel: string, value: string) => {
      const updatedChannels = supportChannels.map((entry) =>
        entry.support_channel === channel
          ? { ...entry, value }
          : entry
      );

      if (!updatedChannels.some((entry) => entry.support_channel === channel)) {
        updatedChannels.push({ support_channel: channel, value });
      }

      setValue("support_channels", updatedChannels, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [supportChannels]
  );

  // Get specific error for each channel
  const getChannelError = (channel: string, index: number) => {
    const supportChannelsError = formState.errors.support_channels as any;
    
    if (supportChannelsError?.errors) {
      const channelError = supportChannelsError.errors.find(
        (err: any) => err.path[1] === channel
      );
      return channelError?.message;
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      {selectedChannels.map((channel, index) => {
        const channelEntry =
          supportChannels.find((entry) => entry.support_channel === channel) ||
          { support_channel: channel, value: "" };
          
        const channelError = getChannelError(channel, index);

        return (
          <div key={channel} className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {channel} Details
            </label>
            <input
              type="text"
              placeholder={`Enter ${channel} details`}
              className={`w-full px-3 py-2 border rounded-lg bg-transparent ${
                channelError ? "border-[#AF202D]" : "border-[#D0D5DD]"
              }`}
              defaultValue={channelEntry.value}
              onChange={(e) => handleInputChange(channel, e.target.value)}
            />
            {channelError && (
              <p className="text-[#AF202D] text-xs">{channelError}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

const FeatureForm = forwardRef(
  (
    {
      multipleInstructions,
      stepData,
      action,
    }: {
      multipleInstructions?: boolean;
      stepData?: Partial<FieldValues>;
      action?: (instructions: Instruction) => void;
    },
    ref: Ref<HTMLFormElement>
  ) => {
    const dispatch = useAppDispatch();
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

    // useImperativeHandle(ref, () => ({
    //   submitForm: () => handleSubmit(),
    // }));

    const handleSubmit = (data: FeatureFormValues) => {
      console.log("Form submitted:", data);
      // if (action) action();
    };

    const defaultValues = {
      support_channels: stepData?.support_channels || [],
      how_it_works: stepData?.how_it_works || "",
      name: stepData?.name || "",
      description: stepData?.description || "",
      tags: stepData?.tags || [],
    };

    return (
      <Form
        fields={FeatureFormFields}
        onSubmit={handleSubmit}
        schema={FeatureFormSchema}
        mode="all"
        className="bg-transparent w-[711px] p-0 border-none shadow-none mt-11 gap-6 dark:border-stone-600 dark:bg-transparent"
        defaultValues={defaultValues}
        submitLabel="Add Instruction"
        renderField={(field, form) => {
          if (field.type === "custom") {
            const errorObj = form.formState.errors;
            const error = form.formState.errors.support_channels?.message as string;
            return (
              <div className="flex flex-col gap-6">
                <FormSelect
                  field={{
                    name: field.name,
                    value: selectedChannels,
                    onChange: (value: string[]) => {
                      if (value.length > 3) {
                        alert("You can only select up to 3 channels.");
                        return;
                      }
                      setSelectedChannels(value);
                      form.setValue(
                        "support_channels",
                        value.map((channel) => ({
                          support_channel: channel,
                          value: "",
                        })),
                        { shouldValidate: true, shouldDirty: true, shouldTouch: true }
                      );
                      form.trigger("support_channels");
                    },
                  }}
                  options={supportChannelOptions}
                  isMulti={true}
                  placeholder="Select Support Channels"
                  error={error}
                />
                <DynamicSupportChannels
                  form={form}
                  errors={errorObj}
                  selectedChannels={selectedChannels}
                  setSelectedChannels={setSelectedChannels}
                />
              </div>
            );
          }
          return <></>;
        }}
      />
    );
  }
);

export default React.memo(FeatureForm);
