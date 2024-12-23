import { z } from "zod";
import { Form, FormFooter, FormHeader, PasswordInput, withFormField } from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import WanoLogo from "@/assets/wano logo 1 1.png";
import { useToast } from "@/contexts/ToastContext";
import { useAppDispatch } from "@/redux-slice/hooks";
import { loginUser, setTempEmail } from "@/redux-slice/auth/auth.slice";
import React from "react";

// Define form schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Define form fields
const loginFields = [
  {
    name: "email",
    label: "Email",
    className: "bg-transparent text-gray-500",
    type: "email" as const,
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    className: "bg-transparent",
    type: "custom" as const,
    placeholder: "Enter your password",
  },
];

type LoginFormValues = z.infer<typeof loginSchema>;

const NOT_VERIFIED = "Account not verified";

const LoginForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const PasswordInputWithFormField = withFormField(PasswordInput);

  const handleSignUp = () => {
    // Handle sign up logic
    navigate("/auth/signup");
  };

  const handleSubmit = async (data: LoginFormValues) => {
    // Handle form submission
    try {
      const loginResponse = await dispatch(loginUser(data)).unwrap();

      if(loginResponse.data){
        addToast('success', loginResponse.message);
        // Set authentication status
        if(!loginResponse.data.setup_business){
          navigate('company');
        } else {
          navigate("/dashboard");
        }
      }
      
    } catch (error) {
      const errorMessage = (error as any)?.message || 'An unexpected error occurred';
      addToast('error', errorMessage);
      // check if the error message is "Account not verified"
      if(errorMessage === NOT_VERIFIED){
        // store the email in the redux store
        dispatch(setTempEmail(data.email));
        // navigate to the verify account page
        navigate('verify-account');
      }
    }
  };


  return (
    <Form
      fields={loginFields}
      schema={loginSchema}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      className="w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800"
      renderField={(field, form) => {
        if (field.type === "custom") {
         return <PasswordInputWithFormField field={field} form={form}/>
        }
        return <></>;
      }}
      renderHeader={(form) => (
        <FormHeader
          Logo={WanoLogo}
          title="Welcome back!"
          text="Let's continue from where you stopped"
          width={300}
        />
      )}
      renderFooter={(form) => (
        <div className="space-y-4 flex flex-col justify-center items-center">
          <Link
            to="/auth/forgot-password"
            className="w-fit text-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Forgot Password
          </Link>
          <FormFooter
            question="Don't have an account?"
            option="Sign up"
            onClick={handleSignUp}
          />
        </div>
      )}
    />
  );
};

export default React.memo(LoginForm);


// how to use your custom component using the renderField without the withFormField wrapper
// renderField={(field, form) => {
// if (field.type === "custom") {
    //   const error = form.formState.errors[field.name]?.message as string;
    //   return (
    //     <PasswordInput
    //       field={{
    //         onChange: async (value) => {
    //           await form.setValue("password", value, {
    //             shouldValidate: true,
    //             shouldDirty: true,
    //             shouldTouch: true,
    //           });
    //           form.trigger("password");
    //         },
    //         value: form.watch("password") || "",
    //         name: "password",
    //       }}
    //       placeholder="Enter your password"
    //       error={error}
    //     />
    //   );
    // } return <></>
// }}