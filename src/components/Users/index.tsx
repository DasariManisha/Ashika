import TanStackTable from "@/components/core/Table/TanstackTable";
import { useQuery } from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import Loading from "../core/Loading";
import { Button } from "../ui/button";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { deleteUsersAPI, getAllPaginatedUsers, multipleDeleteUsersAPI } from "@/utils/services/users";
import { userColumns as baseUserColumns } from "./UserColumns";
import { addSerial } from "@/lib/helpers/addSerial";
import { toast } from "sonner";
import DeleteDialog from "../core/deleteDialog";
import { Checkbox } from "@/components/ui/checkbox";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();

  const searchParams = new URLSearchParams(location.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";

  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<any>();
  const [del, setDel] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  console.log(selectedUsers, "selectedUsers");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", pagination, del],
    queryFn: async () => {
      const response = await getAllPaginatedUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
      });

      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
      };
      router.navigate({
        to: "/users",
        search: queryParams,
      });

      return response;
    },
  });

  const usersData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

  const getAllUsers = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const deleteClient = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteUsersAPI(deleteId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "User Deleted Successfully");
        getAllPaginatedUsers({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          order_by: pagination.order_by,
        });
        setDel((prev) => prev + 1);
        onClickClose();
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteUsers = async () => {
    try {
      setDeleteLoading(true);
      let payload = {
        ids: selectedUsers
      }
      const response = await multipleDeleteUsersAPI(payload);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message || "Users Deleted Successfully");
        getAllPaginatedUsers({
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          order_by: pagination.order_by,
        });
        setDel((prev) => prev + 1);
        onClickClose();
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteId(id);
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const onClickDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleNavigation = () => {
    navigate({
      to: "/users/add",
    });
  };

  // Function to handle individual checkbox toggle
  const handleToggleCheckbox = (userId: number) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Function to handle "select all" checkbox
  const handleToggleSelectAll = () => {
    if (selectedUsers.length === usersData.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      const allUserIds = usersData.map((user: any) => user.id);
      setSelectedUsers(allUserIds); // Select all
    }
  };

  const userColumns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={selectedUsers.length === usersData.length}
          onCheckedChange={handleToggleSelectAll}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedUsers.includes(row.original.id)}
          onCheckedChange={() => handleToggleCheckbox(row.original.id)}
        />
      ),
    },
    ...baseUserColumns,
  ];

  const userActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div>
            <Button title="View" size={"sm"} variant={"ghost"}>
              <img src={"/table/view.svg"} alt="view" height={16} width={16} />
            </Button>
            <Button
              title="Edit"
              onClick={() =>
                navigate({
                  to: `/users/${info.row.original.id}/update`,
                })
              }
              size={"sm"}
              variant={"ghost"}
            >
              <img src={"/table/edit.svg"} alt="view" height={16} width={16} />
            </Button>
            <Button
              title="delete"
              onClick={() => onClickOpen(info.row.original.id)}
              size={"sm"}
              variant={"ghost"}
            >
              <img
                src={"/table/delete.svg"}
                alt="view"
                height={16}
                width={16}
              />
            </Button>
          </div>
        );
      },
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "80px",
      minWidth: "80px",
      maxWidth: "80px",
    },
  ];

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <Button
          className="bg-red-600 text-white hover:bg-blue-700"
          onClick={onClickDeleteOpen}
          disabled={!selectedUsers?.length}
        >
          Delete Users
        </Button>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleNavigation}
        >
          Add
        </Button>
      </div>
      <div>
        {isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <div>
            <TanStackTable
              data={usersData}
              columns={[...userColumns, ...userActions]} // Include selection column
              paginationDetails={data?.data?.data?.pagination_info}
              getData={getAllUsers}
              removeSortingForColumnIds={["serial", "actions", "select"]}
            />
          </div>
        )}
        {deleteOpen == true ? (
        <DeleteDialog
          openOrNot={deleteOpen}
          label="Are you sure you want to Delete this users?"
          onCancelClick={onClickDeleteClose}
          onOKClick={deleteUsers}
          deleteLoading={deleteLoading}
        />
        ) : (
          <DeleteDialog
          openOrNot={open}
          label="Are you sure you want to Delete this user?"
          onCancelClick={onClickClose }
          onOKClick={deleteClient}
          deleteLoading={deleteLoading}
        />
        )}
        <Loading loading={isLoading || isFetching} />
      </div>
    </div>
  );
};

export default Users;
