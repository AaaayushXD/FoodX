import React, { useEffect, useState } from "react";
import { Modal } from "@/common";
import { CreateTicket } from "@/features";
import { getTickets } from "@/services/ticket";
import TicketLogo from "@/assets/tickets.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { RotatingLines } from "react-loader-spinner";
import { Empty } from "@/common";
import { useAppSelector } from "@/hooks";
import { Ticket } from "@/components";
import { Skeleton } from "@/helpers";
import { Icons } from "@/utils";

const TicketPage: React.FC = () => {
  const [ticketState, setTicketState] =
    useState<Common.TicketStatus>("pending");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalData, setTotalData] = useState<number>(0);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Ui.TicketType[]>([]);
  const [currentDoc, setCurrentDoc] = useState<{
    currentFirstDoc: string;
    currentLastDoc: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const store = useAppSelector();

  const fetchTickets = async (
    data: Api.FetchPaginate<keyof Ui.TicketType, Common.TicketStatus, "">
  ) => {
    setLoading(true);
    try {
      const tickets = (await getTickets({
        pageSize: data.pageSize,
        direction: data.direction,
        sort: data.sort,
        currentFirstDoc: data.currentFirstDoc || null,
        currentLastDoc: data.currentLastDoc || null,
        status: data.status,
        uid: store?.user?.userInfo?.uid as string,
      })) as {
        tickets: Ui.TicketType[];
        currentFirstDoc: string;
        currentLastDoc: string;
        length: number;
      };
      setCurrentDoc({
        currentFirstDoc: tickets.currentFirstDoc,
        currentLastDoc: tickets.currentLastDoc,
      });

      if (tickets.tickets.length < data.pageSize) {
        setHasMore(false); // If fewer logs are returned than requested, stop infinite scrolling.
      }

      setTotalData((prev) => prev + tickets.tickets.length);

      setTickets(tickets.tickets);
    } catch (error) {
      setTickets([]);
      throw new Error("Unable to fetch tickets" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets({
      direction: "next",
      pageSize: 5,
      sort: "asc",
      currentFirstDoc: null,
      currentLastDoc: null,
      status: ticketState || "pending",
    });
  }, [ticketState, isRefresh]);

  useEffect(() => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500
    ) {
      const fetchNextPage = async () => {
        try {
          const response = (await getTickets({
            direction: "next",
            pageSize: 5,
            sort: "desc",
            currentFirstDoc: currentDoc?.currentFirstDoc,
            currentLastDoc: currentDoc?.currentLastDoc,
            status: ticketState,
          })) as {
            tickets: Ui.TicketType[];
            currentFirstDoc: string;
            currentLastDoc: string;
            length: number;
          };
          if (response.tickets.length < 5) {
            setHasMore(false);
          }

          setTickets((prev) => [
            ...prev,
            ...response.tickets.filter((ticket) =>
              prev.some((data) => data.id !== ticket.id)
            ),
          ]);

          setCurrentDoc({
            currentFirstDoc: response.currentFirstDoc,
            currentLastDoc: response.currentLastDoc,
          });
        } catch (error) {
          setTickets([]);
          console.log(
            "Error while fetching tickets => ticket.chef.page" + error
          );
        }
      };
      fetchNextPage();
    }
  }, []);

  const TicketComponents = {
    pending: <Ticket title="Pending" prop={tickets} loading={loading} />,
    progress: <Ticket title="Progress" prop={tickets} loading={loading} />,
    resolved: <Ticket title="Resolved" prop={tickets} loading={loading} />,
    cancelled: <Ticket title="Cancelled" prop={tickets} loading={loading} />,
  };
  const component = ticketState && TicketComponents[ticketState];

  return (
    <div className="flex flex-col w-full items-start justify-center px-4 py-5 gap-7">
      <div className="flex items-center justify-between w-full px-5">
        <h1 className="text-[25px] brightness-125 contrast-125 font-[600] text-[var(--dark-text)] ">
          Tickets
        </h1>
        <button
          onClick={() => setCloseModal(!closeModal)}
          className="flex items-center gap-2 justify-center bg-[var(--primary-color)] text-white py-[0.4rem] border-[1px] border-[var(--primary-color)] px-4 rounded"
        >
          <Icons.plus className="size-5" />
          <span className="tex-[16px] tracking-wider "> New Ticket</span>
        </button>
        <Modal
          close={closeModal}
          children={<CreateTicket close={() => setCloseModal(!closeModal)} />}
          closeModal={() => setCloseModal(!closeModal)}
        />
      </div>
      <div className="grid  w-full grid-cols-4 gap-2 px-5 pt-10 sm:gap-6">
        <button
          onClick={() => setTicketState("pending")}
          className={`${
            ticketState === "pending"
              ? "bg-[var(--primary-dark)]"
              : "bg-[var(--primary-light)]  "
          } py-3 hover:bg-[var(--primary-dark)]  sm:text-[15px] text-sm duration-150   font-[500] contrast-150 rounded text-white`}
        >
          Pending
        </button>
        <button
          onClick={() => setTicketState("progress")}
          className={` py-3 sm:text-[15px] hover:bg-[#bb8115]   duration-150 text-sm  font-[500] contrast-150 rounded text-white ${
            ticketState === "progress"
              ? "bg-[#bb8115] "
              : "bg-[var(--orange-bg)]"
          } `}
        >
          Progress
        </button>
        <button
          onClick={() => setTicketState("resolved")}
          className={`py-3 sm:text-[15px] hover:bg-[#287e28fd] duration-150   ${
            ticketState === "resolved"
              ? "bg-[#287e28fd]"
              : "bg-[var(--green-bg)] "
          }  text-sm  font-[500] contrast-150 rounded text-white `}
        >
          Resolve
        </button>
        <button
          onClick={() => setTicketState("cancelled")}
          className={`py-3 hover:bg-[#a82d2dfd] sm:text-[15px] duration-150  ${
            ticketState === "cancelled"
              ? "bg-[#a82d2dfd]"
              : " bg-[var(--danger-bg)] "
            }  text-sm  font-[500] contrast-150 rounded text-white `}
        >
          Reject
        </button>
      </div>
      {/* Employee Card */}
      <div
        id="ticketScrollable"
        className="w-full py-6 h-full overflow-auto   scrollbar-custom px-5 "
      >
        <div className="w-full h-[400px] ">
          {loading ? (
            <Skeleton
              children={{
                className: " w-full h-[200px] rounded-lg ",
              }}
              className=" w-full h-full flex flex-col items-start justify-start gap-3 "
              count={2}
            />
          ) : tickets.length <= 0 ? (
            <Empty
              loading={loading}
              actionText="Refresh ticket"
              parent={TicketLogo}
              style={{ width: "15rem", height: "12rem" }}
              action={() => setIsRefresh(!isRefresh)}
              children={`No ${ticketState}  tickets available`}
            />
          ) : (
            <InfiniteScroll
              scrollableTarget={"ticketScrollable"}
              loader={
                <div className="w-full flex flex-col items-center pt-3 justify-center ">
                  {/* <Skeleton height={70} count={5} /> */}
                  <div className="flex items-center justify-center gap-3">
                    <RotatingLines strokeColor="var(--dark-text)" width="27" />
                    <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                      {" "}
                      loading...
                    </span>
                  </div>
                </div>
              }
              hasMore={hasMore}
              next={() => {
                fetchTickets({
                  direction: "next",
                  pageSize: 5,
                  sort: "asc",
                  currentFirstDoc: currentDoc?.currentFirstDoc,
                  currentLastDoc: currentDoc?.currentLastDoc,
                });
              }}
              dataLength={totalData}
            >
              {component}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
