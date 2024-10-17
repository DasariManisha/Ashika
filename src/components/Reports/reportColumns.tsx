import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface AssetMetadata {
  id: number;
  asset_group: string;
  asset_type: string;
  asset_category: string;
}

export interface ResponseDataType {
  id: number;
  title: string;
  date: string;
  file_key: string;
  thumbnail_key: string;
  created_at: string;
  updated_at: string;
  serial: number;
  actions: any;
  asset_metadata: AssetMetadata;
}

const columnHelper = createColumnHelper<ResponseDataType>();

export const ReportColumns = [
  columnHelper.accessor("serial", {
    id: "serial",
    header: () => "S.No",
    cell: (info) => <div className="p-2">{info.getValue()}</div>,
    footer: (info) => info.column.id,
    size: 20,
  }),
  {
    accessorFn: (row: any) => row.title,
    id: "title",
    cell: (info: any) => {
      let title = info.getValue();
      const shouldShowTooltip = title && title.length > 20;
      const truncatedText = shouldShowTooltip
        ? `${title.substring(0, 20)}...`
        : title;
      return (
        <div className="eachCell">
          {shouldShowTooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{truncatedText}</span>
                </TooltipTrigger>
                <TooltipContent
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    padding: "8px",
                    maxWidth: "300px",
                    fontSize: "14px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <div className="tooltipContent">{title}</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span>{truncatedText || "--"}</span>
          )}
        </div>
      );
    },
    header: () => <span>Title</span>,
    footer: (props: any) => props.column.id,
  },
  columnHelper.accessor((row) => row.asset_metadata?.asset_category, {
    header: () => "Category",
    id: "asset_category",
    cell: (info) => <div className="p-2">{info.getValue()}</div>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row?.date, {
    header: () => "Date",
    id: "date",
    cell: (info) => {
      const date: string = info.getValue();
      return <span>{date ? dayjs(date).format("MMMM YYYY") : "-"}</span>;
    },
    footer: (info) => info.column.id,
  }),
];
