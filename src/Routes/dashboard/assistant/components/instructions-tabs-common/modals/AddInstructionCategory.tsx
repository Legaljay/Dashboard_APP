import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/Modal";
import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useToast } from "@/contexts/ToastContext";
import { createAppCategory } from "@/redux-slice/app-categories/app-categories.slice";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import React, { useCallback } from "react";
import { Form } from "@/components/ui/form";
import { z } from "zod";

// Define form schema
const createCategoryFormSchema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
  description: z.string().min(8, "Description must be at least 8 characters"),
});

// Define form fields
const createCategoryFields = [
  {
    name: "name",
    label: "Category Name",
    className: "bg-transparent text-gray-500",
    type: "text" as const,
    placeholder: "Enter your category name",
  },
  {
    name: "description",
    label: "Category Description",
    className: "bg-transparent text-gray-500",
    type: "textarea" as const,
    placeholder: "Enter your category description",
    rows: 5,
  },
];

type categoryFormValues = z.infer<typeof createCategoryFormSchema>;

const AddInstructionCategory: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const creating = useAppSelector((state) => state.appCategories.creating);

  const handleCreateCategory = async (data: categoryFormValues) => {
    try {
      await dispatch(createAppCategory({ applicationId, categoryData: data })).unwrap();
      addToast("success", "Category created successfully");
      closeModal(MODAL_IDS.custom("add-instruction-category"));
    } catch (error: any) {
      addToast("error", error?.message || "Failed to verify code");
    }
  };

  const onClose = useCallback(() => {
    closeModal(MODAL_IDS.custom("add-instruction-category"));
  }, [closeModal]);

  return (
    <Modal title="Add Instruction Category" description="Create a new category for your instructions" onClose={onClose}>
      <Modal.Body>
        <Form
          fields={createCategoryFields}
          schema={createCategoryFormSchema}
          onSubmit={handleCreateCategory}
          className="space-y-6 shadow-none border-none p-0"
          mode="all" // Only validate on form submission
          hideSubmitButton
          renderButton={(form) => (
            <div className="flex justify-end gap-2 w-2/5">
              <Button
                onClick={onClose}
                className="hover:bg-[#FAFAFA] !border !border-[#D0D5DD] bg-transparent w-full py-2 rounded-lg text-sm font-semibold !text-[#7F7f81]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"black"}
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting || creating ? "Creating..." : "Save"}
              </Button>
            </div>
          )}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddInstructionCategory;
