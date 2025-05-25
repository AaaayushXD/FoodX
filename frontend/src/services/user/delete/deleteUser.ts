import { makeRequest } from "@/makeRequest";

export const deleteAccount = async (data:{uid:string, role: Auth.role}): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-account",
      data: data,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while delete account " + error);
  }
};
