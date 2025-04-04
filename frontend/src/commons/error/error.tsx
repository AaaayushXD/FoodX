import { Icons } from "@/utils";
import React from "react";

interface ErrorProp {
  title?: string;
  message?: string;
  button?: {
    title: string;
    onClick: () => void;
  };
}

export const Error: React.FC<ErrorProp> = ({
  title = "Something went wrong!",
  message = "An unexpected error occurred. Please try again later.",
  button,
}) => {
  return (
    <div className="flex max-w-md  flex-col items-center justify-center p-2 rounded-lg dark:bg-gray-800   w-full mx-auto text-center">
      <div className="p-3 rounded-full bg-[#e21111a8] text-white ">
        <Icons.alert className="size-6 sm:size-7" />
      </div>

      <h2 className="sm:text-xl mt-4 text-[16px] font-semibold text-gray-800 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-600 sm:text-[16px] text-sm line-clamp-2 dark:text-gray-300">
        {message}
      </p>
      {button && (
        <button
          onClick={button.onClick}
          className="mt-4 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-500 transition-all"
        >
          {button.title}
        </button>
      )}
    </div>
  );
};
