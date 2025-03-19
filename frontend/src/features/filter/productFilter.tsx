import React, { useState } from "react";
import { Icons } from "@/utils";

interface FilterTypeProp {
  isOpen: boolean;
  filterData: { type: string; value: string; label: string }[];
  setFilterData: React.Dispatch<
    React.SetStateAction<{ type: string; value: string; label: string }[]>
  >;
  close: () => void;
}

export const ProductFilter: React.FC<FilterTypeProp> = ({
  isOpen,
  close,
  filterData,
  setFilterData,
}) => {
  const [filterType, setFilterType] = useState("sort");
  const [filterValue, setFilterValue] = useState<{
    label: string;
    value: string;
  }>();

  const handleClick = (
    filterType: string,
    filterData: { label: string; value: string }
  ) => {
    setFilterData((prev) => {
      const existingFilterIndex = prev.findIndex(
        (filter) => filter.type === filterType
      );

      if (existingFilterIndex !== -1) {
        const updatedFilters = [...prev];
        updatedFilters[existingFilterIndex] = {
          type: filterType,
          label: filterData.label,
          value: filterData.value,
        };
        return updatedFilters;
      }

      return [
        ...prev,
        { type: filterType, label: filterData.label, value: filterData.value },
      ];
    });
    close();
  };

  const filters: {
    label: string;
    value: string;
    actions: { label: string; value: string }[];
  }[] = [
    {
      label: "Sort",
      value: "sort",
      actions: [
        { label: "Price: Low to High", value: "price[desc]" },
        { label: "Price: High to Low", value: "price[asc]" },
        { label: "Delivery Time", value: "time" },
        { label: "Rating", value: "rating" },
      ],
    },
    {
      label: "Rating",
      value: "rating",
      actions: [
        {
          label: "Rating below 2.0",
          value: "rating[2.0]",
        },
        {
          label: "Rating below 4.0",
          value: "rating-low[4.0]",
        },
        {
          label: "Rating below 5.0",
          value: "rating-low[5.0]",
        },
      ],
    },
    {
      label: "Delivery Time",
      value: "time",
      actions: [
        {
          label: "Less than 10 mins",
          value: "time[10]",
        },
        {
          label: "Less than 20 mins",
          value: "time[20]",
        },
        {
          label: "Less than 30 mins",
          value: "time[30]",
        },
        {
          label: "Less than 1 hrs",
          value: "time[60]",
        },
      ],
    },
    {
      label: "Price",
      value: "price",
      actions: [
        {
          label: "Less than Rs. 100",
          value: "price[100] ",
        },
        {
          label: "Less than Rs. 200",
          value: "price[200] ",
        },
        {
          label: "Less than Rs. 500",
          value: "price[500] ",
        },
        {
          label: "Less than Rs. 1000",
          value: "price[1000] ",
        },
      ],
    },
  ];

  const selectedFilter = filters.find((filter) => filter.value === filterType);

  const handleMatchValue = (data: string) => {
    const matchValue = filterData?.find((value) => value.type === data);
    return matchValue?.value;
  };

  return (
    <div className="w-screen h-screen fixed flex items-center justify-center  top-0 left-0 z-[1000] right-0 bottom-0 bg-[#00000080] ">
      <div
        className={`w-full p-1 sm:max-w-md flex flex-col fixed  duration-200 ${
          isOpen ? "sm:bottom-20 bottom-0 opacity-100" : "-bottom-96 opacity-0"
        } bottom-0 h-[75vh] bg-white sm:rounded-xl sm:p-3 rounded-t-xl `}
      >
        <div className="w-full border-b-[1px] py-3 flex items-center justify-between">
          <h1 className=" text-[18px] font-semibold ">Filter</h1>
          <button
            onClick={() => close()}
            className="bg-gray-100 rounded-full p-2 "
          >
            <Icons.close className=" text-[var(--secondary-text)] size-5 sm:size-7 " />
          </button>
        </div>
        <div className="w-full flex items-center h-full ">
          <div className="flex min-w-[100px] gap-10 py-2 max-w-[300px] w-full  flex-col border-r-[1px] items-start justify-start h-full">
            {filters?.map((item, index) => (
              <button
                onClick={() => setFilterType(item.value)}
                key={index}
                className={`text-[16px] py-1 px-2 rounded-md sm:text-[18px] font-[500] ${
                  filterType === item.value
                    ? "text-[var(--secondary-color)] border-l-[4px] border-[var(--secondary-color)] "
                    : "text-[var(--dark-text)]"
                }  `}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className=" flex pl-2 py-2 gap-8 flex-col items-start w-full h-full">
            <h1 className=" text-[16px] text-[var(--secondary-text)] sm:text-[18px] ">
              {filterType.charAt(0).toUpperCase() + filterType?.slice(1)}
            </h1>
            <div className="flex flex-col items-start justify-start gap-14 h-full">
              {selectedFilter?.actions?.map((filter) => (
                <label
                  key={filter.value}
                  htmlFor={`filter-${filter.value}`}
                  className={`text-[14px] ${
                    handleMatchValue(filterType) === filter.value
                      ? "font-[500] "
                      : ""
                  } flex items-center gap-2 cursor-pointer justify-start sm:text-[16px]  text-[var(--secondary-text)]`}
                >
                  <input
                    onChange={() =>
                      setFilterValue({
                        label: filter.label,
                        value: filter.value,
                      })
                    }
                    id={`filter-${filter.value}`}
                    type="radio"
                    checked={
                      filterValue?.value === filter.value ||
                      handleMatchValue(filterType) === filter.value
                    }
                    name="selectedFilter"
                    className="accent-yellow-500 sm:scale-[1.1] text-[var(--secondary-text)]"
                  />
                  {filter.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full px-2  bg-white h-[100px] shadow flex items-center justify-between  ">
          <button
            // disabled={filterValue.length <= 0 || filterValue.length <= 0}
            onClick={() => setFilterData([])}
            className={` text-[16px] font-semibold
          ${
            (filterValue?.value && filterValue?.value.length > 0) ||
            filterData.length > 0
              ? "  text-[var(--secondary-color)] "
              : "text-[var(--secondary-text)]"
          } `}
          >
            Clear Filters
          </button>
          <button
            // disabled={filterValue.length <= 0 || filterData.length <= 0}
            onClick={() =>
              handleClick(filterType, {
                label: filterValue?.label as string,
                value: filterValue?.value as string,
              })
            }
            className={` text-[16px] px-10 py-2 font-semibold rounded-lg
          ${
            (filterValue?.value && filterValue.value.length > 0) ||
            filterData.length > 0
              ? " text-white  bg-[var(--secondary-color)] "
              : "text-white bg-[var(--secondary-text)] "
          } `}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
