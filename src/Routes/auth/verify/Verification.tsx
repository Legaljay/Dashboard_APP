import { z } from 'zod';
import { Form, FormFooter, FormHeader, withFormField, OTPInput } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { resendEmail, clearTempEmail, verifyEmail } from "@/redux-slice/auth/auth.slice";
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { useToast } from '@/contexts/ToastContext';


// Define form schema
const verificationSchema = z.object({
  code: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Define form fields
const verificationFields = [
  {
    name: "code",
    label: "Enter OTP",
    className: "bg-transparent",
    type: "custom" as const,
    length: 6
  },
];

const PURPOSE = "email_verification";

const Verification = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const tempEmail = useAppSelector((state) => state.auth.tempEmail);

  const OTPInputWithFormField = withFormField(OTPInput);

  const handleResendVerification = async() => {
    // Handle resend verification logic
    if(!tempEmail){
      addToast('error', 'Email not found. Please try again.');
      navigate("/auth/signup");
      return;
    }
    try {
      const response = await dispatch(resendEmail({ email: tempEmail, purpose: PURPOSE })).unwrap();
      if (response.status) {
        addToast('success', response.message);
        dispatch(clearTempEmail());
      } 
    } catch (error:any) {
      addToast('error', error.message || 'An unexpected error occurred.');
    }
  };

  const handleSubmit = async (data: z.infer<typeof verificationSchema>) => {
    try {

      const response = await dispatch(verifyEmail(data)).unwrap();
      
      if (response.status) {
        addToast('success', response.message);
        dispatch(clearTempEmail()); // clear the stored email
        navigate('/dashboard');
      }
    } catch (error: any) {
      addToast('error', error.message || 'Failed to reset password');
    }
  };

  return (
    <Form
      fields={verificationFields}
      schema={verificationSchema}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      className="w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800"
      renderField={(field, form) => {
        if (field.type === "custom") {
          return <OTPInputWithFormField field={field} form={form} />;
        }
        return <></>;
        }}
      renderHeader={(form) => (
        <FormHeader
          title="Verify your email address"
          text="Please enter the One Time Password sent to your email."
          width={400}
          textContainerClass='flex flex-col gap-6'
          allowNavigation
        />
      )}
      renderFooter={(form) => (
        <div className="space-y-4">
          <FormFooter
            question="Didn’t get any mail?"
            option="Resend verification code"
            onClick={handleResendVerification}
          />
        </div>
      )}
    />
  );
}

export default React.memo(Verification);