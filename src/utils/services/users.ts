import { $fetch } from "../fetch";

interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
}

export const getAllPaginatedUsers = async ({
  pageIndex,
  pageSize,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
        page: pageIndex,
        page_size: pageSize,
    };
    return await $fetch.get("/users", queryParams);
  } catch (err) {
    throw err;
  }
};



export const addUsersAPI = async (payload: any) => {
    try {
        // return await $fetch.get(`reports?page=${pageIndex}&limit=${pageSize}&report_group=${reportGroup}&report_type=${reportType}&category_type=${categoryType}`)
        return await $fetch.post("/users", payload);
    } catch (err) {
        throw err
    }
    
}

export const deleteUsersAPI = async (id:number) => {
    try {
        return await $fetch.delete(`/users/${id}`);
    } catch (err) {
        throw err
    }
}
