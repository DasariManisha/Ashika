import { $fetch } from "../fetch";

interface GetAllPaginatedUsersPropTypes {
  pageIndex: number;
  pageSize: number;
  order_by: any;
}

export const getAllPaginatedUsers = async ({
  pageIndex,
  pageSize,
  order_by,
}: GetAllPaginatedUsersPropTypes) => {
  try {
    const queryParams = {
        page: pageIndex,
        page_size: pageSize,
        order_by: order_by,
    };
    return await $fetch.get("/users", queryParams);
  } catch (err) {
    throw err;
  }
};



export const addUsersAPI = async (payload: any) => {
    try {
        return await $fetch.post("/users", payload);
    } catch (err) {
        throw err
    }
    
}

export const updateUserAPI = async (payload: any) => {
  try {
      return await $fetch.patch("/users", payload);
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

export const multipleDeleteUsersAPI = async (payload:any) => {
  try {
      return await $fetch.delete(`/delete-multiple/new`, payload);
  } catch (err) {
      throw err
  }
}

export const getSingleUserAPI = async (userId: string | undefined,) => {
  const queryParams = {
    metadata: true
  }
   try {
     return await $fetch.get(`/users/${userId}`,queryParams);
   } catch (err) {
     throw err;
   }
 };
