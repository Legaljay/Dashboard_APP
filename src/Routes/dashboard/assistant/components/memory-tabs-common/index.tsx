import React, { useState, useCallback, memo } from "react";
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
  setUploadProgress,
  resetState,
} from "@/redux-slice/app-memory/app-memory.slice";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import TemplateTrigger from "./TemplateTrigger";
import UploadMemory from "./memory-modals/UploadMemory";
import ConfirmModal from "./memory-modals/ConfirmModal";
import DeleteInstructionModal from "./memory-modals/DeleteSourceModal";

const OTHER_TABS = "other";

const Common: React.FC<TabProps> = ({ tab, template: Template }) => {
  const { assistantId: applicationId = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();

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

  const [sourceId, setSourceId] = useState<string>("");
  const [features, setFeatures] = useState([]);

  // Custom hook for fetching memory files
  const { fetchedData, loading, refetch, isInitialized } = useMemoryFiles(applicationId, tab);

  // Memoized handlers
  const handleFileChange = useCallback((file: File | null, fileList: any[]) => {
    // setFileState({ file, fileList });
    setFileState({
      file,
      fileList: fileList.map(f => ({
        ...f,
        status: f.status || 'done' // Ensure status is set
      }))
    });
  }, [tab]);

  // handle file upload
  const handleUploadTrain = useCallback(async () => {
    console.log('File changed for tab:', tab);
    console.log('File changed:', fileState?.file, fileState?.fileList); // Add this for debugging
    if (!fileState?.file) {
      message.error("No file uploaded");
      return;
    }

    openUploadModal();
    const formData = new FormData();
    formData.append("file", fileState?.file);
    formData.append("purpose", tab);
    
    dispatch(resetState());
    try {
      const response = await dispatch(
        createMemoryFile({
          applicationId,
          fileData: formData,
          onProgress: (progress) => {
            dispatch(setUploadProgress(progress));
            console.log("Upload Progress: ", progress);
          },
        })
      ).unwrap();
      if (response.data.status) {
        message.success(`${fileState.file.name} file uploaded successfully.`);
        refetch();
        if (applicationId) {
          dispatch(fetchDraft(applicationId));
        }
        closeModal(MODAL_IDS.custom("upload-memory"));
        closeModal(MODAL_IDS.custom("confirm-upload"));
        setFileState({ file: null, fileList: [] });
      }
    } catch (error) {
      console.error(error);
      message.error(`${fileState.file.name} file upload failed.`);
      setFeatures([]);
      refetch();
      closeModal(MODAL_IDS.custom("upload-memory"));
      setFileState({ file: null, fileList: [] });
    }
  }, [fileState, applicationId, dispatch, closeModal, tab, refetch]);

// handle file delete
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
        closeModal(MODAL_IDS.custom("delete-memory"));
      }
    },
    [applicationId, navigate, closeModal, dispatch, refetch, addToast]
  );

  // handle file publish
  const handleActivation = useCallback(
    async (id: string) => {
      try {
        setPublishLoading((prev) => ({ ...prev, [id]: true }));

        const response = await dispatch(
          publishMemoryFile({ applicationId, fileId: id })
        ).unwrap();

        // Check if response exists before accessing data
        if (response?.data?.status) {
          await refetch();

          if (applicationId) {
            await dispatch(fetchDraft(applicationId));
          }

          // Ensure message exists before showing toast
          addToast(
            "success",
            response.data.message || "File published successfully"
          );
        }
      } catch (error) {
        // Better error handling with type assertion
        const err = error as { response?: { message: string; status: number } };

        addToast(
          "error",
          err.response?.message || "An error occurred while publishing the file"
        );

        if (err.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setPublishLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    // Include all dependencies
    [applicationId, navigate, dispatch, refetch, addToast, setPublishLoading]
  );

  //handle upload modal
  const openUploadModal = useCallback(() => {
    openModal(MODAL_IDS.custom("upload-memory"), <UploadMemory />, {
      preventScroll: true,
      size: "lg",
    });
  }, []);

  //handle confirm upload
  const handleConfirmUploadModal = useCallback(() => {
    openModal(
      MODAL_IDS.custom("confirm-upload"),
      <ConfirmModal
        handleClose={() => closeModal(MODAL_IDS.custom("confirm-upload"))}
        handleUploadTrain={handleUploadTrain}
        handleDontShow={() => {
          localStorage.setItem("confirmModal", "true");
          closeModal(MODAL_IDS.custom("confirm-upload"));
        }}
        purpose={tab}
      />,
      { preventScroll: true }
    );
  }, [tab, handleUploadTrain, closeModal]);

// handle open delete modal
  const openDeleteModal = useCallback(
    (id: string) => {
      setSourceId(id);
      openModal(
        MODAL_IDS.custom("delete-memory"),
        <DeleteInstructionModal
          loading={deleteLoading[id]}
          handleClose={() => closeModal(MODAL_IDS.custom("delete-memory"))}
          deleteSource={() => handleDeleteSource(id)}
        />,
        { preventScroll: true, size: "lg" }
      );
    },
    [setSourceId]
  );


  //TODO: ui modals category
  const confirmModalStatus = localStorage.getItem("confirmModal");

  const handleUploadandTrain = useCallback(() => {
    confirmModalStatus ? handleUploadTrain() : handleConfirmUploadModal();
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

        <section className="flex flex-col gap-3 items-center">
          <button
            disabled={!fileState.file}
            className={`${
              !fileState.file ? "bg-DISABLED" : "bg-[#121212]"
            } mt-4 text-[white] py-3 px-4 rounded-lg text-sm`}
            onClick={handleUploadandTrain}
          >
            Upload and Train
          </button>
        </section>

        <section className="mt-8 mb-7">
          <p className="text-lg font-medium text-[#121212]">Your Sources</p>
        </section>

        <MemoryTable
          data={fetchedData}
          loading={isInitialized && loading}
          onDelete={
            (id: string) => openDeleteModal(id)
          }
          onActivate={handleActivation}
          deleteLoading={deleteLoading}
          publishLoading={publishLoading}
          activeTab={tab}
        />
      </section>

      {/* Modals */}
      {/* 
      <ModalPop isOpen={modals.features}>
        <CustomFeatures
          data={features}
          handleClose={() => setModals(prev => ({ ...prev, features: false }))}
        />
      </ModalPop>

      */}
    </main>
  );
};

export default memo(Common);
