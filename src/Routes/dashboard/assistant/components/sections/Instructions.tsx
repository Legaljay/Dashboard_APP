import React, { useState, useCallback, lazy } from "react";
import { Outlet, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/redux-slice/hooks";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import { Modal } from "@/components/ui/modal/Modal";
import InstructionHeader from "../instructions-tabs-common/components/InstructionHeader";
import InstructionDescription from "../instructions-tabs-common/components/InstructionDescription";
import InstructionGrid from "../instructions-tabs-common/components/InstructionGrid";
import { useInstructionData } from "../hooks/useInstructionData";
import { InstructionTemplateTable } from "../instructions-tabs-common/components/InstructionTemplateTable";
import InstructionTemplateForm from "../instructions-tabs-common/components/InstructionTemplateForm";
import AddInstructionCategory from "../instructions-tabs-common/modals/AddInstructionCategory";


const Archives = lazy(() => import("../Archives"));
const AddInstruction = lazy(() => import("../AddInstruction"));
const EditFeature = lazy(() => import("../EditFeature"));
const ViewFeature = lazy(() => import("../ViewFeature"));

interface InstructionsProps {
  applicationId?: string;
  purpose?: "sale" | "customer" | "general";
}

export interface Instruction {
  name: string;
  category: string;
  support_channel: string[];
  description: string;
  how_it_works: string;
}

const sampleData: Instruction[] = [
  {
    name: "Opening a conversation",
    category: "Behaviour",
    support_channel: ["email", "phone_number"],
    description:
      "Create instructions for your assistant on how to behave during a conversation.",
    how_it_works: `Begin every conversation with this: [Insert preferred text here.  E.g “Good Morning, thank you for contacting Wano. How can I assist you today?”]`,
  },
  {
    name: "Closing a conversation",
    category: "Behaviour",
    support_channel: ["chat"],
    description: "This instruction is used before concluding any interaction.",
    how_it_works: `Before ending a conversation, reply to customers with this:

Samples:

[Insert closing text here E.g: “Thank you for contacting us,if you won’t be needing anything else, I’ll be closing this conversation ”]

Then say this:
[Insert new promotion or text here E.g: “Your security is our top priority. We use advanced encryption and two-factor authentication to protect your account. Is there anything else I can assist you with today? ]  Then this:
[Insert preferred text here  Inform customers about new features ‘We’ve recently launched a new budgeting tool in our app that can help you manage your expenses more effectively. Would you like to learn more?]`,
  },
  {
    name: "Hand off",
    description:
      "This instruction is used when the solution or answer to the problem is not found",
    category: "Behaviour",
    support_channel: ["email", "calendar"],
    how_it_works: `Reply with this  :

[insert preferred text here E.g “I’m going to escalate this issue to our specialist team to ensure it’s resolved promptly. They will contact you within [insert time e.g 2 hours].”`,
  },
  {
    name: "complaints",
    category: "Complaints",
    support_channel: ["N/A"],
    description:
      "This instruction is used when there is any question or complaint that cannot be answered.",
    how_it_works: `Ask questions to gather more details.
Reply customer with this:

[insert preferred text here E.g “Could you please provide more details about [the problem] so I can better understand the problem”?]

`,
  },
  {
    name: "Providing assistance",
    category: "Enquiries",
    support_channel: ["N/A"],
    how_it_works: `Reply with this if a customer asks how to [transfer funds]:

[insert preferred text here. E.g "To transfer funds, please go to the 'Transfers' section on our app, enter the recipient's details, and the amount you wish to send]."
`,
    description:
      "Use this instruction to guide the customers through [insert instance E.g completing transfers].",
  },
  {
    name: "Seasonal greetings (a scheduled instruction)",
    category: "Scheduled Instructions",
    support_channel: ["phone_number", "chat"],
    how_it_works: `Start every conversation with this:

[insert preferred text here E.g “Hello, Merry christmas. Remember to save for the rainy days while you pay for tables at the club”]

`,
    description:
      "Use this instruction during [insert preferred period here E.g christmas].",
  },
];

const InstructionsPage: React.FC<InstructionsProps> = ({ purpose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();

  const { assistantId: applicationId = "" } = useParams();
  const [viewTemplate, setViewTemplate] = useState<"table" | "form" | false>(
    false
  );
  const [selectedTemplate, setSelectedTemplate] = useState<any>({});

  const {
    loading,
    serviceBlocksData,
    refetch,
    handleFetchUpdate,
  } = useInstructionData(applicationId);

  const handleAddInstruction = useCallback(() => {
    openModal(
      MODAL_IDS.custom("add-instruction-category"),
      <AddInstructionCategory applicationId={applicationId}/>,
      {
        preventScroll: true,
        size: "2xl",
      }
    );
  }, [openModal, closeModal]);

  const handleViewTemplates = useCallback(() => {
    setViewTemplate("table");
  }, []);

  return (
    <section className="font-figtree mb-16">
      {viewTemplate === "table" ? (
        <InstructionTemplateTable
          data={sampleData}
          setViewTemplate={setViewTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      ) : viewTemplate === "form" ? (
        <InstructionTemplateForm
          data={serviceBlocksData}
          setViewTemplate={setViewTemplate}
          selectedTemplate={selectedTemplate}
        />
      ) : (
        <>
          <InstructionHeader onViewTemplates={handleViewTemplates} />
          <InstructionDescription purpose={purpose} />
          <InstructionGrid
            loading={loading}
            data={serviceBlocksData}
            applicationId={applicationId}
            onAddInstruction={handleAddInstruction}
            onFetchUpdate={handleFetchUpdate}
          />
        </>
      )}
    </section>
  );
};

const InstructionsLayout: React.FC<InstructionsProps> = ({ purpose }) => {
  return <Outlet />;
};

const Instructions: React.FC<InstructionsProps> = ({ purpose }) => {
  return (
    <Routes>
      <Route path="*" element={<InstructionsLayout purpose={purpose} />}>
        <Route index element={<InstructionsPage/>}/>
        <Route path=":id/:type" element={<ViewFeature />} />
        <Route path=":id/:type/archives" element={<Archives />} />
        <Route path=":type/:name/:mId/view-instruction" element={<EditFeature />} />
        <Route path=":id/:instructionType/add-instruction" element={<AddInstruction />} />
      </Route>
    </Routes>
  );
};
export default Instructions;
