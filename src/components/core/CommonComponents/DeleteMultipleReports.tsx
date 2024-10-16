import { Button } from "@/components/ui/button";
import DeleteDialog from "../deleteDialog";
import { multipleDeleteUsersAPI } from "@/utils/services/users";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useState } from "react";
import Loading from "../Loading";
import { multipleDeleteReportsAPI } from "@/utils/services/reports";
import { deleteMultipleReportsProps } from "@/lib/interfaces/report";

const DeleteMultipleReports = ({
  selectedReports,
  setDel,
  setSelectedReports,
}: deleteMultipleReportsProps) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteUsers = async () => {
    try {
      setDeleteLoading(true);
      let payload = {
        ids: selectedReports,
      };
      const response = await multipleDeleteReportsAPI(payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Users Deleted Successfully");
        setSelectedReports([]);
        setDeleteOpen(false);
        setDel((prev) => prev + 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };
  return (
    <>
      {selectedReports?.length > 0 && (
        <Button
          className="bg-red-600 text-white hover:bg-blue-700"
          onClick={() => setDeleteOpen(true)}
          disabled={!selectedReports?.length}
        >
          Delete Reports
        </Button>
      )}
      {deleteOpen == true ? (
        <DeleteDialog
          openOrNot={deleteOpen}
          label="Are you sure you want to Delete this users?"
          onCancelClick={() => setDeleteOpen(false)}
          onOKClick={deleteUsers}
          deleteLoading={deleteLoading}
        />
      ) : (
        ""
      )}
      <Loading loading={deleteLoading} />
    </>
  );
};
export default DeleteMultipleReports;
