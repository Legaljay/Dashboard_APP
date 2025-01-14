import React from "react";
import { WanoProfilePicture } from "@/assets/svg";
import DefaultImage1 from "@/assets/DefaultImage.png";
import { isDirty, z } from "zod";
import PersonalityField from "@/Routes/auth/customize-assistant/components/PersonalityField";
import VerbosityField from "./VerbosityField";
import { SettingsFormData, SettingsFormProps } from "./types";
import AssistantIDField from "./AssistantIDField";
import { Controller, UseFormReturn, FieldValues, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DeactivateAssistantField from "./DeactivateAssistantField";
import { Button } from "@/components/ui/button/button";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/redux-slice/hooks";
import { useNavigationBlocker } from "@/hooks/useNavigationBlocker";
import { UnsavedChangesModal } from "@/components/ui/modals/UnsavedChangesModal";

type SettingsFormDataWithId = SettingsFormData & {
  assistant_id: string;
  icon_url: string;
};

const formSchema = z.object({
  file: z.any().refine((file) => file instanceof File, "Image is required"),
  sale_agent_name: z.string().min(1, "Assistant name is required"),
  description: z.string().min(1, "Description is required"),
  personality_type: z.string().min(1, "Personality is required"),
  verbose: z.string().min(1, "Verbosity is required"),
  type: z.enum(["customer", "sales", "generalist"]),
  assistant_id: z.string().optional(),
  icon_url: z.string().optional(),
});

const SettingsForm: React.FC<SettingsFormProps> = ({
  data,
  selectedPersonality,
  selectedVerbosity,
  handleUploadAssistant,
  handlePersonalityModal,
  handleVerbosityModal,
}) => {
// grab assistant's ID from params
  const { assistantId = "" } = useParams();
  const assistantApplication = useAppSelector((state) =>
    state.applications.applications.find(
      (app) => app.id === assistantId
    )
  );
  const updatingAssistant = useAppSelector((state) =>
    state.applications.loading
  );

  const assistant = assistantApplication?.draft || assistantApplication;


  
  //initialize form
  const methods = useForm<SettingsFormDataWithId>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: assistant?.name || "",
      sale_agent_name: assistant?.sale_agent_name || "",
      description: assistant?.description || "",
      file: new File([], "") || null,
      personality_type: assistant?.personality_type || "",
      verbose: assistant?.verbose || "",
      type: (assistant?.type as typeof data.type) || "sales",
      assistant_id: assistant?.id || "string",
    },
  });

  //destructure methods
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

// show unsaved changes modal if form is dirty
  const { showModal, onClose, onConfirm, onDiscard } = useNavigationBlocker({
    isDirty: isDirty,
    basePath: '/assistant',
    onSave: async () => {
        const data = methods.getValues();
        await onSubmit(data);
    }
  });

// handle image change and set values for icon_url and file in form
  const handleImageChange = (file: File | null) => {
    if (file && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        methods.setValue("icon_url", reader.result as string);
      };
      reader.readAsDataURL(file);
      methods.setValue("file", file);
    }
  };

  // handle form submit
  const onSubmit = async(
    formData: Omit<SettingsFormDataWithId, "is_light" | "name">
  ) => {
    const completeData: SettingsFormDataWithId = {
      ...formData,
      name: formData.sale_agent_name,
    };
    const { assistant_id, icon_url, ...data } = completeData;
    await handleUploadAssistant(data);
    methods.reset();
  };

