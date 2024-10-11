import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import React, { useContext } from "react";
import { CreateReportContext } from "./CreateReportContext";

const YearSelect = () => {
  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { handleYearChange, errMessages } = context;
  return (
    <div>
      <Select onValueChange={handleYearChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {["2028", "2027", "2026", "2025", "2024", "2023"].map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errMessages?.date && (
        <p className="text-red-500">{errMessages?.date[0]}</p>
      )}
    </div>
  );
};

export default YearSelect;
