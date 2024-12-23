import { z } from 'zod';
import { Form, FormFooter, FormHeader, withFormField, OTPInput } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { resetPassword, clearTempPassword, resendEmail, clearTempEmail } from "@/redux-slice/auth/auth.slice";
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { useToast } from '@/contexts/ToastContext';


// Define form schema
const resetOTPSchema = z.object({
  OTP: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Define form fields
const resetOTPFields = [
  {
    name: "OTP",
    label: "Enter OTP",
    className: "bg-transparent",
    type: "custom" as const,
    length: 6
  },
];

const PURPOSE = "forgot_password";

const ResetOTP = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const tempPassword = useAppSelector((state) => state.auth.tempPassword);
  const tempEmail = useAppSelector((state) => state.auth.tempEmail);

  const OTPInputWithFormField = withFormField(OTPInput);

  const handleResendVerification = async() => {
    // Handle resend verification logic
    if(!tempEmail){
      addToast('error', 'Email not found. Please try again.');
      navigate("/auth/forgot-password");
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

  const handleSubmit = async (data: z.infer<typeof resetOTPSchema>) => {
    try {
      if (!tempPassword) {
        addToast('error', 'Password not found. Please try again.');
        navigate('/auth/reset-password');
        return;
      }

      const response = await dispatch(resetPassword({ code: data.OTP, password: tempPassword })).unwrap();
      
      if (response.status) {
        addToast('success', response.message);
        dispatch(clearTempEmail()); //Clear the stored email
        dispatch(clearTempPassword()); // Clear the stored password
        navigate('/auth');
      }
    } catch (error: any) {
      addToast('error', error.message || 'Failed to reset password');
    }
  };

  return (
    <Form
      fields={resetOTPFields}
      schema={resetOTPSchema}
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
          title="Reset OTP!"
          text="Check your email address provided for an email verification from us. Please enter below the OTP in the mail."
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

export default React.memo(ResetOTP);
