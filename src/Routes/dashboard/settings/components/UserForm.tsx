import React from "react";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { updateUserProfile, fetchUserProfile } from "@/redux-slice/user/user.slice";
import { Form } from "@/components/ui/form/Form";
import FormPhoneInput from "@/components/ui/form/FormPhoneInput";
import { FormField } from "@/components/ui/form/types";
import { UseFormReturn, FieldValues } from "react-hook-form";
import FormInput from "@/components/ui/form/FormInput";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import ChangePasswordModal from "./Modals/ChangePasswordModal";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button/button";
import { useNavigationBlocker } from "@/hooks/useNavigationBlocker";
import { UnsavedChangesModal } from "@/components/ui/modals/UnsavedChangesModal";


// Define the form schema using zod
const userFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  password: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

const formFields: FormField[] = [
  {
    name: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter your first name",
    containerClassName: "flex-1",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter your last name",
    containerClassName: "flex-1",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    disabled: true,
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "custom",
    placeholder: "Enter your phone number",
    disabled: true,
  },
  {
    name: "country",
    label: "Country",
    type: "text",
    placeholder: "Enter your country",
    disabled: true,
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    disabled: true,
  },
];
const PASSWORD = "********************************";
const TYPE_PASSWORD = "password";

export const UserForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const { addToast } = useToast();
  const userProfile = useAppSelector((state) => state.user.profile);
  const formRef = React.useRef<UseFormReturn<z.infer<typeof userFormSchema>>>();
  const [formState, setFormState] = React.useState({ isDirty: false });

  const { showModal, onClose, onConfirm, onDiscard } = useNavigationBlocker({
    isDirty: formState.isDirty,
    basePath: '/settings',
    onSave: async () => {
      if (formRef.current) {
        const data = formRef.current.getValues();
        await onSubmit(data);
      }
    }
  });

  const handleFormReady = React.useCallback((form: UseFormReturn<z.infer<typeof userFormSchema>>) => {
    formRef.current = form;
    // Subscribe to form changes and update state to trigger re-render
    const subscription = form.watch(() => {
      setFormState({ isDirty: form.formState.isDirty });
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const defaultValues = {
    first_name: userProfile?.first_name || "",
    last_name: userProfile?.last_name || "",
    email: userProfile?.email || "",
    phone_number: userProfile?.phone_number || "",
    country: userProfile?.country || "",
    password: PASSWORD,
  };
  

  const openPasswordChangeModal = () => {
    openModal(
        MODAL_IDS.custom('change-password'),
        <ChangePasswordModal modalID={MODAL_IDS.custom('change-password')} />,
        {
          size: "xl",
          position: "center",
          closeOnClickOutside: true,
          className: "",
        }
      );
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      const { first_name, last_name } = data;
      await dispatch(updateUserProfile({ first_name, last_name })).unwrap();
      // Fetch the latest profile data after successful update
      await dispatch(fetchUserProfile()).unwrap();
      addToast("success", "Profile updated successfully");
    } catch (error: any) {
      addToast("error", error?.message || "Failed to update profile");
    }
  };

  const renderField = (field: FormField, form: UseFormReturn<FieldValues>) => {
    const error = form.formState.errors[field.name]?.message as string;

    if (field.name === "phone_number") {
      return (
        <FormPhoneInput
          field={{
            onChange: async (value) => {
              await form.setValue(field.name, value, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
              form.trigger(field.name);
            },
            value: form.watch(field.name) || "",
            name: field.name,
          }}
          placeholder={field.placeholder}
          error={error}
          disabled={field.disabled}
          className="disabled:cursor-not-allowed disabled:!bg-[#B3B3B3]/20"
        />
      );
    }

    return <></>;
  };

  const renderFieldGroup = (
    fields: FormField[],
    form: UseFormReturn<FieldValues>
  ) => {
    const nameFields = fields.filter(
      (f) => f.name === "first_name" || f.name === "last_name"
    );
    const otherFields = fields.filter(
      (f) => f.name !== "first_name" && f.name !== "last_name"
    );

    return (
      <>
        <div className="flex gap-4">
          {nameFields.map((field) => (
            <div key={field.name} className={field.containerClassName}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {field.label}
              </label>
              <FormInput
                field={{
                  onChange: async (value) => {
                    await form.setValue(field.name, value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    form.trigger(field.name);
                  },
                  value: form.watch(field.name) || "",
                  name: field.name,
                }}
                type={field.type}
                placeholder={field.placeholder}
                className="text-sm text-BLACK-_500"
                error={form.formState.errors[field.name]?.message as string}
              />
            </div>
          ))}
        </div>
        {otherFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className={`block text-sm font-medium text-gray-700 dark:text-gray-200 ${field.name === TYPE_PASSWORD && "flex justify-between"}`}
            >
              {field.label}
              {field.name === TYPE_PASSWORD && ( <span onClick={openPasswordChangeModal} className="text-BLUE-_200 text-left text-xs font-semibold cursor-pointer">Change Password?</span>)}
            </label>
            {field.type === "custom" ? (
              renderField(field, form)
            ) : (
              <FormInput
                field={{
                  onChange: async (value) => {
                    await form.setValue(field.name, value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    form.trigger(field.name);
                  },
                  value: form.watch(field.name) || "",
                  name: field.name,
                }}
                type={field.type}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`text-sm text-black disabled:cursor-not-allowed disabled:!bg-[#B3B3B3]/20 ${field.name === TYPE_PASSWORD ? "pt-3" : ""}`}
                error={form.formState.errors[field.name]?.message as string}
              />
            )}
          </div>
        ))}
      </>
    );
  };

  const renderButton = (form: UseFormReturn<FieldValues>) => {
    return (
      <Button type="submit" variant={"black"}>
        {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
      </Button>      
    );
  };

  return (
    <div className="flex gap-8 w-full">
      <div className="w-[350px]">
        <h2 className="text-sm text-BLACK-_100 font-medium">
          Personal Profile
        </h2>
        <p className="text-sm text-gray-500">
          Personal profile settings. You can change this information at anytime
        </p>
      </div>

      <Form
        fields={formFields}
        schema={userFormSchema}
        onSubmit={onSubmit}
        onFormReady={handleFormReady}
        submitLabel="Save Changes"
        className="space-y-6 shadow-none border-none w-[520px] px-[50px] pt-0"
        renderFieldGroup={renderFieldGroup}
        renderButton={renderButton}
        defaultValues={defaultValues}
        hideSubmitButton
      />

      <UnsavedChangesModal
        isOpen={showModal}
        onClose={onClose}
        onConfirm={onConfirm}
        onDiscard={onDiscard}
      />
    </div>
  );
};

export default UserForm;
