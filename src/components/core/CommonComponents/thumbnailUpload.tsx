import { thumbnailUploadProps } from "@/lib/interfaces/upload";
import useUploadFileHook from "./useUploadFileHook";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { CreateReportContext } from "../AddReports/CreateReportContext";

const ThumbnailPreview = ({ accept }: thumbnailUploadProps) => {
  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { setThumbnailKey, errMessages, preview } = context;
  const {
    startUploading,
    handleFileDrop,
    handleDragOver,
    handleFileSelect,
    isDragging,
  } = useUploadFileHook({
    accept,
    setFileKey: setThumbnailKey,
  });

  return (
    <div className="lg:w-1/3 space-y-4">
      <div
        className={`border rounded-lg p-4 h-48 flex items-center justify-center ${
          isDragging ? "border-blue-500 bg-blue-50" : ""
        }`}
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Thumbnail Preview"
            className="h-full w-auto object-contain"
          />
        ) : (
          <p className="text-gray-400">Drag & Drop the Thumbnail</p>
        )}
      </div>
      <input
        type="file"
        accept={accept}
        id="file-input"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        variant="outline"
        className={`w-full ${
          startUploading ? "bg-gray-300 cursor-not-allowed" : ""
        }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        Upload Preview Image
      </Button>
      {errMessages?.thumbnail_key && (
        <p className="text-red-500">{errMessages.thumbnail_key[0]}</p>
      )}
    </div>
  );
};

export default ThumbnailPreview;
