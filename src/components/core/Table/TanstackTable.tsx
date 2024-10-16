import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./Pagination";
import { getRouteApi, useLocation } from "@tanstack/react-router";

interface pageProps {
  columns: any[];
  data: any[];
  loading?: boolean;

  getData?: any;
  paginationDetails: any;
  removeSortingForColumnIds?: string[];
}

const TanStackTable: FC<pageProps> = ({
  columns,
  data,
  loading = false,
  getData,
  paginationDetails,
  removeSortingForColumnIds,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const table = useReactTable({
    columns,
    data: data?.length ? data : [],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  console.log(paginationDetails, "details");

  const capturePageNum = (value: number) => {
    getData({
      ...searchParams,
      pageSize: searchParams.get("page_size")
        ? searchParams.get("page_size")
        : 10,
      pageIndex: value,
    });
  };
  const captureRowPerItems = (value: number) => {
    getData({
      ...searchParams,
      pageSize: value,
      pageIndex: 1,
    });
  };

  const getWidth = (id: string) => {
    const widthObj = columns.find((col) => col.id === id);
    console.log(widthObj, columns);
    return widthObj ? widthObj?.width || widthObj?.size || "100px" : "100px";
  };

  const sortAndGetData = (header: any) => {
    if (
      removeSortingForColumnIds &&
      removeSortingForColumnIds.length &&
      removeSortingForColumnIds.includes(header.id)
    ) {
      return;
    }

    let sortBy = header.id;
    let sortDirection = "asc";
    let orderBy = `${sortBy}:asc`;

    if (searchParams.get("order_by")?.startsWith(header.id)) {
      if (searchParams.get("order_by") === `${header.id}:asc`) {
        sortDirection = "desc";
        orderBy = `${header.id}:desc`;
      } else {
        sortBy = "";
        sortDirection = "";
        orderBy = "";
      }
    }

    getData({
      ...searchParams,
      pageIndex: searchParams.get("current_page"),
      pageSize: searchParams.get("page_size"),
      order_by: orderBy,
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="max-h-[100vh] overflow-y-auto">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: any, index: number) => {
                    return (
                      <TableHead
                        key={index}
                        colSpan={header.colSpan}
                        style={{
                          minWidth: getWidth(header.id),
                          width: getWidth(header.id),
                          color: "#000",
                          background: "#F0EDFF",
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                            }}
                            onClick={() => sortAndGetData(header)}
                            className="flex items-center gap-2 cursor-pointer"
                            style={{
                              minWidth: getWidth(header.id),
                              width: getWidth(header.id),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <SortItems
                              header={header}
                              removeSortingForColumnIds={
                                removeSortingForColumnIds
                              }
                            />
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {data?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="p-1.5" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !loading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-5 text-center">
                  <div className="flex justify-center items-center">
                    <img
                      src="/table/no-data.svg"
                      alt="No Data"
                      height={150}
                      width={250}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-5 text-center">Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        paginationDetails={paginationDetails}
        capturePageNum={capturePageNum}
        captureRowPerItems={captureRowPerItems}
      />
    </div>
  );
};

export default TanStackTable;

const SortItems = ({
  header,
  removeSortingForColumnIds,
}: {
  header: any;
  removeSortingForColumnIds?: string[];
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);

  const sortBy = searchParams.get("order_by")?.split(":")[0];
  const sortDirection = searchParams.get("order_by")?.split(":")[1];
  if (removeSortingForColumnIds?.includes(header.id)) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {sortBy === header.id ? (
        sortDirection === "asc" ? (
          <img src="/table/sort-asc.svg" height={20} width={20} alt="Asc" />
        ) : (
          <img src="/table/sort-desc.svg" height={20} width={20} alt="Desc" />
        )
      ) : (
        <img src="/table/sort-norm.svg" height={20} width={20} alt="No Sort" />
      )}
    </div>
  );
};
