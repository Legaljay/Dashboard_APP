import React from 'react';
import { Upload, message } from 'antd';
import { FileUploadState } from '../types';
import docxIcon from '@/assets/svg/docx.svg';
import deleteIcon from '@/assets/svg/delete.svg';
import uploadIcon from '@/assets/img/uploadIcon.svg';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

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
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isDoc = file.type === 'application/msword' || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isDoc) {
        message.error('You can only upload Doc files!');
        return Upload.LIST_IGNORE;
      }
      
      return false;
    },
    onChange: (info: UploadChangeParam<UploadFile>) => {
      const { file, fileList } = info;
      
      if (file.status === 'removed') {
        onFileChange(null, []);
      }
      // For all other cases (like 'error')
      else {
        onFileChange(fileList[0]['originFileObj'] || null, fileList);
      }
    },
    accept: '.doc, .docx',
    onRemove: () => {
      onFileChange(null, []);
    },
  };

  return (
    <Dragger {...props} >
      {fileState.fileList.length ? (
        <div className="flex flex-col gap-2 items-center py-8 bg-ant">
          <img src={docxIcon} alt="template" className="w-8 h-8" />
          <p className="text-sm text-BLACK-_200">
            {!!fileState.fileList.length && fileState.fileList[0].name}
          </p>
          <div
            className="flex gap-2 items-center text-sm text-RED-_100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
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
