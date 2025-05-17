import React from "react";
import { useNavigate } from "react-router-dom";
import { DarkMode } from "@/components";
import { Icons } from "@/utils";
import { useLogout } from "@/hooks";

interface Prop {
  user: Auth.User;
  closeModal: () => void;
}

export const Profile: React.FC<Prop> = ({ user, closeModal }: Prop) => {
  const navigate = useNavigate();

  const { loading, logout } = useLogout();

  return (
    <div className=" px-3 border border-[var(--dark-border)] shadow-md py-4 flex bg-[var(--light-foreground)] flex-col sm:w-[350px] w-[300px]  rounded-md items-baseline justify-center gap-5">
      <div className="flex flex-col items-baseline justify-center gap-1 w-full">
        <p className="sm:text-[17px] text-[14px] tracking-wide text-[var(--dark-text)]">
          Currently in
        </p>
        <div
          onClick={() => {
            navigate("/profile");
            closeModal();
          }}
          className="flex items-center justify-start gap-3 cursor-pointer w-full hover:bg-[var(--light-background)] p-1 rounded-md"
        >
          <div>
            <img
              src={user.avatar}
              className="sm:w-[100px] w-[60px] h-[50px] sm:h-[77px] rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col items-baseline justify-center gap-0.5 w-full">
            <div className="flex justify-between w-full">
              <p className="text-[var(--dark-text)] text-[14px] sm:text-lg font-semibold">
                {user.fullName}
              </p>
            </div>

            <p className="sm:text-sm text-xs text-[var(--dark-secondary-text)] ">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex-col space-y-2 items-start justify-center">
        <p className="text-[13px] text-[var(--dark-text)]">More options</p>
        <div className="flex flex-col items-baseline justify-start gap-1 w-full">
          <button
            onClick={() => {
              navigate("/orders");
              closeModal();
            }}
            className=" flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]   w-full p-3 rounded duration-150 "
          >
            <Icons.history className="size-5" />
            View Orders
          </button>
          <DarkMode />
          <button
            disabled={loading}
            onClick={logout}
            className=" flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] w-full p-3 rounded duration-150"
          >
            <Icons.logout className="size-5 " />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
