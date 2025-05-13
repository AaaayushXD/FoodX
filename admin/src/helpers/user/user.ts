import { getUser, getOrderByUser } from "@/services";
import { getCustomerData } from "../../firebase/db";

import { totalCost, totalQuantity } from "../product/product";

export const SearchCustomer = (customers: Auth.User[], value: string) => {
  const searchingCustomer = customers?.filter((customer) => {
    return (
      customer.fullName && customer?.fullName.toLowerCase().includes(value)
    );
  });
  return searchingCustomer;
};
export const getUserByUid = async (uid: string): Promise<Auth.User | null> => {
  try {
    // Try to get customer data first
    const customerData = (await getUser("customer", uid)) as {
      data: { data: Auth.User };
      statusText: string;
    };
    if (customerData?.data?.data && customerData?.data?.data?.fullName) {
      return customerData.data.data;
    }

    // If customer not found, try to get chef data
    const chefData = await getUser("chef", uid);
    if (chefData?.data?.data && chefData?.data?.data?.fullName) {
      return chefData.data.data;
    }

    // If neither customer nor chef found, return null
    return null;
  } catch (error) {
    return null;
  }
};

export const getChefByUid = async (uid: string): Promise<Auth.User | null> => {
  try {
    // If chef name is not found, try to get the admin's full name
    const chefData = await getUser("chef", uid);
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
    const chefData = await getUser("chef", uid);
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
    const user = await getUser("customer", uid);
    console.log(user);
    if (user?.data.statusCode === 200) return user.data.data;

    const chef = await getUser("chef", uid);
    if (chef) return chef.data.data;

    const admin = await getUser("admin", uid);
    if (admin) return admin.data.data;

    return null;
  } catch (error) {
    console.error(`Error fetching user info for UID ${uid}:`, error);

    return null;
  }
};

// aggregate Customer Data
export const aggregateCustomerData = async (
  customers: Auth.DbUser[]
): Promise<Auth.User[]> => {
  const customerList: Auth.User[] = [];

  const totalCustomersPromises = customers.map(
    async (data: Auth.DbUser): Promise<Auth.User> => {
      try {
        const userOrderData = await getOrderByUser(data.uid);
        if (!userOrderData) throw new Error("user not found");
        const totalUserOrder = userOrderData.data as Ui.Order[];
        let totalCustomerCost: number = 0;
        let totalCustomerQuantity: number = 0;
        totalUserOrder?.forEach((order) => {
          totalCustomerQuantity += totalQuantity(
            order.products as Ui.Product[]
          );
          totalCustomerCost += totalCost(order.products as Ui.Product[]);
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
    const sortBySpent = customerList.sort((a: Auth.User, b: Auth.User) => {
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
