import { ComponentType } from "react";

export interface MemoryFile {
  id: string;
  name: string;
  file_url: string;
  status: string;
  draft?: {
    active: boolean;
  };
  active?: boolean;
  purpose?: string;
}

export interface TabProps {
  applicationId?: string;
  tab: string;
  template?: ComponentType<{ handleClose: () => void; key: string }>;
}

export interface FileUploadState {
  file: File | null;
  fileList: any[];
}
