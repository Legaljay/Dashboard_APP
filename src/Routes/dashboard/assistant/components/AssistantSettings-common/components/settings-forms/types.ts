export interface AssistantFormData {
    businessId: string;
    name: string;
    sale_agent_name: string;
    personality_type: string;
    type: 'customer' | 'sales' | 'generalist';
    file: File;
  }


  export interface SettingsFormData {
    name: string;
    description?: string;
    sale_agent_name: string;
    type: 'customer' | 'sales' | 'generalist';
    personality_type: string;
    verbose: string;
    file: File;
  }
  
  export interface SettingsFormProps {
    data: {
      icon_url?: string;
      personality_type?: string;
      name?: string;
      type?: 'customer' | 'sales' | 'generalist';
    };
    selectedPersonality: string;
    handleUploadAssistant: (data: SettingsFormData) => void;
    handlePersonalityModal: () => void;
    handleVerbosityModal: () => void;
    selectedVerbosity: string;
  }
  
  
  export interface PersonalityModalProps {
    setSelectedPersonality: React.Dispatch<React.SetStateAction<string>>;
    selectedPersonality: string;
  }

  export interface VerbosityModalProps {
    setSelectedVerbosity: React.Dispatch<React.SetStateAction<string>>;
    selectedVerbosity: string;
  }
  