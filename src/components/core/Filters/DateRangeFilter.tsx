import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "./DatePickerRanges";

const DateRangeFilter = ({ dateValue, updateDateValues }: any) => {
  return (
    <DateRangePicker
      editable={false}
      placeholder={"Select Date"}
      ranges={predefinedRanges}
      placement="bottomEnd"
      value={dateValue}
      onChange={updateDateValues}
      showHeader={false}
    />
  );
};
export default DateRangeFilter;
