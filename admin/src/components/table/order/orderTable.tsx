import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UpdateStatus } from "@/features";
import { addNotification, updateOrderStatus } from "@/services";
import { Icons, toaster } from "@/utils";
import { Table } from "@/common";
import { getUserByUid } from "@/helpers";
import { Modal } from "@/common/popUp/Popup";
import { CreditCard } from "lucide-react";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentImage, setSelectedPaymentImage] = useState<string>("");

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
        <div className=" !p-0 w-[100px]   relative cursor-pointer group/id text-start ">
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
      fieldName:"Pre-order",
      colStyle: {width:"100px",justifyContent:"start",textAlign:"start"},
      render: (item: Ui.OrderModal) => (
        <div className=" w-[100px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{item?.note ? item.note.replace(/^Preorder Time: /, '') : "No"}</span>
        </div>
      ),
    },
    {
      fieldName:"Payment Method",
      colStyle: {width:"150px",justifyContent:"start",textAlign:"start"},
      render: (item: Ui.OrderModal) => (
        <div className=" w-[150px] flex flex-col items-start justify-center text-[var(--dark-text)] ">
          <span>{ item?.paymentMethod ? item?.paymentMethod?.charAt(0).toUpperCase() + item?.paymentMethod?.slice(1) : "N/A"}</span>
        </div>
      ),
    },
    {
      fieldName: "Payment Image",
      colStyle: { width: "120px", justifyContent: "start", textAlign: "start" },
      render: (item: Ui.OrderModal) => (
        <div className="w-[120px] flex items-center justify-start">
          {item?.paymentMethod === "online" && item?.paymentImage ? (
            <div className="relative group">
              <img
                src={import.meta.env.VITE_API_URL_ASSETS + item.paymentImage}
                alt="Payment confirmation"
                className="h-8 w-8 rounded border border-[var(--dark-border)] object-cover cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  setSelectedPaymentImage(item.paymentImage as string);
                  setShowPaymentModal(true);
                }}
              />
            </div>
          ) : (
            <span className="text-[var(--dark-secondary-text)] text-sm">N/A</span>
          )}
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
        actions={
          {
            checkFn: (id: string, isChecked: boolean) => {
              setSelectedId(id);
              action.checkFn?.(id, isChecked);
            },
            checkAllFn: (isChecked: boolean,) => {
              action.checkAllFn?.(isChecked);
            },
          }
        }
        actionIconColor="red"
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

      {/* Payment Image Modal */}
      {showPaymentModal && (
        <Modal close={false} closeModal={() => setShowPaymentModal(false)}>
          <div className="max-w-4xl max-h-[90vh] p-0">
            <div className="p-6 pb-2">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--dark-text)]">
                <CreditCard className="h-5 w-5" />
                Payment Confirmation
              </h2>
            </div>
            <div className="border-t border-[var(--dark-border)]" />
            <div className="p-6 pt-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative max-w-full h-[60vh] overflow-hidden rounded-lg border border-[var(--dark-border)]">
                  <img
                    src={import.meta.env.VITE_API_URL_ASSETS + selectedPaymentImage}
                    alt="Payment confirmation"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 rounded border border-[var(--dark-border)] text-[var(--dark-text)] hover:bg-[var(--light-background)] transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => window.open(import.meta.env.VITE_API_URL_ASSETS + selectedPaymentImage, "_blank")}
                    className="px-4 py-2 rounded bg-[var(--primary-color)] text-white hover:bg-[var(--primary-light)] transition-colors"
                  >
                    Open Full Size
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
