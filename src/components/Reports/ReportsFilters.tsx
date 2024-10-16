import { IReportsFilters } from "@/lib/interfaces/report";
import { Input } from "../ui/input";

const ReportsFilters = ({ searchString, setSearchString }: IReportsFilters) => {
  return (
    <div>
      {/* <DateRangePicker
        editable={false}
        placeholder={"Select Date"}
        ranges={predefinedRanges}
        placement="autoVertical"
        value={dateValue}
        onChange={updateDateValues}
      /> */}
      <Input
        type="text"
        placeholder="Search Here"
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        className="border px-4 py-2 rounded"
      />
    </div>
  );
};
export default ReportsFilters;
