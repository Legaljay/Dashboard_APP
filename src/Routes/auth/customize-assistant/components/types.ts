export interface AssistantFormData {
  businessId: string;
  name: string;
  sale_agent_name: string;
  personality_type: string;
  type: 'customer' | 'sales' | 'generalist';
  file: File;
}

export interface ApplicationSetupData {
  businessId: string;
  name: string;
  description?: string;
  sale_agent_name: string;
  type: 'customer' | 'sales' | 'generalist';
  personality_type: string;
  file: File;
}

export interface SetupScreenProps {
  selectedImage2: string | null;
  data: {
    icon_url?: string;
    personality_type?: string;
    name?: string;
    type?: 'customer' | 'sales' | 'generalist';
  };
  selectedPersonality: string;
  handleImageChange: (files: File | null) => void;
  handleUploadAssistant: (data: ApplicationSetupData) => void;
  handlePersonalityModal: () => void;
}

export interface LoadingScreenProps {
  progress: number;
  setupText: string;
}

export interface PersonalityModalProps {
  setSelectedPersonality: React.Dispatch<React.SetStateAction<string>>;
  selectedPersonality: string;
}
