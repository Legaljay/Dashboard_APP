import { Modal } from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button/button";
import { RadioGroup } from "@headlessui/react";
import { BsCheck } from "react-icons/bs";
import { useCallback, useState } from "react";
import { MODAL_IDS } from "@/constants/modalIds";
import BRAND from "@/assets/img/brand.svg";
import PROFESSIONAL from "@/assets/img/professional.svg";
import FRIENDLY from "@/assets/img/friendly.svg";
import YOUTHFUL from "@/assets/img/youthful.svg";
import BRANDD from "@/assets/img/brandd.svg";
import PROF from "@/assets/img/prof2.svg";
import FRIEND from "@/assets/img/friendd.svg";
import TRENDY from "@/assets/img/trendy.svg";

interface PersonalityOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundImage: string;
}

const personalityOptions: PersonalityOption[] = [
  {
    id: "brand-specific",
    title: "Brand/Specific",
    description: "Your AI takes on the tone specified in your sources",
    icon: BRAND,
    backgroundImage: BRANDD,
  },
  {
    id: "professional",
    title: "Professional/Formal",
    description: "Your AI takes on a professional and competent tone",
    icon: PROFESSIONAL,
    backgroundImage: PROF,
  },
  {
    id: "friendly",
    title: "Friendly/Informal",
    description: "Your AI takes on a friendly and Informal tone",
    icon: FRIENDLY,
    backgroundImage: FRIEND,
  },
  {
    id: "youthful",
    title: "Youthful/Trendy",
    description: "Your AI takes on a youthful and Trendy tone, Suitable for younger audiences",
    icon: YOUTHFUL,
    backgroundImage: TRENDY,
  },
];

interface PersonalityCardProps {
  option: PersonalityOption;
  isSelected: boolean;
}

const PersonalityCard = ({ option, isSelected }: PersonalityCardProps) => (
  <div
    className={`w-[264px] overflow-hidden border border-solid rounded-xl bg-[#FAFAFA] ${
      isSelected ? "border-[#1774FD]" : "border-[#E5E5E5]"
    }`}
  >
    <section className={`rounded-t-xl ${isSelected ? "bg-[rgba(205,222,248,0.20)]" : "bg-white"}`}>
      <div className="flex justify-between pt-3 px-[15px] items-center">
        <img src={option.icon} alt={option.title} className="w-8 h-8" />
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
          isSelected 
            ? "bg-[#1774FD] border-[#1774FD]" 
            : "border-gray-300 bg-white"
        }`}>
          {isSelected && <BsCheck className="text-white w-4 h-4" />}
        </div>
      </div>
      <p className="px-[15px] text-base text-[#121212] font-medium">
        {option.title}
      </p>
      <p className="text-[#7F7F81] font-normal text-xs pb-[7px] px-[15px]">
        {option.description}
      </p>
    </section>
    <img src={option.backgroundImage} alt={`${option.title} background`} className={option.id === "professional" ? "pb-11 bg-[#FAFAFA]" : "pb-0"}/>
  </div>
);

interface PersonalityModalProps {
  selectedPersonality: string;
  setSelectedPersonality: (personality: string) => void;
  closeModal: (modalId: string) => void;
}

const PersonalityModal = ({
  selectedPersonality,
  setSelectedPersonality,
  closeModal,
}: PersonalityModalProps) => {
  const [localSelectedPersonality, setLocalSelectedPersonality] = useState(selectedPersonality);

  const handleSave = useCallback(() => {
    if (localSelectedPersonality) {
      setSelectedPersonality(localSelectedPersonality);
      // The form will be updated via the SetupScreen component when selectedPersonality changes
    }
    closeModal(MODAL_IDS.PERSONALITY_MODAL);
  }, [localSelectedPersonality, closeModal, setSelectedPersonality]);

  const handleClose = useCallback(() => {
    closeModal(MODAL_IDS.PERSONALITY_MODAL);
  }, [closeModal]);

  return (
    <Modal
      title="Choose Assistant Personality"
      onClose={handleClose}
    >
      <Modal.Body>
        <h4 className="text-[#7F7F81] text-sm font-medium mb-6">
          Choose a personality for your assistant, you can make it trendy or a corporate head.
        </h4>
        <RadioGroup 
          value={localSelectedPersonality} 
          onChange={setLocalSelectedPersonality}
        >
          <div className="grid grid-cols-2 gap-4 place-items-center">
            {personalityOptions.map((option) => (
              <RadioGroup.Option key={option.id} value={option.id} className="h-full cursor-pointer">
                {({ checked }) => (
                  <PersonalityCard
                    option={option}
                    isSelected={checked}
                  />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex justify-end gap-2">
          <Button
            variant="outlined"
            onClick={handleClose}
          >
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

export default PersonalityModal;