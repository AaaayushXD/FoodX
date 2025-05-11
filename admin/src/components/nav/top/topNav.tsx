import Profile from "@/common/popUp/AuthProfile";
import { useThemeContext } from "@/context";
import { NotificationPage } from "@/features";
import { useAppSelector } from "@/hooks";
import { Icons } from "@/utils";
import { Image } from "@/utils/Image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Img from "@/assets/logo/avatar.png"
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const notificationReference = useRef<HTMLDivElement | null>(null);
  const profileReference = useRef<HTMLDivElement | null>(null);

  const { user } = useAppSelector();

  useEffect(() => {
    const closeModal = (event: MouseEvent) => {
      if (
        profileReference.current &&
        !profileReference.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        notificationReference.current &&
        !notificationReference.current.contains(event.target as Node)
      ) {
        setOpenNotification(false);
      }
    };

    if (isOpen || openNotification) {
      document.addEventListener("mousedown", closeModal);
    }

    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  }, [isOpen, openNotification]);

  const { display, setDisplay } = useThemeContext();

  return (
    <div className="w-full  shadow-md shadow-[var(--light-foreground)] border-b-2 border-[var(--light-background)] h-[80px] hidden xl:flex justify-between  items-center gap-5 px-5 py-4">
      <h1 className="px-3 text-[var(--dark-text)] text-2xl">
        Welcome back,{" "}
        <span className="font-semibold tracking-wide">
          {user.userInfo?.fullName &&
            user?.userInfo?.fullName.charAt(0).toUpperCase() +
              user?.userInfo?.fullName?.slice(1)}
        </span>
      </h1>
      <div className="flex gap-5 items-center justify-start">
        <label className="switch">
          <input
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                setDisplay("dark");
              } else {
                setDisplay("light");
              }
            }}
            checked={display === "dark" ? true : false}
            type="checkbox"
          />
          <span className="slider"></span>
        </label>
        {user.userInfo?.role === "chef" && (
          <div ref={notificationReference as any} className="relative">
            <Icons.bell
              onClick={() => setOpenNotification(!openNotification)}
              className="size-7 text-[var(--dark-text)] cursor-pointer "
            />
            <div
              className={`absolute w-[300px] z-30 duration-150 ${
                openNotification
                  ? "visible opacity-100 -translate-y-0 "
                  : "invisible opacity-0 translate-y-10"
              }   right-[4.7rem] top-8`}
            >
              <NotificationPage isOpen={openNotification} />
            </div>
          </div>
        )}
        <div>
          {user ? (
            <div
              onClick={() => setIsOpen(!isOpen)}
              ref={profileReference as any}
              className=" relative  cursor-pointer  "
            >
              {" "}
              <Image
                highResSrc={user.userInfo?.avatar as string}
                lowResSrc={Img}
                className="w-10 hover:ring-[var(--dark-border)] hover:ring-4 duration-150 h-10 rounded-full"
                alt=""
              />
              <div
                className={`absolute duration-150 right-[-5px] top-12 ${
                  isOpen
                    ? "visible z-[1] opacity-100 translate-y-0"
                    : "invisible -translate-y-2 opacity-0 z-[-1]"
                } `}
              >
                <Profile user={user.userInfo} />
              </div>
            </div>
          ) : (
            <Icons.user />
          )}
        </div>
      </div>
    </div>
  );
};

