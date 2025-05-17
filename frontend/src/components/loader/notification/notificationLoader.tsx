import { RotatingLines } from "react-loader-spinner";

export const NotificationLoader = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full pt-3 ">
      {/* <Skeleton height={70} count={5} /> */}
      <div className="flex items-center justify-center   w-full gap-2  h-full min-h-[200px] ">
        <RotatingLines strokeColor="var(--dark-text)" width="27" />
        <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
          {" "}
          loading...
        </span>
      </div>
    </div>
  );
};
