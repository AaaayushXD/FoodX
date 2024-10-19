import { EditIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import avatar from "../../assets/logo/avatar.png";
import { AppDispatch, RootState } from "../../Store";
import { storeImageInFirebase } from "../../firebase/storage";
import { User } from "../../models/user.model";
import Modal from "../../Components/Common/Popup/Popup";
import { updateUserAction } from "../../Actions/user.actions";
import Skeleton from "react-loading-skeleton";
import { PasswordChange } from "../../Auth/Settings/Account.password";
import ReAuth from "../../Auth/Profile/ReAuth";
import { AccountDisable } from "../../Auth/Settings/Account.disable";
import { AccountDelete } from "../../Auth/Settings/Account.delete";
import toast from "react-hot-toast";

export const AdminProfile = () => {
  const authUser = useSelector(
    (state: RootState) => state.root.auth.userInfo
  ) as User;

  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    setUserData({
      fullName: authUser.fullName,
      avatar: authUser.avatar,
      email: authUser.email,
      role: authUser.role,
      phoneNumber: authUser.phoneNumber,
    });
  }, [
    authUser.avatar,
    authUser.email,
    authUser.fullName,
    authUser.role,
    authUser.phoneNumber,
  ]);

  return (
    <div className="flex flex-col items-center overflow-autojustify-center w-full  px-3 py-5 ">
      <div className="flex flex-col items-center justify-center flex-grow w-full p-3">
        <p className="flex items-start w-full text-start  text-xl font-semibold tracking-wide py-5 text-[var(--dark-text)]">
          My Profile
        </p>
        <ProfileCard
          fullName={userData?.fullName as string}
          avatar={userData?.avatar as string}
          role={userData?.role as string}
          email={userData?.email as string}
        />
      </div>
      <div className="flex flex-col items-center justify-center  w-full gap-2 lg:p-0  p-3 rounded ">
        <PersonlInformation
          fullName={userData?.fullName as string}
          avatar={userData?.avatar}
          role={userData?.role}
          email={userData?.email}
          phoneNumber={userData?.phoneNumber}
        />
      </div>
      <div className="flex flex-col items-center justify-center h-full flex-grow w-full p-3">
        <p className="flex items-start w-full text-start  text-xl font-semibold tracking-wide py-5 text-[var(--dark-text)]">
          Danger Zone
        </p>
        <div className="w-full  flex justify-center items-center border border-red-500 rounded">
          <ChangePasswordComponent />
        </div>
      </div>
    </div>
  );
};

interface ProfileCardType {
  fullName: string;
  avatar: string;
  role: string;
  email: string;
  phoneNumber?: string;
}

// My profile
const ProfileCard: React.FC<ProfileCardType> = (props: ProfileCardType) => {
  const uploadAvatarRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [updateAvatar, setUpdateAvatar] = useState<string>(avatar);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const UpdateUserProfile = async () => {
    setLoading(true);
    try {
      await dispatch(updateUserAction({ avatar: updateAvatar }));
    } catch (error) {
      throw new Error("Error while updating avatar" + error);
    }
    setLoading(false);
  };

  return loading ? (
    <div className="w-full">
      <Skeleton
        height={130}
        baseColor="var(--light-background)"
        highlightColor="var(--light-foreground) "
        count={1}
      />
    </div>
  ) : (
    <div
      className={`flex items-center justify-between overflow-hidden w-full h-full gap-2 sm:gap-5 sm:px-5 sm:py-5 px-1 py-3 border border-[var(--dark-border)] rounded`}
    >
      <div className="flex gap-5">
        <div className=" relative group/editable max-w-[80px] max-h-[80px] overflow-hidden rounded-full">
          {edit ? (
            <img src={updateAvatar} alt="" />
          ) : (
                <div className=" sm:w-[80px] w-[50px] h-[50px] sm:h-[80px] ">
                   <img
              src={props?.avatar}
              alt="user profile"
              className={`w-full h-full`}
            />
            </div>
          )}
          <div
            className={`absolute group-hover/editable:visible ${
              edit ? "flex" : "hidden"
            } invisible duration-200 top-0 left-0 right-0 `}
          >
            <input
              className="hidden"
              ref={uploadAvatarRef}
              type="file"
              onChange={async (event) => {
                if (event.target.files) {
                  const file = event.target.files[0];
                  setLoading(true);
                  const imageUrl = await storeImageInFirebase(file, {
                    folder: "users",
                  });
                  setUpdateAvatar(imageUrl as string);
                  setLoading(false);
                }
              }}
              accept="image/*"
            />
            <div
              onClick={() => uploadAvatarRef.current?.click()}
              className={` relative w-[80px] h-[80px]  rounded-full bg-[#86b1e75e]
              `}
            >
              <div className="absolute flex items-end justify-end  bottom-2 right-3">
                <EditIcon className="size-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-1">
          <p
            className={`font-semibold tracking-wider text-[var(--dark-text)] `}
          >
            {props.fullName}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)] *:`}
          >
            {props?.role?.charAt(0).toUpperCase() + props?.role?.slice(1)}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)]`}
          >
            {props.email}
          </p>
        </div>
      </div>
      <div onClick={() => setEdit(!edit)}>
        {edit ? (
          <div onClick={UpdateUserProfile}>
            <UpdateUser />
          </div>
        ) : (
          <EditProfileIcon />
        )}
      </div>
    </div>
  );
};

