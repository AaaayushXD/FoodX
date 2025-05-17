import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useActions";
import { AvatarUpdate, PersonlInformation, ProfileCard } from "..";

export const ProfileView = () => {
  const { auth } = useAppSelector();

  return (
    <div className="flex flex-col   gap-5  sm:gap-8 items-center h-full justify-start w-full  px-3 py-0 ">
      <div className="flex flex-col items-center justify-start flex-grow w-full p-3">
        <p className="flex items-start w-full text-start  text-xl font-semibold tracking-wide py-3 text-[var(--dark-text)]">
          My Profile
        </p>
        <div className="w-full flex flex-col">
          <ProfileCard {...auth?.userInfo} />
          <AvatarUpdate {...auth?.userInfo} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center  w-full gap-2 lg:p-0  p-3 rounded ">
        <PersonlInformation {...auth?.userInfo} />
      </div>
    </div>
  );
};
