import { z } from 'zod';
import { Form, FormHeader, PasswordInput, withFormField } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { setTempPassword } from "@/redux-slice/auth/auth.slice";
import { useAppDispatch } from '@/redux-slice/hooks';

// Define form schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Define form fields
const resetPasswordFields = [
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    className: "bg-transparent",
    type: "custom" as const,
  },
];


const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const PasswordInputWithFormField = withFormField(PasswordInput);

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    // Handle form submission
    // Store password in Redux state
    dispatch(setTempPassword(data.password));
    navigate('/auth/reset-verify')
  };

  return (
    <Form
      fields={resetPasswordFields}
      schema={resetPasswordSchema}
      onSubmit={handleSubmit}
      submitLabel="Reset"
      className="w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800"
      renderField={(field, form) => {
        if (field.type === "custom") {
         return <PasswordInputWithFormField field={field} form={form}/>
        }
        return <></>;
      }}
      renderHeader={(form) => (
        <FormHeader
          title="Reset Password!"
          text="Enter a new password for your account."
          width={300}
          textContainerClass='flex flex-col gap-6'
          allowNavigation
        />
      )}
    />
  );
}

export default React.memo(ResetPassword);