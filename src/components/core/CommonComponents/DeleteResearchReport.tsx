import { Button } from "@/components/ui/button";
// import { deleteResearchReportsAPI } from "@/lib/services/researchReports";
import Image from "next/image";
import { useState } from "react";
// import { toast } from "sonner";
import DeleteDialog from "../deleteDialog";
import { deleteReportAPI } from "@/utils/services/reports";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface deleteProps {
  info: any;
  getAllReports: ({
    pageIndex,
    pageSize,
    // asset_group,
    // asset_type,
    // asset_category,
  }: any) => void;
}

const DeleteResearchReports = ({ info, getAllReports }: deleteProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportId, setReportId] = useState(0);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await deleteReportAPI(id);
        console.log(response, "resDel");
        if (response?.status === 200 || response?.status === 201) {
          toast.success(response?.data?.message);
          getAllReports({});
          // queryClient.invalidateQueries(["projects"]);
          setDeleteDialogOpen(false);
        } else {
          toast.error(response?.data?.message);
        }
      } catch {
        toast.error("An error occurred while deleting the report");
      }
    },
  });

  const handleDeleteClick = () => {
    mutate(reportId);
  };

  const handleDelete = (id: number) => {
    setDeleteDialogOpen(true);
    setReportId(id);
  };

  return (
    <>
      <Button
        title="delete"
        onClick={() => handleDelete(info.row.original.id)}
        size={"sm"}
        variant={"ghost"}
      >
        <img src={"/table/delete.svg"} alt="view" height={16} width={16} />
      </Button>
      <DeleteDialog
        openOrNot={deleteDialogOpen}
        onCancelClick={() => setDeleteDialogOpen(false)}
        label="Are you sure you want to delete this file?"
        onOKClick={handleDeleteClick}
        deleteLoading={isPending}
      />
    </>
  );
};
export default DeleteResearchReports;
