import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Img from "@/assets/logo/avatar.png";
import { Image } from "@/utils/Image";

import { signOut } from "@/services";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

interface Prop {
  user: Auth.User;
}

const Profile: React.FC<Prop> = ({ user }: Prop) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut({
        uid: user?.uid as string,
        role: user?.role as Auth.UserRole,
      });
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          message: error.message,
          title: "Error",
        });
      }
    }
  };

  return (
    <div className=" px-3 py-4 border-[1px] border-[var(--dark-border)] flex bg-[var(--light-foreground)] flex-col w-[300px]  rounded-md items-baseline justify-center gap-5">
      <div className="flex flex-col items-baseline justify-center gap-1 w-full">
        <p className="text-[12px] tracking-wide text-[var(--dark-text)]">
          Currently in
        </p>
        <div
          onClick={() => navigate("contact/profile")}
          className="flex items-center justify-start gap-3 cursor-pointer w-full hover:bg-[#8080807c] p-1.5 rounded-md"
        >
          <div>
            <Image
              highResSrc={import.meta.env.VITE_API_URL_ASSETS + user?.avatar as string}
              lowResSrc={Img}
              className="w-10 h-10 rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col items-baseline justify-center gap-1 w-full">
            <div className="flex justify-between w-full">
              <p className="text-[var(--dark-text)] tracking-wider text-[15px] font-semibold">
                {user.fullName}
              </p>
            </div>

            <p className="text-[12px] tracking-wider text-[var(--dark-secondary-text)] ">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex-col space-y-2 items-start justify-center">
        <p className="text-[13px] text-[var(--dark-text)]">More options</p>
        <div className="flex flex-col items-start justify-start gap-1 w-full">
          <button
            onClick={() => navigate("/orders")}
            className=" flex tracking-wider justify-start items-center  rounded-md text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[15px] py-1 px-2 bg-[var(--secondary-light-text)]"
          >
            View Orders
          </button>
          <button
            onClick={() => handleLogout()}
            className=" flex justify-start items-center  rounded text-[var(--dark-text)] hover:bg-[#8080807c] w-full text-[15px] py-1 px-2 bg-[var(--secondary-light-text)]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
