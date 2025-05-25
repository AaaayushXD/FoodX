import { EditIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import avatar from "@/assets/logo/avatar.png";
import { AppDispatch, RootState } from "@/store";
import { Modal } from "@/common";
import { updateUserAction } from "@/actions/userAction";
import Skeleton from "react-loading-skeleton";
import { PasswordChange } from "../password/accountPassword";
import { Image } from "@/utils/Image";
import Img from "@/assets/logo/avatar.png";
import { uploadImage } from "@/services";
import { AccountDelete } from "../delete/accountDelete";
import { PersonlInformation } from "../edit/editDetails";

export const AdminProfile = () => {
  const authUser = useSelector(
    (state: RootState) => state.root.user.userInfo
  ) as Auth.User;

  const [userData, setUserData] = useState<Auth.User>();

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
  const [updateAvatar, setUpdateAvatar] = useState<string>(props?.avatar);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const UpdateUserProfile = async () => {
    if (updateAvatar === props?.avatar) {
      setEdit(false);
      return;
    }
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
      className={`flex items-center justify-between w-full h-full gap-5 p-5 border border-[var(--dark-border)] rounded`}
    >
      <div className="flex gap-5">
        <div className=" relative group/editable max-w-[80px] max-h-[80px] overflow-hidden rounded-full">
          {edit ? (
            <Image
              highResSrc={import.meta.env.VITE_API_URL_ASSETS + updateAvatar}
              alt=""
              className={`w-[80px] h-[80px]`}
            />
          ) : (
            <Image
              lowResSrc={Img}
              highResSrc={import.meta.env.VITE_API_URL_ASSETS + props?.avatar}
              alt="user profile"
              className={`w-[80px] h-[80px]`}
            />
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
                  const imageUrl = await uploadImage(file, "users");
                  setUpdateAvatar(
                    `${imageUrl?.data?.folderName}/${imageUrl?.data?.filename}`
                  );
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


const ChangePasswordComponent = () => {
  const [isChangePassword, setIsChangePassword] = useState<boolean>(true);
  const [isDelete, setIsDelete] = useState<boolean>(true);

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
      <div className="flex items-center justify-between w-full gap-5 px-3 py-5 ">
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
        <PasswordChange setIsOpen={setIsChangePassword} />
      </Modal>
      <Modal
        close={isDelete}
        closeModal={() => setIsDelete(true)}
      >
        <AccountDelete setIsOpen={setIsDelete} />
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
