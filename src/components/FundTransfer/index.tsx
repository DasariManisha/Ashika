"use client";
import { Button } from "@/components/ui/button";
import { addSerial } from "@/lib/helpers/addSerial";
import { prepareQueryParams } from "@/lib/helpers/prepareQueryParams";
import prepareURLEncodedParams from "@/lib/helpers/prepareURLEncodedParams";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import TanStackTable from "../core/Table/TanstackTable";
import { fundTransferColumns } from "./FundTransferColumns";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import {
  deleteClientAPI,
  getAllPaginatedClients,
  getExportDpClientsAPI,
  importClientAPI,
} from "@/utils/services/fundTransfer";
import DeleteDialog from "../core/deleteDialog";
import UploadCsvDialog from "../core/CommonComponents/UploadCsvDialog";
import SearchFilter from "../core/Filters/SearchFilter";
import { useQuery } from "@tanstack/react-query";
import Loading from "../core/Loading";

const FundTransfer = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const initialSearch = searchParams.get("search") || "";
  const [fundTransferData, setFundTransferData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [searchString, setSearchString] = useState(initialSearch);
  const [fileUpload, setFileUpload] = useState<any>();
  const [exportData, setExportData] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<any>();
  const [exportLoading, setExportLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchString);
  const [del, setDel] = useState(1);

  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });


  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["clients", pagination, del, debouncedSearch],
    queryFn: async () => {
      const response = await getAllPaginatedClients({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        search: debouncedSearch,
      });

      const queryParams: Record<string, any> = {
        current_page: pagination.pageIndex,
        page_size: pagination.pageSize,
        order_by: pagination.order_by || undefined,
        search: debouncedSearch || undefined,
      };
      router.navigate({
        to: "/fund-transfer",
        search: queryParams,
      });

      return response;
    },
  });

  // const getAllFundTransfer = async ({
  //   page = searchParams.get("page") as string,
  //   limit = searchParams.get("limit") as string,
  //   // sort_by = location?.search?.sort_by as string,
  //   // sort_type = location?.search?.sort_type as string,
  // }: any) => {
  //   setLoading(true);
  //   let queryParams = prepareQueryParams({
  //     page: page ? page : 1,
  //     limit: limit ? limit : 10,
  //   });

  //   let querySting = prepareURLEncodedParams("", queryParams);
  //   navigate({
  //     to: `${location?.pathname}${querySting}`,
  //   });
  //   try {
  //     const response = await getAllFundTransferAPI(queryParams);
  //     if (response?.success) {
  //       let { data, ...rest } = response?.data?.data;
  //       data = addSerial(data, rest.page, rest.limit);
  //       setFundTransferData(data);
  //       setPaginationDetails(rest);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching files:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const clientsData =
    addSerial(
      data?.data?.data?.data,
      data?.data?.data?.page,
      data?.data?.data?.limit
    ) || [];

  const getAllClients = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };

  const deleteClient = async () => {
    try {
      setDeleteLoading(true);
      const response = await deleteClientAPI(deleteId);
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || "Dp Client Deleted Successfully"
        );
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

  const downloadCSV = async (data: string, fileName: string) => {
    const csvData = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportClientDetails = async () => {
    try {
      setExportLoading(true);
      let queryParams = {};
      const response: any = await getExportDpClientsAPI(queryParams);
      setExportData(response);
      toast.success("Export Clients successfully");
      await downloadCSV(response, "export-clients");
    } catch (err: any) {
      console.error("Error exporting client details:", err);
    } finally {
      setExportLoading(false);
    }
  };

  const importFile = async () => {
    try {
      setUploadLoading(true);

      const formData = new FormData();
      formData.append("file", fileUpload);

      const response = await importClientAPI(formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Dp clients imported successfully");
        setUploadOpen(false);
        setDel((prev) => prev + 1);
      } else {
        throw response;
      }
    } catch (error) {
      console.error("Error during import:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const onClickOpen = (id: any) => {
    setOpen(true);
    setDeleteId(id);
  };

  const onClickClose = () => {
    setOpen(false);
  };

  const onClickUploadOpen = () => {
    setUploadOpen(true);
  };

  const onClickUploadClose = () => {
    setUploadOpen(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchString);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchString]);

  const fundTransferActions = [
    {
      accessorFn: (row: any) => row.actions,
      id: "actions",
      cell: (info: any) => {
        return (
          <div>
            <Button
              title="View"
              // onClick={() => {
              //   router.push(
              //     `/interviews/${id}/candidates/${info.row.original.id}/view`
              //   );
              // }}
              size={"sm"}
              variant={"ghost"}
            >
              <img src={"/table/view.svg"} alt="view" height={16} width={16} />
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
    <div>
      <div className="ml-5 mt-3 mb-3 flex items-center space-x-4">
        <h5 className="mr-60"></h5>
        <Button className="bg-[#4ade80] text-white">Download Excel</Button>
        <Button
          className="bg-[#1e3a8a] text-white"
          onClick={exportClientDetails}
          disabled={exportLoading} // Optional: Disable button while loading
        >
          {exportLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Export Client"
          )}
        </Button>
        <Button className="bg-[#1e3a8a] text-white" onClick={onClickUploadOpen}>
          Import Client
        </Button>
        <Button className="bg-[#e11d48] text-white">select</Button>
        <SearchFilter
          searchString={searchString}
          setSearchString={setSearchString}
        />
        <Button
          className="bg-[#1e3a8a] text-white"
          onClick={() =>
            navigate({
              to: "/fund-transfer/add-client",
            })
          }
        >
          Add Client
        </Button>
      </div>
      {isError ? (
          <div>Error: {error.message}</div>
        ) : (
      <div className="ml-5 ">
        <TanStackTable
          columns={[...fundTransferColumns, ...fundTransferActions]}
          data={clientsData}
          loading={false}
          getData={getAllClients}
          paginationDetails={paginationDetails}
          removeSortingForColumnIds={["serial", "actions"]}
        />
      </div>
      )}
      <UploadCsvDialog
        openOrNot={uploadOpen}
        onCancelClick={onClickUploadClose}
        onOKClick={importFile}
        uploadLoading={uploadLoading}
        setFileUpload={setFileUpload}
      />
      <DeleteDialog
        openOrNot={open}
        label="Are you sure you want to Delete this dp client?"
        onCancelClick={onClickClose}
        onOKClick={deleteClient}
        deleteLoading={deleteLoading}
      />
      <Loading loading={isLoading} label="" />
    </div>
  );
};
export default FundTransfer;
