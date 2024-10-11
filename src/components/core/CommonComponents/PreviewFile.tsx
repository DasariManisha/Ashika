import { Button } from "@/components/ui/button";
import { filePreviewAPI } from "@/lib/services/fileUpload";
import Image from "next/image";
import { useState } from "react";

const PreviewFile = ({ info }: any) => {
  const [loading, setLoading] = useState(false);

  const filePreview = async (fileKey: string) => {
    setLoading(true);
    try {
      const payload = {
        file_key: fileKey,
      };
      const response = await filePreviewAPI(payload);

      if (response.status === 200 || response.status === 201) {
        const url = response?.data?.data?.download_url;
        window.open(url, "_blank", "noopener,noreferrer");
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

  //   const openFileInNewTab = async (fileUrl: string) => {
  //     try {
  //       const fileResponse = await fetch(fileUrl);
  //       const blob = await fileResponse.blob();

  //       const blobUrl = window.URL.createObjectURL(blob);
  //       window.open(blobUrl, "_blank", "noopener,noreferrer");

  //       setTimeout(() => {
  //         window.URL.revokeObjectURL(blobUrl);
  //       }, 100);
  //     } catch (error) {
  //       console.error("Error opening file in new tab:", error);
  //     }
  //   };

  return (
    <>
      <Button
        title="Preview"
        onClick={() => filePreview(info.row.original.file_key)}
        size={"sm"}
        variant={"ghost"}
      >
        <img src={"/table/view.svg"} alt="view" height={16} width={16} />
      </Button>
      {/* <Loading loading={loading} /> */}
    </>
  );
};
export default PreviewFile;
