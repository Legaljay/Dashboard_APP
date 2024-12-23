import { z } from "zod";
import { Form, FormHeader } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/redux-slice/hooks";
import { useToast } from "@/contexts/ToastContext";
import { forgotPassword, setTempEmail } from "@/redux-slice/auth/auth.slice";

// Define form schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Define form fields
const forgotPasswordFields = [
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    placeholder: "Enter your email",
  },
];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    // Handle form submission
    try {
      const forgotResponse = await dispatch(forgotPassword(data)).unwrap();
      if (forgotResponse.status) {
        // Store email in Redux state
        dispatch(setTempEmail(data.email));
        addToast("success", forgotResponse.message);
        // Set authentication status

        // Set user data
        navigate("/auth/reset-password");
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.message || "An unexpected error occurred";
      addToast("error", errorMessage);
    }
  };

  return (
    <Form
      fields={forgotPasswordFields}
      schema={forgotPasswordSchema}
      onSubmit={handleSubmit}
      submitLabel="Send Mail"
      className="w-[520px] mx-auto shadow py-[30px] px-[50px] rounded-xl bg-white dark:bg-gray-800"
      renderHeader={(form) => (
        <FormHeader
          title="Forgot your Password!"
          text="Enter your email address below, you will receive a link in your inbox to continue."
          width={300}
          textContainerClass="flex flex-col gap-6"
          allowNavigation
        />
      )}
    />
  );
};

export default ForgotPassword;
