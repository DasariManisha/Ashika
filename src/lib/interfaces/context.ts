
import React, {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
    ChangeEvent,
  } from "react";
import { fileDetail } from "./upload";
  
  export interface CreateReportContextProps {
    reportsData: reportsDataProps;
    setReportsData: Dispatch<React.SetStateAction<reportsDataProps>>;
    fileKey: string;
    setFileKey: Dispatch<SetStateAction<string>>;
    thumbnailKey: string;
    setThumbnailKey: Dispatch<SetStateAction<string>>;
    selectedYear: string;
    setSelectedYear: Dispatch<SetStateAction<string>>;
    selectedMonth: string;
    setSelectedMonth: Dispatch<SetStateAction<string>>;
    selectedCategory: string;
    setSelectedCategory: Dispatch<SetStateAction<string>>;
    loading: boolean;
    setLoading : Dispatch<SetStateAction<boolean>>;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleMonthChange:  (value: string) => void;
    handleYearChange:  (value: string) => void;
    handleCategory:  (value: string) => void;
    addReport: ({ asset_group, asset_type, asset_category }: ReportDetailsProps) => void;
    errMessages: any;
    categories : Array<string>;
    setCategories: Dispatch<SetStateAction<string[]>>;
    isPending: boolean;
    selectedFiles: any;
    setSelectedFiles: Dispatch<SetStateAction<fileDetail[]>>
    preview : string;
    setPreview: Dispatch<SetStateAction<string>>;
    clearStates: () => void
  }

  export interface reportsDataProps {
    title: string,
    date: string,
    file_key: string,
    thumbnail_key: string,
    asset_category: string,
  }

  export interface ReportDetailsProps {
    asset_group: string;
    asset_type: string;
    asset_category: string;
    showYear:boolean;
    showCategory: boolean;
    showThumbnail: boolean;
  }