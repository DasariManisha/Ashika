import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "./DatePickerRanges";

const DateRangeFilter = ({ dateValue, updateDateValues }: any) => {
  return (
    <DateRangePicker
      editable={false}
      placeholder={"Select Date"}
      ranges={predefinedRanges}
      placement="autoVertical"
      value={dateValue}
      onChange={updateDateValues}
    />
  );
};
export default DateRangeFilter;
