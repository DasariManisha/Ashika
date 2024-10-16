import TanStackTable from "@/components/core/Table/TanstackTable";
import { getAllPaginatedReports } from "@/utils/services/reports";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { ReportColumns, ResponseDataType } from "./reportColumns";
import Loading from "../core/Loading";
import { Button } from "../ui/button";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import { addSerial } from "@/lib/helpers/addSerial";
import PreviewFile from "../core/CommonComponents/PreviewFile";
import DeleteResearchReports from "../core/CommonComponents/DeleteResearchReport";
import { Checkbox } from "../ui/checkbox";
import DeleteMultipleReports from "../core/CommonComponents/DeleteMultipleReports";
import { ReportProps } from "@/lib/interfaces/report";

const Reports: React.FC<ReportProps> = ({
  asset_group,
  asset_type,
  asset_category,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = new URLSearchParams(location.search);

  const pageIndexParam = Number(searchParams.get("current_page")) || 1;
  const pageSizeParam = Number(searchParams.get("page_size")) || 10;
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const orderBY = searchParams.get("order_by")
    ? searchParams.get("order_by")
    : "";
  const [pagination, setPagination] = useState({
    pageIndex: pageIndexParam,
    pageSize: pageSizeParam,
    order_by: orderBY,
  });

  const [del, setDel] = useState(1);
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["projects", pagination, del],
    queryFn: async () => {
      const response = await getAllPaginatedReports({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        order_by: pagination.order_by,
        asset_group,
        asset_type,
        asset_category,
      });
      const queryParams = {
        current_page: +pagination.pageIndex,
        page_size: +pagination.pageSize,
        order_by: pagination.order_by ? pagination.order_by : undefined,
      };
      router.navigate({
        to:
          asset_group === "downloads"
            ? `/${asset_group}`
            : asset_group === "margins"
              ? `/margin-updates`
              : `/${asset_group}/${asset_type}`,
        search: queryParams,
      });
      return response;
    },
  });

  const getAllReports = async ({ pageIndex, pageSize, order_by }: any) => {
    setPagination({ pageIndex, pageSize, order_by });
  };
  const paginationInfo = data?.data?.data?.pagination_info;
  const records = data?.data?.data?.records;
  const recordsWithSerials = addSerial(
    records,
    paginationInfo?.current_page,
    paginationInfo?.page_size
  );
  const handleNavigation = () => {
    navigate({
      to:
        asset_group === "downloads"
          ? `/${asset_group}/add`
          : asset_group === "margins"
            ? `/margin-updates/add`
            : `/${asset_group}/${asset_type}/add`,
    });
  };

  const handleToggleCheckbox = (reportId: number) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(reportId)
        ? prevSelected.filter((id) => id !== reportId)
        : [...prevSelected, reportId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedReports.length === ReportsData.length) {
      setSelectedReports([]);
    } else {
      const allReportsIds = ReportsData.map((report: any) => report.id);
      setSelectedReports(allReportsIds);
    }
  };

  const ReportsData =
    addSerial(
      data?.data?.data?.records,
      data?.data?.data?.pagination_info?.current_page,
      data?.data?.data?.pagination_info?.page_size
    ) || [];

  const reportsColumns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={selectedReports.length === ReportsData.length}
          onCheckedChange={handleToggleSelectAll}
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={selectedReports.includes(row.original.id)}
          onCheckedChange={() => handleToggleCheckbox(row.original.id)}
        />
      ),
    },
    ...ReportColumns,
  ];

  const columnHelper = createColumnHelper<ResponseDataType>();

  const actionsColumns = [
    columnHelper.accessor("actions", {
      header: () => "Actions",
      cell: (info: any) => {
        return (
          <div>
            <Button
              title="edit"
              onClick={() =>
                navigate({
                  to:
                    asset_group === "downloads"
                      ? `/${asset_group}/${info.row.original.id}/update`
                      : asset_group === "margins"
                        ? `/margin-updates/${info.row.original.id}/update`
                        : `/${asset_group}/${asset_type}/${info.row.original.id}/update`,
                })
              }
              size={"sm"}
              variant={"ghost"}
            >
              <img src={"/table/edit.svg"} alt="edit" height={16} width={16} />
            </Button>
            <PreviewFile info={info} />
            <DeleteResearchReports info={info} setDel={setDel} />
          </div>
        );
      },
      footer: (info) => info.column.id,
    }),
  ];
  return (
    <div className="relative">
      <div className="flex justify-end mb-4 gap-4">
        <DeleteMultipleReports
          selectedReports={selectedReports}
          setDel={setDel}
          setSelectedReports={setSelectedReports}
        />
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
              data={recordsWithSerials}
              columns={[...reportsColumns, ...actionsColumns]}
              paginationDetails={paginationInfo}
              getData={getAllReports}
              removeSortingForColumnIds={["select", "serial", "actions"]}
            />
          </div>
        )}
        <Loading loading={isLoading || isFetching} />
      </div>
    </div>
  );
};
export default Reports;
