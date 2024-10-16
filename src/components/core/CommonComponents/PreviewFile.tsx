import { Button } from "@/components/ui/button";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { filePreviewAPI } from "@/lib/services/fileUpload";
import Image from "next/image";
import { useContext, useState } from "react";
import { CreateReportContext } from "../AddReports/CreateReportContext";
import usePresignedUrlHook from "./usePresignedUrlHook";

const PreviewFile = ({ info }: any) => {
  const [loading, setLoading] = useState(false);

  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { setThumbnailKey, setPreview } = context;

  const { filePreview } = usePresignedUrlHook();

  const handleFilePreview = async (key: string) => {
    const url = await filePreview(key);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Button
        title="Preview"
        onClick={() => handleFilePreview(info.row.original.file_key)}
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
