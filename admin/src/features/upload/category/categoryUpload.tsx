import { UploadIcon } from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { addCategory,  uploadImage } from "@/services";
import { useMutation, useQueryClient } from "react-query";
import { toaster } from "@/utils";
import { ApiError } from "@/helpers";
import { Image } from "@/utils/Image";

interface CategoryModal {
  closeModal: () => void;
}

export const UploadCategory: React.FC<CategoryModal> = ({ closeModal }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [bannerImageLoading, setBannerImageLoading] = useState<boolean>(false);
  const reference = useRef<HTMLDivElement>();
  const [data, setData] = useState<{
    name: string;
    description: string;
    image: string;
    bannerImage: string;
  }>({
    name: "",
    description: "",
    image: "",
    bannerImage: ""
  })

  const fileRef = useRef<HTMLInputElement | null>(null);
  const bannerFileRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!data.name || !data.description || !data.image || !data.bannerImage)
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
        name: data.name,
        description: data.description,
        image: data.image,
        bannerImage: data.bannerImage
      });
      toaster({
        icon: "success",
        className: "bg-green-50",
        message: response?.message,
        title: "Category successfully added!",
      });
      queryClient?.invalidateQueries({ queryKey: "categories-1" });
      setData({
        name: "",
        description: "",
        image: "",
        bannerImage: "",
      });
      closeModal();

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
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, type: 'image' | 'bannerImage') => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      type === 'image' ? setImageLoading(true) : setBannerImageLoading(true);
      try {
        const response = await uploadImage(file, "categories");
        setData({
          ...data,
          [type]: `${response?.data?.folderName}/${response?.data?.filename}`,
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
        type === 'image' ? setImageLoading(false) : setBannerImageLoading(false);
      }
    } else {
      toast.error("Only image files are allowed");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>, type: 'image' | 'bannerImage') => {
    type === 'image' ? setImageLoading(true) : setBannerImageLoading(true);
    try {
      if (event.target.files) {
        const response = await uploadImage(event.target.files[0], "categories");
        setData({
          ...data,
          [type]: `${response?.data?.folderName}/${response?.data?.filename}`,
        });
        console.log( response, type)
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
      type === 'image' ? setImageLoading(false) : setBannerImageLoading(false);
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
          className="sm:w-[600px] h-[60vh] overflow-y-auto  text-[var(--dark-text)]  w-full px-5 min-w-full py-7 gap-16 flex flex-col"
        >
          {/* First Row */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Category Name
              </label>
              <input
                required
                onChange={(e) => setData({ ...data, name: e.target.value })}
                type="text"
                placeholder="Pizza"
                className="w-full border-[1px] border-[var(--dark-border)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
              />
            </div>

            <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
              <label
                className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                htmlFor=""
              >
                Category Description
              </label>
              <textarea
                required
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Enter category description..."
                rows={4}
                className="w-full border-[1px] border-[var(--dark-border)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded resize-none"
              />
            </div>
          </div>
          
          {/* Image Upload Section */}
          <div className="w-full flex justify-between gap-4">
            <div className=" w-full flex-col gap-2">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Category Image
              </label>
              {data.image ? (
                <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
                  <Image
                    className="w-full h-[230px] object-fill"
                    highResSrc={`${import.meta.env.VITE_API_URL_ASSETS}${data.image}`}
                  />
                </div>
              ) : (
                <div
                  onDrop={(e) => handleDrop(e, 'image')}
                  onDragOver={handleDragOver}
                  onClick={() => fileRef.current?.click()}
                  className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
                >
                  <input
                    required
                    ref={fileRef as any}
                    onChange={(event) => handleImage(event, 'image')}
                    type="file"
                    className="hidden"
                  />
                  {imageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(---light-background)] bg-opacity-50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                        <p className="text-[var(--dark-text)] text-sm animate-pulse">Uploading image...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center bottom-10 justify-center gap-1">
                      <UploadIcon className="size-7 text-[var(--dark-text)]" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Upload a file or drag and drop
                      </span>
                      <span className="text-[var(--dark-secondary-text)] text-sm">
                        jpg,png upto 10 mb
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Banner Image Upload */}
            <div className="flex w-full flex-col gap-2">
              <label className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]">
                Banner Image
              </label>
              {data.bannerImage ? (
                <div className="w-full overflow-hidden transition-all hover:bg-[var(--light-secondary-text)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-secondary-text)] stroke-[1px]">
                  <Image
                    className="w-full h-[230px] object-fill"
                    highResSrc={`${import.meta.env.VITE_API_URL_ASSETS} ${data.bannerImage}`}
                  />
                </div>
              ) : (
                <div
                  onDrop={(e) => handleDrop(e, 'bannerImage')}
                  onDragOver={handleDragOver}
                  onClick={() => bannerFileRef.current?.click()}
                  className="w-full transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2px] rounded border-[var(--dark-border)] stroke-[1px] py-20"
                >
                  <input
                    required
                    ref={bannerFileRef as any}
                    onChange={(event) => handleImage(event, 'bannerImage')}
                    type="file"
                    className="hidden"
                  />
                  {bannerImageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(---light-background)] bg-opacity-50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]"></div>
                        <p className="text-[var(--dark-text)] text-sm animate-pulse">Uploading banner...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center bottom-10 justify-center gap-1">
                      <UploadIcon className="size-7 text-[var(--dark-text)]" />
                      <span className="text-sm text-[var(--dark-text)]">
                        Upload banner or drag and drop
                      </span>
                      <span className="text-[var(--dark-secondary-text)] text-sm">
                        jpg,png upto 10 mb
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || imageLoading || bannerImageLoading}
            type="submit"
            className={`w-full text-white transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] ${
              (loading || imageLoading || bannerImageLoading) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
