import { useCallback, useEffect, useState } from "react";
import { CustomerTable } from "@/components";
import {
  bulkDeleteOfCustomer,
  getUsers,
  addLogs,
  searchUser,
} from "@/services";
import toast from "react-hot-toast";
import { UpdateCustomer, handleDownloadCustomerCSV } from "@/features";
import { debounce } from "@/helpers";
import { Button, DeleteButton, Delete, Modal } from "@/common";
import { Icons } from "@/utils";

const AllCustomers = () => {
  const [totalData, setTotalData] = useState<number>();
  const [filter, setFilter] = useState<{
    typeFilter?: {
      type?: "admin" | "customer" | "chef" | undefined;
      id?: string;
    };
    sortFilter?: { sort?: string; id?: string };
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialCustomer, setInitialCustomer] = useState<Auth.User[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>("asc");
  const [bulkSelectedCustomer, setBulkSelectedCustomer] = useState<
    { id: string; role: "customer" | "admin" | "chef" }[]
  >([]);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isBulkDelete, setIsBulkDelete] = useState<boolean>(false);
  const [id, setId] = useState<string>();
  const [customerModal, setCustomerModal] = useState<Auth.User>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirection?: "prev" | "next";
  }>({ currentPage: 1, perPage: 5 });
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [exportedData, setExportedData] = useState<Auth.User[]>([]);

  const handleCustomerData = async ({
    direction,
    filter,
    pageSize,
    path,
    sort,
    currentFirstDoc,
    currentLastDoc,
  }: Api.FetchPaginate<keyof Auth.User, "", Auth.UserRole>) => {
    setLoading(true);
    try {
      const user = await getUsers({
        path: path,
        pageSize: pageSize,
        filter: filter as keyof Auth.User,
        direction: direction,
        sort: sort,
        currentFirstDoc: currentFirstDoc || null,
        currentLastDoc: currentLastDoc || null,
      });

      const users = user.data;

      setCurrentDoc({
        currentFirstDoc: users.currentFirstDoc,
        currentLastDoc: users.currentLastDoc,
      });
      setTotalData(users.length);
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
      setInitialCustomer(aggregateUser);
    } catch (error) {
      setLoading(false);
      throw new Error(`Error while getting customers : ${error}`);
    }
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

  const handleSelectedDelete = async () => {
    const toastLoader = toast.loading("Deleting customer...");
    try {
      const { customer, admin, chef } = bulkSelectedCustomer.reduce<{
        customer: string[];
        admin: string[];
        chef: string[];
      }>(
        (acc, customer) => {
          if (customer.role === "admin") {
            acc.admin.push(customer.id);
          } else if (customer.role === "customer") {
            acc.customer.push(customer.id);
          }
          if (customer.role === "chef") {
            acc.chef.push(customer.id);
          }
          return acc;
        },
        { customer: [], admin: [], chef: [] }
      );
      if (customer.length > 0) {
        await bulkDeleteOfCustomer({ role: "customer", ids: [...customer] });
      }
      if (admin.length > 0) {
        await bulkDeleteOfCustomer({ role: "admin", ids: [...admin] });
      }
      if (chef.length > 0) {
        await bulkDeleteOfCustomer({ role: "chef", ids: [...chef] });
      }
      await addLogs({
        action: "delete",
        date: new Date(),
        detail: `bulk delete : customer :  ${JSON.stringify(
          customer
        )}, chef : ${JSON.stringify(chef)}, admin: ${JSON.stringify(admin)} `,
      });
      if (!admin && !customer) return toast.error("Please select the customer");
      toast.dismiss(toastLoader);
      const refreshCategory = initialCustomer.filter((user) => {
        return (
          !customer.includes(user.id as string) &&
          !admin.includes(user.id as string)
        );
      });

      setInitialCustomer(refreshCategory);
      toast.success("Successfully deleted");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while deleting...");
      throw new Error("Error while bulk user delete" + error);
    }
    setIsBulkDelete(false);
  };

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Customer not found");
    const findCustomer = initialCustomer?.find(
      (customer) => customer.uid === id
    );
    const toastLoader = toast.loading("Deleting customer...");
    try {
      await deletUser({
        role: findCustomer?.role as string,
        uid: findCustomer?.uid as string,
      });

      toast.dismiss(toastLoader);
      toast.success("Succesfully deleted");
      const refreshCustomer = initialCustomer?.filter(
        (data) => data.uid !== id
      );
      setInitialCustomer(refreshCustomer);
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while delting user");
      throw new Error("Error while deleting user" + error);
    }
    setIsDelete(false);
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

  // fetch next page
  useEffect(() => {
    if (pagination.currentPage > 1 && pagination.pageDirection) {
      (async () => {
        setLoading(true);
        const customers = await getUsers({
          path:
            (filter?.typeFilter?.type as "customer" | "admin" | "chef") ||
            "customer",
          pageSize: pagination.perPage,
          direction: pagination.pageDirection || "next",
          filter: (filter?.sortFilter?.sort as keyof Auth.User) || "fullName",
          sort: (sortOrder as "asc" | "desc") || "asc",
          currentFirstDoc: currentDoc && currentDoc.currentFirstDoc,
          currentLastDoc: currentDoc && currentDoc.currentLastDoc,
        });

        const users = customers.data as {
          currentFirstDoc: string;
          currentLastDoc: string;
          users: Auth.User[];
          length: number;
        };
        setCurrentDoc({
          currentFirstDoc: users.currentFirstDoc,
          currentLastDoc: users.currentLastDoc,
        });
        setTotalData(users.length);

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
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex flex-col justify-center gap-3 items-start w-full ">
        <div className="flex w-full  sm:flex-row flex-col items-end sm:items-center justify-between  ">
          <div className="flex w-full py-2 text-start flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Customers
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {totalData || 0} entries found
            </p>
          </div>
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
              <Icons.download strokeWidth={2.5} className="size-5" />
              <p className="text-[16px]   tracking-widest ">Export</p>
            </button>
            <Button
              selectedTypes={[filter?.typeFilter?.id as string]}
              selectedCheck={[filter?.sortFilter?.id as string]}
              bodyStyle={{
                width: "400px",
                top: "3rem",
                left: "-18rem",
              }}
              parent={
                <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                  <Icons.filter
                    strokeWidth={2.5}
                    className="size-5 text-[var(--dark-secondary-text)]"
                  />
                  <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                    Filter
                  </p>
                </div>
              }
              checkFn={{
                checkSortFn: (isChecked, value, id) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: "", sort: "" },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: id, sort: value },
                    }));
                  }
                },
                checkTypeFn: (isChecked, value, id) => {
                  if (!isChecked) {
                    return setFilter((prev) => ({
                      ...prev,
                      typeFilter: { id: "", type: undefined },
                    }));
                  }
                  if (isChecked) {
                    setFilter((prev) => ({
                      ...prev,
                      typeFilter: { id: id, type: value },
                    }));
                  }
                },
              }}
              types={[
                { label: "Admin", value: "admin", id: "sfksdjlk" },
                { label: "Customer", value: "customer", id: "fkldsjfks" },
                { label: "Chef", value: "chef", id: "fkldjs" },
              ]}
              sort={[
                { label: "Order", value: "totalOrder", id: "flksjd" },
                { label: "Amount", value: "totalSpent", id: "lfkjds" },
              ]}
              sortFn={(type: "asc" | "desc") => setSortOrder(type)}
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-start gap-2">
          <form
            action=""
            className="relative text-[var(--darkt-text)] w-full sm:w-auto "
          >
            <input
              id="search"
              type="search"
              onChange={(event) => debouncedHandleChange(event?.target.value)}
              className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
              placeholder="Search for users"
            />
          </form>
          <div className="h-10  w-[1px] bg-[var(--dark-border)] "></div>
          <DeleteButton
            dataLength={bulkSelectedCustomer.length}
            deleteFn={() => setIsBulkDelete(true)}
          />
          {filter?.sortFilter?.sort && (
            <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
              <div className="flex gap-1 items-center justify-center">
                <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                  {filter.sortFilter.sort?.toLowerCase()}
                </span>
              </div>
              <button
                onClick={() =>
                  setFilter((prev) => ({
                    ...prev,
                    sortFilter: { id: "", sort: "" },
                  }))
                }
              >
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
          {filter?.typeFilter?.type && (
            <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
              <div className="flex gap-1 items-center justify-center">
                <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                  {filter.typeFilter.type?.toLowerCase()}
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
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <CustomerTable
        handlePageDirection={(pageDirection) =>
          setPagination((prev) => ({ ...prev, pageDirection: pageDirection }))
        }
        totalData={totalData || 1}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        selectedData={bulkSelectedCustomer?.map((customer) => customer.id)}
        users={initialCustomer as Auth.User[]}
        loading={loading}
        actions={{
          checkAllFn: (isChecked: boolean) => {
            handleAllSelected(isChecked);
            if (!isChecked) return setExportedData([]);
            if (isChecked) setExportedData(initialCustomer);
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
          delete: (id) => {
            setIsDelete(true);
            setId(id);
          },
          edit: (id) => {
            const findCustomer = initialCustomer?.find(
              (customer) => customer.id == id
            );
            setCustomerModal(findCustomer);
            setIsEdit(false);
          },
        }}
      />
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(false)}
          id={id as string}
          isClose={isDelete}
          setDelete={(id: string) => handleDelete(id)}
        />
      )}
      <Modal
        children={
          <UpdateCustomer
            closeModal={() => setIsEdit(true)}
            customerInfo={customerModal as Auth.User}
          />
        }
        close={isEdit}
        closeModal={() => setIsEdit(true)}
        disableScroll={true}
      />
      {isBulkDelete && (
        <Delete
          closeModal={() => setIsBulkDelete(false)}
          id={id as string}
          isClose={isBulkDelete}
          setDelete={() => handleSelectedDelete()}
        />
      )}
    </div>
  );
};

export default AllCustomers;
