"use client";
import { UploadCloud, X } from "lucide-react";
import React, { useContext } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fileProps, fileUploadProps } from "@/lib/interfaces/upload";
import useUploadFileHook from "./useUploadFileHook";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { CreateReportContext } from "../AddReports/CreateReportContext";

const FileUpload = ({ accept, type }: fileProps) => {
  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { setFileKey, selectedFiles, setSelectedFiles } = context;
  const {
    startUploading,
    handleFileDrop,
    handleDragOver,
    handleFileSelect,
    uploadSuccess,
    handleRemoveFile,
    isDragging,
  } = useUploadFileHook({
    accept,
    setFileKey,
    type,
  });

  return (
    <div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          File Upload
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-1 flex flex-col items-center justify-center text-center ${
            isDragging ? "border-blue-500 bg-blue-50" : ""
          } ${startUploading ? "bg-gray-300 cursor-not-allowed" : ""}`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <UploadCloud className="h-8 w-8 text-gray-500 mb-2" />
          <label
            className={`cursor-pointer text-blue-600 hover:underline ${
              startUploading ? "cursor-not-allowed" : ""
            } `}
          >
            Click to browse or drag and drop your files
          </label>
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept={accept}
            id="fileInput"
            disabled={startUploading}
          />
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div
          className={`mt-5 text-left ${
            uploadSuccess ? "bg-green-300 rounded " : ""
          }`}
        >
          {selectedFiles.map((file: any, index: any) => {
            const displayFileName =
              file.fileName.length > 40
                ? `${file.fileName.slice(0, 40)}...`
                : file.fileName;

            return (
              <div
                key={index}
                className="selectedFile flex items-center justify-between mb-2"
              >
                <div className="fileName flex items-center">
                  {/* <Image
                    src="/addInterview/csv.svg"
                     width={30}
                    height={30}
                    alt="CSV Icon"
                  /> */}
                  <div className="fileSize ml-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer font-bold">
                            {displayFileName}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>{file.fileName}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-gray-500 text-xs ml-2">
                      ({file.fileSize} KB)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(file.fileName)}
                  className="bg-none border-none cursor-pointer"
                >
                  <X className="text-red-500 w-6 h-6" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
