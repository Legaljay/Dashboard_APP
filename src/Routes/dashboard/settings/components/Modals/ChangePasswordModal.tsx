import { Form } from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/types";
import { Modal } from "@/components/ui/modal/Modal";
import { useModal } from "@/contexts/ModalContext";
import { useAppDispatch } from "@/redux-slice/hooks";
import { changePassword } from "@/redux-slice/profile/profile.slice";
import { z } from "zod";
import { useCallback } from "react";
import { Button } from "@/components/ui/button/button";

// Define the form schema using zod
const passwordFormSchema = z
  .object({
    old_password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
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
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormData = z.infer<typeof passwordFormSchema>;

const formFields: FormField[] = [
  {
    name: "old_password",
    label: "Old Password",
    type: "password",
    placeholder: "Enter your old password",
    containerClassName: "flex-1",
    className: "bg-transparent text-gray-500",
    autoFocus: true, 
  },
  {
    name: "password",
    label: "New Password",
    type: "text",
    placeholder: "Enter your new password",
    className: "bg-transparent text-gray-500",
    containerClassName: "flex-1",
  },
  {
    name: "confirm_password",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    className: "bg-transparent text-gray-500",
    containerClassName: "flex-1",
  },
];

const ChangePasswordModal = ({ modalID }: { modalID: string }) => {
  const { closeModal } = useModal();
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    closeModal(modalID);
  }, [closeModal, modalID]);

  const onSubmit = async (data: PasswordFormData) => {
    const { confirm_password, ...restData } = data;
    try {
      await dispatch(changePassword(restData)).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to update password:", error);
    }
  };

  return (
    <Modal title="Change Password" onClose={handleClose}>
      <Modal.Body>
        <div>
          <Form
            fields={formFields}
            schema={passwordFormSchema}
            onSubmit={onSubmit}
            className="space-y-6 shadow-none border-none"
            mode="all" // Only validate on form submission
            renderButton={(form) => (
              <div className="flex justify-end gap-2">
                <Button type="button" className="text-black" variant={"outline"} onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" variant={"black"}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
            hideSubmitButton
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
