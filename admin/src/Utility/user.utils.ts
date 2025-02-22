import { getOrderByUser } from "../Services/order.services";
import { getUser } from "../Services/user.services";
import { getCustomerData } from "../firebase/db";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { DbUser, User } from "../models/user.model";
import { totalCost, totalQuantity } from "./product.utils";

export const SearchCustomer = (customers: User[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return (
      customer.fullName && customer?.fullName.toLowerCase().includes(value)
    );
  });
  return searchingCustomer;
};
export const getUserByUid = async (uid: string): Promise<User | null> => {
  try {
    const customerData = (await getUser({ role: "customer" }, uid)) as {
      data: { data: User };
      statusText: string;
    };
    if (customerData?.data?.data && customerData?.data?.data?.fullName) {
      return customerData.data.data;
    }

    // If chef name is not found, try to get the admin's full name
    const chefData = await getUser({ role: "chef" }, uid);
    if (chefData?.data?.data && chefData?.data?.data?.fullName) {
      return chefData!.data.data;
    }
    // If customer name is not found, try to get the admin's full name
    const adminData = await getUser({ role: "admin" }, uid);
    if (adminData?.data?.data && adminData?.data.data?.fullName) {
      return adminData!.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getChefByUid = async (uid: string): Promise<User | null> => {
  try {
    // If chef name is not found, try to get the admin's full name
    const chefData = await getUser({ role: "chef" }, uid);
    if (chefData?.data?.data && chefData?.data?.data?.fullName) {
      return chefData!.data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getChefDetails = async (uid: string): Promise<string | null> => {
  try {
    // If chef name is not found, try to get the admin's full name
    const chefData = await getUser({ role: "chef" }, uid);
    if (chefData?.data?.data && chefData?.data?.data?.fullName) {
      return chefData!.data.data.fullName;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getUserInfo = async (uid: string) => {
  try {
    // Try fetching user data for different roles
    const user = await getUser({ role: "customer" }, uid);
    console.log(user);
    if (user?.data.statusCode === 200) return user.data.data;

    const chef = await getUser({ role: "chef" }, uid);
    if (chef) return chef.data.data;

    const admin = await getUser({ role: "admin" }, uid);
    if (admin) return admin.data.data;

    return null;
  } catch (error) {
    console.error(`Error fetching user info for UID ${uid}:`, error);

    return null;
  }
};

// aggregate Customer Data
export const aggregateCustomerData = async (
  customers: DbUser[]
): Promise<User[]> => {
  const customerList: User[] = [];

  const totalCustomersPromises = customers.map(
    async (data: DbUser): Promise<User> => {
      try {
        const userOrderData = await getOrderByUser(data.uid);
        if (!userOrderData) throw new Error("user not found");
        const totalUserOrder = userOrderData.data as Order[];
        let totalCustomerCost: number = 0;
        let totalCustomerQuantity: number = 0;
        totalUserOrder?.forEach((order) => {
          totalCustomerQuantity += totalQuantity(order.products as Product[]);
          totalCustomerCost += totalCost(order.products as Product[]);
        });

        return {
          uid: data.uid,
          fullName: data.fullName,
          email: data.email,
          avatar: data.avatar,
          totalSpent: Math.round(totalCustomerCost * 100) / 100,
          totalOrder: totalCustomerQuantity,
          role: data.role as "customer" | "admin" | "chef",
        };
      } catch (error) {
        throw new Error(`Error fetching orders for user ${data.uid}:` + error);
      }
    }
  );

  try {
    const results = await Promise.all(totalCustomersPromises);
    customerList.push(...results);
  } catch (error) {
    throw new Error("Error processing batch:" + error);
  }

  if (customerList.length > 0) {
    return customerList;
  } else {
    throw new Error("No customers found or processed.");
  }
};

export const getTopCustomers = async () => {
  try {
    const getCustomer = await getCustomerData("customer");
    if (getCustomer.length <= 0) return [];
    const customerList = await aggregateCustomerData(getCustomer);
    const sortBySpent = customerList.sort((a: User, b: User) => {
      // Safely handle undefined values by assigning 0 as a default if undefined
      const spentA = a?.totalSpent ?? 0;
      const spentB = b?.totalSpent ?? 0;

      return spentB - spentA;
    });

    return sortBySpent;
    return sortBySpent.slice(0, 5);
  } catch (error) {
    throw new Error("Error while sorting top customers : " + error);
  }
};