export interface UpdateProfileInfo {
  avatar?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: number;
}

const PersonlInformation: React.FC<User> = ({
  fullName,
  email,
  phoneNumber,
  role,
}) => {
  const firstName = fullName?.split(" ")[0];
  const lastName = fullName?.split(" ")[1];

  const [edit, setEdit] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [update, setUpdate] = useState({
    firstName,
    lastName,
    phoneNumber,
  });
  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = async () => {
    setLoading(true);
    const toastLoader = toast.loading("Updating..., Please wait!");
    try {
      await dispatch(
        updateUserAction({
          fullName: `${update.firstName} ${update.lastName}`,
          phoneNumber: parseInt(update.phoneNumber as string),
        })
      );
      toast.dismiss(toastLoader);
      toast.success("User update successfully!");
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Failed to update user account!");
      throw new Error("Error while updating account " + error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-col items-center w-full lg:px-3">
      <div className="flex  justify-between w-full pt-3 pb-4 ">
        <p className="text-xl font-semibold tracking-wide  text-[var(--dark-text)]">
          Personal Information
        </p>

        <div onClick={() => setEdit(!edit)} className="px-5 ">
          {edit ? (
            <button
              onClick={handleSubmit}
              disabled={
                !update.firstName || !update.lastName || !update.phoneNumber
              }
            >
              <UpdateUser />
            </button>
          ) : (
            <EditProfileIcon />
          )}
        </div>
      </div>
      {loading ? (
        <div className="w-full">
          {" "}
          <Skeleton
            height={100}
            baseColor="var(--light-background)"
            highlightColor="var(--light-foreground)"
            count={1}
          />
        </div>
      ) : (
        <div
          className=" w-full grid grid-rows-3 gap-8 px-5 py-7 border border-[var(--dark-border)] rounded
    "
        >
          <div
            className={`grid  items-center grid-cols-2 grid-flow-cols gap-7 `}
          >
            <div className={`flex flex-col w-full gap-1 `}>
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                First Name
              </p>
              {edit ? (
                <input
                  type="text"
                  value={update.firstName}
                  onChange={(event) =>
                    setUpdate((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  className="px-2 py-1.5 rounded border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] bg-[var(--light-foreground)]  outline-none"
                />
              ) : (
                <p className="text-[var(--dark-text)] font-medium ">
                  {firstName}
                </p>
              )}
            </div>
            <div className={`flex flex-col w-full gap-1 `}>
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                Last Name
              </p>
              {edit ? (
                <input
                  value={update.lastName}
                  onChange={(event) =>
                    setUpdate((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  type="text"
                  className="px-2 py-1.5 rounded border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] bg-[var(--light-foreground)]  outline-none"
                />
              ) : (
                <p className="text-[var(--dark-text)] font-medium ">
                  {lastName}
                </p>
              )}
            </div>
          </div>
          <div
            className={` w-full flex sm:flex-row gap-10 sm:gap-0 items-center justify-between flex-col `}
          >
            <div className={`flex flex-col w-full gap-1`}>
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                Email
              </p>
              <p className="text-[var(--dark-text)] font-medium ">{email}</p>
            </div>
            <div className={`flex flex-col w-full gap-1`}>
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                Phone Number
              </p>
              {edit ? (
                <input
                  type="text"
                  value={update.phoneNumber}
                  onChange={(event) =>
                    setUpdate((prev) => ({
                      ...prev,
                      phoneNumber: event.target.value,
                    }))
                  }
                  className="px-2 py-1.5 rounded border-[1px] border-[var(--dark-border)] text-[var(--dark-text)] bg-[var(--light-foreground)]  outline-none"
                />
              ) : (
                <p className="text-[var(--dark-text)] font-medium ">
                  {phoneNumber}
                </p>
              )}
            </div>
          </div>
          <div className={` grid items-center grid-flow-col grid-cols-2 gap-7`}>
            <div
              className={`flex flex-col w-full gap-1 ${
                loading ? "invisible" : ""
              }`}
            >
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                Role
              </p>
              <p className="text-[var(--dark-text)] font-medium ">
                {role && role?.charAt(0).toUpperCase() + role?.slice(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChangePasswordComponent = () => {
  const [isChangePassword, setIsChangePassword] = useState<boolean>(true);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  return (
    <div className=" relative  w-full grow flex-col gap-8 flex items-center justify-center px-5 py-7 text-[var(--dark-text)]">
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--dark-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide ">
          Change your password
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            Are you sure you want to change your password?
          </span>
        </p>
        {/* passwordChange */}
        <div
          onClick={() => setIsChangePassword(!isChangePassword)}
          className="border-[var(--danger-text)] border  p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all"
        >
          <p className="w-full text-center">Change Password</p>
        </div>
      </div>
      <div
        onClick={() => setIsDisable(!isDisable)}
        className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--dark-border)]"
      >
        <p className="flex flex-col gap-1 font-semibold tracking-wide">
          Disable your account
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            This will temporarily disable your account.
          </span>
        </p>
        <div className="border-[var(--danger-text)] border p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all">
          <p className="w-full text-center">Disable Account</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5  border-b border-b-[var(--dark-border)]">
        <p className="flex flex-col gap-1 font-semibold tracking-wide">
          Delete your account
          <span className="text-sm font-normal text-[var(--dark-secondary-text)]">
            This will delete all your data. You won't be able to login again.
            Are you sure you want to delete your account?
          </span>
        </p>
        <div
          onClick={() => setIsDelete(!isDelete)}
          className="border-[var(--danger-text)] border  p-3 rounded text-[var(--danger-text)] hover:bg-[var(--danger-bg)] hover:text-[var(--light-text)] cursor-pointer hover:border-[var(--danger-text)] ease-in-out duration-200 transition-all"
        >
          <p className="w-full text-center">Delete Account</p>
        </div>
      </div>
      <Modal
        close={isChangePassword}
        closeModal={() => setIsChangePassword(true)}
      >
        {isVerified ? (
          <PasswordChange />
        ) : (
          <ReAuth isVerified={() => setIsVerified(true)} />
        )}
      </Modal>
      <Modal close={isDisable} closeModal={() => setIsDisable(true)}>
        {isVerified ? (
          <AccountDisable />
        ) : (
          <ReAuth isVerified={() => setIsVerified(true)} />
        )}
      </Modal>
      <Modal close={isDelete} closeModal={() => setIsDelete(true)}>
        {isVerified ? (
          <AccountDelete />
        ) : (
          <ReAuth isVerified={() => setIsVerified(true)} />
        )}
      </Modal>
    </div>
  );
};

export const EditProfileIcon: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] ] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--dark-border)] ">
      <p className="text-xs ">Edit</p>
      <EditIcon size={15} />
    </div>
  );
};
export const UpdateUser: React.FC = () => {
  return (
    <div className="bg-[var(--light-foreground)] p-2 rounded-full flex justify-center items-center gap-2 cursor-pointer text-[var(--dark-text)] hover:bg-[var(--primary-color)] hover:text-[var(--light-text)] transition-all ease-in-out duration-250 border border-[var(--light-border)] ">
      <p className="text-xs">Save</p>
      <EditIcon size={15} />
    </div>
  );
};
