import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const removeProductFromCart = async (
  uid: Auth.User["uid"],
  productId: Ui.Product["id"]
): Promise<
  Api.Response<{
    createdAt: Common.TimeStamp;
    products: Ui.Product["id"][];
    uid: Auth.User["uid"];
  } | null>
> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "/cart/remove",
      data: { uid, productId },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
