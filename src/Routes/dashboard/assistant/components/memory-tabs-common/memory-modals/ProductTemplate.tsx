import React, { useState, useEffect, useCallback } from "react";
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
import { FixedSizeList } from "react-window";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";

const schema = z.object({
  answerOne: z.string().min(1, "Products/services are required"),
  answerTwo: z.string().min(1, "Product/service descriptions are required"),
  answerThree: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const formFields = [
  {
    id: "field1",
    question: "What are the products/services offered by your business?",
    name: "answerOne",
    required: true,
  },
  {
    id: "field2",
    question:
      "Provide descriptions of each Product/Service (Include pricing where necessary)",
    name: "answerTwo",
    required: true,
  },
  {
    id: "field3",
    question:
      "Anything else you'd like your customers to know about your business?",
    name: "answerThree",
    required: false,
  },
];

const ITEM_SIZE = 300; // Height for each form field row

const ProductTemplate: React.FC<{ handleClose: () => void; key: string }> = ({
  handleClose,
  key,
}) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { assistantId: applicationId = "" } = useParams();
  const formRef = React.useRef<HTMLFormElement>(null);
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

  const handleTriggerSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit(); 
    }
  }, []);
  
  const onSubmit = useCallback(async (values: FormValues) => {
    setLoading(true);
    try {
      const template = {
        data: [
          {
            question:
              "What are the products/services offered by your business?",
            category: "product_and_service",
            answer: values.answerOne,
          },
          {
            question:
              "Provide descriptions of each Product/Service (Include pricing where necessary)",
            category: "product_and_service",
            answer: values.answerTwo,
          },
          {
            question:
              "Anything else you'd like your customers to know about your business?",
            category: "product_and_service",
            answer: values.answerThree || "",
          },
        ].filter((item) => item.answer),
      };

      const response = await dispatch(createMemoryTemplate({ applicationId, template })).unwrap();
      if (response.status) {
        addToast("success", response.message || "Product/Services template updated successfully");
        setLoading(false);
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast(
        "error",
        "Error updating product/services template. Please try again."
      );
      setLoading(false);
    }
  },[addToast, handleClose]);

  const defaultValues = {
    answerOne: getAnswerByCategoryAndQuestion(
      "product_and_service",
      "What are the products/services offered by your business?"
    ),
    answerTwo: getAnswerByCategoryAndQuestion(
      "product_and_service",
      "Provide descriptions of each Product/Service (Include pricing where necessary)"
    ),
    answerThree: getAnswerByCategoryAndQuestion(
      "product_and_service",
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

  const generateFields = (): FormField[] => {
    return formFields.map((field) => ({
      name: field.name,
      label: field.question,
      type: "textarea",
      placeholder: "Enter your answer",
      required: field.required,
      rows: 10,
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
        <div style={style} className="flex flex-col gap-6 px-6">
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
      <FixedSizeList
        height={600}
        itemCount={fields.length}
        itemSize={ITEM_SIZE}
        width={946}
      >
        {FormFieldRow}
      </FixedSizeList>
    );
  };

  return (
    <Modal
      title="Product/Services - Template Guide"
      key={key}
      onClose={handleClose}
      childClassName="p-0"
    >
      <Modal.Header className="px-6 py-2 border-none">{renderHeader()}</Modal.Header>
      <Modal.Body className="overflow-y-scroll max-h-[60dvh]">
        <Form
          ref={formRef}
          fields={generateFields()}
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          loading={loading}
          submitLabel="Save"
          className="flex flex-col gap-6 px-6 pt-0 pb-6 border-none shadow-none"
          fieldGroupClassName="space-y-4"
          // renderHeader={renderHeader}
          renderField={(fields, form) =>
            renderVirtualizedFields(generateFields())
          }
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

export default React.memo(ProductTemplate);
