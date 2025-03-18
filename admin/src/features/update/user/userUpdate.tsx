import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { storeImageInFirebase } from "@/firebase/storage";
import toast from "react-hot-toast";
import { Selector } from "@/common";
import { updateRole, updateUser, addLogs, uploadImage } from "@/services";
import { Icons, toaster } from "@/utils";
import { ApiError } from "@/helpers";

interface UpdateCategoryType {
  label: string;
  value: string;
}

const UpdateCategoryOption: UpdateCategoryType[] = [
  { label: "FullName", value: "fullName" },
  {
    label: "Image",
    value: "avatar",
  },
  {
    label: "Role",
    value: "role",
  },
];
const roleOptions: UpdateCategoryType[] = [
  {
    label: "Admin",
    value: "admin",
  },
  {
    label: "Customer",
    value: "customer",
  },
  {
    label: "Chef",
    value: "chef",
  },
];

interface UpdateCustomerProp {
  customerInfo: Auth.User;
  closeModal: () => void;
}

export const UpdateCustomer: React.FC<UpdateCustomerProp> = ({
  customerInfo,
  closeModal,
}) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"avatar" | "fullName" | "role">(
    "fullName"
  );

  const fileRef = useRef<HTMLImageElement>();
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!customerInfo.id && !newData && !field)
      return toast.error(`All field required`);
    const toastLoader = toast.loading("Updating user role...");
    try {
      if (field == "role") {
        const response = await updateRole({
          id: customerInfo.id as string,
          role: customerInfo.role as string,
          newRole: newData,
        });
        await addLogs({
          action: "update",
          date: new Date(),
          detail: `${customerInfo.fullName} was update from ${customerInfo.role} to ${newData} by me. `,
        });
        toaster({
          className: "bg-green-50",
          icon: "success",
          message: response?.message,
          title: "User role updated!",
        });
      }
      await updateUser({
        id: customerInfo.id as string,
        role: customerInfo.role as "admin" | "customer" | "chef",
        field: field,
        newData: newData,
      });
      const response = await addLogs({
        action: "update",
        date: new Date(),
        detail: `${customerInfo.fullName} was updated of ${field} : ${newData} by me. `,
      });
      toaster({
        className: "bg-green-50",
        icon: "success",
        message: response?.message,
        title: "User successfully updated!",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
      setField("fullName");
      closeModal();
      setNewData("");
    }
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const loading = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    try {
      const image = event.target.files[0];
      const response = await uploadImage(image, "users");
      setNewData(`${response?.data?.folderName}/${response?.data?.filename}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      toast.dismiss(loading);
    }
  };
  return (
    <div className="flex flex-col  items-start justify-center gap-7">
      <h3 className=" h-12 tracking-wider border-[var(--dark-border)]  text-center  w-full border-b-[1px] text-[var(--dark-text)] text-[22px]">
        Update Customer
      </h3>
      <form
        action=""
        className="flex text-[var(--dark-text)] py-5 sm:px-16 px-5 flex-col items-start justify-start gap-7 w-full"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Selector
          categoryOption={UpdateCategoryOption}
          setField={(value) =>
            setField(value as "avatar" | "role" | "fullName")
          }
        />

        {field === "avatar" ? (
          newData ? (
            <div className="w-full    overflow-hidden transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--light-foreground)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={`${import.meta.env.VITE_URI}assets/${newData}`}
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
            >
              <input
                ref={fileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                <Icons.upload className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )
        ) : field === "fullName" ? (
          <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
            <input
              className="w-full bg-[var(--light-foreground)] text-[var(--dark-text)] outline-none placeholder:text-sm py-1.5 px-4 rounded "
              type="text"
              placeholder="Eg. Saroj GT"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : field === "role" ? (
          <Selector
            categoryOption={roleOptions?.filter(
              (role) => role.value !== customerInfo.role
            )}
            setField={(value) => setNewData(value as string)}
          />
        ) : (
          ""
        )}
        <button className="w-full text-[18px] tracking-wider text-[var(--dark-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};
