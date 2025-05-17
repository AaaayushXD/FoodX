import { Icons } from "@/utils";

interface ProductSortProp {
  isOpen: boolean;
  close: () => void;
  sortData: { type: string; value: string };
  setSortData: React.Dispatch<
    React.SetStateAction<{ type: string; value: string }>
  >;
}

export const ProductSort: React.FC<ProductSortProp> = ({
  close,
  setSortData,
  isOpen,
  sortData,
}) => {
  const sortFilter: { label: string; value: string }[] = [
    { label: "Price: Low to High", value: "price[asc]" },
    { label: "Price: High to Low", value: "price[desc]" },
    { label: "Delivery Time", value: "time" },
    { label: "Rating", value: "rating-high" },
  ];

  const handleClick = (type: string, value: string) => {
    setSortData({ type: type, value: value });
  };

  return (
    <div className="w-screen h-screen fixed flex items-center justify-center top-0 left-0 z-[1000] right-0 bottom-0  bg-[#00000080] ">
      <div
        className={`w-full p-4  sm:max-w-md flex flex-col fixed gap-10  transition-all ${
          isOpen ? "bottom-0 sm:bottom-36 opacity-100" : "-bottom-96 opacity-0"
        } bottom-0  bg-white sm:rounded-xl rounded-t-xl `}
      >
        <div className="w-full  border-b-[1px] py-3 flex items-center justify-between">
          <h1 className=" text-[18px] font-semibold ">Sort</h1>
          <button
            onClick={() => close()}
            className="bg-gray-100 rounded-full p-2 "
          >
            <Icons.close className=" text-[var(--secondary-text)] size-5 sm:size-6 " />
          </button>
        </div>
        <div className="flex flex-col items-start justify-start gap-14 h-full">
          {sortFilter?.map((filter, index) => (
            <label
              key={index}
              htmlFor={`filter-${filter.value}`}
              className={`${
                sortData.value === filter.value ? "font-[500] " : ""
              } flex items-center gap-2 cursor-pointer justify-start text-[16px]  text-[var(--secondary-text)]`}
            >
              <input
                onChange={() => handleClick(filter.label, filter.value)}
                id={`filter-${filter.value}`}
                type="radio"
                checked={sortData.value === filter.value}
                name="selectedFilter"
                className="accent-yellow-500 sm:scale-[1.1] text-[var(--secondary-text)]"
              />
              {filter.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
