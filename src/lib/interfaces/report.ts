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