// watch icon_url value to display uploaded image
  const watchIconUrl = methods.watch("icon_url");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-5 mb-20">
        <main className="divide-y divide-gray-100 dark:divide-secondary-800">
          <section>
            <div className="flex gap-20 mb-5 w-full">
              <div className="w-2/6">
                <h3 className="text-sm font-medium dark:text-WHITE-_100">Description</h3>
                <p className="text-[#7F7F81] font-normal text-xs">
                  Set a description and look for your assistant while it interacts
                  with your customers
                </p>
              </div>
              <div className="mb-10 space-y-3 w-1/2">
                <div className="flex gap-5 items-end">
                  <div className="relative">
                    <WanoProfilePicture />
                    {watchIconUrl ? (
                      <img
                        src={watchIconUrl}
                        alt="Uploaded"
                        className="absolute top-0 h-[40px] w-[40px] object-cover rounded-[6.4px]"
                      />
                    ) : (
                      <img
                        src={assistant ? assistant.icon_url : DefaultImage1}
                        alt="Default"
                        className="absolute top-0 h-[40px] rounded-[6.4px] shadow-md w-[40px] object-cover"
                      />
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      {...register("file", {
                        onChange: (e) => {
                          const files = e.target.files;
                          if (files) {
                            handleImageChange(files[0]);
                          }
                        },
                      })}
                      id="choosefile"
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="choosefile"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 shadow-sm cursor-pointer dark:text-stone-50 dark:border-secondary-800 dark:bg-gray-800 hover:bg-gray-50"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("sale_agent_name")}
                    className="px-3 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 dark:border-secondary-800 dark:bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your Assistant's name"
                  />
                  {errors.sale_agent_name && (
                    <p className="text-sm text-red-500">
                      {errors.sale_agent_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assistant ID
                  </label>
                <Controller
                  name={"assistant_id"}
                  control={control}
                  render={({ field }) => (
                    <AssistantIDField
                      field={field}
                      selectedAssistantID={field.value as string}
                    />
                  )}
                />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    rows={6}
                    {...register("description")}
                    className="px-3 py-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 dark:border-secondary-800 dark:bg-transparent focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your Assistant's description"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          <section>
            <div className="flex gap-20 my-10 w-full">
              <div className="w-2/6">
                <p className="text-xs font-medium dark:text-WHITE-_100">Personality</p>
                <p className="text-[#7F7F81] text-xs font-normal">
                  Select a Personality for your assistant, you can change this
                  whenever you want
                </p>
              </div>
              <div className="space-y-3 w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Personality Type
                </label>
                <Controller
                  name={"personality_type"}
                  control={control}
                  render={({ field }) => (
                    <PersonalityField
                      field={field}
                      selectedPersonality={selectedPersonality}
                      handlePersonalityModal={handlePersonalityModal}
                      form={methods as unknown as UseFormReturn<FieldValues>}
                    />
                  )}
                />
              </div>
            </div>
          </section>
          <section>
            <div className="flex gap-20 my-10 w-full">
              <div className="w-2/6">
                <p className="text-xs font-medium dark:text-WHITE-_100">Verbosity</p>
                <p className="text-[#7F7F81] text-xs font-normal">
                  Adjust Assistant’s response detail or word’s used
                </p>
              </div>
              <div className="space-y-3 w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Choose Verbosity level
                </label>
                <Controller
                  name={"verbose"}
                  control={control}
                  render={({ field }) => (
                    <VerbosityField
                      field={field}
                      selectedVerbosity={selectedVerbosity}
                      handleVerbosityModal={handleVerbosityModal}
                      form={methods as unknown as UseFormReturn<FieldValues>}
                    />
                  )}
                />
              </div>
            </div>
          </section>
          <section>
            <DeactivateAssistantField/>
          </section>
        </main>
        <Button variant="black" disabled={isSubmitting || !isDirty} className="disabled:opacity-50">
          {isSubmitting || updatingAssistant ? <p>Saving...</p> : <p>Save Changes</p>}
        </Button>
      </form>
      <UnsavedChangesModal
        isOpen={showModal}
        onClose={onClose}
        onConfirm={onConfirm}
        onDiscard={onDiscard}
      />
    </FormProvider>

);
};

export default SettingsForm;

// <Form
//   fields={fields}
//   onSubmit={handleSubmit}
//   schema={formSchema}
//   className="pt-3 border-none shadow-none dark:bg-gray-800"
//   fieldGroupClassName=""
//   hideSubmitButton
//   renderField={(field, form) => {
//     if (field.type === "custom") {
//       switch (field.name) {
//         case "assistant_id":
//           return <AssistantIDField field={field} form={form} />;
//         case "personality_type":
//           return (
//             <section className="flex my-20 border-gray-50 border-y">
//               <div className="w-2/6">
//                 <p className="text-xs font-medium">Personality</p>
//                 <p className="text-[#7F7F81] text-xs font-normal">
//                   Select a Personality for your assistant, you can change
//                   this whenever you want
//                 </p>
//               </div>
//               <div>
//                 <PersonalityField
//                   field={field}
//                   selectedPersonality={selectedPersonality}
//                   handlePersonalityModal={handlePersonalityModal}
//                   form={form}
//                 />
//               </div>
//             </section>
//           );
//         case "verbose":
//           return (
//             <section className="flex my-20 border-gray-50 border-y">
//               <div className="w-2/6">
//                 <p className="text-xs font-medium">Verbosity</p>
//                 <p className="text-[#7F7F81] text-xs font-normal">
//                   Adjust Assistant’s response detail or word’s used
//                 </p>
//               </div>
//               <div>
//                 <VerbosityField
//                   field={field}
//                   selectedVerbosity={selectedVerbosity}
//                   handleVerbosityModal={handleVerbosityModal}
//                   form={form}
//                 />
//               </div>
//             </section>
//           );
//         default:
//           return field.render?.(field) || <div />;
//       }
//     }
//     return field.render?.(field) || <div />;
//   }}
// />