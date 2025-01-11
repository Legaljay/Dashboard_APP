import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { z } from "zod";
import { Form } from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/types";
import { useAppDispatch } from "@/redux-slice/hooks";
import {
  createMemoryTemplate,
  fetchMemoryTemplates,
} from "@/redux-slice/memory-template/memory-template.slice";
import { MemoryTEmplate } from "@/redux-slice/memory-template/memory-template.types";
import { useParams } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";
import { useMemoryFiles } from "../hooks/useMemoryFiles";

const schema = z.object({
  answerOne: z.string().min(1, "This field is required"),
  answerTwo: z.string().min(1, "This field is required"),
  answerThree: z.string().min(1, "This field is required"),
  answerFour: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const AboutTemplate: React.FC<{ handleClose: () => void; key: string }> = ({
  handleClose,
  key,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const { assistantId: applicationId = "" } = useParams();
  const { refetch } = useMemoryFiles(applicationId, "about");
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<MemoryTEmplate[]>([]);

  useEffect(() => {
    if (applicationId) {
      fetchData();
    }
  }, [applicationId]);

  const handleTriggerSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit(); 
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(
        fetchMemoryTemplates(applicationId)
      ).unwrap();
      setFetchedData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch, applicationId]);

  const getAnswerByCategoryAndQuestion = (
    category: string,
    question: string
  ) => {
    const foundItem = fetchedData.find(
      (item) => item.category === category && item.question === question
    );
    return foundItem ? foundItem.answer : "";
  };

  const fields: FormField[] = [
    {
      name: "answerOne",
      label:
        "Q1. Give a description of your business and its services or offerings",
      type: "textarea",
      placeholder: "Enter your answer",
      rows: 6,
    },
    {
      name: "answerTwo",
      label:
        "Q2. What are your business's foundational principles, mission, and long-term vision?",
      type: "textarea",
      placeholder: "Enter your answer",
      rows: 6,
    },
    {
      name: "answerThree",
      label: "Q3. What are the core values and culture of your company?",
      type: "textarea",
      placeholder: "Enter your answer",
      rows: 6,
    },
    {
      name: "answerFour",
      label: "Q4. Anything else you'd like your customers to know about your business?",
      type: "textarea",
      placeholder: "Enter additional information",
      rows: 6,
    },
  ];

  const onSubmit = useCallback(async (values: FormValues) => {
    setLoading(true);
    try {
      const template = {
        data: [
          {
            question:
              "Give a description of your business and its services or offerings",
            category: "about",
            answer: values.answerOne,
          },
          {
            question:
              "What are your business's foundational principles, mission, and long-term vision?",
            category: "about",
            answer: values.answerTwo,
          },
          {
            question: "What are the core values and culture of your company?",
            category: "about",
            answer: values.answerThree,
          },
          {
            question:
              "Anything else you'd like your customers to know about your business?",
            category: "about",
            answer: values.answerFour || "",
          },
        ].filter((item) => item.answer),
      };

      const response = await dispatch(createMemoryTemplate({ applicationId, template })).unwrap();
      if (response.status) {
        addToast("success", response.message || "About template updated successfully");
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast("error", "Error updating about template. Please try again.");
      setLoading(false);
    }
  }, [dispatch, addToast, applicationId, handleClose]);

  const defaultValues = {
    answerOne: getAnswerByCategoryAndQuestion(
      "about",
      "Give a description of your business and its services or offerings"
    ),
    answerTwo: getAnswerByCategoryAndQuestion(
      "about",
      "What are your business's foundational principles, mission, and long-term vision?"
    ),
    answerThree: getAnswerByCategoryAndQuestion(
      "about",
      "What are the core values and culture of your company?"
    ),
    answerFour: getAnswerByCategoryAndQuestion(
      "about",
      "Anything else you'd like your customers to know about your business?"
    ),
  };

  const renderHeader = () => (
    <div className="flex items-center">
      <div>
        <p className="text-xs font-normal leading-5 text-BLACK-_200">
          Fill the template with the necessary information.
        </p>
      </div>
    </div>
  );

  return (
    <Modal title="About - Template Guide" key={key} onClose={handleClose} childClassName="p-0">
      <Modal.Header className="px-6 py-2 border-none">{renderHeader()}</Modal.Header>
      <Modal.Body className="overflow-y-scroll max-h-[60dvh]">
        <Form
          ref={formRef}
          fields={fields}
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          loading={loading}
          submitLabel="Upload"
          className="flex flex-col gap-6 p-6 border-none shadow-none"
          fieldGroupClassName="space-y-4"
          // renderHeader={renderHeader}
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

export default React.memo(AboutTemplate);
