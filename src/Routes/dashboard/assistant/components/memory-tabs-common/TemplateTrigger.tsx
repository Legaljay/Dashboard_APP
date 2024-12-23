import React, { ComponentType } from 'react';
import TemplateIcon from "@/assets/svg/template.svg";
import { useModal } from '@/contexts/ModalContext';
import { MODAL_IDS } from '@/constants/modalIds';

interface TemplateTriggerProps {
  tab: string;
  component?: ComponentType<{ handleClose: () => void; key: string }>;
}


const TemplateTrigger: React.FC<TemplateTriggerProps> = ({ tab, component: Component }) => {
  const { openModal, closeModal } = useModal();

  const handleOpenTemplate = () => {
    const modalId = MODAL_IDS.custom(`${tab}-template`);
    openModal(modalId,
      Component && <Component 
        key={tab} 
        handleClose={() => closeModal(modalId)} 
      />, { preventScroll: true , size: '2xl'}
    );
  };

  return (
    <div className="text-xs text-[#7F7F81] font-normal flex justify-end">
      <span>Don't have an {tab.toUpperCase()} document prepared already?</span>
      <span
        className="text-[#0359D8] cursor-pointer ml-2"
        onClick={handleOpenTemplate}
      >
        Use Template
      </span>
      <span className="ml-1">
        <img src={TemplateIcon} alt="template" className="w-[13px] h-[13px]" />
      </span>
    </div>
  );
};

export default React.memo(TemplateTrigger);