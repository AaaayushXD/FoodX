import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { addLogs, updateCategory, uploadImage } from "@/services";
import toast from "react-hot-toast";
import { UploadIcon } from "lucide-react";
import { Selector } from "@/common";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

interface UpdateCategoryType {
  label: string;
  value: string;
  placeholder?: string;
}

const UpdateCategoryOption: UpdateCategoryType[] = [
  { label: "Name", value: "name", placeholder: "Eg. Pizza" },
  {
    label: "Image",
    value: "image",
  },
];

export const UpdateCategory: React.FC<Prop.updateComponentProp> = ({ id }) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"image" | "name">("name");
  const fileRef = useRef<HTMLImageElement>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id) return toast.error("Category id not found");
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    try {
      const response = await updateCategory({
        id: id,
        field: field as string,
        newData: newData,
      });
      addLogs({ action: "update", date: new Date(), detail: `${id}` });
      toaster({
        className: "bg-green-50",
        icon: "success",
        message: response?.message,
        title: "Category successfully added!",
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
    }
  };
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    try {
      const image = event.target.files[0];
      const response = await uploadImage(image, "categories");
      // const imageUrl = await storeImageInFirebase(image, {
      //   folder: "categories",
      // });
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
    }
  };
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <h3 className=" h-12 sticky  text-[var(--dark-text)] overflow-hidden  text-center  w-full border-b-[1px]  border-[var(--dark-border)] text-[20px]">
        Update Category
      </h3>
      <form
        action=""
        className="flex text-[var(--dark-text)] py-5 px-10 flex-col items-start justify-start gap-5 w-full"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Selector
          categoryOption={UpdateCategoryOption}
          setField={(value) => setField(value as "name" | "image")}
        />

        {field === "image" ? (
          newData ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={`${import.meta.env.VITE_URI}assets/${newData}`}
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px]  rounded border-[var(--dark-border)] stroke-[1px] py-20"
            >
              <input
                ref={fileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )
        ) : field === "name" ? (
          <div className="w-full py-1 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
            <input
              placeholder="Eg. Pizza"
              className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-1.5 px-4 rounded "
              type="text"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : (
          ""
        )}
        <button className="w-full text-[var(--dark-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};
