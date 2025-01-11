import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { z } from "zod";
import { Form } from "@/components/ui/form/Form";
import { FormField } from "@/components/ui/form/types";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { createMemoryTemplate, fetchMemoryTemplates } from "@/redux-slice/memory-template/memory-template.slice";
import { MemoryTEmplate } from "@/redux-slice/memory-template/memory-template.types";
import { useParams } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";

const schema = z.object({
  numberOne: z.string().optional(),
  numberTwo: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  url: z.string().url("Invalid URL").optional(),
  answerTwo: z.string().min(1, "This field is required"),
  answerThree: z.string().min(1, "This field is required"),
  answerFour: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const SupportTemplate: React.FC<{ handleClose: () => void, key: string }> = ({ handleClose, key }) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { assistantId: applicationId = ''} = useParams();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<MemoryTEmplate[]>([]);
  const [countrycode, setCountrycode] = useState("+234");
  const [countrycode2, setCountrycode2] = useState("+234");

  // const storeCountries = useAppSelector((state) => state.getAllCountries);

  useEffect(() => {
    if (applicationId) {
      fetchData();
    }
  }, [applicationId]);

  const fetchData = async () => {
    try {
      const response = await dispatch(fetchMemoryTemplates(applicationId)).unwrap();
      setFetchedData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAnswerByCategoryAndQuestion = (category: string, question: string) => {
    const foundItem = fetchedData.find(
      (item) => item.category === category && item.question === question
    );
    return foundItem ? foundItem.answer : "";
  };

  const fields: FormField[] = [
    {
      name: "numberOne",
      label: "Phone Number 1",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      name: "numberTwo",
      label: "Phone Number 2",
      type: "tel",
      placeholder: "Enter alternate phone number",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      name: "twitter",
      label: "X (formerly Twitter)",
      type: "text",
      placeholder: "Enter Twitter handle",
    },
    {
      name: "instagram",
      label: "Instagram",
      type: "text",
      placeholder: "Enter Instagram handle",
    },
    {
      name: "facebook",
      label: "Facebook",
      type: "text",
      placeholder: "Enter Facebook page",
    },
    {
      name: "url",
      label: "Company's URL or Website",
      type: "text",
      placeholder: "Enter company website",
    },
    {
      name: "answerTwo",
      label: "How are escalations managed if an issue cannot be resolved immediately?",
      type: "textarea",
      placeholder: "Enter your answer",
    },
    {
      name: "answerThree",
      label: "Where is your company located? Mention branches also if any",
      type: "textarea",
      placeholder: "Enter your answer",
    },
    {
      name: "answerFour",
      label: "Anything else you'd like your customers to know about your business?",
      type: "textarea",
      placeholder: "Enter additional information",
    },
  ];
  
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
            question: "PhoneNumberOne",
            category: "support",
            answer: values.numberOne ? `${countrycode}${values.numberOne}` : "",
          },
          {
            question: "PhoneNumberTwo",
            category: "support",
            answer: values.numberTwo ? `${countrycode2}${values.numberTwo}` : "",
          },
          {
            question: "Email",
            category: "support",
            answer: values.email || "",
          },
          {
            question: "Twitter",
            category: "support",
            answer: values.twitter || "",
          },
          {
            question: "Instagram",
            category: "support",
            answer: values.instagram || "",
          },
          {
            question: "Facebook",
            category: "support",
            answer: values.facebook || "",
          },
          {
            question: "Url",
            category: "support",
            answer: values.url || "",
          },
          {
            question: "How are escalations managed if an issue cannot be resolved immediately?",
            category: "support",
            answer: values.answerTwo,
          },
          {
            question: "Where is your company located ?  mention branches also if any",
            category: "support",
            answer: values.answerThree,
          },
          {
            question: "Anything else you'd like your customers to know about your business?",
            category: "support",
            answer: values.answerFour || "",
          },
        ].filter(item => item.answer),
      };

      const response = await dispatch(createMemoryTemplate({ applicationId, template })).unwrap();
      if (response.status) {
        addToast('success', response.message || "Support template updated successfully");
        setLoading(false);
        handleClose();
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      addToast("error", "Error updating support template. Please try again.");
      setLoading(false);
    }
  }, [addToast, handleClose]);

  const defaultValues = {
    numberOne: getAnswerByCategoryAndQuestion("support", "PhoneNumberOne"),
    numberTwo: getAnswerByCategoryAndQuestion("support", "PhoneNumberTwo"),
    email: getAnswerByCategoryAndQuestion("support", "Email"),
    twitter: getAnswerByCategoryAndQuestion("support", "Twitter"),
    instagram: getAnswerByCategoryAndQuestion("support", "Instagram"),
    facebook: getAnswerByCategoryAndQuestion("support", "Facebook"),
    url: getAnswerByCategoryAndQuestion("support", "Url"),
    answerTwo: getAnswerByCategoryAndQuestion(
      "support",
      "How are escalations managed if an issue cannot be resolved immediately?"
    ),
    answerThree: getAnswerByCategoryAndQuestion(
      "support",
      "Where is your company located ?  mention branches also if any"
    ),
    answerFour: getAnswerByCategoryAndQuestion(
      "support",
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
    <Modal title="Support - Template Guide" key={key} onClose={handleClose} childClassName="p-0">
      <Modal.Header className="px-6 py-2 border-none">
        {renderHeader()}
      </Modal.Header>
      <Modal.Body className="overflow-y-scroll max-h-[60dvh]">
        <Form
          ref={formRef}
          fields={fields}
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          loading={loading}
          submitLabel="Upload"
          className="flex flex-col gap-6 px-0 pt-0 pb-6 border-none shadow-none"
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

export default React.memo(SupportTemplate);
