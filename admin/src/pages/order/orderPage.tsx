import { useEffect, useState } from "react";
import { Button, Modal } from "@/common";
import dayjs from "dayjs";
import { getUserByUid } from "@/helpers";
import toast from "react-hot-toast";
import {
  Invoice,
  InvoiceDocumentProp,
  handleDownloadCSV,
  OrderSearch,
} from "@/features";
import { Icons, useSocket, toaster } from "@/utils";
import Bell from "@/assets/order.mp3";
import { useAppSelector, usePaginateOrders } from "@/hooks";
import { customToast } from "@/common/toast/toast";
import { OrderTable } from "@/components";
import { updateOrderStatus, addNotification } from "@/services";
import { ApiError } from "@/helpers";

const OrderList = () => {
  const {
    isFilter,
    loading,
    pagination,
    setIsFilter,
    setPagination,
    setSortOrder,
    totalData,
    initialOrders,
    setInitialOrders,
    setHaveUser,
    haveUser,
  } = usePaginateOrders({
    direction: "next",
    pageSize: 20,
  });
  const [isExport, setIsExport] = useState<boolean>(true);
  const [exportSelectedOrder, setExportSelectedOrder] = useState<string[]>([]);
  const [resolvedOrders, setResolvedOrders] = useState<
    InvoiceDocumentProp["orders"]
  >([]);
  const store = useAppSelector();
  const { socket } = useSocket(store?.user?.success);

  const exportAllOrder = (isCheckedAll: boolean) => {
    if (!isCheckedAll) {
      return setExportSelectedOrder([]);
    }
    const selectedOrder_Ids = initialOrders?.map((order) => order.id);
    setExportSelectedOrder(selectedOrder_Ids as string[]);
  };

  const exportSelectedOrderFn = (id: string, isChecked: boolean) => {
    if (id && !isChecked) {
      return setExportSelectedOrder((prev) =>
        prev.filter((value) => value !== id)
      );
    }
    const selectedOrders = initialOrders?.filter((order) => order.id === id);
    const order_Ids = selectedOrders?.map((order) => order.id);
    if (selectedOrders.length === 0) return toast.error("Order not found");
    setExportSelectedOrder((prev) => [...prev, ...(order_Ids as string[])]);
  };

  useEffect(() => {
    const handleNewOrder = async (order: Ui.Order) => {
      // Assuming getFullName is asynchronous

      const user = await getUserByUid(order.uid as string);
      setInitialOrders((prev) => [
        {
          uid: order.uid,
          id: order.orderId as string,
          name: user?.fullName,
          image: user?.avatar as string,
          orderRequest: dayjs(order.orderRequest).format(
            "YYYY-MM-DD, h:mm A"
          ) as string,
          orderFullfilled: dayjs(order.orderFullfilled).format(
            "YYYY-MM-DD, h:mm A"
          ) as string,
          products: order.products as Ui.Product[],
          rank: 1,
          status: order?.status,
        },
        ...prev.map((o) => ({ ...o, rank: o.rank! + 1 })),
      ]);
      
      // Enhanced toast with actions
      customToast({
        orderId: order.orderId,
        products: order.products,
        orderRequest: order.orderRequest,
        name: user?.fullName as string,
        note: order.note as string,
        paymentMethod: order.paymentMethod,
      }, {
        onAccept: async (orderId: string) => {
          const toastLoader = toaster({
            icon: "loading",
            message: "Accepting order...",
          });
          
          try {
            const user = await getUserByUid(order.uid as string);
            const response = await updateOrderStatus({
              id: orderId,
              status: "preparing",
              price: order.products?.reduce(
                (productAcc, product) =>
                  productAcc + Number(product.price) * Number(product.quantity),
                0
              ),
              uid: order.uid as string,
              role: user?.role as Auth.UserRole,
            });
            
            if (response?.message) {
              toaster({
                className: "bg-green-50",
                icon: "success",
                message: response.message,
                title: "Order accepted successfully!",
              });
            }
          } catch (error) {
            if (error instanceof ApiError) {
              toaster({
                className: "bg-red-50",
                icon: "error",
                message: error?.message,
                title: "Error accepting order",
              });
            }
          } finally {
            toast.dismiss(toastLoader);
          }
        },
        onReject: async (orderId: string) => {
          const toastLoader = toaster({
            icon: "loading",
            message: "Rejecting order...",
          });
          
          try {
            const user = await getUserByUid(order.uid as string);
            const response = await updateOrderStatus({
              id: orderId,
              status: "cancelled",
              price: order.products?.reduce(
                (productAcc, product) =>
                  productAcc + Number(product.price) * Number(product.quantity),
                0
              ),
              uid: order.uid as string,
              role: user?.role as Auth.UserRole,
            });
            
            if (response?.message) {
              toaster({
                className: "bg-green-50",
                icon: "success",
                message: response.message,
                title: "Order rejected successfully!",
              });
            }
            
            // Send notification to user
            await addNotification({
              message: "Your order has been cancelled. Please contact customer support for assistance.",
              title: "Order Cancelled",
              uid: order.uid as string,
            });
          } catch (error) {
            if (error instanceof ApiError) {
              toaster({
                className: "bg-red-50",
                icon: "error",
                message: error?.message,
                title: "Error rejecting order",
              });
            }
          } finally {
            toast.dismiss(toastLoader);
          }
        },
        onView: (orderId: string) => {
          // Handle view order action - refresh the order list
          console.log("View order:", orderId);
          // The order list will automatically update since we're already on the order page
        },
      });
    };

    // Listen for the 'new_order' event
    socket?.on("new_order", handleNewOrder);

    // Cleanup listener when component unmounts
    return () => {
      socket?.off("new_order", handleNewOrder);
    };
  }, [setInitialOrders, socket]);

  useEffect(() => {
    const fetchOrders = async () => {
      const resolvedOrders = exportSelectedOrder.map((order) => {
        const matchedOrder = initialOrders?.find((od) => od.id === order);

        if (!matchedOrder) {
          return null;
        }

        return {
          orderDetails: {
            products: matchedOrder?.products,
            status: matchedOrder?.status,
          },
          customerDetails: {
            name: matchedOrder?.name as string,
            phoneNumber: matchedOrder.phoneNumber || "N/A", // Ensure correct type for phoneNumber
            userId: matchedOrder?.uid || "N/A",
          },
          invoiceData: {
            invoiceDate:
              dayjs(matchedOrder?.orderRequest).format("	MMM D, YYYY h:mm A") ||
              "N/A",
            invoiceNumber: order,
          },
        };
      });

      // Filter out null values and update the state
      setResolvedOrders(resolvedOrders as InvoiceDocumentProp["orders"]);
    };

    fetchOrders();
  }, [exportSelectedOrder, initialOrders]);

  return (
    <div className="flex flex-col items-start justify-center w-full gap-5 px-5 py-4 rounded-sm">
      <div className="flex sm:flex-row flex-col gap-3 items-end sm:items-center justify-between w-full pt-5">
        <div className="flex w-full text-start flex-col -space-y-1.5 items-start justify-center gap-1">
          <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
            All Orders
          </h4>
          <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
            {totalData || 0} entries found
          </p>
        </div>
        <div className="flex items-center justify-center gap-5 ">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() =>
                exportSelectedOrder.length > 0 &&
                store?.user?.userInfo?.role === "chef"
                  ? setIsExport(!isExport)
                  : exportSelectedOrder.length > 0 &&
                    store?.user.userInfo.role === "admin"
                  ? handleDownloadCSV({ orders: resolvedOrders })
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
              selectedCheck={[isFilter?.sortFilter?.id as string]}
              sortFn={(value) => setSortOrder(value)}
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
              sort={[
                { label: "Pending", value: "pending", id: "jfhkdj" },
                // {
                //   label: "Status",
                //   value: "status",
                //   id: "kfljdsfsdfkjk",
                // },
                {
                  label: "Completed",
                  value: "completed",
                  id: "kfljdsfsdf",
                },
              ]}
              checkFn={{
                checkSortFn: (isChecked, value, id) => {
                  if (!isChecked) {
                    return setIsFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: "", sort: "" },
                    }));
                  }
                  if (isChecked) {
                    setIsFilter((prev) => ({
                      ...prev,
                      sortFilter: { id: id, sort: value },
                    }));
                  }
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex sm:w-auto sm:flex-row flex-col items-start sm:items-start   justify-start gap-2.5 sm:gap-5 w-full px-1">
        <OrderSearch payload={(value) => setHaveUser(value)} />
        <div className=" w-full flex  gap-3 items-center justify-start">
          {haveUser?.fullName && (
            <div className="flex  items-center rounded-md border-[1px] border-[var(--dark-border)]  justify-between px-1 gap-2 py-1  ">
              <div className="flex  items-center justify-center">
                <span className=" min-w-11  text-[15px] text-[var(--dark-secondary-text)] ">
                  {haveUser?.fullName}
                </span>
              </div>
              <button onClick={() => setHaveUser({})} className=" ">
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
          {isFilter?.sortFilter?.sort && (
            <div className="flex items-center rounded-md border-[1px] border-[var(--dark-border)]  justify-between px-1 gap-2 py-1  ">
              <div className="flex  items-center justify-center">
                <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                  {isFilter.sortFilter.sort &&
                    isFilter.sortFilter.sort.charAt(0).toUpperCase() +
                      isFilter?.sortFilter?.sort.slice(1).toLocaleLowerCase()}
                </span>
              </div>
              <button
                onClick={() =>
                  setIsFilter((prev) => ({
                    ...prev,
                    sortFilter: { id: "", sort: "" },
                  }))
                }
                className=" "
              >
                <Icons.close className="text-[var(--danger-text)] " size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <OrderTable
        handlePageDirection={(pageDirection) =>
          setPagination((prev) => ({ ...prev, pageDirecton: pageDirection }))
        }
        selectedData={exportSelectedOrder}
        action={{
          checkAllFn: (isChecked: boolean) => exportAllOrder(isChecked),
          checkFn: (id: string, isChecked: boolean) =>
            exportSelectedOrderFn(id, isChecked),
        }}
        totalData={(totalData as number) || 1}
        pagination={{
          currentPage: pagination.currentPage,
          perPage: pagination.perPage,
        }}
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, currentPage: page }))
        }
        orders={initialOrders}
        loading={loading}
      />
      {!isExport && exportSelectedOrder.length > 0 && (
        <Modal
          close={isExport}
          isExport={true}
          closeModal={() => setIsExport(!isExport)}
        >
          <Invoice orders={resolvedOrders} />
        </Modal>
      )}
    </div>
  );
};

export default OrderList;
