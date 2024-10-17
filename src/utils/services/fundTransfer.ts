import { apiPropsForQueryParams } from "@/lib/helpers/prepareQueryParams";
import { $fetch } from "../fetch";

interface GetAllPaginatedClientsPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
  search: string;
}


export const getAllPaginatedClients = async ({
  pageIndex,
  pageSize,
  order_by,
  search,
}: GetAllPaginatedClientsPropTypes) => {
  try {
    const queryParams = {
      page: pageIndex,
      limit: pageSize,
      order_by: order_by,
      search_string: search
    };
    return await $fetch.get("/clients/list", queryParams);
  } catch (err) {
    throw err;
  }
};

export const deleteClientAPI = async (id: number) => {
  try {
    return await $fetch.delete(`/clients/${id}`);
  } catch (err) {
    throw err;
  }
};

export const getExportDpClientsAPI = async (queryParams:any) => {
  try {
    const response= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fund-transfers/dp-clients/export`);
     if(response.status == 200 || response.status == 201){
      return await response.text();
    }else{
      throw await response.json()
     }
   } catch (err: any) {
    console.log(err);
  }
}

export const getSingleCategoryAPI = async (id: number) => {
  try {
    return await $fetch.get(`/categories/${id}`);
  } catch (err) {
    throw err;
  }
};

export const addClientAPI = async (payload: any) => {
  try {
    return await $fetch.post(`/fund-transfers/dp-clients`, payload);
  } catch (err) {
    throw err;
  }
};

export const importClientAPI = async (formData: any) => {
  try {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fund-transfers/dp-clients/import`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    throw err;
  }
};
