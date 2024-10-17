import { Dispatch, SetStateAction } from "react";

export interface ReportProps {
    asset_group: string;
    asset_type: string;
    asset_category: string;
  }

  export interface deleteMultipleReportsProps {
    selectedReports: Array<number>;
    setDel: Dispatch<SetStateAction<number>>;
    setSelectedReports: Dispatch<SetStateAction<number[]>>;
  }

  export interface IReportsFilters {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    // dateValue: [Date, Date] | null;
    // onChangeData: (fromDate: string, toDate: string) => void;
    // onChangeStatus: (statusValue: string) => void;
    // status: string;
  }