import { useNavigate } from "react-router-dom";
import { Icons } from "@/utils";
import React from "react";

interface ProductSearchProp {
  action?: (value: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProp> = ({ action }) => {
  const navigate = useNavigate();

  return (
    <div className=" w-full bg-white rounded-lg flex items-center justify-center  bg-[var(--foreground-color)] ">
      <input
        onChange={(e) => action && action(e.target.value)}
        onFocus={() => navigate(`/search`)}
        type="text"
        className=" w-full placeholder:text-sm rounded-l-lg p-3 md:p-4 outline-none  "
        placeholder="Search for products"
      />
      <button className=" p-2.5  text-[var(--secondary-text)] ">
        <Icons.search className="sm:size-7 size-6 " />
      </button>
    </div>
  );
};
