import { useState } from "react";
import { CustomerCard } from "@/components";
import { Filter } from "lucide-react";
import { Button, Empty } from "@/common";
import CustomerLogo from "@/assets/customer.png";
import { getUsers } from "@/services";
import { useQuery } from "react-query";
import { Skeleton } from "@/helpers";

export const TopCustomers = () => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    type?: keyof Auth.User;
    id: string;
  }>();

  const { data: TopCustomer, isLoading } = useQuery(
    ["user:top", sortOrder, filter?.type],
    async (): Promise<Auth.User[]> => {
      const users = await getUsers({
        pageSize: 5,
        path: "customer",
        sort: sortOrder || "desc",
        direction: "next",
        filter: filter?.type || "totalSpent",
      });
      return users?.data.users;
    },
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="w-full border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] h-[400px] flex flex-col justify-start  items-start px-2 rounded-md py-3 ">
      <div className="flex items-center text-[var(--dark-text)] justify-between w-full gap-3 px-3 pt-3 pb-5">
        <h4 className="text-xl">Top Customers</h4>
        <div>
          <Button
            selectedCheck={[filter?.id as string]}
            bodyStyle={{
              width: "250px",
              top: "3rem",
              left: "-8.9rem",
              zIndex: 10000,
            }}
            parent={
              <div className="flex border-[1px] border-[var(--dark-border)] px-4 py-2 rounded items-center justify-start gap-2">
                <Filter
                  strokeWidth={2.5}
                  className="size-5 text-[var(--dark-text)] "
                />
                <p className="text-[16px] text-[var(--dark-secondary-text)] tracking-widest ">
                  Filter
                </p>
              </div>
            }
            checkFn={{
              checkSortFn: (
                isChecked: boolean,
                value: keyof Auth.User,
                id: string
              ) => {
                if (!isChecked && value) {
                  return setFilter({ id: "", type: undefined });
                }
                setFilter({ id: id, type: value });
              },
            }}
            sort={[
              { label: "Orders", value: "totalOrder", id: "flkiogrgaiosjd" },
              { label: "Amount", value: "totalSpent", id: "lfwrtpokjds" },
            ]}
            sortFn={(type: "asc" | "desc") =>
              setSortOrder(type as "asc" | "desc")
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 overflow-x-hidden scrollbar-custom pr-3  w-full  flex-grow ">
        {!isLoading ? (
          TopCustomer && TopCustomer?.length > 0 ? (
            TopCustomer?.map((customer, index) => (
              <CustomerCard key={customer.uid} prop={customer} index={index} />
            ))
          ) : (
            <Empty
              actionText="Refresh customer"
              action={() => setIsRefresh(!isRefresh)}
              children="No Top customer available"
              parent={CustomerLogo}
              style={{ width: "10rem", height: "9rem" }}
            />
          )
        ) : (
          <Skeleton
            children={{
              className: "w-full h-[60px] rounded-md",
            }}
            className=" w-full flex flex-col items-start justify-start gap-4"
            count={5}
          />
        )}
      </div>
    </div>
  );
};
