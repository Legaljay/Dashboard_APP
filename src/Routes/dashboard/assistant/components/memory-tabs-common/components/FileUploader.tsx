import React from 'react';
import { Upload, message } from 'antd';
import { FileUploadState } from '../types';
import docxIcon from '@/assets/svg/docx.svg';
import deleteIcon from '@/assets/svg/delete.svg';
import uploadIcon from '@/assets/img/uploadIcon.svg';

interface FileUploaderProps {
  fileState: FileUploadState;
  onFileChange: (file: File | null, fileList: any[]) => void;
  documentType: string;
}

const { Dragger } = Upload;

export const FileUploader: React.FC<FileUploaderProps> = React.memo(({ fileState, onFileChange, documentType }) => {
  const props = {
    name: 'file',
    multiple: false,
    fileList: fileState.fileList,
    beforeUpload: (file: File) => {
      const isDOC = file.type === 'application/msword';
      const isDOCX = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isDOC && !isDOCX) {
        message.error('You can only upload Doc files!');
        onFileChange(null, [{ ...file, status: 'error', name: file.name }]);
      } else {
        onFileChange(file, [{ ...file, status: 'success', name: file.name }]);
      }
      return false;
    },
    onRemove: () => {
      onFileChange(null, []);
    },
  };

  return (
    <Dragger {...props}>
      {fileState.fileList.length ? (
        <div className="flex flex-col items-center gap-2 py-8 bg-ant">
          <img src={docxIcon} alt="template" className="w-8 h-8" />
          <p className="text-BLACK-_200 text-sm">
            {!!fileState.fileList.length && fileState.fileList[0].name}
          </p>
          <div
            className="flex items-center gap-2 text-RED-_100 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null, []);
            }}
          >
            <p>Remove Document</p>
            <img src={deleteIcon} alt="template" className="w-3 h-3" />
          </div>
        </div>
      ) : (
        <main className="py-8 px-[107px] flex items-center flex-col gap-2 select-none">
          <img src={uploadIcon} alt="template" className="w-4 h-4" />
          <p className="text-[#7F7F81] font-normal text-xs">
            Drag and drop {documentType.toUpperCase()} document here or upload from your device
          </p>
          <p className="text-[#A7A7A7] font-normal text-[10px]">
            Supported file: Doc, 100mb Max
          </p>
        </main>
      )}
    </Dragger>
  );
});

FileUploader.displayName = 'FileUploader';
