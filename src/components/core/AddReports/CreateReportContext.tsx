"use client";
import {
  CreateReportContextProps,
  ReportDetailsProps,
  reportsDataProps,
} from "@/lib/interfaces/context";
import { addReportsAPI } from "@/utils/services/reports";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const data = {
  title: "",
  date: "",
  file_key: "",
  thumbnail_key: "",
  category: "",
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
});

export const CreateReportProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const navigate = useNavigate();

  const [reportsData, setReportsData] = useState<reportsDataProps>({
    title: "",
    date: "",
    file_key: "",
    thumbnail_key: "",
    category: "",
  });
  const [fileKey, setFileKey] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errMessages, setErrorMessages] = useState<any>({});
  const [loading, setLoading] = useState(false);

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
      category: category,
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
      console.log(response, "res");
      if (response?.status === 200 || response?.status === 201) {
        toast.error(response?.data?.message);
      }
      if (response?.status === 422) {
        console.log(response?.data?.errData, "errDa");
        setErrorMessages(response?.data?.errData || [""]);
        toast.error(response?.data?.message);
      } else {
      }
      // navigate({
      //   to: `/`,
      // });
    },
    onError: (error: any) => {
      if (error?.response?.status === 422) {
        console.log(error?.response?.data?.errData, "errDa");
        setErrorMessages(error?.response?.data?.errData || [""]);
      } else {
      }
    },
  });

  console.log(error, "err");

  const clearStates = () => {
    setErrorMessages({});
    setReportsData({
      title: "",
      date: "",
      file_key: "",
      thumbnail_key: "",
      category: "",
    });
    setFileKey("");
    setThumbnailKey("");
    // setSelectedCategory("");
    // setSelectedMonth("");
    // setSelectedYear("");
  };

  useEffect(() => {
    clearStates();
  }, [router]);

  const formattedDate = dayjs("2024/10/10").toISOString();

  const addReport = ({
    asset_group,
    asset_type,
    asset_category,
    showYear,
    showCategory,
    showThumbnail,
  }: ReportDetailsProps) => {
    const payload = {
      asset_group,
      asset_type,
      asset_category: "Company Report",
      title: reportsData?.title,
      file_key: fileKey,
      ...(showYear && {
        date: reportsData?.date,
      }),
      ...(showThumbnail && { thumbnail_key: thumbnailKey }),
      // ...(showCategory && { category: reportsData?.category }),
    };
    mutate(payload);
  };

  return (
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
      }}
    >
      {children}
    </CreateReportContext.Provider>
  );
};
