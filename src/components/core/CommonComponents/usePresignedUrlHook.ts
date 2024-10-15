import { Button } from "@/components/ui/button";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { filePreviewAPI } from "@/lib/services/fileUpload";
import Image from "next/image";
import { useContext, useState } from "react";
import { CreateReportContext } from "../AddReports/CreateReportContext";

const usePresignedUrlHook = ({ info }: any) => {
    const [loading, setLoading] = useState(false);

  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { setThumbnailKey, setPreview } = context;

  const filePreview = async (fileKey: string) => {
    setLoading(true);
    try {
      const payload = {
        file_key: fileKey,
      };
      const response = await filePreviewAPI(payload);

      if (response.status === 200 || response.status === 201) {
        const url = response?.data?.data?.download_url;
        setPreview(url);
        return url
        // await openFileInNewTab(url);
      } else {
        throw response;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return{
    filePreview
  }
};
export default usePresignedUrlHook;