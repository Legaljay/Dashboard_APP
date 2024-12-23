import React, { useState, useEffect } from "react";
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
import { FixedSizeList as List } from "react-window";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";

const schema = z.object({
  answerOne: z.string().min(1, "Terms and conditions are required"),
  answerTwo: z.string().min(1, "License information is required"),
  answerThree: z.string().min(1, "Security information is required"),
  answerFour: z.string().min(1, "Privacy policy is required"),
  answerFive: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const formFields = [
  {
    id: "terms",
    question: "What are your business's terms and conditions?",
    name: "answerOne",
    required: true,
  },
  {
    id: "licenses",
    question:
      "Are there any specific licenses/certifications your business holds?",
    name: "answerTwo",
    required: true,
  },
  {
    id: "security",
    question: "How do you ensure security and privacy of customer data?",
    name: "answerThree",
    required: true,
  },
  {
    id: "privacy",
    question: "Explain your business privacy policy if any",
    name: "answerFour",
    required: true,
  },
  {
    id: "additional",
    question:
      "Anything else you'd like your customers to know about your business?",
    name: "answerFive",
    required: false,
  },
];

const ITEM_SIZE = 250; // Height for each form field row

const LegalTemplate: React.FC<{ handleClose: () => void; key: string }> = ({
  handleClose,
  key,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { assistantId: applicationId = "" } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<MemoryTEmplate[]>([]);

  useEffect(() => {
    if (applicationId) {
      fetchData();
    }
  }, [applicationId]);

  const fetchData = async () => {
    try {
      const response = await dispatch(
        fetchMemoryTemplates(applicationId)
      ).unwrap();
      setFetchedData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAnswerByCategoryAndQuestion = (
    category: string,
    question: string
  ) => {
    const foundItem = fetchedData.find(
      (item) => item.category === category && item.question === question
    );
    return foundItem ? foundItem.answer : "";
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const template = {
        data: [
          {
            question: "What are your business's terms and conditions?",
            category: "legal",
            answer: values.answerOne,
          },
          {
            question:
              "Are there any specific licenses/certifications your business holds?",
            category: "legal",
            answer: values.answerTwo,
          },
          {
            question:
              "How do you ensure security and privacy of customer data?",
            category: "legal",
            answer: values.answerThree,
          },
          {
            question: "Explain your business privacy policy if any",
            category: "legal",
            answer: values.answerFour,
          },
          {
            question:
              "Anything else you'd like your customers to know about your business?",
            category: "legal",
            answer: values.answerFive || "",
          },
        ].filter((item) => item.answer),
      };

      await dispatch(createMemoryTemplate({ applicationId, template }));
      addToast("success", "Legal template updated successfully");
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast("error", "Error updating legal template. Please try again.");
      setLoading(false);
    }
  };

  const defaultValues = {
    answerOne: getAnswerByCategoryAndQuestion(
      "legal",
      "What are your business's terms and conditions?"
    ),
    answerTwo: getAnswerByCategoryAndQuestion(
      "legal",
      "Are there any specific licenses/certifications your business holds?"
    ),
    answerThree: getAnswerByCategoryAndQuestion(
      "legal",
      "How do you ensure security and privacy of customer data?"
    ),
    answerFour: getAnswerByCategoryAndQuestion(
      "legal",
      "Explain your business privacy policy if any"
    ),
    answerFive: getAnswerByCategoryAndQuestion(
      "legal",
      "Anything else you'd like your customers to know about your business?"
    ),
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs leading-5 font-normal text-BLACK-_200">
          Fill the template with the necessary information.
        </p>
      </div>
    </div>
  );

  const generateFields = (): FormField[] => {
    return formFields.map((field) => ({
      name: field.name,
      label: field.question,
      type: "textarea",
      placeholder: "Enter your answer",
      required: field.required,
      rows: 6,
    }));
  };

  const renderVirtualizedFields = (fields: FormField[]) => {
    const FormFieldRow = ({
      index,
      style,
    }: {
      index: number;
      style: React.CSSProperties;
    }) => {
      const field = fields[index];
      return (
        <div style={style} className="flex flex-col gap-6 px-6 mb-4">
          <div className="w-[866px] flex flex-col">
            <p className="label text-left text-[#121212] text-sm font-medium">
              {field.label}
            </p>
            <div className="flex flex-col lg:w-[866px] gap-2">
              <textarea
                name={field.name}
                rows={field.rows}
                placeholder={field.placeholder}
                className="outline-none rounded-lg border border-[#D0D5DD] p-2"
              />
            </div>
          </div>
        </div>
      );
    };

    return (
      <List
        height={600}
        itemCount={fields.length}
        itemSize={ITEM_SIZE}
        width="100%"
      >
        {FormFieldRow}
      </List>
    );
  };

  return (
    <Modal title="Legal - Template Guide" key={key} onClose={handleClose} childClassName="p-0">
      <Modal.Header className="px-6 py-2 border-none">{renderHeader()}</Modal.Header>
      <Modal.Body className="overflow-y-scroll max-h-[60dvh]">
        <Form
          fields={generateFields()}
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          loading={loading}
          submitLabel="Submit"
          className="flex flex-col gap-6 shadow-none border-none px-6 pb-6 pt-0"
          fieldGroupClassName="space-y-4"
          // renderHeader={renderHeader}
          renderField={(fields, form) =>
            renderVirtualizedFields(generateFields())
          }
        />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-5">
        <Button
          type="button"
          size={"lg"}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button type="submit" size={"lg"} variant="black">
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(LegalTemplate);
