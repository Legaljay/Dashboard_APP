import { z } from "zod";
import { Form, FormFooter, FormHeader, PasswordInput, FormPhoneInput, FormSelect, FormInput } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import WanoLogo from "@/assets/wano logo 1 1.png";
import { useToast } from "@/contexts/ToastContext";
import { useAppDispatch } from "@/redux-slice/hooks";
import { registerUser, setTempEmail } from "@/redux-slice/auth/auth.slice";
import { FormField } from "@/components/ui/form/types";
import { FieldValues, UseFormReturn } from "react-hook-form";

// Define form schema
const signupSchema = z.object({
  first_name: z.string().min(4, "First name must be at least 2 characters"),
  last_name: z.string().min(4, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Invalid phone number"),
  country: z.string().min(1, "Please select a country"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

// Define form fields
const signupFields = [
  {
    name: "first_name",
    label: "First Name",
    type: "text" as const,
    placeholder: "Enter your first name",
    className: "!bg-transparent text-gray-500",
  },
  {
    name: "last_name",
    label: "Last Name",
    type: "text" as const,
    placeholder: "Enter your last name",
    className: "!bg-transparent text-gray-500",
  },
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    placeholder: "Enter your email",
    className: "!bg-transparent text-gray-500",
  },
  {
    name: "phone_number",
    label: "Phone Number",
    type: "custom" as const,
    containerClassName: "z-[100]",
  },
  {
    name: "country",
    label: "Country",
    type: "custom" as const,
    containerClassName: "z-[90]",
  },
  {
    name: "password",
    label: "Password",
    type: "custom" as const,
  },
];

// Define countries data
const countries = [
  { value: "United States", label: "🇺🇸 United States" },
  { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Australia", label: "🇦🇺 Australia" },
  { value: "Germany", label: "🇩🇪 Germany" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Italy", label: "🇮🇹 Italy" },
  { value: "Spain", label: "🇪🇸 Spain" },
  { value: "Brazil", label: "🇧🇷 Brazil" },
  { value: "India", label: "🇮🇳 India" },
  { value: "China", label: "🇨🇳 China" },
  { value: "Japan", label: "🇯🇵 Japan" },
  { value: "Russia", label: "🇷🇺 Russia" },
  { value: "South Africa", label: "🇿🇦 South Africa" },
  { value: "Nigeria", label: "🇳🇬 Nigeria" },
  // Add more countries as needed
];

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
            className={`block text-sm font-medium text-gray-700 dark:text-gray-200`}
          >
            {field.label}
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
              className="text-sm text-BLACK-_500"
              error={form.formState.errors[field.name]?.message as string}
            />
          )}
        </div>
      ))}
    </>
  );
};

const renderField = (field: FormField, form: UseFormReturn<FieldValues>) => {
  if (field.type === "custom") {
    const error = form.formState.errors[field.name]?.message as string;

    switch (field.name) {
      case "phone_number":
        return (
          <FormPhoneInput
            field={{
              onChange: async (value) => {
                await form.setValue("phone_number", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.trigger("phone_number");
              },
              value: form.watch("phone_number") || "",
              name: "phone_number",
            }}
            placeholder="Enter your phone number"
            error={error}
          />
        );
      case "country":
        return (
          <FormSelect
            field={{
              onChange: async (value) => {
                await form.setValue("country", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.trigger("country");
              },
              value: form.watch("country") || "",
              name: "country",
            }}
            options={countries}
            placeholder="Select your country"
            isMulti={false}
            error={error}
          />
        );
      case "password":
        return (
          <PasswordInput
            field={{
              onChange: async (value) => {
                await form.setValue("password", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.trigger("password");
              },
              value: form.watch("password") || "",
              name: "password",
            }}
            placeholder="Enter your password"
            error={error}
          />
        );
      default:
        return <></>;
    }
  }
  return <></>;
};

const SignupForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const signupResponse = await dispatch(registerUser(data)).unwrap();
      if (signupResponse.status) {
        addToast("success", signupResponse.message);
        // Set authentication status

        // Store email in Redux state
        dispatch(setTempEmail(data.email));

        // Set user data
        navigate("/auth/verify-account");
      }
    } catch (error) {
      const errorMessage =
        (error as any)?.message || "An unexpected error occurred";
      addToast("error", errorMessage);
    }
  };

  return (
    <Form
      fields={signupFields}
      schema={signupSchema}
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      className="w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800"
      renderHeader={() => (
        <FormHeader
          Logo={WanoLogo}
          title="Create an Account"
          text="Join Wano and start your journey"
          width={300}
        />
      )}
      renderFooter={() => (
        <div className="space-y-4">
          <FormFooter
            question="Already have an account?"
            option="Login"
            onClick={handleLogin}
          />
        </div>
      )}
      renderFieldGroup={renderFieldGroup}
    />
  );
};

export default SignupForm;

