import { z } from 'zod';
import { Form, FormFooter, FormHeader, withFormField, OTPInput } from "@/components/ui/form";
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { resetPassword, clearTempPassword, resendEmail, clearTempEmail, setTempEmail, loginUser } from "@/redux-slice/auth/auth.slice";
import { useAppDispatch, useAppSelector } from '@/redux-slice/hooks';
import { useToast } from '@/contexts/ToastContext';
import { fetchApplications } from '@/redux-slice/applications/applications.slice';


// Define form schema
const twoFAOtpSchema = z.object({
  OTP: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Define form fields
const twoFAOtpFields = [
  {
    name: "OTP",
    label: "Enter OTP",
    className: "bg-transparent",
    type: "custom" as const,
    length: 6
  },
];

const NOT_VERIFIED = "Account not verified";

const TWO_FA_OTP_REQUIRED = "2FA OTP is required";

const TwoFactorAuthentication = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();
  const tempPassword = useAppSelector((state) => state.auth.tempPassword);
  const tempEmail = useAppSelector((state) => state.auth.tempEmail) as string;

  const OTPInputWithFormField = withFormField(OTPInput);

  const handleSubmit = async (data: z.infer<typeof twoFAOtpSchema>) => {
    // Handle form submission
    try {
      if (!tempPassword) {
        addToast('error', 'Password not found. Please try again.');
        navigate('/auth');
        return;
      }

      if(!tempEmail){
        addToast('error', 'Email not found. Please try again.');
        navigate('/auth');
        return;
      }

      const loginResponse = await dispatch(loginUser({email: tempEmail, password: tempPassword, code: data.OTP})).unwrap();

      if(loginResponse.data){
        addToast('success', loginResponse.message);
        // Set authentication status
        if(!loginResponse.data.setup_business){
          navigate('company');
        } else {
          dispatch(clearTempEmail()); //Clear the stored email
          dispatch(clearTempPassword()); // Clear the stored password
          await dispatch(fetchApplications())
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      }
      
    } catch (error) {
      const errorMessage = (error as any)?.message || 'An unexpected error occurred';
      addToast('error', errorMessage);
      // check if the error message is "Account not verified"
      if(errorMessage === NOT_VERIFIED){
        // store the email in the redux store
        dispatch(setTempEmail(tempEmail));
        // navigate to the verify account page
        navigate('verify-account');
      }
    }
  };

  return (
    <Form
      fields={twoFAOtpFields}
      schema={twoFAOtpSchema}
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
          title="Enter 6-digit code from your authenticator app"
          text="This helps us keep your account secure."
          width={400}
          textContainerClass='flex flex-col gap-6'
          allowNavigation
        />
      )}
    />
  );
}

export default React.memo(TwoFactorAuthentication);
