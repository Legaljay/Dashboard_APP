import React, { useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { z } from "zod";
import { Form } from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/types";
import { useAppDispatch } from "@/redux-slice/hooks";
import { createMemoryTemplate } from "@/redux-slice/memory-template/memory-template.slice";
import { useParams } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";

const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.literal("faq")
});

const schema = z.object({
  questionsAndAnswers: z.array(faqItemSchema).min(1, "At least one FAQ is required")
});

// type FaqItem = z.infer<typeof faqItemSchema>;
type FormValues = z.infer<typeof schema>;

const initialValues: FormValues = {
  questionsAndAnswers: [
    { question: '', category: "faq", answer: '' }
  ]
};

const FaqTemplate: React.FC<{ handleClose: () => void, key: string }> = ({ handleClose, key }) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { assistantId: applicationId = '' } = useParams();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);

  const handleTriggerSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit(); 
    }
  }, []);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const template = {
        data: values.questionsAndAnswers.filter(item => item.answer && item.question)
      };

      const response = await dispatch(createMemoryTemplate({ applicationId, template })).unwrap();
      if (response.status) {
        addToast('success', response.message || "FAQ template updated successfully");
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast("error", "Error updating FAQ template. Please try again.");
      setLoading(false);
    }
  };

  const generateFields = (): FormField[] => {
    const fields: FormField[] = [];
    
    for (let i = 0; i < questionCount; i++) {
      fields.push(
        {
          name: `questionsAndAnswers.${i}.question`,
          label: `Question ${i + 1}`,
          type: "text",
          placeholder: "Enter your question",
        },
        {
          name: `questionsAndAnswers.${i}.answer`,
          label: "Answer",
          type: "textarea",
          placeholder: "Enter your answer",
          rows: 10,
        }
      );
    }
    
    return fields;
  };


  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal leading-5 text-BLACK-_200">
          Fill the template with the necessary information.
        </p>
      </div>
    </div>
  );

  const renderAddButton = () => (
    <div className="flex justify-end w-full">
      <p 
        className="text-[#1774FD] text-sm font-semibold cursor-pointer" 
        onClick={() => {
          setQuestionCount(prev => prev + 1);
          const newValues = { ...initialValues };
          newValues.questionsAndAnswers.push({ question: '', category: "faq", answer: '' });
          return newValues;
        }}
      >
        Add another question
      </p>
    </div>
  );

  return (
    <Modal title="FAQ - Template Guide" key={key} onClose={handleClose} childClassName="p-0">
      <Modal.Header className="px-6 py-2 border-none">
        {renderHeader()}
      </Modal.Header>
      <Modal.Body className="overflow-y-scroll max-h-[60dvh]">
      <Form
        ref={formRef}
        fields={generateFields()}
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={initialValues}
        loading={loading}
        submitLabel="Upload"
        className="flex flex-col gap-6 px-6 pt-0 pb-6 border-none shadow-none"
        fieldGroupClassName="space-y-4"
        // renderHeader={renderHeader}
        renderButton={renderAddButton}
        hideSubmitButton
      />
      </Modal.Body>
      <Modal.Footer className="flex gap-5 justify-end">
        <Button
          type="button"
          size={"lg"}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button type="button" size={"lg"} variant="black" onClick={handleTriggerSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(FaqTemplate);