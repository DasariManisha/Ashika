import { $fetch } from "../fetch";

interface GetAllPaginatedReportPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search_string: string | null;
  // start_date: string | null;
  // end_date:string | null ;
  asset_group: string;
  asset_type: string;
  asset_category: string;
}

export const getAllPaginatedReports = async ({
  pageIndex,
  pageSize,
  order_by,
  search_string,
  // start_date,
  // end_date,
  asset_group,
  asset_type,
  asset_category,
}: Partial<GetAllPaginatedReportPropTypes>) => {
  try {
    // return await $fetch.get(`reports?page=${pageIndex}&limit=${pageSize}&report_group=${reportGroup}&report_type=${reportType}&category_type=${categoryType}`)
    const queryParams = {
      page: pageIndex,
      page_size: pageSize,
      order_by: order_by,
      search_string,
      // start_date,
      // end_date,
      asset_group,
      asset_type,
      asset_category,
    };
    return await $fetch.get("/assets", queryParams);
  } catch (err) {
    throw err;
  }
};

export const addReportsAPI = async (payload: any) => {
  try {
    // return await $fetch.get(`reports?page=${pageIndex}&limit=${pageSize}&report_group=${reportGroup}&report_type=${reportType}&category_type=${categoryType}`)
    return await $fetch.post("/assets", payload);
  } catch (err) {
    throw err;
  }
};

export const updateReportsAPI = async (payload: any,id: string | undefined) => {
  try {
    // return await $fetch.get(`reports?page=${pageIndex}&limit=${pageSize}&report_group=${reportGroup}&report_type=${reportType}&category_type=${categoryType}`)
    return await $fetch.patch(`/assets/${id}`, payload);
  } catch (err) {
    throw err;
  }
};

export const deleteReportAPI = async (id: number) => {
  try {
    return await $fetch.delete(`/assets/${id}`);
  } catch (err) {
    throw err;
  }
};

export const getReportCategoryAPI = async (asset_group: string,asset_type: string) => {
 const queryParams = {
    asset_group,
    asset_type,
  };
  try {
    return await $fetch.get(`/assets/metadata`,queryParams);
  } catch (err) {
    throw err;
  }
};

export const getSingleReportAPI = async (reportId: string | undefined,) => {
  const queryParams = {
    metadata: true
  }
   try {
     return await $fetch.get(`/assets/${reportId}`,queryParams);
   } catch (err) {
     throw err;
   }
 };

 export const multipleDeleteReportsAPI = async (payload:any) => {
  try {
      return await $fetch.delete(`/assets/delete-multiple/new`, payload);
  } catch (err) {
      throw err
  }
}
