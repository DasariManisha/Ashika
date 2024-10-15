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

  console.log(reportId, "id");
  // const navigate = useNavigate();

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
  } = context as CreateReportContextProps;

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
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      }
    },
  });
  const { isFetching } = useQuery({
    queryKey: ["getSingleReport"],
    queryFn: async () => {
      try {
        const response = await getSingleReportAPI(reportId);

        if (response.success) {
          const data = response?.data?.data;
          setReportsData({
            title: data?.title,
            date: data?.date,
            file_key: data?.file_key,
            thumbnail_key: data?.thumbnail_key,
            asset_category: "",
          });
          assignDate(data?.date);
          const file = {
            fileName: data?.file_key,
            fileSize: "",
            fileType: "",
          };
          setSelectedFiles([file]);
        } else {
          throw response;
        }
      } catch (errData) {
        console.error(errData);
        errPopper(errData);
      }
    },
  });

  const assignDate = (date: string) => {
    setSelectedYear(dayjs(date).format("YYYY"));
    setSelectedMonth(dayjs(date).format("MM"));
  };

  return (
    <>
      <div className=" relative p-6  max-w-2xl mt-5 mx-auto bg-white rounded-xl shadow-md space-y-6">
        <Button
          onClick={() => window.history.back()}
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
          onCancel={() => window.history.back()}
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
