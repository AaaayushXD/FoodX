import React from "react";
import { debounce } from "@/helpers";
import avatar from "@/assets/logo/avatar.png"
import { searchUser } from "../../../services/user";
import { useQuery } from "react-query";
import Customer from "@/assets/customer.png";
import { RotatingLines } from "react-loader-spinner";
import { Image } from "@/utils/Image";

interface OrderSearchProp {
  payload: (user: Auth.User) => void;
}
export const OrderSearch: React.FC<OrderSearchProp> = ({ payload }) => {
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [isValue, setIsValue] = React.useState<string>("");

  const handleChange = async (value: string) => {
    setIsValue(value);
  };

  const { data: users, isLoading } = useQuery(
    ["users:search", isValue],
    async (): Promise<Auth.User[]> => {
      const isUserExist = await searchUser(isValue);
      return isUserExist;
    },
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      enabled: isChecked && isValue.length > 0,
    }
  );

  const debouncedHandleChange = React.useCallback(
    debounce(handleChange, 400),
    []
  );

  return (
    <div className="w-full relative">
      <form
        action=""
        className="relative sm:w-auto w-full text-[var(--dark-text)]  "
      >
        <input
          onClick={() => setIsChecked(true)}
          id="search"
          type="search"
          onChange={(event) => debouncedHandleChange(event?.target.value)}
          className=" border placeholder:tracking-wider placeholder:text-[16px] placeholder:text-[var(--dark-secondary-text)] outline-none sm:w-[300px] w-full py-2 px-2  border-[var(--dark-border)] bg-[var(--light-background)] rounded-lg  ring-[var(--primary-color)] focus:ring-[3px] duration-150 "
          placeholder="Search for orders"
        />
      </form>
      <div
        className={`sm:w-[500px] flex flex-col items-start gap-4 py-2 duration-150 ${
          isChecked && isValue.length > 0
            ? "visible opacity-100"
            : "invisible opacity-0 "
        } top-14 -left-1 w-full z-[100] overflow-y-auto scrollbar-custom px-2  p-1 border-[var(--dark-border)] border-[1px] rounded-xl absolute bg-[var(--light-foreground)] h-[300px]`}
      >
        {isLoading ? (
          <div className="w-full flex flex-col items-center pt-3 justify-center ">
            {/* <Skeleton height={70} count={5} /> */}
            <div className="flex items-center pt-10 justify-center gap-3">
              <RotatingLines strokeColor="var(--dark-text)" width="27" />
              <span className="text-[17px] text-[var(--dark-text)] tracking-wider ">
                {" "}
                loading...
              </span>
            </div>
          </div>
        ) : users && users?.length > 0 ? (
          users?.map((user) => (
            <div
              key={user.uid}
              onClick={() => {
                payload(user);
                setIsChecked(false);
              }}
              className="w-full hover:bg-[var(--body-bg)] cursor-pointer flex items-center  rounded-lg justify-start gap-3 p-2 border-[1px] border-[var(--dark-border)] "
            >
              <Image
                highResSrc={ import.meta.env.VITE_API_URL_ASSETS + user.avatar}
                lowResSrc={avatar}
                className="size-14 rounded-full "
                alt="user"
              />
              <div>
                <h1 className=" text-[16px] text-[var(--dark-text)] ">
                  {user.fullName}
                </h1>
                <h1 className=" text-xs text-gray-400 ">{user.email}</h1>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center pt-10 justify-center">
            <img className="size-32" src={Customer} alt="" />
            <span className="text-[17px] text-[var(--dark-text)] tracking-wider">
              No users found. Please try a different search.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
