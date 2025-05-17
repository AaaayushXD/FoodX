import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import {  updateProduct, uploadImage } from "@/services";
import { Selector } from "@/common";
import { useAppSelector } from "@/hooks";
import { Icons, toaster } from "@/utils";
import { ApiError } from "@/helpers";
import { Image } from "@/utils/Image";
import { useQueryClient } from "react-query";

const UpdateCategoryOption: { label: string; value: string }[] = [
  { label: "Product Name", value: "name" },
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Price",
    value: "price",
  },
  {
    label: "Quantity",
    value: "quantity",
  },
  {
    label:"bannerImage",
    value:"bannerImage"
  },
  { label: "Category", value: "category" },
];

interface updateProductProp {
  product: Ui.Product;
  closeModal: () => void;
}

export const UpdateFood: React.FC<updateProductProp> = ({
  product,
  closeModal,
}) => {
  const [newData, setNewData] = useState<string | number>();
  const [field, setField] = useState<
    "image" | "name" | "price" | "category" | "quantity" | "bannerImage"
  >("name");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { category } = useAppSelector();
 
  const fileRef = useRef<HTMLImageElement>();
  const bannerFileRef = useRef<HTMLImageElement>();
 const queryClient = useQueryClient()
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!product.id) return toast.error("food id not found");
    const toastLoading = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    try {
      const response = await updateProduct({
        category: product.type,
        field: field,
        id: product.id,
        newData: newData as any,
      });
      queryClient.invalidateQueries("specials");
      toaster({
        className: "bg-green-50",
        icon: "success",
        message: response?.message,
        title: "Product successfully updated!",
      });
      setNewData("");
      setField("name");
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
      closeModal();
      toast.dismiss(toastLoading);
  
    }
  };
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setIsImageLoading(true);
    const loading = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    try {
      const image = event.target.files[0];
      const imageUrl = await uploadImage(image, "products");
      setNewData(`${imageUrl.data.folderName}/${imageUrl.data.filename}`);
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
      setIsImageLoading(false);
    }
  };
  return (
    <div className="flex z-[100] flex-col items-start justify-center gap-5">
      <h3 className=" h-12 sticky  overflow-hidden  text-center  w-full border-b-[1px] border-[var(--dark-border)] text-[var(--dark-text)] text-[20px]">
        Update Food
      </h3>
      <form
        action=""
        className="flex py-5 px-10 flex-col items-start justify-start gap-5 w-full"
        onSubmit={(event) => handleSubmit(event)}
      >
        <Selector
          setField={(value) => setField(value as any)}
          categoryOption={UpdateCategoryOption}
        />

        {field === "image" ? (
          newData ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
              {" "}
              <Image
                className="w-full h-[230px] object-cover"
                highResSrc={(import.meta.env.VITE_API_URL_ASSETS + newData) as string}
              />
            </div>
          ) : (
            <div
              onClick={() => !isImageLoading && fileRef.current?.click()}
              className={`w-full transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20 ${
                isImageLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <input
                ref={fileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
                disabled={isImageLoading}
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                {isImageLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
                    <span className="text-sm text-[var(--dark-text)]">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Icons.upload className="size-7 text-[var(--dark-text)] " />
                    <span className="text-sm text-[var(--dark-text)] ">
                      Upload a file or drag and drop
                    </span>
                    <span className="text-[var(--dark-secondary-text)] text-sm ">
                      jpg,png upto 10 mb
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        ) : field === "bannerImage" ? (
          newData ? (
            <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px]">
              <Image
                className="w-full h-[230px] object-cover"
                highResSrc={(import.meta.env.VITE_API_URL_ASSETS + newData) as string}
              />
            </div>
          ) : (
            <div
              onClick={() => !isImageLoading && bannerFileRef.current?.click()}
              className={`w-full transition-all hover:bg-[var(--light-background)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)] stroke-[1px] py-20 ${
                isImageLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <input
                ref={bannerFileRef as any}
                onChange={(event: ChangeEvent<any>) => handleChange(event)}
                type="file"
                className="hidden"
                disabled={isImageLoading}
              />
              <div className="flex flex-col items-center justify-center w-full gap-1 bottom-10">
                {isImageLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
                    <span className="text-sm text-[var(--dark-text)]">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Icons.upload className="size-7 text-[var(--dark-text)] " />
                    <span className="text-sm text-[var(--dark-text)] ">
                      Upload a file or drag and drop
                    </span>
                    <span className="text-[var(--dark-secondary-text)] text-sm ">
                      jpg,png upto 10 mb
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        ) : field === "name" ? (
          <div className="w-full py-1 border-[var(--dark-border)] border-[1px]  rounded px-2 bg-[var(--light-foreground)]">
            <input
              className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)]  outline-none placeholder:text-sm py-1.5 px-4 rounded "
              type="text"
              value={newData as string}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setNewData(event.target.value)
              }
            />
          </div>
        ) : field === "price" ? (
          <input
            value={newData as number}
            type="text"
            onChange={(event) => setNewData(parseInt(event.target.value))}
            placeholder="1200"
            className="w-full placeholder:text-sm  border-[var(--dark-border)] border-[1px] bg-[var(--light-foreground)] outline-none text-[var(--dark-text)] py-2 px-4 rounded"
          />
        ) : field === "quantity" ? (
          <input
            value={newData as number}
            onChange={(event) => setNewData(parseInt(event.target.value))}
            type="text"
            className="w-full border-[var(--dark-border)] border-[1px] bg-[var(--light-foreground)] text-[var(--dark-text)] outline-none placeholder:text-sm py-1.5 px-4 rounded"
          />
        ) : field === "category" ? (
          <Selector
            categoryOption={category?.categories as []}
            setField={(value) => setNewData(value)}
          />
        ) : (
          ""
        )}
        <button disabled={isImageLoading} type="submit" className="w-full dark:text-[var(--dark-text)] text-[var(--light-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ">
          Submit
        </button>
      </form>
    </div>
  );
};
