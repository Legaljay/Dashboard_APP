import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { fetchApplications, updateApplicationById } from "@/redux-slice/applications/applications.slice";
import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import VerbosityModal from "../../modals/VerbosityModal";
import PersonalityModal from "@/Routes/auth/customize-assistant/components/PersonalityModal";
import SettingsForm from "./SettingsForm";
import { SettingsFormData } from "./types";
import { useParams } from "react-router-dom";
import { fetchDraft } from "@/redux-slice/app-draft/app-draft.slice";

const SettingsWrapper: React.FC = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();
  const { assistantId = "" } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<string>("");
  const [selectedVerbose, setSelectedVerbose] = useState<string>("");
  const [data, setData] = useState<any>({});



  const handleUploadAssistant = async (formData: SettingsFormData) => {
    setLoading(true);
    console.log(formData, "formData");
    try {

      const response = await dispatch(
        updateApplicationById({
          applicationId: assistantId,
          updatedData: formData,
        })
      ).unwrap();
      if (response.status) {
        await dispatch(fetchApplications());
        await dispatch(fetchDraft(assistantId));
        addToast(
          "success",
          response.message || "Assistant created successfully"
        );
      } else {
        throw new Error(response.message || "Failed to create assistant");
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
        size: "2xl",
        position: "center",
        closeOnClickOutside: true,
        className: "",
      }
    );
  };

  const handleVerbosityModal = () => {
    openModal(
      MODAL_IDS.custom("Verbosity_MODAL"),
      <VerbosityModal
        setSelectedVerbosity={setSelectedVerbose}
        selectedVerbosity={selectedVerbose}
        closeModal={closeModal}
      />,
      {
        size: "5xl",
        position: "center",
        closeOnClickOutside: true,
        className: "",
      }
    );
  };

  return (
    <SettingsForm
      selectedPersonality={selectedPersonality}
      selectedVerbosity={selectedVerbose}
      handlePersonalityModal={handlePersonalityModal}
      handleVerbosityModal={handleVerbosityModal}
      handleUploadAssistant={handleUploadAssistant}
      data={data}
    />
  );
};

export default SettingsWrapper;
