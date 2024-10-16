"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useContext, useState } from "react";
import dayjs from "dayjs";
import TitleInput from "./Title";
import YearSelect from "./Year";
import MonthSelect from "./Month";
import ActionButtons from "./ActionButtons";

import { CreateReportContext } from "./CreateReportContext";
import { CreateReportContextProps } from "@/lib/interfaces/context";
import FileUpload from "../CommonComponents/UploadPage";
import ThumbnailPreview from "../CommonComponents/thumbnailUpload";
import { createRouter, useParams, useRouter } from "@tanstack/react-router";
import CategorySelect from "./Category";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getReportCategoryAPI,
  getSingleReportAPI,
} from "@/utils/services/reports";
import Loading from "../Loading";
import { errPopper } from "@/utils/helpers/errorPopper";
import usePresignedUrlHook from "../CommonComponents/usePresignedUrlHook";

interface AddProps {
  showTitle?: boolean;
  showYear?: boolean;
  showMonth?: boolean;
  showCategory?: boolean;
  showFileUpload?: boolean;
  showThumbnail?: boolean;
  asset_group: string;
  asset_type: string;
  asset_category?: string;
}

const CombineAdd = ({
  showTitle = true,
  showYear = true,
  showMonth = true,
  showCategory = true,
  showFileUpload = true,
  showThumbnail = true,
  asset_group,
  asset_type,
  asset_category = "",
}: AddProps) => {
  const router = useRouter();
  const { reportId } = useParams({ strict: false });

  const context: CreateReportContextProps = useContext(
    CreateReportContext
  ) as CreateReportContextProps;

  const {
    loading,
    addReport,
    errMessages,
    setCategories,
    handleCategory,
    setReportsData,
    setSelectedYear,
    setSelectedMonth,
    reportsData,
    setSelectedFiles,
    setFileKey,
    setPreview,
    clearStates,
  } = context as CreateReportContextProps;

  const { filePreview } = usePresignedUrlHook();

  const { isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const response = await getReportCategoryAPI(asset_group, asset_type);

        if (response.success) {
          const assetCategories = response?.data?.data?.map(
            (item: any) => item.asset_category
          );
          {
            assetCategories.length > 1
              ? setCategories(assetCategories)
              : handleCategory(assetCategories[0]);
          }
          {
            !reportId && clearStates();
          }
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      }
    },
  });

  const getSingleReport = async () => {
    try {
      const response = await getSingleReportAPI(reportId);

      if (response.success) {
        const data = response?.data?.data;
        setReportsData((prev) => ({
          ...prev,
          title: data?.title,
          date: data?.date,
          file_key: data?.file_key,
          thumbnail_key: data?.thumbnail_key,
          ...(data?.asset_metadata?.asset_category && {
            asset_category: data?.asset_metadata?.asset_category,
          }),
        }));

        setFileKey(data?.file_key);
        assignDate(data?.date);
        const file = {
          fileName: data?.file_key,
          fileSize: "",
        };
        setSelectedFiles([file]);
        if (showThumbnail && data?.thumbnail_key) {
          fetchThumbnailPreview(data);
        }
      } else {
        throw response;
      }
    } catch (errData) {
      console.error(errData);
      errPopper(errData);
    }
  };

  const { isFetching } = useQuery({
    queryKey: ["getSingleReport", reportId],
    queryFn: getSingleReport,
    enabled: !!reportId,
  });

  const assignDate = (date: string) => {
    setSelectedYear(dayjs(date).format("YYYY"));
    setSelectedMonth(dayjs(date).format("MM"));
  };

  const fetchThumbnailPreview = async (data: any) => {
    const url = await filePreview(data?.thumbnail_key);
    setPreview(url);
  };

  const handleBack = () => {
    clearStates();
    window.history.back();
  };

  return (
    <>
      <div className=" relative p-6  max-w-2xl mt-5 mx-auto bg-white rounded-xl shadow-md space-y-6">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center space-x-1 mb-4  h-[30px]"
        >
          <ArrowLeft className="mr-1" />
          <span>Back</span>
        </Button>

        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="flex-1 space-y-6">
            {showTitle && <TitleInput />}

            <div className="flex space-x-4">
              {showYear && <YearSelect />}
              {showMonth && <MonthSelect />}
            </div>
            {showCategory && <CategorySelect />}
            {showFileUpload && (
              <div>
                <FileUpload accept="*/*" />
                {errMessages?.file_key && (
                  <p className="text-red-500">{errMessages.file_key[0]}</p>
                )}
              </div>
            )}
          </div>

          {showThumbnail && <ThumbnailPreview accept="image/*" />}
        </div>

        <ActionButtons
          onCancel={handleBack}
          onSave={() =>
            addReport({
              asset_group,
              asset_type,
              asset_category,
              showYear,
              showCategory,
              showThumbnail,
            })
          }
        />
        <Loading loading={isLoading || isFetching} />
      </div>
    </>
  );
};

export default CombineAdd;
