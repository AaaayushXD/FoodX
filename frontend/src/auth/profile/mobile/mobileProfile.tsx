import { Link } from "react-router-dom";
import { Icons } from "@/utils";
import { ProfileInfo } from "../info/profileInfo";
import { useAppSelector } from "@/hooks/useActions";
import { useLogout } from "@/hooks";

export const MobileProfile = () => {
  const { auth } = useAppSelector();
  const { loading, logout } = useLogout();

  const userInfo = [
    {
      icon: <Icons.total className="size-6 sm:size-7 " />, // Blue for orders
      title: "Total orders",
      total: 45,
      bg: "bg-blue-500",
    },
    {
      icon: <Icons.money className="size-6 sm:size-7 " />,
      title: "Total spents",
      total: 3400,
      bg: "bg-green-500",
    },
    {
      icon: <Icons.user className="size-6 sm:size-7 " />, // Yellow for user
      title: "User",
      total: "Customer",
      bg: "bg-yellow-500",
    },
  ];

  const accountNavigation: { title: string; path: string; icon: any }[] = [
    {
      title: "View Profile",
      path: `/profile/${auth.userInfo.uid} `,
      icon: (
        <Icons.user className="size-6 sm:size-7 text-[var(--secondary-text)] " />
      ),
    },
    {
      title: "Password Change",
      path: "/profile/password-change",
      icon: (
        <Icons.password className=" size-6 sm:size-7 text-[var(--secondary-text)]" />
      ),
    },
    {
      path: "/profile/account-delete",
      title: "Delete Account",
      icon: (
        <Icons.delete className=" size-5 sm:size-6 text-[var(--secondary-text)]" />
      ),
    },
  ];
  const supportNavigation: {
    title: string;
    path: string;
    icon: any;
  }[] = [
    {
      title: "Emergency Call",
      path: "tel:+9779848255044",
      icon: (
        <Icons.call className=" size-6 sm:size-7 text-[var(--secondary-text)] " />
      ),
    },
    {
      title: "Your Feedback",
      path: "/profile/feedback",
      icon: (
        <Icons.support className=" size-6 sm:size-7 text-[var(--secondary-text)] " />
      ),
    },
  ];
  return (
    <div className="w-full h-full md:max-w-sm flex flex-col items-start justify-start gap-10">
      <ProfileInfo />
      <div className="w-full px-2 flex items-center justify-between">
        {userInfo?.map((user, index) => (
          <InfoCard
            key={index}
            bg={user?.bg}
            icon={user?.icon}
            title={user?.title}
            total={user?.total}
          />
        ))}
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-5">
        <h1 className=" text-lg font-semibold px-2 text-[var(--dark-text)] ">
          Account
        </h1>
        <nav className="w-full flex py-3 bg-white flex-col gap-6 items-start justify-start">
          {accountNavigation?.map((accountNav, index) => (
            <Link
              key={index}
              className="text-[18px] px-2 flex items-center  w-full justify-between py-2 text-[var(--dark-text)] "
              to={accountNav.path}
            >
              <div className="flex items-center justify-start gap-1">
                <button className=" rounded-full p-1 ">
                  {accountNav.icon}
                </button>
                <h1 className=" sm:text-[18px] text-[16px]  ">
                  {" "}
                  {accountNav.title}
                </h1>
              </div>
              <Icons.chevronRight className="size-4 text-[var(--secondary-text)] sm:size-5" />
            </Link>
          ))}
        </nav>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-5">
        <h1 className=" px-2  text-lg font-semibold text-[var(--dark-text)] ">
          Help & Support
        </h1>
        <nav className="w-full flex py-3 bg-white flex-col gap-6 items-start justify-start">
          {supportNavigation?.map((accountNav, key) =>
            accountNav.title === "Emergency Call" ? (
              <div
                key={key}
                className="text-[18px] px-2 flex items-center  w-full justify-between py-2 text-[var(--dark-text)]"
              >
                <div
                  key={key}
                  className="flex items-center justify-start gap-1"
                >
                  <button className="  rounded-full p-1 ">
                    {accountNav.icon}
                  </button>
                  <a
                    href={accountNav.path}
                    className=" sm:text-[18px] text-[16px] "
                  >
                    {" "}
                    {accountNav.title}
                  </a>
                </div>
              </div>
            ) : (
              <Link
                className="text-[18px] px-2 flex items-center  w-full justify-between py-2 text-[var(--dark-text)] "
                to={accountNav.path}
              >
                <div className="flex items-center justify-start gap-1">
                  <button className="  rounded-full p-1 ">
                    {accountNav.icon}
                  </button>
                  <h1 className=" sm:text-[18px] text-[16px] ">
                    {" "}
                    {accountNav.title}
                  </h1>
                </div>
                <Icons.chevronRight className="size-5 text-[var(--secondary-text)] sm:size-7" />
              </Link>
            )
          )}
          <button
            disabled={loading}
            onClick={() => logout()}
            className="flex text-red-700 items-center justify-start gap-2 px-4"
          >
            <Icons.logout className="size-6 sm:size-7 text-red-700 " />{" "}
            <p className="sm:text-[18px] text-[16px] ">Logout</p>{" "}
          </button>
        </nav>
      </div>
    </div>
  );
};

interface InfoCardProp {
  icon: React.ReactNode;
  title: string;
  total: any;
  bg: string;
}
const InfoCard: React.FC<InfoCardProp> = ({ icon, title, total, bg }) => {
  return (
    <div className="flex flex-col items-center justify-start gap-1">
      <div className={` ${bg} p-2.5 rounded-full text-white `}>{icon}</div>
      <h1 className=" text-[var(--dark-text)] font-semibold text-[17px] ">
        {total}
      </h1>
      <p className=" text-[var(--dark-secondary-text)] text-[14px] ">{title}</p>
    </div>
  );
};
