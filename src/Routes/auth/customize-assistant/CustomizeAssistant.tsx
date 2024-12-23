import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SetupScreen from "./components/SetupScreen";
import LoadingScreen from "./components/LoadingScreen";
import PersonalityModal from "./components/PersonalityModal";
import { useToast } from "@/contexts/ToastContext";
import { setupApplication } from "@/redux-slice/applications/applications.slice";
import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { ApplicationSetupData } from "@/types/applications.types";
import { useAppDispatch } from "@/redux-slice/hooks";

const CustomizeAssistant: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [setupText, setSetupText] = useState("Initializing...");
  const [selectedImage2, setSelectedImage2] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  useEffect(() => {
    if (progress < 33) {
      setSetupText("Initializing assistant...");
    } else if (progress < 66) {
      setSetupText("Configuring personality...");
    } else if (progress < 100) {
      setSetupText("Almost done...");
    } else {
      setSetupText("Setup complete!");
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1000);
    }
  }, [progress, navigate]);

  const handleImageChange = (files: File | null) => {
    if (files && files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage2(reader.result as string);
      };
      reader.readAsDataURL(files);
    }
  };


  const handleUploadAssistant = async (formData: ApplicationSetupData) => {
    setLoading(true);
    try {
      const assistantData = {
        ...formData,
        personality_type: selectedPersonality,
      };
      
      const response = await dispatch(setupApplication(assistantData)).unwrap();
      if (response.status) {
        addToast("success", response.message || "Assistant created successfully");
        navigate('/dashboard');
        // setTimeout(() => {
        // }, 1000);
      } else {
        throw new Error(response.message || 'Failed to create assistant');
      }
    } catch (error: any) {
      console.error("Error uploading assistant:", error);
      addToast("error", error.message || "Failed to upload assistant");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalityModal = () => {
    openModal(
      MODAL_IDS.PERSONALITY_MODAL,
      <PersonalityModal
        setSelectedPersonality={setSelectedPersonality}
        selectedPersonality={selectedPersonality}
        closeModal={closeModal}
      />,
      {
        size : "2xl",
        position : "center",
        closeOnClickOutside : true,
        className : "",
      }
    );
  };

  if (loading) {
    return <LoadingScreen progress={progress} setupText={setupText} />;
    }

  return (
    <div className="">
      <SetupScreen
        selectedImage2={selectedImage2}
        selectedPersonality={selectedPersonality}
        handleImageChange={handleImageChange}
        handlePersonalityModal={handlePersonalityModal}
        handleUploadAssistant={handleUploadAssistant}
        data={data}
      />
    </div>
  );
};

export default CustomizeAssistant;
