  import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UpdateStatus } from "@/features";
import { addNotification, updateOrderStatus } from "@/services";
import { Icons, toaster } from "@/utils";
import { Table } from "@/common";
import { getUserByUid } from "@/helpers";

interface orderTableProp {
  totalData: number;
  orders: Ui.OrderModal[];
  loading?: boolean;
  selectedData: string[];
  pagination: { currentPage: number; perPage: number };
  onPageChange: (page: number) => void;
  action: {
    checkAllFn?: (isChecked: boolean) => void;
    checkFn?: (id: string, isChecked: boolean) => void;
  };
  handlePageDirection: (pageDirection: "next" | "prev") => void;
}

export const OrderTable: React.FC<orderTableProp> = ({
  totalData,
  orders,
  loading,
  onPageChange,
  pagination,
  action,
  selectedData,
  handlePageDirection,
}) => {
  const [id, setId] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);
  const [initialOrder, setInitialOrder] = useState<Ui.OrderModal[]>([]);

  const message = {
    completed: "Your order has been successfully completed.",
    cancelled:
      "Your order has been cancelled. Please contact customer support for assistance.",
  };

  const statusChangeFn = async (newStatus: Common.OrderStatus) => {
    if (!newStatus && !id) return toast.error("Order doesn't exist");
    const toastLoader = toaster({
      title: "Updating status...",
      icon: "loading",
    });
    const order = initialOrder?.find((od) => od.id === id);
    const user = await getUserByUid(order?.uid as string);
    try {
      await updateOrderStatus({
        id: id as string,
        status: newStatus as string,
        price: order?.products?.reduce(
          (orderAcc, order) =>
            orderAcc + Number(order?.price) * Number(order.quantity),
          0
        ) as number,
        uid: order?.uid as string,
        role: user?.role as Auth.UserRole,
      });

      if (
        (newStatus === "completed" || newStatus === "cancelled") &&
        order?.uid
      ) {
        await addNotification({
          message: message[newStatus],
          title: "Order " + newStatus,
          uid: order?.uid as string,
        
        });
      }
      const refreshProducts = orders?.map((order) => {
        if (order.id === id) {
          return { ...order, status: newStatus };
        }

        return order;
      }) as Ui.OrderModal[];
      setInitialOrder(refreshProducts);
      toast.dismiss(toastLoader);
      toaster({
        title: "Succussfully updated",
        icon: "success",
      });
    } catch (error) {
      toast.dismiss(toastLoader);
      toaster({
        title: "Error while updating status",
        icon: "error",
      });
      throw new Error("Error while updating status" + error);
    }
    setIsChangeStatus(false);
  };

  const Columns: Common.ColumnProps[] = [
    {
      fieldName: "Id",
      colStyle: { width: "100px", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className=" !p-0 w-[100px]   relative cursor-pointer group/id text-center ">
          #{item.id?.substring(0, 8)}
          <div
            className=" top-[-27px]  text-[15px] -left-2 group-hover/id:visible opacity-0 group-hover/id:opacity-[100] duration-150 invisible   absolute bg-[var(--light-foreground)] p-0.5
           rounded shadow "
          >
            #{item.id}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Name",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.OrderModal) => (
        <div className="w-[120px]  text-[var(--dark-text)] flex items-center justify-start gap-3 ">
          <span> {value.name}</span>
        </div>
      ),
    },
    {
      fieldName: "Items",
      colStyle: {
        width: "180px ",
        justifyContent: "start",
        textAlign: "start",
      },
      render: (item: Ui.OrderModal) => (
        <div className=" w-[180px]  flex items-center justify-start gap-1 text-[var(--dark-text)]">
          <p>
            {!isCollapsed && item.id == selectedId
              ? item.products?.map(
                  (product) => `${product?.name} * ${product?.quantity} `
                )
              : item.products &&
                `${item?.products[0]?.name} × ${item?.products[0]?.quantity}  `}
          </p>
          <button
            onClick={() => {
              setSelectedId(item.id);
              setIsCollapsed(!isCollapsed);
            }}
          >
            <Icons.chevronRight
              className={`size-5 ${
                selectedId === item.id && !isCollapsed ? "rotate-90" : ""
              }  duration-200 cursor-pointer `}
            />
          </button>
        </div>
      ),
    },
    {
      fieldName: "Recieved",
      colStyle: { width: "135px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.orderRequest}</span>
        </div>
      ),
    },
    {
      fieldName: "Delivered ",
      colStyle: { width: "135px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.orderFullfilled}</span>
        </div>
      ),
    },
    {
      fieldName: "Status",
      colStyle: { width: "140px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className=" w-[140px]  gap-2 flex  items-center justify-start  text-[var(--dark-text)]  ">
          <div
            className={`w-2 h-2 rounded-full ${
              item.status === "prepared"
                ? "bg-[var(--prepared)] "
                : item.status === "pending"
                ? "bg-[var(--pending)] "
                : item.status === "preparing"
                ? "bg-[var(--preparing)] "
                : item.status === "cancelled"
                ? "bg-[var(--cancelled)]"
                : item.status === "completed"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></div>
          <button
            onClick={() => {
              setIsChangeStatus(true);
              setId(item.id);
            }}
          >
            {item.status &&
              item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </button>
          <div className="absolute lg:left-[45rem] md:left-[30rem] left-[15rem] sm:left-[30rem] z-[1000]">
            {" "}
            {isChangeStatus && id === item.id && (
              <UpdateStatus
                isChangeStatus={() => setIsChangeStatus(false)}
                status={item.status!}
                statusFn={(status: Common.OrderStatus) =>
                  statusChangeFn(status)
                }
              />
            )}
          </div>
        </div>
      ),
    },
    {
      fieldName: "Rank",
      colStyle: { width: "100px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className=" w-[135px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item.rank}</span>
        </div>
      ),
    },
  ];

  console;

  useEffect(() => {
    setInitialOrder(orders);
  }, [orders]);

  return (
    <div className="w-full overflow-auto rounded-t-md">
      <Table
        handlePageDirection={(pageDirection) =>
          handlePageDirection(pageDirection)
        }
        selectedData={selectedData}
        totalData={totalData}
        data={initialOrder as any}
        columns={Columns}
        actionIconColor="red"
        actions={{
          checkFn: (id: string, isChecked: boolean) =>
            action.checkFn && action.checkFn(id, isChecked),
          checkAllFn: (isCheckedAll: boolean) =>
            action.checkAllFn && action.checkAllFn(isCheckedAll),
        }}
        disableActions={false}
        loading={loading}
        bodyHeight={400}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(pageNumber: number) => onPageChange(pageNumber)}
        disableNoData={false}
        headStyle={{ width: "100%" }}
      />
    </div>
  );
};
