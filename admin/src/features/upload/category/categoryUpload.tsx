import { UploadIcon } from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { addCategory, addLogs, uploadImage } from "@/services";
import { useMutation, useQueryClient } from "react-query";
import { MoonLoader } from "react-spinners";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";

interface CategoryModal {
  closeModal: () => void;
}

export const UploadCategory: React.FC<CategoryModal> = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const reference = useRef<HTMLDivElement>();
  // const [Scroll, setScroll] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!categoryName && !imageURL)
      return toaster({
        icon: "error",
        className: "bg-red-50",
        title: "Error",
        message: "All fields are required",
      });

    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });

    try {
      setLoading(true);
      const response = await addCategory({
        name: categoryName,
        image: imageURL,
      });
      await addLogs({
        action: "create",
        date: new Date(),
        detail: `Category : ${categoryName} `,
      });

      toaster({
        icon: "success",
        className: "bg-green-50",
        message: response?.message,
        title: "Category successfully added!",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          className: "bg-red-50",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
      setLoading(false);
      closeModal();
      setCategoryName("");
      setImageURL("");
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      // const compressedImage = await compressImage(file, {
      //   maxHeight: 150,
      //   maxWidth: 150,
      //   quality: 0.6,
      // });
      // const imageURL = URL.createObjectURL(compressedImage as Blob);
      const response = await uploadImage(file, "categories");
      setImageURL(`${response?.data?.folderName}/${response?.data?.filename}`);

      // storeImageInFirebase(response.data, {
      //   folder: "categories",
      // }).then((url) => setImageURL(url));
      setLoading(false);
    } else {
      toast.error("Only image files are allowed");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      if (event.target.files) {
        // const compressedImage = await compressImage(
        //   event.target.files[0],
        //   { maxHeight: 150, maxWidth: 150, quality: 0.7 }
        // );

        const response = await uploadImage(event.target.files[0], "categories");
        setImageURL(
          `${response?.data?.folderName}/${response?.data?.filename}`
        );

        // setImageURL(URL.createObjectURL(compressedImage as Blob));
        // storeImageInFirebase(compressedImage as File, {
        //   folder: "categories",
        // })
        //   .then((res) => {
        //     setImageURL(res);
        //   })
        //   .finally(() => setLoading(false));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          icon: "error",
          className: "bg-red-50",
          message: error?.message,
          title: "Error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleSave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "categories-1" });
    },
  });

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className=" h-12 sticky  overflow-hidden border-[var(--dark-border)]  text-center  w-full border-b-[1px] text-[var(--dark-text)] text-[20px]">
          Add an Category
        </h3>

        <form
          onSubmit={(e) => {
            mutate(e);
          }}
          action=""
          className="sm:w-[600px]  text-[var(--dark-text)]  w-full px-5 min-w-full py-7 gap-16 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Category Name
            </label>
            <input
              required
              onChange={(e) => setCategoryName(e.target.value)}
              type="text"
              placeholder="Pizza"
              className="w-full border-[1px] border-[var(--dark-border)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* second row */}
          {imageURL ? (
            <div className="w-full   overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
              {" "}
              <img
                className="w-full h-[230px] object-fill"
                src={`${import.meta.env.VITE_URI}assets/${imageURL} `}
              />
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileRef.current?.click()}
              className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
            >
              <input
                required
                ref={fileRef as any}
                onChange={(event) => handleImage(event)}
                type="file"
                className="hidden"
              />
              <div className=" w-full flex flex-col items-center bottom-10 justify-center gap-1">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            </div>
          )}
          {/* Third Row */}
          <button
            disabled={loading}
            type="submit"
            className="w-full text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
          >
            Save
            {loading && <MoonLoader size={18} color="white" />}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
