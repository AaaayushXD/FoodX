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
    <div className="flex flex-col items-center justify-center p-2 rounded-lg dark:bg-gray-800   w-full mx-auto text-center">
      <svg
        className="w-12 h-12 text-red-500 mb-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 5a1 1 0 112 0v6a1 1 0 11-2 0V7zm1 12a1.25 1.25 0 110-2.5A1.25 1.25 0 0112 19z"
          clipRule="evenodd"
        />
      </svg>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
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
