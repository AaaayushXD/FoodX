import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { signOutUser } from "@/firebase/Authentication";
import Cookies from "js-cookie";
import { makeRequest } from "@/makeRequest";
import toast from "react-hot-toast";
import { authLogout } from "@/reducer";

interface Prop {
  user: Auth.User;
}

const Profile: React.FC<Prop> = ({ user }: Prop) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastLoader = toast.loading("Logout user...");
    try {
      await makeRequest.post("/users/logout");
      await signOutUser();
      dispatch(authLogout());
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.dismiss(toastLoader);
      toast.success("Successfully logout");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while logout user");
      throw new Error("Unable to logged out" + error);
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
            <img src={user.avatar} className="w-20 h-14 rounded-full" alt="" />
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
