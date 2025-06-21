import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/hooks/useActions";
import { Icons, toaster } from "@/utils";
import Skeleton from "react-loading-skeleton";
import { updateUserAction } from "@/actions";
import { ApiError } from "@/helpers";

export const PersonlInformation: React.FC<Auth.User> = (user) => {
  const [edit, setEdit] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [update, setUpdate] = useState<{
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }>({
    firstName: user?.fullName?.split(" ")[0] as string,
    lastName: user?.fullName?.split(" ")[1] as string,
    phoneNumber: user?.phoneNumber || "",
  });
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    setUpdate({
      firstName: user?.fullName?.split(" ")[0] as string,
      lastName: user?.fullName?.split(" ")[1] as string,
      phoneNumber: user?.phoneNumber || "98u9",
    });
  }, [user]);
  const handleSubmit = async () => {
    setLoading(true);
    const loading = toaster({ title: "Loading...", icon: "loading" });
    try {
      await dispatch(
        updateUserAction({
          fullName: update?.firstName + " " + update?.lastName,
          phoneNumber: update?.phoneNumber,
        })
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error?.message,
          icon: "error",
          className: "bg-red-50",
        });
      }
    } finally {
      setLoading(false);
      toast.dismiss(loading);
    }
  };
  return (
    <div className="flex-col items-start w-full lg:px-3">
      <div className="flex  justify-between w-full ">
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
              <Icons.updateProfile />
            </button>
          ) : (
            <Icons.editProfile />
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
          <div className={`grid grid-cols-2 sm:p-12 px-0 pb-24 pt-8
         bg-white gap-x-4 gap-y-2  `}>

          <ProfileField
            value={update?.firstName as string}
            label="First Name"
            edit={edit}
            onChange={(value) =>
              setUpdate((prev) => ({ ...prev, firstName: value }))
            }
          />
          <ProfileField
            value={update?.lastName as string}
            label="Last Name"
            edit={edit}
            onChange={(value) =>
              setUpdate((prev) => ({ ...prev, lastName: value }))
            }
          />
          <ProfileField
            label="Phone Number"
            edit={edit}
            onChange={(value) =>
              setUpdate((prev) => ({ ...prev, phoneNumber: value }))
            }
            value={update.phoneNumber as string}
          />
          <div
            className={`flex flex-col w-full gap-1 ${
              loading ? "invisible" : ""
            }`}
          >
            <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
              Role
            </p>
            <p className="text-[var(--dark-text)] font-medium ">
              {user?.role &&
                user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </p>
          </div>
          <div
            className={` w-full flex sm:flex-row gap-10 sm:gap-0 items-center justify-between flex-col `}
          >
            <div className={`flex flex-col w-full gap-1`}>
              <p className=" tracking-wide text-[var(--dark-secondary-text)] text-sm">
                Email
              </p>
              <p className="text-[var(--dark-text)] font-medium ">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ProfileFieldProp {
  label: string;
  value: string;
  edit: boolean;
  onChange: (value: string) => void;
}

const ProfileField: React.FC<ProfileFieldProp> = ({
  label,
  value,
  edit,
  onChange,
}) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <p className="text-sm tracking-wide text-[var(--dark-secondary-text)]">
        {label}
      </p>
      {edit ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="px-3 py-2 rounded border border-[var(--dark-border)] text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
        />
      ) : (
        <p className="text-[var(--dark-text)] font-medium">{value}</p>
      )}
    </div>
  );
};
