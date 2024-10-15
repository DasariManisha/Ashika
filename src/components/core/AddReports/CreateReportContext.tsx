"use client";
import {
  CreateReportContextProps,
  ReportDetailsProps,
  reportsDataProps,
} from "@/lib/interfaces/context";
import { addReportsAPI } from "@/utils/services/reports";
import { useMutation } from "@tanstack/react-query";
import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import dayjs from "dayjs";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import Loading from "../Loading";
import { fileDetail } from "@/lib/interfaces/upload";

const data = {
  title: "",
  date: "",
  file_key: "",
  thumbnail_key: "",
  asset_category: "",
};

interface ReportPayload {
  asset_group: string;
  asset_type: string;
  asset_category: string;
  title: string;
  date?: string;
  file_key: string;
  thumbnail_key?: string;
  category?: string;
}

export const CreateReportContext = createContext<CreateReportContextProps>({
  reportsData: data,
  setReportsData: () => {},
  fileKey: "",
  setFileKey: () => {},
  thumbnailKey: "",
  setThumbnailKey: () => {},
  selectedYear: "",
  setSelectedYear: () => {},
  selectedMonth: "",
  setSelectedMonth: () => {},
  selectedCategory: "",
  setSelectedCategory: () => {},
  loading: false,
  setLoading: () => {},
  handleInputChange: () => {},
  handleCategory: () => {},
  handleYearChange: () => {},
  handleMonthChange: () => {},
  addReport: () => {},
  errMessages: {},
  categories: [],
  setCategories: () => [],
  isPending: false,
  selectedFiles: [],
  setSelectedFiles: () => [],
  preview: "",
  setPreview: () => {},
});

export const CreateReportProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const navigate = useNavigate();

  const [reportsData, setReportsData] = useState<reportsDataProps>({
    title: "",
    date: "",
    file_key: "",
    thumbnail_key: "",
    asset_category: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<fileDetail[]>([]);
  const [preview, setPreview] = useState<string>("");
  const [fileKey, setFileKey] = useState("");
  const [assetGroup, setAssetGroup] = useState("");
  const [assetType, setAssetType] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errMessages, setErrorMessages] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReportsData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategory = (category: string) => {
    setReportsData((prevData: any) => ({
      ...prevData,
      asset_category: category,
    }));
  };

  const updateDate = (year: string, month: string) => {
    if (year && month) {
      const formattedDate = dayjs(`${year}-${month}-01`).toISOString();
      setReportsData((prevData: any) => ({
        ...prevData,
        date: formattedDate,
      }));
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    updateDate(year, selectedMonth);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    updateDate(selectedYear, month);
  };

  const { mutate, isPending, isError, error, data, isSuccess } = useMutation({
    mutationFn: async (payload: ReportPayload) => {
      return await addReportsAPI(payload);
    },
    onSuccess: (response: any) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(response?.data?.message);
        clearStates();
        navigate({
          to: `/${assetGroup}/${assetType}`,
        });
      }
      if (response?.status === 422) {
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      }
    },
  });

  const clearStates = () => {
    setErrorMessages({});
    setReportsData({
      title: "",
      date: "",
      file_key: "",
      thumbnail_key: "",
      asset_category: "",
    });
    setFileKey("");
    setThumbnailKey("");
  };

  useEffect(() => {
    clearStates();
  }, [router]);

  const addReport = ({
    asset_group,
    asset_type,
    asset_category,
    showYear,
    showCategory,
    showThumbnail,
  }: ReportDetailsProps) => {
    setAssetGroup(asset_group);
    setAssetType(asset_type);
    const payload = {
      asset_group,
      asset_type,
      asset_category: reportsData?.asset_category,
      title: reportsData?.title,
      file_key: fileKey,
      ...(showYear && {
        date: reportsData?.date,
      }),
      ...(showThumbnail && { thumbnail_key: thumbnailKey }),
    };
    mutate(payload);
  };

  return (
    <div className="relative">
      <CreateReportContext.Provider
        value={{
          reportsData,
          setReportsData,
          fileKey,
          setFileKey,
          thumbnailKey,
          setThumbnailKey,
          selectedYear,
          setSelectedYear,
          selectedMonth,
          setSelectedMonth,
          selectedCategory,
          setSelectedCategory,
          loading,
          setLoading,
          handleInputChange,
          handleCategory,
          handleMonthChange,
          handleYearChange,
          addReport,
          errMessages,
          categories,
          setCategories,
          isPending,
          selectedFiles,
          setSelectedFiles,
          preview,
          setPreview,
        }}
      >
        {children}
      </CreateReportContext.Provider>
    </div>
  );
};
