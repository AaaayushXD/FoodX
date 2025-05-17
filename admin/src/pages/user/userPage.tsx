import { Download, Filter, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "@/helpers";
import { CustomerTable } from "@/components";
import { Button } from "@/common";
import toast from "react-hot-toast";
import { handleDownloadCustomerCSV } from "@/features";
import { getUsers, searchUser } from "@/services";

const CustomerList: React.FC = () => {
  const [initialCustomer, setInitialCustomer] = useState<Auth.User[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
    { id: string; role: "customer" | "admin" | "chef" }[]
  >([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirection?: "prev" | "next";
  }>({ currentPage: 1, perPage: 5 });
  const [exportedData, setExportedData] = useState<Auth.User[]>([]);
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [filter, setFilter] = useState<{
    typeFilter?: {
      type?: "admin" | "customer" | "chef" | undefined;
      id?: string;
    };
    sortFilter?: { sort?: string; id?: string };
  }>();
  const [totalData, setTotalData] = useState<number>();

  const handleCustomerData = async ({
    direction,
    filter,
    pageSize,
    path,
    sort,
    currentFirstDoc,
    currentLastDoc,
  }: Api.FetchPaginate<keyof Auth.User, " ", Auth.UserRole>) => {
    setLoading(true);
    try {
      const user = await getUsers({
        path: path,
        pageSize: pageSize,
        filter: filter,
        direction: direction,
        sort: sort,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
      });

      setCurrentDoc({
        currentFirstDoc: user?.data?.currentFirstDoc,
        currentLastDoc: user?.data.currentLastDoc,
      });

      const aggregateUser = user.data?.users?.map((user) => ({
        id: user.uid,
        avatar: user.avatar,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        totalSpent: user.totalSpent,
        totalOrder: user.totalOrder,
      }));
      setTotalData(user?.data?.users.length);
      setInitialCustomer(aggregateUser);
    } catch (error) {
      throw new Error(`Error while getting customers : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // search user
  const handleChange = async (value: string) => {
    if (value.length <= 0)
      return handleCustomerData({
        path:
          (filter?.typeFilter?.type as "admin" | "customer" | "chef") ||
          "customer",
        direction: "next",
        filter: (filter?.sortFilter?.sort as keyof Auth.User) || "fullName",
        pageSize: pagination.perPage,
        sort: sortOrder || "asc",
        currentFirstDoc: null,
        currentLastDoc: null,
      });
    setLoading(true);
    const filterCustomer = await searchUser(value);
    setTotalData(filterCustomer.length);
    // const aggregateUser = await aggregateCustomerData(filterCustomer);
    setCurrentDoc({ currentFirstDoc: "", currentLastDoc: "" });
    setInitialCustomer(filterCustomer || []);
    setLoading(false);
  };

  const handleBulkSelected = (id: string, isChecked: boolean) => {
    const refreshIds = bulkSelectedCustomer?.filter((user) => user.id !== id);

    isChecked
      ? setBulkSelectedCustomer(
          (prev): { id: string; role: "customer" | "admin" | "chef" }[] => {
            const newCustomer = prev?.filter((category) => category.id !== id);
            const findCustomer = initialCustomer.find(
              (category) => category?.id === id
            );
            return newCustomer
              ? [
                  ...newCustomer,
                  {
                    id: findCustomer?.id as string,
                    role: findCustomer?.role as "customer" | "admin" | "chef",
                  },
                ]
              : [
                  {
                    id: findCustomer?.id as string,
                    role: findCustomer?.role as "customer" | "admin" | "chef",
                  },
                ];
          }
        )
      : setBulkSelectedCustomer(refreshIds);
  };

  const handleAllSelected = (isChecked: boolean) => {
    if (isChecked) {
      const AllCategories = initialCustomer?.map((customer) => {
        return { id: customer.id as string, role: customer.role };
      });
      setBulkSelectedCustomer(
        AllCategories as { id: string; role: "customer" | "admin" | "chef" }[]
      );
    }
    if (!isChecked) {
      setBulkSelectedCustomer([]);
    }
  };

  const debouncedHandleChange = useCallback(debounce(handleChange, 350), [
    initialCustomer,
  ]);

  // call getUser fn based on changing the current page number
  useEffect(() => {
    handleCustomerData({
      path:
        (filter?.typeFilter?.type as "admin" | "customer" | "chef") ||
        "customer",
      direction: "next",
      filter: (filter?.sortFilter?.sort as keyof Auth.User) || "fullName",
      pageSize: pagination.perPage,
      sort: sortOrder || "asc",
      currentFirstDoc: null,
      currentLastDoc: null,
    });
  }, [
    pagination.perPage,
    filter?.sortFilter?.sort,
    filter?.typeFilter?.type,
    sortOrder,
  ]);

  useEffect(() => {
    if (pagination.currentPage > 1 && pagination.pageDirection) {
      (async () => {
        setLoading(true);
        const customers = await getUsers({
          path:
            (filter?.typeFilter?.type as "customer" | "admin" | "chef") ||
            "customer",
          pageSize: pagination.perPage,
          direction: pagination?.pageDirection || "next",
          filter: (filter?.sortFilter?.sort as keyof Auth.User) || "fullName",
          sort: sortOrder || "asc",
          currentFirstDoc: currentDoc && currentDoc.currentFirstDoc,
          currentLastDoc: currentDoc && currentDoc.currentLastDoc,
        });

        const users = customers.data as {
          currentFirstDoc: string;
          currentLastDoc: string;
          users: Auth.User[];
          length: number;
        };

        const aggregateUser = users.users?.map((user) => ({
          id: user.uid,
          avatar: user.avatar,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          totalSpent: user.totalSpent,
          totalOrder: user.totalOrder,
        }));
        setCurrentDoc({
          currentFirstDoc: users.currentFirstDoc,
          currentLastDoc: users.currentLastDoc,
        });
        setTotalData(users.length);

        setInitialCustomer((customer) => {
          return [
            ...customer,
            ...aggregateUser.filter(
              (user) => !customer.some((cust) => user.id === cust.id)
            ),
          ];
        });
        setLoading(false);
      })();
    }
  }, [
    pagination.currentPage,
    pagination.perPage,
    filter?.sortFilter?.sort,
    filter?.typeFilter?.type,
    pagination.pageDirection,
    sortOrder,
  ]);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-2 2xl:container">
      <div className="flex sm:flex-row flex-col gap-3  items-end sm:items-center justify-between w-full px-2 pt-5">
        <div className="flex w-full text-start flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Customers
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {totalData || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex  items-center justify-center gap-2">
            <button
              onClick={() =>
                exportedData.length > 0
                  ? handleDownloadCustomerCSV(exportedData)
                  : toast.error("Please select order", {
                      position: "top-right",
                    })
              }
              className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-white py-[0.5rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
            >
              <Download strokeWidth={2.5} className="size-5" />
              <p className="text-[16px]   tracking-widest ">Export</p>
            </button>
            {/* Filter button */}
            <Button
              selectedTypes={[filter?.typeFilter?.id as string]}
              selectedCheck={[filter?.sortFilter?.id as string]}
              bodyStyle={{
                width: "400px",
                top: "3.5rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                  <Filter
                    strokeWidth={2.5}
                    className="size-5 text-[var(--dark-secondary-text)]"
                  />
                  <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                    Filter
                  </p>
                </div>
              }
              checkFn={{
                checkSortFn: (
                  isChecked: boolean,
                  value: string,
                  id: string
                ) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: "", sort: "" },
                    }));
                  }

                  setFilter((prev) => ({
                    ...prev,
                    sortFilter: { sort: value, id: id },
                  }));
                },
                checkTypeFn: (
                  isChecked: boolean,
                  value: "admin" | "chef" | "customer",
                  id: string
                ) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      typeFilter: { type: undefined, id: "" },
                    }));
                  }
                  setFilter((prev) => ({
                    ...prev,
                    typeFilter: { id: id, type: value },
                  }));
                },
              }}
              types={[
                { label: "Admin", value: "admin", id: "sfksdjlk" },
                { label: "Customer", value: "customer", id: "fkldsjfks" },
                { label: "Chef", value: "chef", id: "fkldjs" },
              ]}
              sort={[
                { label: "Fullname", value: "fullName", id: "flksjd" },
                { label: "Spent", value: "totalSpent", id: "lfkjds" },
                { label: "Order", value: "totalOrder", id: "fldkjs" },
              ]}
              sortFn={(type: "asc" | "desc") =>
                setSortOrder(type as "asc" | "desc")
              }
            />
          </div>
        </div>
      </div>
      <div className="flex sm:flex-row flex-col items-start sm:items-center justify-start gap-8 sm:gap-2 w-full px-1">
        <form
          action=""
          className="relative text-[var(--dark-text)] w-full sm:w-auto "
        >
          <input
            id="search"
            type="search"
            onChange={(event) => debouncedHandleChange(event?.target.value)}
            className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
            placeholder="Search for users"
          />
        </form>
        {filter?.sortFilter?.sort && (
          <div className="flex px-2 py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.sortFilter?.sort?.toLocaleLowerCase()}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  sortFilter: { id: "", sort: "" },
                }))
              }
              className=" "
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
        {filter?.typeFilter?.type && (
          <div className="flex px-2 py-0.5 gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
            <div className="flex gap-1 items-center justify-center">
              <span className="text-[15px] text-[var(--dark-secondary-text)]">
                {filter.typeFilter?.type?.toLocaleLowerCase()}
              </span>
            </div>
            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  typeFilter: { id: "", type: undefined },
                }))
              }
            >
              <X className="text-[var(--danger-text)] " size={20} />
            </button>
          </div>
        )}
      </div>
      <CustomerTable
        selectedData={bulkSelectedCustomer?.map((customer) => customer.id)}
        actions={{
          checkAllFn: (isChecked: boolean) => {
            handleAllSelected(isChecked);
            if (!isChecked) return setExportedData([]);
            if (isChecked) {
              setExportedData(initialCustomer);
            }
          },
          checkFn: (id: string, isChecked: boolean) => {
            handleBulkSelected(id, isChecked);
            const findUser = initialCustomer?.find((user) => user.id === id);
            if (!isChecked && id) {
              setExportedData((prev) => {
                const filteredData = prev
                  ? prev.filter((user) => user.id !== id)
                  : [];
                return [...filteredData];
              });
            }
            if (isChecked && id) {
              setExportedData((prev) => [...prev, findUser as Auth.User]);
            }
          },
        }}
        handlePageDirection={(pageDirection) =>
          setPagination((prev) => ({ ...prev, pageDirection: pageDirection }))
        }
        totalData={totalData || 1}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page: number) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        loading={loading}
        users={initialCustomer}
      />
    </div>
  );
};

export default CustomerList;

//functions

// const handleBulkSelected = (id: string, isChecked: boolean) => {
//   const refreshIds = bulkSelectedCustomer?.filter(
//     (product) => product.id !== id
//   );

//   isChecked
//     ? setBulkSelectedCustomer((prev) => {
//         const newCategory = prev?.filter((category) => category.id !== id);
//         const findProduct = initialCustomer?.find(
//           (category) => category.id === id
//         );
//         return newCategory
//           ? [...newCategory, { id: findProduct?.id }]
//           : [{ id: findProduct?.id }];
//       })
//     : setBulkSelectedCustomer(refreshIds);
// };
// const handleAllSelected = (isChecked: boolean) => {
//   if (isChecked) {
//     const AllCategories = initialCustomer?.map((product) => {
//       return { id: product.id };
//     });
//     setBulkSelectedCustomer(AllCategories as { id: string }[]);
//   }
//   if (!isChecked) {
//     setBulkSelectedCustomer([]);
//   }
// };

// const handleSelectedDelete = async () => {
//   try {
//     const toastLoader = toast.loading("Deleting category...");
//     const AllCategoriesId = bulkSelectedCustomer?.map(
//       (category) => category.id
//     );
//     await bulkDeleteOfCategory(AllCategoriesId);
//     toast.dismiss(toastLoader);
//     const refreshCategory = initialCustomer.filter((category) => {
//       return !AllCategoriesId.includes(category.id as string);
//     });
//     setInitialCustomer(refreshCategory);
//     toast.success("Successfully deleted");
//   } catch (error) {
//     console.error("Error deleting products:", error);
//     // Handle the error appropriately, e.g., show a notification to the user
//   }
// };

// const handleDelete = async (id: string) => {
//   const toastLoading = toast.loading("Deleting user...");
//   const findUser = initialCustomer?.find((customer) => customer.id === id);
//   try {
//     await deleteUser({
//       id: [findUser?.id as string],
//       role: findUser?.role as string,
//     });
//     toast.dismiss(toastLoading);
//     toast.success("Successfully deleted");
//     const refreshData = initialCustomer?.filter(
//       (customer) => customer.id !== id
//     );
//     setInitialCustomer(refreshData);
//     setIsDelete(false);
//   } catch (error) {
//     toast.dismiss(toastLoading);
//     toast.error("Failed to delete user");
//   }
//   setIsDelete(false);
// };

//table action
// selectedData={bulkSelectedCustomer}
// actions={{
//   checkAllFn: (isChecked: boolean) => handleAllSelected(isChecked),
//   checkFn: (id: string, isChecked: boolean) =>
//     handleBulkSelected(id, isChecked),
// }}

//modal of delete
{
  /* {isDelete && (
        <Delete
          id={id as string}
          closeModal={() => setIsDelete(false)}
          isClose={isDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )} */
}

// state
// const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
// { id: string }[]
// >([]);
// const [isChecked, setIsChecked] = useState<boolean>(false);
// const [checked, setChecked] = useState<CustomerType[]>([]);
// const [isDelete, setIsDelete] = useState<boolean>(false);
// const [id, setId] = useState<string>();
