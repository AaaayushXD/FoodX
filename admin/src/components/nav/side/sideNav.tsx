import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import collegeLogo from "@/assets/logo/texas.png";
import Img from "@/assets/logo/avatar.png"
import {
  LayoutDashboard,
  ListOrdered,
  BookUser,
  LineChart,
  Utensils,
  Shapes,
  Mail,
  CircleUser,
  Ticket,
  ChevronRight,
  Combine,
  Fullscreen,
  Menu,
  User,
  X,
  Bell,
} from "lucide-react";
import Logout from "../../../features/logout/logout";
import { signOut } from "../../../services/user";
import { Loader } from "../../../common/loader/Loader";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import { NotificationPage } from "../../../features/notification/order/orderNotification";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../context/themeContenxt";
import Profile from "@/common/popUp/AuthProfile";
import { Image } from "@/utils/Image";

interface DesktopSliderProp {
  closeFn?: () => void;
  open: boolean;
}

export const DesktopSlider: React.FC<DesktopSliderProp> = ({
  closeFn,
  open,
}) => {
  const reference = useRef<HTMLDivElement | null>(null);
  const [openContact, setOpenContact] = useState<boolean>(false);
  const [openCollection, setOpenCollection] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const user = useSelector((state: RootState) => state.root.user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
        open && closeFn && closeFn();
      }
    };
    if (open) {
      document.body.style.overflowY = "hidden";
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflowY = "unset";
    };
  }, [open, closeFn]);

  return (
    <div
      ref={reference}
      className="  w-[300px] px-3 py-4 h-screen  bg-[var(--light-foreground)] flex flex-col items-center justify-between rounded "
    >
      <div className="flex flex-col justify-between w-full h-full gap-5 py-2 overflow-auto ">
        {/* College Logo Section */}
        <div className="flex items-center justify-center w-full py-3 ">
          <div
            onClick={() => {
              setUrl(`/${user.userInfo?.role}`);
              closeFn && closeFn();
            }}
            className="items-center cursor-pointer justify-center hidden xl:flex "
          >
            <Image
              className=" xl:w-full max-w-[200px]"
              highResSrc={collegeLogo}
              alt="logo"
            />
          </div>

          <div className="flex   items-center justify-between gap-3 pb-8 pr-5 xl:hidden">
            <div
              onClick={() => {
                setUrl("/admin");
                closeFn && closeFn();
              }}
              className="w-[200px] cursor-pointer"
            >
              <Image
                className="w-full h-full "
                highResSrc={collegeLogo}
            
                alt="logo"
              />
            </div>
            <button onClick={closeFn} className="hover:text-red-600">
              <X className="size-9 text-[var(--dark-text)] " />
            </button>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-start justify-start flex-grow h-full overflow-auto ">
          <ul className="flex flex-col text-[var(--dark-text)] items-start justify-center w-full gap-5">
            <li
              onClick={() => {
                setUrl(`/`);
                closeFn && closeFn();
              }}
              className="flex items-center justify-start gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  w-full py-3 px-2 rounded duration-150  "
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
            {user.userInfo.role !== "admin" ? (
              ""
            ) : (
              <li
                onClick={() => {
                  setUrl("analytics");
                  closeFn && closeFn();
                }}
                className={`${
                  user.userInfo.role === "admin" ? "visible" : "hidden"
                } flex items-center justify-start gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28] w-full p-3 rounded duration-150`}
              >
                <LineChart />
                <span>Analytics</span>
              </li>
            )}
            <li className="relative flex flex-col items-center justify-start w-full gap-3 ">
              <button
                onClick={() => setOpenCollection(!openCollection)}
                className="flex  items-center   justify-start gap-5 cursor-pointer dark:hover:bg-[#121b28]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-500"
              >
                <Combine />
                <span>Collections</span>
                <ChevronRight
                  className={` duration-200 size-5 ${
                    openCollection ? "rotate-90" : ""
                  } `}
                />
              </button>
              <ul
                className={`px-2 w-full flex flex-col duration-500  ${
                  openCollection
                    ? "flex z-[8] bottom-[-80px] opacity-100"
                    : "hidden opacity-0 bottom-[0px] z-[-1]"
                } items-start   gap-3 justify-center`}
              >
                <li
                  onClick={() => {
                    setUrl("collection/foodlist");
                    closeFn && closeFn();
                  }}
                  className=" text-[14px] flex items-center dark:hover:bg-[#121b28]-start gap-5 cursor-pointer dark:hover:bg-[#121b28]   hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                >
                  <Utensils className="size-5" />
                  Food list
                </li>
                <li
                  onClick={() => {
                    setUrl("collection/banner");
                    closeFn && closeFn();
                  }}
                  className=" text-[14px] flex items-center  justify-start gap-5 cursor-pointer dark:hover:bg-[#121b28]   hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                >
                  <Fullscreen className="size-5" />
                  Banner
                </li>
              </ul>
            </li>
            <li
              onClick={() => {
                setUrl("category");
                closeFn && closeFn();
              }}
              className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150 "
            >
              <Shapes />
              <span>Category</span>
            </li>
            <li
              onClick={() => {
                setUrl("order-list");
                closeFn && closeFn();
              }}
              className="flex items-center justify-start gap-5   cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]  w-full p-3 rounded duration-150   "
            >
              <ListOrdered />
              <span>Order</span>
            </li>

            <li
              onClick={() => {
                setUrl("customer-list");
                closeFn && closeFn();
              }}
              className={`flex items-center justify-start  gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]   w-full p-3 rounded duration-150 ${
                user.userInfo.role === "admin" ? "visible" : "hidden"
              } `}
            >
              <BookUser />
              <span>Customers</span>
            </li>

            <li className="relative flex flex-col items-center justify-start w-full gap-3 ">
              <button
                onClick={() => setOpenContact(!openContact)}
                className="flex  items-center justify-start  gap-5 cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]   w-full p-3 rounded duration-500"
              >
                <Mail />
                <span>Contact</span>
                <ChevronRight
                  className={` duration-200 size-5 ${
                    openContact ? "rotate-90" : ""
                  } `}
                />
              </button>
              <ul
                className={`px-2 w-full flex flex-col duration-500  ${
                  openContact
                    ? "flex z-[8] bottom-[-80px] opacity-100"
                    : "hidden opacity-0 bottom-[0px] z-[-1]"
                } items-start   gap-3 justify-center`}
              >
                <li
                  onClick={() => {
                    setUrl("contact/profile");
                    closeFn && closeFn();
                  }}
                  className=" text-[14px] flex items-center  justify-start gap-5 cursor-pointer dark:hover:bg-[#121b28] hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                >
                  <CircleUser />
                  {user.userInfo.role!.charAt(0).toUpperCase() +
                    user.userInfo.role!.slice(1)}{" "}
                  Details
                </li>

                {user.userInfo.role === "admin" && (
                  <li
                    onClick={() => {
                      setUrl("contact/admin-tickets");
                      closeFn && closeFn();
                    }}
                    className=" text-[14px] flex items-center   justify-start gap-5 cursor-pointer dark:hover:bg-[#121b28]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                  >
                    <Ticket />
                    Tickets
                  </li>
                )}
                {user.userInfo.role === "chef" && (
                  <li
                    onClick={() => {
                      setUrl("contact/chef-tickets");
                      closeFn && closeFn();
                    }}
                    className=" text-[14px] flex items-center  justify-start gap-5 cursor-pointer dark:hover:bg-[#121b28]  hover:bg-[#e8e8e8]  w-full p-3 rounded duration-150"
                  >
                    <Ticket />
                    My Requests
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>

        {/* Logout Section */}
        <Logout logout={() => signOut({uid: user?.userInfo?.uid as string, role: user?.userInfo?.role as Auth.UserRole})} />
      </div>
      {url && <Loader url={url} />}
    </div>
  );
};

export const MobileSlider: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const { display, setDisplay } = useThemeContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);

  const profileReference = useRef<HTMLDivElement>();
  const notificationReference = useRef<HTMLDivElement>();
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
  const reference = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.root.user.userInfo);
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-between w-full px-4 lg:shadow-none">
      <div className="flex items-center justify-center gap-4">
        <div
          onClick={() => navigate(`/${user.role}`)}
          className="w-[150px] cursor-pointer"
        >
          <Image className="w-full h-full" highResSrc={collegeLogo} alt="" />
        </div>
      </div>
      <div className="flex  items-center justify-around gap-3">
        <button onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? (
            <X className="size-8 text-[var(--dark-text)] " />
          ) : (
            <Menu className="size-8 text-[var(--dark-text)] " />
          )}
        </button>
        <div className="flex gap-5 items-center justify-start">
          <label className="switch">
            <input
              checked={display === "dark" ? true : false}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.checked) {
                  setDisplay("dark");
                } else {
                  setDisplay("light");
                }
              }}
              type="checkbox"
            />
            <span className="slider"></span>
          </label>
          {user.role === "chef" && (
            <div ref={notificationReference as any} className="relative">
              <Bell
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
                  lowResSrc={Img}
                  highResSrc={user?.avatar as string}
                  className="w-10 hover:ring-[var(--dark-border)] hover:ring-4 duration-150 h-10 rounded-full"
                  alt="avatar"
                />
                <div
                  className={`absolute duration-150 right-[-5px] top-12 ${
                    isOpen
                      ? "visible z-[1] opacity-100 translate-y-0"
                      : "invisible -translate-y-2 opacity-0 z-[-1]"
                  } `}
                >
                  <Profile user={user} />
                </div>
              </div>
            ) : (
              <User />
            )}
          </div>
        </div>
      </div>

      <div
        ref={reference as any}
        className={`absolute w-[1300px] z-[100] duration-200  ${
          openMenu ? "backdrop-blur-sm opacity-100 " : "blur-0 "
        }   duration-150 top-[-11px] ${
          openMenu ? "left-[-11px]" : "left-[-3000px]"
        } `}
      >
        <DesktopSlider open={openMenu} closeFn={() => setOpenMenu(!openMenu)} />
      </div>
    </div>
  );
};
