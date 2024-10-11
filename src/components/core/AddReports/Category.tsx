import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import { CreateReportContext } from "./CreateReportContext";

const CategorySelect = () => {
  // const categories = ["IPO Buy Bank OFS", "Event Update", "Other Report"];

  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const { handleCategory, errMessages, categories } = context;

  return (
    <div>
      <Select onValueChange={handleCategory}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errMessages?.category && (
        <p className="text-red-500">{errMessages?.category[0]}</p>
      )}
    </div>
  );
};

export default CategorySelect;
