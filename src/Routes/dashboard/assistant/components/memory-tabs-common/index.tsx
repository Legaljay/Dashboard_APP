import React, { useState, useCallback, useMemo } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import TemplateIcon from "@/assets/svg/template.svg";
import { FileUploader } from "./components/FileUploader";
import { MemoryTable } from "./components/MemoryTable";
import { useMemoryFiles } from "./hooks/useMemoryFiles";
import { TabProps, FileUploadState } from "./types";
import { fetchDraft } from "@/redux-slice/app-draft/app-draft.slice";
import { useAppDispatch } from "@/redux-slice/hooks";
import { useToast } from "@/contexts/ToastContext";
import {
  createMemoryFile,
  deleteMemoryFile,
  publishMemoryFile,
} from "@/redux-slice/app-memory/app-memory.slice";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import TemplateTrigger from "./TemplateTrigger";
import UploadMemory from "./memory-modals/UploadMemory";
import ConfirmModal from "./memory-modals/ConfirmModal";


const OTHER_TABS = "other";

const Common: React.FC<TabProps> = ({ tab, template: Template }) => {
  const { assistantId: applicationId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { openModal,closeModal } = useModal();

  // State management with TypeScript
  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    fileList: [],
  });
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [publishLoading, setPublishLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [modals, setModals] = useState({
    template: false,
    upload: false,
    delete: false,
    confirm: false,
    features: false,
  });
  const [sourceId, setSourceId] = useState<string>("");
  const [features, setFeatures] = useState([]);

  // Custom hook for fetching memory files
  const { fetchedData, loading, refetch } = useMemoryFiles(applicationId, tab);

  // Memoized handlers
  const handleFileChange = useCallback((file: File | null, fileList: any[]) => {
    setFileState({ file, fileList });
  }, []);

  const openUploadModal = useCallback(() => {
    openModal(MODAL_IDS.custom("upload-memory"), <UploadMemory/>, { preventScroll: true });
  }, []);

  const handleConfirmUploadModal = useCallback(() => {
    openModal(MODAL_IDS.custom("confirm-upload"), 
    <ConfirmModal 
      handleClose={() =>closeModal(MODAL_IDS.custom("confirm-upload"))} 
      handleUploadTrain={handleUploadTrain}
      handleDontShow={() => {
        localStorage.setItem('confirmModal', 'true');
        closeModal(MODAL_IDS.custom("confirm-upload"));
      }}
      purpose={tab} 
    />, { preventScroll: true });
  }, []);

  const handleUploadTrain = useCallback(async () => {
    if (!fileState.file) {
      message.error("No file uploaded");
      return;
    }

    // setModals((prev) => ({ ...prev, upload: true }));
    openUploadModal();
    const formData = new FormData();
    formData.append("file", fileState.file);
    formData.append("purpose", tab);

    try {
      const response = await dispatch(
        createMemoryFile({ applicationId, fileData: formData })
      ).unwrap();

      if (response.data.status === 201) {
        message.success(`${fileState.file.name} file uploaded successfully.`);
        refetch();
        if (applicationId) {
          dispatch(fetchDraft(applicationId));
        }
        closeModal(MODAL_IDS.custom("upload-memory"));
        closeModal(MODAL_IDS.custom("confirm-upload"));
        // setModals((prev) => ({ ...prev, upload: false, confirm: false }));
        setFileState({ file: null, fileList: [] });
      }
    } catch (error) {
      console.error(error);
      message.error(`${fileState.file.name} file upload failed.`);
      setFeatures([]);
      refetch();
      // setModals((prev) => ({ ...prev, upload: false }));
      closeModal(MODAL_IDS.custom("upload-memory"));
      setFileState({ file: null, fileList: [] });
    }
  }, [fileState.file, applicationId, dispatch]);

  const handleDeleteSource = useCallback(
    async (id: string) => {
      try {
        setDeleteLoading((prev) => ({ ...prev, [id]: true }));
        await dispatch(deleteMemoryFile({ applicationId, fileId: id }));

        addToast("success", "Resource deleted successfully");
        refetch();
      } catch (error: any) {
        addToast("error", "Error deleting resource");
        if (error.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setDeleteLoading((prev) => ({ ...prev, [id]: false }));
        // setModals((prev) => ({ ...prev, delete: false }));
        closeModal(MODAL_IDS.custom("delete-memory"));
      }
    },
    [applicationId, navigate]
  );

  const handleActivation = useCallback(
    async (id: string) => {
      try {
        setPublishLoading((prev) => ({ ...prev, [id]: true }));
        const response = await dispatch(
          publishMemoryFile({ applicationId, fileId: id })
        ).unwrap();

        addToast("success", response.data.message);
        if (applicationId) {
          dispatch(fetchDraft(applicationId));
        }
      } catch (error: any) {
        addToast("error", error.response?.message);
        if (error.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setPublishLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [applicationId, navigate, dispatch]
  );

  const confirmModalStatus = localStorage.getItem("confirmModal");

  const handleUploadandTrain = useCallback(() => {
          confirmModalStatus
            ? handleUploadTrain()
            : handleConfirmUploadModal();
  }, [confirmModalStatus]);

  // Render component
  return (
    <main>
      <section className="my-4">
        {tab !== OTHER_TABS && (
          <TemplateTrigger tab={tab} component={Template} />
        )}

        <div className="mt-2">
          <FileUploader
            fileState={fileState}
            onFileChange={handleFileChange}
            documentType={tab}
          />
        </div>

        <section className="flex flex-col items-center gap-3">
          <button
            disabled={!fileState.file}
            className={`${
              !fileState.file ? "bg-DISABLED" : "bg-[#121212]"
            } mt-4 text-[white] py-3 px-4 rounded-lg text-sm`}
            onClick={() => {
              const confirmModalStatus = localStorage.getItem("confirmModal");
              confirmModalStatus
                ? handleUploadTrain()
                : setModals((prev) => ({ ...prev, confirm: true }));
            }}
          >
            Upload and Train
          </button>
        </section>

        <section className="mt-8 mb-7">
          <p className="text-lg font-medium text-[#121212]">Your Sources</p>
        </section>

        <MemoryTable
          data={fetchedData}
          loading={loading}
          onDelete={(id) => {
            setSourceId(id);
            setModals((prev) => ({ ...prev, delete: true }));
          }}
          onActivate={handleActivation}
          deleteLoading={deleteLoading}
          publishLoading={publishLoading}
          activeTab={tab}
        />
      </section>

      {/* Modals */}
      {/* <ModalPop isOpen={modals.delete}>
        <DeleteSourceModal
          handleClose={() => setModals(prev => ({ ...prev, delete: false }))}
          deleteSource={() => handleDeleteSource(sourceId)}
          loading={deleteLoading[sourceId]}
        />
      </ModalPop>

      <ModalPop isOpen={modals.confirm}>
        <ConfirmModal
          handleClose={() => setModals(prev => ({ ...prev, confirm: false }))}
          handleDontShow={() => {
            localStorage.setItem('confirmModal', 'true');
            setModals(prev => ({ ...prev, confirm: false }));
          }}
          handleUploadTrain={() => {
            setModals(prev => ({ ...prev, confirm: false }));
            handleUploadTrain();
          }}
          purpose="about"
          id={applicationId}
        />
      </ModalPop>

      <ModalPop isOpen={modals.features}>
        <CustomFeatures
          data={features}
          handleClose={() => setModals(prev => ({ ...prev, features: false }))}
        />
      </ModalPop>

      <ModalPop isOpen={modals.upload}>
        <UploadMemory
          handleClose={() => setModals(prev => ({ ...prev, upload: false }))}
        />
      </ModalPop>

      <ModalPop isOpen={modals.template}>
        <AboutTemplate
          handleClose={() => {
            setModals(prev => ({ ...prev, template: false }));
            refetch();
          }}
        />
      </ModalPop> 
      
      */}
    </main>
  );
};

export default Common;
