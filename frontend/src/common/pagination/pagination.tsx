import { Icons } from "@/utils";
import React from "react";
import { useNavigate } from "react-router-dom";

interface PaginationProps {
  totalData: number;
  perPage: number;
  currentPage: number;
  onChange: (page: number) => void;
  style?: React.CSSProperties;
  className?: string;
  navigateTo?: string;
  handlePageDirection: (pageDirection: "next" | "prev") => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalData,
  perPage = 5,
  currentPage = 1,
  onChange,
  className,
  style,
  navigateTo = "page",
  handlePageDirection,
}) => {
  const totalPages = Math.ceil(totalData / perPage);
  const navigate = useNavigate();

  // const getRange = () => {
  //   const siblingCount = 1;
  //   const totalPageNumbers = siblingCount + 5;

  //   if (totalPages <= totalPageNumbers) {
  //     return range(1, totalPages);
  //   }

  //   const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  //   const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  //   const showLeftDots = leftSiblingIndex > 2;
  //   const showRightDots = rightSiblingIndex < totalPages - 1;

  //   if (!showLeftDots && showRightDots) {
  //     const leftCount = 1 + 2 * siblingCount;
  //     const leftRange = range(1, leftCount);
  //     return [...leftRange, "...", totalPages];
  //   }

  //   if (showLeftDots && !showRightDots) {
  //     const rightCount = 1 + 2 * siblingCount;
  //     const rightRange = range(totalPages - rightCount + 1, totalPages);
  //     return [1, "...", ...rightRange];
  //   }

  //   if (showLeftDots && showRightDots) {
  //     const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  //     return [1, "...", ...middleRange, "...", totalPages];
  //   }
  // };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange(page);
      navigate(`?${navigateTo}=${page}`);
    }
  };
  // const renderPageNumbers = () => {
  //   const pageNumbers: any[] = [];
  //   const pages = getRange();
  //   pages?.forEach((page, index) => {
  //     pageNumbers.push(
  //       <button
  //         key={index}
  //         className={`px-3 py-1 duration-150 rounded text-[var(--dark-text)] hover:text-[var(--dark-text)]  hover:bg-[var(--light-background)] ${
  //           typeof page === "number" ? "pagination-page" : "not-btn"
  //         } ${
  //           page === currentPage
  //             ? " text-[white] bg-red-500 hover:!bg-red-600  "
  //             : ""
  //         }`}
  //         style={{
  //           cursor: typeof page !== "number" ? "default" : "pointer",
  //         }}
  //         onClick={() => {
  //           if (typeof page === "number") handlePageChange(page);
  //         }}
  //       >
  //         {page}
  //       </button>
  //     );
  //   });
  //   return pageNumbers;
  // };

  return (
    <div className="w-full h-full flex items-center justify-end flex-nowrap py-[20px] px-[50px] ">
      <div className="flex items-center justify-center gap-4" style={style}>
        <div className="flex items-center justify-center w-full gap-2 ">
          <button
            disabled={currentPage === 1}
            className={`bg-[var(--light-background)]   ${
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            } p-2 rounded hover:bg-[var(--dark-foreground)] hover:text-[var(--light-foreground)] duration-150`}
            onClick={() => {
              handlePageChange(currentPage - 1);

              handlePageDirection("prev");
            }}
          >
            <Icons.chevronLeft />
          </button>
        </div>

        <div
          className={`flex  items-center justify-center  gap-2 ${
            className ? className : ""
          }`}
        >
          <button className="px-3 text-sm sm:text-[15px] text-white bg-red-500 hover:bg-red-600 py-1 duration-150 rounded text-[var(--dark-text)] hover:text-[var(--dark-text)]  text-[18px]  hover:bg-[var(--light-background)]">
            {currentPage}{" "}
          </button>{" "}
          <p className="  text-sm sm:text-[15px]">of</p>
          <p className=" text-sm sm:text-[15px]">{totalPages}</p>
        </div>

        <div className="flex items-center justify-center gap-5">
          <button
            className={`bg-[var(--light-background)]   p-2 rounded hover:bg-[var(--dark-foreground)] hover:text-[var(--light-foreground)] duration-150 ${
              currentPage === totalPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={() => {
              handlePageChange(currentPage + 1);
              handlePageDirection("next");
            }}
            disabled={currentPage === totalPages}
          >
            <Icons.chevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};
