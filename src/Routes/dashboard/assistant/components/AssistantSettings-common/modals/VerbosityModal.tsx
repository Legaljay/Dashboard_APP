import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";
import { RadioGroup } from "@headlessui/react";
import { BsCheck } from "react-icons/bs";
import { useCallback, useState } from "react";
import { MODAL_IDS } from "@/constants/modalIds";

interface VerbosityOption {
  id: string;
  title: string;
  description: string;
  backgroundImage: React.ReactElement;
}

const VerbosityOptions: VerbosityOption[] = [
  {
    id: "concise",
    title: "Concise",
    description: "Your Assistant's response will be brief and to the point.",
    backgroundImage: (
      <div className="py-3 px-[15px] rounded-b-xl">
        <div className="flex justify-end">
          <p className="text-right bg-[#D7FAD1] rounded-lg p-2 text-xs font-normal text-[#171A16]  mt-7">
            What is this business about?
          </p>
        </div>
        <p className="text-left bg-white rounded-lg p-2 text-xs font-normal text-[#171A16] mt-2">
          This business is focused on completing transaction for customers.
        </p>
      </div>
    ),
  },
  {
    id: "balance",
    title: "Balanced",
    description:
      "Your Assistant's response will have a moderate level of detail.",
    backgroundImage: (
      <div className="py-3 px-[15px] rounded-b-xl">
        <div className="flex justify-end">
          <p className="text-right bg-[#D7FAD1] rounded-lg p-2 text-xs font-normal text-[#171A16] mt-4">
            What is this business about?
          </p>
        </div>
        <p className="text-left bg-white rounded-lg p-2 text-xs font-normal text-[#171A16] mt-2">
          This business primarily operates in the Financial sector, specializing
          in providing safe international and local transactions for their
          customers.
        </p>
      </div>
    ),
  },
  {
    id: "detailed",
    title: "Detailed",
    description:
      "Your Assistant's response will always be comprehensive and thorough.",
    backgroundImage: (
      <div className="py-3 px-[15px] rounded-b-xl">
        <div className="flex justify-end">
          <p className="text-right bg-[#D7FAD1] rounded-lg p-2 text-xs font-normal text-[#171A16] mt-2">
            What is this business about?
          </p>
        </div>
        <p className="text-left bg-white rounded-lg p-2 text-xs font-normal text-[#171A16] mt-2">
          This fintech company specializes in digital payment solutions,
          revolutionizing the way people handle their finances. They offer a
          wide range of services, including mobile payment apps, online banking
          platforms, secure ...
        </p>
      </div>
    ),
  },
];

interface VerbosityCardProps {
  option: VerbosityOption;
  isSelected: boolean;
}

const VerbosityCard = ({ option, isSelected }: VerbosityCardProps) => {
  const BackgroundText = option.backgroundImage;
  return (
    <div
      className={`h-full overflow-hidden border border-solid rounded-xl bg-[#FAFAFA] ${
        isSelected ? "border-[#1774FD]" : "border-[#E5E5E5]"
      }`}
    >
      <section
        className={`rounded-t-xl flex justify-between items-start ${
          isSelected ? "bg-[rgba(205,222,248,0.20)]" : "bg-white"
        }`}
      >
        <div className="flex flex-col gap-1 pt-3">
          <p className="px-[15px] text-base text-[#121212] font-medium">
            {option.title}
          </p>
          <p className="text-[#7F7F81] font-normal text-xs pb-[7px] px-[15px]">
            {option.description}
          </p>
        </div>
        <div className="flex justify-between pt-4 px-[15px] items-center">
          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              isSelected
                ? "bg-[#1774FD] border-[#1774FD]"
                : "border-gray-300 bg-white"
            }`}
          >
            {isSelected && <BsCheck className="text-white w-4 h-4" />}
          </div>
        </div>
      </section>
      {BackgroundText}
    </div>
  );
};

interface VerbosityModalProps {
  selectedVerbosity: string;
  setSelectedVerbosity: (Verbosity: string) => void;
  closeModal: (modalId: string) => void;
}

const VerbosityModal = ({
  selectedVerbosity,
  setSelectedVerbosity,
  closeModal,
}: VerbosityModalProps) => {
  const [localSelectedVerbosity, setLocalSelectedVerbosity] =
    useState(selectedVerbosity);

  const handleSave = useCallback(() => {
    if (localSelectedVerbosity) {
      setSelectedVerbosity(localSelectedVerbosity);
      // The form will be updated via the SetupScreen component when selectedVerbosity changes
    }
    closeModal(MODAL_IDS.custom("Verbosity_MODAL"));
  }, [localSelectedVerbosity, closeModal, setSelectedVerbosity]);

  const handleClose = useCallback(() => {
    closeModal(MODAL_IDS.custom("Verbosity_MODAL"));
  }, [closeModal]);

  return (
    <Modal title="Choose Assistant Verbosity" onClose={handleClose}>
      <Modal.Body>
        <h4 className="text-[#7F7F81] text-sm font-medium mb-6 w-1/2">
          Adjust Assistant&apos;s response detail or word&apos;s used. Note that
          this directly affects Pricing and may affect your users experience
          with your assistant.
        </h4>
        <RadioGroup
          value={localSelectedVerbosity}
          onChange={setLocalSelectedVerbosity}
        >
          <div className="grid grid-cols-3 gap-4 place-items-center items-stretch">
            {VerbosityOptions.map((option) => (
              <RadioGroup.Option
                key={option.id}
                value={option.id}
                className="h-full cursor-pointer w-full"
              >
                {({ checked }) => (
                  <VerbosityCard option={option} isSelected={checked} />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="black" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default VerbosityModal;
