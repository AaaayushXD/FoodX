import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { updateCategory, uploadImage } from "@/services";
import toast from "react-hot-toast";
import { UploadIcon } from "lucide-react";
import { Selector } from "@/common";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";
import { MoonLoader } from "react-spinners";
import { Image } from "@/utils/Image";
import { useQueryClient } from "react-query";

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
  {
    label: "Banner Image",
    value: "bannerImage",
  },
];

export const UpdateCategory: React.FC<Prop.updateComponentProp> = ({
  id,
  closeModal,
}) => {
  const [newData, setNewData] = useState<string>("");
  const [field, setField] = useState<"image" | "name" | "bannerImage">("name");
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLImageElement>();
  const queryClient = useQueryClient();
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
      setNewData("");
      setField("name");
      queryClient?.invalidateQueries("categories-1");
      closeModal && closeModal(false);
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
      setIsUploading(true);
      const image = event.target.files[0];
      const response = await uploadImage(image, "categories");
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
      setIsUploading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      try {
        const response = await uploadImage(file, "categories");
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
        setIsUploading(false);
      }
    } else {
      toast.error("Only image files are allowed");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
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
          setField={(value) => setField(value as "name" | "image" | "bannerImage")}
        />

        {(field === "image" || field === "bannerImage") ? (
          newData ? (
            <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              <Image
                className="w-full h-[230px] object-fill"
                highResSrc={`${import.meta.env.VITE_API_URL_ASSETS}${newData}`}
              />
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => !isUploading && fileRef.current?.click()}
              className={`w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20 ${
                isUploading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <input
                ref={fileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
                disabled={isUploading}
                accept="image/*"
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <MoonLoader size={24} color="var(--dark-text)" />
                    <span className="text-sm text-[var(--dark-text)]">
                      Uploading image...
                    </span>
                    <span className="text-xs text-[var(--dark-secondary-text)]">
                      Please wait while we process your image
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="size-7 text-[var(--dark-text)]" />
                    <span className="text-sm text-[var(--dark-text)]">
                      Upload a file or drag and drop
                    </span>
                    <span className="text-[var(--dark-secondary-text)] text-sm">
                      jpg,png upto 10 mb
                    </span>
                  </>
                )}
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
