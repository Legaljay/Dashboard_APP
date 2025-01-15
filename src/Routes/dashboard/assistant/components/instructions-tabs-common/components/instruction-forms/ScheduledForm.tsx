import React, { useState, forwardRef, memo, useCallback, Ref } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput, TextArea, SupportChannel } from "./FormComponents";
import { Select } from "@/components/ui/select";
import { ScheduledFormSchema } from "@/constants/FormSchemas/ScheduledForm.schema";
import { Instruction } from "../../../sections/Instructions";


// Type inference from the schema
export type ScheduledFormValues = z.infer<typeof ScheduledFormSchema>;

// Define support channel options
const SUPPORT_CHANNEL_OPTIONS = [
  { label: "Email Address", value: "Email Address" },
  { label: "Instagram Handle", value: "Instagram Handle" },
  { label: "App Store (IOS)", value: "App Store (IOS)" },
  { label: "Android PlayStore", value: "Android PlayStore" },
  { label: "Twitter Handle", value: "Twitter Handle" },
  { label: "WhatsApp Link", value: "WhatsApp Link" },
  { label: "Phone Number", value: "Phone Number" },
  { label: "Website", value: "Website" },
];

const ScheduledForm = forwardRef(
  (
    {
      multipleInstructions,
      stepData,
      action,
    }: {
      multipleInstructions?: boolean;
      stepData?: Partial<ScheduledFormValues>;
      action?: (instructions: Instruction) => void;
    },
    ref: Ref<HTMLFormElement>
  ) => {
    // Default country code for phone numbers
    const [countryCode] = useState("234");

    // Initialize form with default values or step data
    const methods = useForm<ScheduledFormValues>({
      resolver: zodResolver(ScheduledFormSchema),
      defaultValues: {
        name: stepData?.name || "",
        description: stepData?.description || "",
        how_it_works: stepData?.how_it_works || "",
        support_channel: stepData?.support_channel || [],
        start_date: stepData?.start_date || "",
        end_date: stepData?.end_date || "",
        tags: stepData?.tags || [],
      },
    });

    const {
      control,
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = methods;

    // Watch selected support channels
    const selectedSupportChannels = watch("support_channel") || [];

    // Handle form submission
    const onSubmit = useCallback(
      (data: ScheduledFormValues) => {
        // Process support channels, especially for phone numbers
        const processedData = {
          ...data,
          support_channel: data.support_channel.map((channel) => ({
            ...channel,
            website:
              channel.support_channel === "Phone Number"
                ? `${countryCode}${channel.website}`
                : channel.website,
          })),
        };

        console.log("Submitted Form Data:", processedData);

        // Call action if provided
        // action?.();
      },
      [action, countryCode]
    );

    // Remove support channel handler
    const handleRemoveSupportChannel = useCallback(
      (index: number) => {
        const currentChannels = watch("support_channel");
        const updatedChannels = currentChannels.filter((_, i) => i !== index);
        setValue("support_channel", updatedChannels);
      },
      [watch, setValue]
    );

    // Update support channel website
    const handleSupportChannelChange = useCallback(
      (index: number, value: string) => {
        setValue(`support_channel.${index}.website`, value);
      },
      [setValue]
    );

    return (
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} ref={ref}>
          <section className="flex justify-between">
            <div className="bg-transparent w-[711px] p-0 border-none shadow-none flex flex-col mt-11 gap-6">
              {/* Name Input */}
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Name"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.name?.message}
                    placeholder="Card Request"
                    required
                  />
                )}
              />

              {/* Description Input */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextInput
                    label="Description"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.description?.message}
                    placeholder="e.g. These instructions are for whenever a customer has a complaint about a Failed Transaction and would like it resolved."
                    required
                  />
                )}
              />

              {/* Instructions Input */}
              <Controller
                name="how_it_works"
                control={control}
                render={({ field }) => (
                  <TextArea
                    label="Enter Instructions"
                    customLabel={
                      <>
                        Enter Instructions{" "}
                        <span className="text-red-700 pl-[2px]">*</span>{" "}
                        <span className="text-[#7F7F81] ml-[5px]">
                          (Provide a Step by Step Description of how this
                          instruction should work)
                        </span>
                      </>
                    }
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.how_it_works?.message}
                    placeholder="e.g. These instructions are for whenever a customer has a complaint about a Failed Transaction and would like it resolved."
                    required
                  />
                )}
              />

              {/* Support Channel Selection */}
              <div className="space-y-2">
                <Select
                  name="support_channel"
                  label="Support Channel"
                  options={SUPPORT_CHANNEL_OPTIONS}
                  multiple
                  classObj={{
                    placeholderClass: "text-gray-500 placeholder:text-sm",
                    trigger: `bg-transparent ${errors.support_channel ? "border-red-600": ""}`,
                  }}
                  maxSelections={3}
                  placeholder="Select Support Channel"
                  className="bg-transparent text-gray-500 placeholder:text-sm"
                  error={errors.support_channel?.message}
                  value={
                    watch("support_channel")?.map(
                      (channel) => channel.support_channel
                    ) || []
                  }
                  onChange={(selectedValues: unknown) => {
                    const existingChannels = watch("support_channel") || [];

                    // Keep existing channels and only add new ones
                    const newChannels = (selectedValues as string[])
                      .filter(
                        (value) =>
                          !existingChannels.some(
                            (channel) => channel.support_channel === value
                          )
                      )
                      .map((value) => ({
                        support_channel: value,
                        website: "", // Initialize with empty website
                      }));

                    // Update the form state with new channels
                    setValue("support_channel", [
                      ...existingChannels,
                      ...newChannels,
                    ]);
                  }}
                  trackValue="support_channel"
                />
              </div>

              {/* Dynamic Support Channel Inputs */}
              {selectedSupportChannels.map((field, index) => (
                <SupportChannel
                  key={`${field.support_channel}-${index}`}
                  index={index}
                  onRemove={() => handleRemoveSupportChannel(index)}
                  channel={field}
                  onChange={(_, value) =>
                    handleSupportChannelChange(index, value)
                  }
                  error={errors.support_channel?.[index]?.website?.message}
                />
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </section>
        </form>
      </FormProvider>
    );
  }
);

// Add display name for better debugging
ScheduledForm.displayName = "ScheduledForm";

export default ScheduledForm;
