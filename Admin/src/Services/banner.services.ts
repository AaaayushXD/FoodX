import { makeRequest } from "../makeRequest";

// banner
export const addBanner = async (data: { name: string; img: string }) => {
    try {
      const response = await makeRequest({
        method: "post",
        data: { title: data.name, image: data.img },
        url: "banners/add-banner",
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to add banners" + error);
    }
  };
  export const getBanners = async () => {
    try {
      const response = await makeRequest({
        method: "get",
        url: "banners/get-banners",
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to fetch banners" + error);
    }
  };
  export const deleteBanner = async (data: { id: string }) => {
    try {
      const response = await makeRequest({
        method: "delete",
        data: { id: data.id },
        url: "banners/delete-banner",
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to delete banners" + error);
    }
  };
  export const bulkDeleteBanner = async (data: { id: string[] }) => {
    try {
      const response = await makeRequest({
        method: "delete",
        data: { ids: [...data.id] },
        url: "banners/bulk-delete",
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to delete banner" + error);
    }
  };