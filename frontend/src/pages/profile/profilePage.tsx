import { useNavigate, useParams } from "react-router-dom";
import {
  AccountDelete,
  AccountDisable,
  MobileProfile,
  PasswordChange,
  ProfileView,
  FeedbackSupport,
} from "@/auth";
import { useAppSelector } from "@/hooks";
import { Icons } from "@/utils";

export const ProfilePage = () => {
  const { setting } = useParams();
  const { auth } = useAppSelector();
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-start justify-start gap-3">
      <div className="  sm:h-screen overflow-auto md:max-w-xs pr-1 w-full ">
        <MobileProfile />
      </div>
      <div className="w-full flex-col md:flex hidden ">
        {setting === "password-change" ? (
          <PasswordChange />
        ) : setting === "account-delete" ? (
          <AccountDelete />
        ) : setting === "account-disable" ? (
          <AccountDisable />
        ) : setting === auth?.userInfo?.uid ? (
          <ProfileView />
        ) : setting === "feedback" ? (
          <FeedbackSupport />
        ) : (
          <ProfileView />
        )}
      </div>
      <div
        className={`w-full md:hidden h-screen flex flex-col fixed left-0 right-0 bottom-0 overflow-scroll z-10 top-0 duration-150 ${
          setting === undefined ? "  scale-0" : "visible bg-white scale-100  "
        }  left-0 right-0 h-full `}
      >
        <button
          onClick={() => navigate(-1)}
          className="px-5 w-full   border-b py-3"
        >
          <Icons.arrowLeft className="text-black  "  />
        </button>
        {setting === "password-change" ? (
          <PasswordChange />
        ) : setting === "account-delete" ? (
          <AccountDelete />
        ) : setting === "account-disable" ? (
          <AccountDisable />
        ) : setting === auth?.userInfo?.uid ? (
          <ProfileView />
        ) : setting === "feedback" ? (
          <FeedbackSupport />
        ) : (
          <ProfileView />
        )}
      </div>
    </div>
  );
};
