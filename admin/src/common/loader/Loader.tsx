import React, { useEffect, useState } from "react";
import { BallTriangle, InfinitySpin } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
interface LoaderProp {
  url: string;
}

interface LoadingTextProp {
  isLoading: boolean;
  loadingFn?: () => void;
}

export const Loader: React.FC<LoaderProp> = ({ url }) => {
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoader(false); // Toggling loader
    }, 500);
  
    return () => clearTimeout(timer);
  }, [url]);
  

  return loader ? (
    <div className="w-screen z-[10000000]   left-0 bg-[var(--popup-bg)] top-0 fixed h-screen ">
      <div className="w-screen h-screen  backdrop-blur-md flex items-center justify-center ">
        <BallTriangle
          color="blue"
          height={80}
          width={100}
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  ) : (
    <Navigate to={`${url}`} replace />
  );
};

export const Loading: React.FC<LoadingTextProp> = ({ isLoading, loadingFn }) => {
  useEffect(() => {
    const loadingTime = setTimeout(() => {
      if (isLoading) {
        loadingFn && loadingFn();
      }
    }, 700);

    return () => {
      clearTimeout(loadingTime);
    };
  }, [isLoading]);

  return (
    <div
      className={`w-screen h-screen left-0 top-0  z-[100] dark:bg-[#080e18] bg-[var(--var(--body-bg))] flex items-center justify-center fixed ${
        isLoading ? "visible" : "invisible"
      } `}
    >
      <p className="text-[20px]  flex items-center justify-center gap-3 text-[var(--dark-text)] font-semibold ">
        <InfinitySpin color="blue" width="200" />
      </p>
    </div>
  );
};
