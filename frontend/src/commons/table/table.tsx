import React, { ChangeEvent, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Empty from "@/assets/empty.png";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/utils";
import { Pagination } from "@/commons";
import { Empty as EmptyComponent } from "../index";

export const Table = <T extends { id: string }>({
  data,
  columns,
  actionIconColor,
  actions,
  disableActions,
  loading,
  onPageChange,
  selectedData,
  totalData,
  pagination = { perPage: 2, currentPage: 1 },
  handlePageDirection,
}: Common.TableModalProps<T>): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage as number
  );
  const [currentData, setCurrentData] = useState<any[]>();

  const navigate = useNavigate();

  useEffect(() => {
    const startIndex = ((currentPage || 1) - 1) * (pagination?.perPage || 2);
    const endIndex = startIndex + (pagination?.perPage || 2);
    const paginateData = data?.slice(startIndex, endIndex) as any;
    setCurrentData(paginateData);
  }, [pagination.currentPage, pagination.perPage, data, currentPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const isCheckedData = selectedData?.map((data) => data.id);

  return (
    <div className="w-full flex items-center justify-center text-gray-400 border-collapse overflow-auto rounded ">
      <table className="w-full relative border-collapse max-w-[1500px] flex flex-col items-center justify-center  gap-2">
        <thead className="w-full px-2 bg-[var(--light-background)] ">
          <tr className="w-full  flex justify-start gap-[2.5rem] items-center overflow-auto  ">
            {!!actions?.checkFn && !disableActions && (
              <th className="w-[30px]">
                <input
                  onChange={(event) => {
                    if (!actions.checkAllFn) return;
                    actions.checkAllFn(event.target.checked);
                  }}
                  className="w-4 accent-slate-900 h-4 cursor-pointer"
                  type="checkbox"
                />
              </th>
            )}
            {columns.map((item, index) => (
              <th
                className="flex items-center sm:text-[14px] text-sm  justify-center font-bold  py-5 "
                key={index}
              >
                {typeof item.fieldName === "string" ? (
                  <div style={item.colStyle}> {item.fieldName}</div>
                ) : React.isValidElement(item.fieldName) ? (
                  item.fieldName
                ) : (
                  ""
                )}
              </th>
            ))}
            {!!actions?.editFn && !disableActions && (
              <th className="w-[100px]"></th>
            )}
            {!!actions?.deleteFn && !disableActions && (
              <th className="w-[100px]"></th>
            )}
            {!!actions?.viewFn && !disableActions && (
              <th className="w-[100px]">View</th>
            )}
          </tr>
        </thead>
        <tbody
          className="w-full flex items-center justify-evenly flex-col flex-nowrap"
          style={{
            overflow: "auto",
          }}
        >
          {loading ? (
            <tr className="w-full ">
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={80}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={3}
              />
            </tr>
          ) : (
            <>
              {currentData && currentData?.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    className=" border-b-[1px] border-[var(--dark-border)]  px-2 py-6 hover:bg-[var(--light-background)] overflow-auto  w-full flex items-center justify-start gap-[2.5rem] flex-nowrap"
                    key={(item?.id && item.id) || index}
                  >
                    {!!actions?.checkFn && !disableActions && (
                      <th className="w-[30px]">
                        <input
                          checked={isCheckedData?.includes(item.id)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            actions.checkFn &&
                              actions.checkFn(item.id, event.target.checked);
                          }}
                          className="w-4 h-4 accent-slate-900 cursor-pointer"
                          type="checkbox"
                        />
                      </th>
                    )}
                    {columns?.map(({ render }, index) => (
                      <td className="table-body-content" key={index}>
                        {render ? render(item) : "Default"}
                      </td>
                    ))}
                    {!!actions?.editFn && !disableActions && (
                      <td
                        className="w-[100px]"
                        onClick={() => {
                          actions?.editFn && actions?.editFn(item.id);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-light)] justify-center p-2 px-3  rounded-lg tracking-wide text-[var(--light-text)] dark:text-[var(--dark-text)] gap-2">
                          <Icons.edit />
                          <p className="text-[16px]  tracking-wide">Edit</p>
                        </div>
                      </td>
                    )}
                    {!!actions?.orderFn && !disableActions && (
                      <td
                        className="w-[90px] "
                        onClick={() => {
                          actions?.orderFn && actions?.orderFn(item.id);
                        }}
                      >
                        <div className=" flex group/data   text-white duration-150 hover:bg-[var(--primary-dark)]  cursor-pointer items-center  px-2 justify-center gap-2 rounded-lg py-1.5 bg-[var(--primary-color)]  ">
                          <Icons.redo
                            className=" text-[var(--dark-text)] size-3 sm:size-6  duration-200 "
                            color="white"
                            strokeWidth={1}
                          />
                          <p className="sm:text-[14px] text-xs ">Order</p>
                        </div>
                      </td>
                    )}
                    {!!actions?.downloadFn && !disableActions && (
                      <td
                        className="flex  w-[90px] hover:bg-[var(--body-bg)] duration-150 cursor-pointer border-[1px] border-[var(--dark-border)] px-2 py-1.5 rounded-lg items-center gap-2"
                        onClick={() => {
                          actions?.downloadFn && actions?.downloadFn(item.id);
                        }}
                      >
                        <div className=" text-[var(--dark-secondary-text)] border-none">
                          <Icons.download
                            className="text-[var(--dark-secondary-text)] size-4 sm:size-6 "
                            style={{ border: "none" }}
                            strokeWidth={2}
                          />
                        </div>
                        <p className=" text-xs sm:text-[14px] tracking-wide ">
                          Export
                        </p>
                      </td>
                    )}
                    {!!actions?.viewFn && !disableActions && (
                      <td
                        className="table-body-content"
                        onClick={() => {
                          actions?.viewFn && actions?.viewFn(item.id);
                        }}
                      >
                        <div
                          className="table-body-content-btns"
                          style={{
                            color: actionIconColor ? actionIconColor : "red",
                          }}
                        >
                          <Icons.eyeOpen />
                          <p className="text-sm text-[var(--dark-text)] ">
                            View
                          </p>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <EmptyComponent
                  title={"No orders found"}
                  image={Empty}
                  action={() => navigate("#categories")}
                  actionTitle="Browse Categories"
                  description="   It looks like you haven't placed any orders."
                />
              )}
            </>
          )}
        </tbody>
        <tfoot className="w-full flex justify-end py-3">
          <tr>
            <td className="w-full ">
              <Pagination
                handlePageDirection={(pageDirecton) =>
                  handlePageDirection(pageDirecton)
                }
                totalData={totalData}
                perPage={pagination?.perPage || 2}
                currentPage={currentPage || 1}
                onChange={handlePageChange}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
