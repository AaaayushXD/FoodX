import React, { useEffect, useRef, useState } from "react";
import { aggregateTickets } from "@/helpers";
import { Modal, Button, Table } from "@/common";
import { addNotification, getTickets, updateTicket } from "@/services";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { Icons } from "@/utils";
import { TicketView } from "@/components";

export const TicketAdminPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ui.TicketType[]>([]);
  const [totalData, setTotalData] = useState<number>();
  const [pagination, setPagination] = useState<{
    currentPage: number;
    perPage: number;
    pageDirection?: "prev" | "next";
  }>({ currentPage: 1, perPage: 10 });
  const [filter, setFilter] = useState<{
    id: string;
    sort?: Common.TicketStatus | undefined;
  }>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [id, setId] = useState<string>();
  const [isView, setIsView] = useState<boolean>(true);
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false);

  const Columns: Common.ColumnProps[] = [
    {
      fieldName: "Name",
      colStyle: { width: "200px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.TicketType) => (
        <div className="w-[200px] text-[var(--dark-text)] tracking-wide  flex items-center justify-start gap-3 ">
          <span>
            {" "}
            {(value.name &&
              value?.name?.charAt(0).toUpperCase() + value?.name?.slice(1)) ||
              "User"}
          </span>
        </div>
      ),
    },
    {
      fieldName: "Category",
      colStyle: {
        width: "200px",
        justifyContent: "start",
        textAlign: "start",
        padding: "0px 15px 0px 0px",
      },
      render: (value: Ui.TicketType) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[200px] ">
          <p>{value.category}</p>
        </div>
      ),
    },
    {
      fieldName: "Created At",
      colStyle: { width: "180px", justifyContent: "start", textAlign: "start" },
      render: (value: Ui.TicketType) => (
        <div className=" text-[var(--dark-text)] tracking-wide w-[180px] ">
          <p>{value.date}</p>
        </div>
      ),
    },
    {
      fieldName: "Status",
      colStyle: { width: "150px", textAlign: "start" },
      render: (item: Ui.TicketType) => (
        <div
          onClick={() => {
            setId(item.id);
            setIsChangeStatus(true);
          }}
          className={`text-[var(--dark-text)]  cursor-pointer flex items-center justify-start gap-2 tracking-wide w-[150px]   text-start `}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              item.status === "pending"
                ? "bg-[var(--pending)] "
                : item.status === "progress"
                ? "bg-[var(--preparing)] "
                : item.status === "rejected"
                ? "bg-[var(--cancelled)]"
                : item.status === "resolved"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></div>
          <p>{item.status?.charAt(0).toUpperCase() + item.status!.slice(1)}</p>
          <div className="absolute lg:left-[45rem] md:left-[30rem] left-[15rem] sm:left-[30rem] z-[1000]">
            {" "}
            {isChangeStatus && id === item.id && (
              <TicketStautusChanger
                isChangeStatus={() => setIsChangeStatus(false)}
                status={item.status!}
                statusFn={(newStatus: Common.TicketStatus) =>
                  updateTicketFn(newStatus)
                }
              />
            )}
          </div>
        </div>
      ),
    },
  ];

  const queryClient = useQueryClient();

  const updateTicketFn = async (newStatus: Common.TicketStatus) => {
    const messages = {
      pending: {
        message: "Your ticket is pending. We'll get back to you shortly.",
        title: "Ticket Pending",
      },
      progress: {
        message: "We're working on your issue. Stay tuned for updates!",
        title: "Ticket In Progress",
      },
      resolved: {
        message: "Your issue has been resolved. Thanks for your patience!",
        title: "Ticket Resolved",
      },
      rejected: {
        message:
          "Unfortunately, your ticket was rejected. Please contact support for details.",
        title: "Ticket Rejected",
      },
    };
    const loading = toast.loading("Updating...");
    try {
      await updateTicket({ id: id as string, newStatus: newStatus });
      const { message, title } = messages[newStatus];
      const findTicket = tickets?.find((ticket) => ticket.id === id);
      await addNotification({
        message: message,
        title: title,
        uid: findTicket?.uid as string,
      });
    } catch (error) {
      toast.error("Something went wrong, please try after 2 mins");
    }
    const updateTickets = tickets?.map((ticket) => {
      if (ticket.id === id) {
        return { ...ticket, status: newStatus };
      } else {
        return ticket; // Always return the ticket, modified or not
      }
    });
    setTickets(updateTickets as Ui.TicketType[]);
    toast.dismiss(loading);
  };

  const fetchTickets = async ({
    direction,
    pageSize,
    sort,
    currentFirstDoc,
    currentLastDoc,
    status,
  }: Api.FetchPaginate<keyof Ui.TicketType, Common.TicketStatus, "">) => {
    setLoading(true);
    try {
      const response = (await getTickets({
        direction: direction,
        pageSize: pageSize,
        sort: sort,
        currentFirstDoc: currentFirstDoc,
        currentLastDoc: currentLastDoc,
        status: status,
      })) as {
        tickets: Ui.TicketType[];
        currentFirstDoc: string;
        currentLastDoc: string;
        length: number;
      };

      setCurrentDoc({
        currentFirstDoc: response.currentFirstDoc,
        currentLastDoc: response.currentLastDoc,
      });
      setTotalData(response.length);
      const allTicket = await aggregateTickets(response.tickets, queryClient);
      setTickets(allTicket);
    } catch (error) {
      setTickets([]);
      console.log(`Error while fetching tickets => admin-ticket` + error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets({
      pageSize: pagination.perPage,
      sort: (sortOrder as "asc" | "desc") || "asc",
      direction: "next",
      currentFirstDoc: null,
      currentLastDoc: null,
      status: filter?.sort || undefined,
    });
  }, [sortOrder, filter?.sort, pagination.perPage]);

  useEffect(() => {
    if (pagination.currentPage > 1 && pagination.pageDirection) {
      const fetchNextPage = async () => {
        setLoading(true);
        try {
          const response = (await getTickets({
            pageSize: pagination.perPage,
            sort: (sortOrder as "asc" | "desc") || "asc",
            direction: pagination.pageDirection || "next",
            currentFirstDoc: currentDoc?.currentFirstDoc || null,
            currentLastDoc: currentDoc?.currentLastDoc || null,
            status: filter?.sort || undefined,
          })) as {
            tickets: Ui.TicketType[];
            currentFirstDoc: string;
            currentLastDoc: string;
            length: number;
          };
          setCurrentDoc({
            currentFirstDoc: response.currentFirstDoc,
            currentLastDoc: response.currentLastDoc,
          });
          setTotalData(response.length);
          const allTicket = await aggregateTickets(
            response.tickets,
            queryClient
          );
          setTickets(allTicket);
        } catch (error) {
          setTickets([]);
          console.log(`Error while fetching tickets => admin-ticket` + error);
        }
        setLoading(false);
      };
      fetchNextPage();
    }
  }, [
    pagination.currentPage,
    pagination.pageDirection,
    pagination.perPage,
    sortOrder,
    filter?.sort,
  ]);

  const findTicket =
    !isView && id && tickets?.find((ticket) => ticket.id === id);

  return (
    <div className="w-full px-3 py-10">
      <div className="w-full flex items-start justify-between">
        <div className="flex sm:flex-row flex-col items-end justify-center gap-2   sm:gap-10">
          <div className="flex flex-col -space-y-1.5 items-start justify-center gap-1">
            <h4 className="text-[1.25rem] font-[600] tracking-wider text-[var(--dark-text)]">
              All Tickets
            </h4>
            <p className="text-[15px] tracking-wider text-[var(--dark-secondary-text)] text-nowrap ">
              {totalData || 0} entries found
            </p>
          </div>
          <div className="flex items-center justify-start gap-2">
            {filter?.sort && (
              <div className="flex px-2 py-0.5  gap-3 border-[var(--dark-secondary-text)]  items-center rounded border  justify-start">
                <div className="flex gap-1 items-center justify-center">
                  <span className="  text-[15px] text-[var(--dark-secondary-text)] ">
                    {filter.sort &&
                      filter.sort.charAt(0).toUpperCase() +
                        filter.sort.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => setFilter({ id: "", sort: undefined })}
                  className=" "
                >
                  <Icons.close
                    className="text-[var(--danger-text)] "
                    size={20}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
        <Button
          selectedCheck={[filter?.id as string]}
          sortFn={(value: "asc" | "desc") => setSortOrder(value)}
          bodyStyle={{
            width: "400px",
            top: "3.5rem",
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
            { label: "Pending", value: "pending", id: "fklsdjf" },
            { label: "Progress", value: "progress", id: "fkjdls" },
            {
              label: "Resolved",
              value: "resolved",
              id: "sarojgtkxwkhabar",
            },
            {
              label: "Rejected",
              value: "rejected",
              id: "kirangt3owijf",
            },
          ]}
          checkFn={{
            checkSortFn: (isChecked, value, id) => {
              if (!isChecked) return setFilter({ id: "", sort: undefined });
              setFilter({ id: id, sort: value });
            },
          }}
        />
      </div>

      <div className=" py-6">
        <Table
          handlePageDirection={(pageDirection) =>
            setPagination((prev) => ({ ...prev, pageDirection: pageDirection }))
          }
          loading={loading}
          columns={Columns}
          data={tickets as Ui.TicketType[]}
          totalData={totalData as number}
          actions={{
            viewFn: (id: string) => {
              setId(id);
              setIsView(false);
            },
          }}
          pagination={{
            perPage: pagination.perPage,
            currentPage: pagination.currentPage,
          }}
          onPageChange={(value) =>
            setPagination((prev) => ({ ...prev, currentPage: value }))
          }
          bodyHeight={400}
          headStyle={{ width: "100%" }}
        />
      </div>
      {!isView && id && (
        <Modal
          children={<TicketView item={findTicket as Ui.TicketType} />}
          close={isView}
          closeModal={() => setIsView(!isView)}
        />
      )}
    </div>
  );
};

interface StatusChangerProp {
  status: Common.TicketStatus;
  statusFn: (status: Common.TicketStatus, id?: string) => void;
  isChangeStatus: () => void;
}

export const TicketStautusChanger: React.FC<StatusChangerProp> = ({
  status,
  statusFn,
  isChangeStatus,
}) => {
  const [showModal, setShowModal] = useState(true);

  const reference = useRef<HTMLDivElement>();
  const Status = ["progress", "resolved", "pending", "rejected"];

  const updateStatus = Status.filter((sts) => sts !== status);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        reference.current &&
        !reference.current?.contains(event.target as any)
      ) {
        setShowModal(false);
        isChangeStatus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [status, isChangeStatus]);

  return (
    <div
      ref={reference as any}
      className={`w-full flex p-1 duration-200 flex-col bg-[var(--light-foreground)] border-[1px] border-[var(--dark-border)] shadow rounded-lg items-center ${
        showModal ? "visible" : "invisible"
      } `}
    >
      {updateStatus.map((status, index) => (
        <button
          className={`w-[150px] flex items-center tracking-wider gap-3 justify-start py-1.5 px-5 duration-150 hover:bg-[var(--light-background)] rounded-lg `}
          onClick={() => statusFn(status as Common.TicketStatus)}
          key={index}
        >
          <span
            className={` w-2 rounded-full h-2 ${
              status === "pending"
                ? "bg-[var(--pending)] "
                : status === "progress"
                ? "bg-[var(--preparing)] "
                : status === "rejected"
                ? "bg-[var(--cancelled)]"
                : status === "resolved"
                ? "bg-[var(--completed)] "
                : ""
            } `}
          ></span>
          <span> {status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </button>
      ))}
    </div>
  );
};
