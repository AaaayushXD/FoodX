import { makeRequest } from "@/makeRequest";

export const deleteAccount = async (): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-account",
    });
    return response.data;
  } catch (error) {
    throw new Error("Error while delete account " + error);
  }
};
