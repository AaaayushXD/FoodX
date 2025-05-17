import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import React, { ChangeEvent, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line @typescript-eslint/no-namespace

export function Table<T extends { id: string }>({
  data,
  columns,
  actionIconColor,
  actions,

  disableActions,

  loading,
  onPageChange,
  selectedData,
  totalData,
  pagination = { perPage: 5, currentPage: 1 },
  handlePageDirection,
}: Common.TableModalProps<T>): React.ReactElement {

  
  const [currentPage, setCurrentPage] = useState<number>(
    pagination.currentPage as number
  );
  const [currentData, setCurrentData] = useState<any[]>();

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

  return (
    <div className="w-full flex items-center justify-center text-gray-400 border-collapse overflow-auto rounded ">
      <table className="w-full relative border-collapse max-w-[1500px] flex flex-col items-center justify-center  gap-2">
        <thead className="w-full px-2 bg-[var(--light-background)] ">
          <tr className="w-full  flex justify-start gap-5 items-center overflow-auto  ">
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
                className="flex items-center  justify-center font-bold  py-5 "
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
              <th className="w-[200px] text-start">View</th>
            )}
          </tr>
        </thead>

        <tbody className="w-full overflow-auto flex items-start justify-start flex-col flex-nowrap">
          {loading ? (
            <tr className="w-full">
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
              <Skeleton
                height={100}
                baseColor="var(--light-background)"
                highlightColor="var(--light-foreground)"
                count={1}
              />
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
              {currentData && currentData?.length <= 0 ? (
                <tr className="flex w-full flex-col items-center justify-center p-10">
                  <td className="text-[24px] text-[var(--dark-text)] mb-4">
                    No Data Found
                  </td>
                  <td className="text-[16px] text-[var(--dark-secondary-text)] mb-6">
                    We couldn't find any data to display here.
                  </td>
                  <td
                    className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md hover:bg-[var(--primary-light)]"
                    onClick={() => window.location.reload()} // Replace with a function to fetch data if needed
                  >
                    Refresh
                  </td>
                </tr>
              ) : (
                currentData &&
                currentData.map((item, index) => (
                  <tr
                    className={`border-b-[1px] overflow-x-auto overflow-y-clip border-[var(--dark-border)]  px-2 py-5  hover:bg-[var(--light-background)]   w-full flex items-center justify-start gap-5  flex-nowrap`}
                    key={(item?.id ? item.id : item?.uid) || index}
                  >
                    {!!actions?.checkFn && !disableActions && (
                      <th className="w-[30px]">
                        <input
                          checked={selectedData?.includes(item?.id)}
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            actions.checkFn &&
                              actions.checkFn(
                                item.id || item.uid,
                                event.target.checked
                              );
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
                          actions?.editFn &&
                            actions?.editFn(item.id ? item.id : item.uid);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-light)] justify-center p-2 px-3  rounded-lg tracking-wide text-[var(--light-text)] dark:text-[var(--dark-text)] gap-2">
                          <FaEdit />
                          <td className="text-[16px]  tracking-wide">
                            Edit
                          </td>
                        </div>
                      </td>
                    )}
                    {!!actions?.deleteFn && !disableActions && (
                      <td
                        className="w-[100px]"
                        onClick={() => {
                          actions?.deleteFn &&
                            actions?.deleteFn(item.id ? item.id : item.uid);
                        }}
                      >
                        <div className="flex  items-center bg-[var(--danger-bg)] cursor-pointer hover:bg-[var(--danger-text)] justify-start p-2  px-3 rounded-lg tracking-wide dark:text-[var(--dark-text)] text-[var(--light-text)] gap-2">
                          <FaTrash />
                          <td className="text-[16px]  tracking-wide ">
                            Delete
                          </td>
                        </div>
                      </td>
                    )}
                    {!!actions?.viewFn && !disableActions && (
                      <td
                        className="w-[120px]"
                        onClick={() => {
                          actions?.viewFn &&
                            actions?.viewFn(item.id ? item.id : item.uid);
                        }}
                      >
                        <div
                          className="w-full rounded-lg cursor-pointer hover:bg-[var(--danger-text)] duration-150 font-semibold bg-[var(--danger-bg)] p-2 flex items-center justify-center gap-3"
                          style={{
                            color: actionIconColor ? actionIconColor : "white",
                          }}
                        >
                          <FaEye className=" size-5 " />
                          <td className="text-[15px] text-white ">View</td>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </>
          )}
        </tbody>

        <tfoot className="w-full flex justify-end py-3">
          <tr>
            <td>
              <Pagination
                handlePageDirection={(pageDirection) =>
                  handlePageDirection && handlePageDirection(pageDirection)
                }
                totalData={totalData || 0}
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
}


