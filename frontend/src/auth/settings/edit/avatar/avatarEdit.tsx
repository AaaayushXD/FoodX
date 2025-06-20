import React, { ChangeEvent, useRef, useState } from "react";
import { Icons, toaster } from "@/utils";
import { useAppDispatch } from "@/hooks/useActions";
import avatar from "@/assets/logo/avatar.png";
import { updateUserAction } from "@/actions";
import { userUpload } from "@/services";
import toast from "react-hot-toast";
import { ApiError, compressImage, Image, Skeleton } from "@/helpers";

export const ProfileCard: React.FC<Auth.User> = (user) => {
  const uploadAvatarRef = useRef<HTMLInputElement | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>(user?.avatar || avatar);
  const [originalAvatar, setOriginalAvatar] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files && event?.target.files[0];

    try {
      setOriginalAvatar(file as File);
      setPreviewAvatar(URL.createObjectURL(file as File));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error.message,
        });
      }
    }
  };
  const UpdateUserProfile = async () => {
    if (!originalAvatar) {
      setEdit(false);
      return;
    }
    setLoading(true);
    try {
      const compressedImage = await compressImage(originalAvatar as File, {
        maxWidth: 150,
        maxHeight: 150,
        quality: 0.5,
      });
      const response = await userUpload(compressedImage as File, "users");
      setPreviewAvatar(
        `${response?.data.folderName}/${response?.data.filename}`
      );
      await dispatch(
        updateUserAction({
          avatar: `${response?.data.folderName}/${response?.data.filename}`,
        })
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: "Error",
          className: "bg-red-50 ",
          icon: "error",
          message: error?.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Skeleton
      children={{
        className: "w-full rounded-md  sm:h-[130px]",
      }}
      className="w-full h-full"
      count={1}
    />
  ) : (
    <div
      className={`sm:flex hidden items-center justify-between overflow-hidden w-full h-full gap-2 sm:gap-5 sm:px-5 sm:py-5 px-1 py-3 border border-[var(--dark-border)] rounded`}
    >
      <div className="flex gap-5">
        <div className=" relative group/editable size-20 overflow-hidden rounded-full">
          {edit ? (
            <Image
              className="object-cover h-full w-full"
              lowResSrc={avatar}
              highResSrc={
                previewAvatar?.startsWith("blob:")
                  ? previewAvatar
                  : `${import.meta.env.VITE_URI}assets/${previewAvatar}`
              }
              alt="User Avatar"
            />
          ) : (
            <div className=" sm:w-[80px] w-[50px] h-[65px] sm:h-[80px] ">
              <Image
                lowResSrc={avatar}
                highResSrc={
                  previewAvatar?.startsWith("blob:")
                    ? previewAvatar
                    : `${import.meta.env.VITE_URI}assets/${previewAvatar}`
                }
                className="w-full h-full"
                alt="avatar"
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
              onChange={(event) => handleChange(event)}
              accept="image/*"
            />
            <div
              onClick={() => uploadAvatarRef.current?.click()}
              className={` relative w-[80px] h-[80px]  rounded-full bg-[#86b1e75e]
              `}
            >
              <div className="absolute flex items-end justify-end  bottom-2 right-3">
                <Icons.edit className="size-4" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-1">
          <p
            className={`font-semibold tracking-wider text-[var(--dark-text)] `}
          >
            {user.fullName}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)] *:`}
          >
            {user.role &&
              user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </p>
          <p
            className={`text-xs tracking-wider text-[var(--dark-secondary-text)]`}
          >
            {user.email}
          </p>
        </div>
      </div>
      <div onClick={() => setEdit(!edit)}>
        {edit ? (
          <div onClick={UpdateUserProfile}>
            <Icons.updateProfile />
          </div>
        ) : (
          <Icons.editProfile />
        )}
      </div>
    </div>
  );
};

export const AvatarUpdate: React.FC<Auth.User> = (user) => {
  const [edit, setEdit] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    user?.avatar || avatar
  );
  const [originalAvatar, setOriginalAvatar] = useState<File | string>("");
  const [loading, setLoading] = useState(false);
  const uploadAvatarRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files && event?.target.files[0];
    const loading = toaster({ title: "Loading...", icon: "loading" });
    try {
      setOriginalAvatar(file as File);
      setPreviewAvatar(URL.createObjectURL(file as File));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error.message,
        });
      }
    } finally {
      toast.dismiss(loading);
    }
  };

  const UpdateUserProfile = async () => {
 
    if (!originalAvatar) {
      setEdit(false);
      return;
    }
    setLoading(true);
    try {
      const response = await userUpload(originalAvatar as File, "users");
      setPreviewAvatar(
        `${response?.data.folderName}/${response?.data.filename}`
      );
      await dispatch(
        updateUserAction({
          avatar: `${response?.data.folderName}/${response?.data.filename}`,
        })
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: "Error",
          className: "bg-red-50 ",
          icon: "error",
          message: error?.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Skeleton
      children={{
        className: "w-full h-[200px]",
      }}
      className="w-full h-full"
      count={1}
    />
  ) : (
    <div className="flex sm:hidden  flex-col items-center w-full px-4 sm:px-6">
      {/* Profile Avatar Section */}
      <div className="relative size-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
        <Image
          lowResSrc={avatar}
          highResSrc={
            previewAvatar?.startsWith("blob:")
              ? previewAvatar
              : `${import.meta.env.VITE_URI}assets/${previewAvatar}`
          }
          alt="User Avatar"
          className="w-full h-full object-cover"
        />

        {edit && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
            onClick={() => uploadAvatarRef.current?.click()}
          >
            <Icons.edit className="text-white size-5" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        className="hidden"
        ref={uploadAvatarRef}
        onChange={handleChange}
        accept="image/*"
      />

      {/* User Details */}
      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">{user.fullName}</p>
        <p className="text-sm text-gray-500">
          {user.role &&
            user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
        </p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Edit Button */}
      <button
        onClick={async () => {
          if (edit) {
            await UpdateUserProfile();
            setEdit(!edit);
          } else {
            setEdit(!edit);
          }
        }}
        className="mt-3 flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md transition hover:bg-blue-600"
      >
        <span>{edit ? "Save Changes" : "Edit Profile"}</span>
      </button>
    </div>
  );
};
