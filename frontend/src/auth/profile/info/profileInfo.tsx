import { Icons } from "@/utils";
import Avatar from "@/assets/logo/avatar.png";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useActions";
import { Image } from "@/helpers";

export const ProfileInfo = () => {
  const navigate = useNavigate();
  const { auth } = useAppSelector();
  return (
    <div className=" w-full flex flex-col px-3 items-center justify-start gap-4 py-5 bg-gradient-to-tr from-[var(--primary-color)] to-[var(--primary-dark)] ">
      <div className="w-full flex items-center justify-between">
        <button onClick={() => navigate(-1)} className=" text-white ">
          <Icons.arrowLeft />
        </button>
        <h1 className="text-[18px] sm:text-[22px] font-semibold text-white  ">
          Profile
        </h1>
        <div></div>
      </div>
      <div className=" flex flex-col w-full items-center justify-start gap-1">
        <div className="size-24  rounded-full ">
          <Image
            className="w-full h-full ring-2 ring-gray-300 object-cover rounded-full"
            highResSrc={
              import.meta.env.VITE_URI + "assets/" + auth?.userInfo?.avatar ||
              Avatar
            }
            alt="avatar"
            lowResSrc={Avatar}
          />
        </div>
        <h2 className="  text-lg font-semibold text-white ">
          {auth?.userInfo?.fullName}
        </h2>
        <p className=" text-[var(--secondary-text)] text-[14px] ">
          {auth?.userInfo?.email}
        </p>
      </div>
    </div>
  );
};
