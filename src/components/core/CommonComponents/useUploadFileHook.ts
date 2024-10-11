import { CreateReportContextProps } from "@/lib/interfaces/context";
import { fileDetail, fileUploadProps } from "@/lib/interfaces/upload";
import { fileUploadAPI, uploadToS3API } from "@/lib/services/fileUpload";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { CreateReportContext } from "../AddReports/CreateReportContext";



const useUploadFileHook = ({ accept, setFileKey,type }: fileUploadProps) => {

  const [selectedFiles, setSelectedFiles] = useState<fileDetail[]>([]);
  const [startUploading, setStartUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  


  const uploadFile = async (fileDetails: any, file: File) => {
    setUploadSuccess(false);
    setStartUploading(true);
    try {
      const payload = {
        file_name: fileDetails.fileName,
        file_type: fileDetails.fileType,
      };
      const response = await fileUploadAPI(payload);

      if (response.status === 200 || response.status === 201) {
        const { target_url, file_key } = response?.data?.data;
        setFileKey(file_key);
        await uploadToS3(target_url, file);
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToS3 = async (url: string, file: File) => {
    try {
      const response = await uploadToS3API(url, file);
      if (response.status === 200 || response.status === 201) {
        toast.success("File Uploaded SuccessFully");
        setUploadSuccess(true);
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStartUploading(false);

    }
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
    const files = Array.from(e.target.files).map((file: any) => ({
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2),
      fileType: file.type,
    }));
    if (type == "import") {
      setFileKey(file);
      setSelectedFiles(files);
    }else {
      uploadFile(files[0], file);
      setSelectedFiles(files);
    }
    setIsDragging(false);

  };

  const handleFileDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
    const files = Array.from(e.dataTransfer.files).map((file: any) => ({
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2),
      fileType: file.type,
    }));
    uploadFile(files[0], file);
    setSelectedFiles(files);
    setIsDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleRemoveFile = (fileName: any) => {
    setStartUploading(false);
    setSelectedFiles(
      selectedFiles.filter((file) => file.fileName !== fileName)
    );
    setIsDragging(false);
    setFileKey('');
  };

  return {
    startUploading,
    handleFileDrop,
    handleDragOver,
    handleFileSelect,
    selectedFiles,
    uploadSuccess,
    handleRemoveFile,
    isDragging,
    preview
  };

};
export default useUploadFileHook