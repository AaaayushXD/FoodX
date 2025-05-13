import { UploadIcon, X } from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { addBanner, uploadImage } from "@/services";
import { Selector } from "@/common";
import { useMutation, useQueryClient } from "react-query";
import { MoonLoader } from "react-spinners";
import { toaster } from "@/utils";

interface UploadBannerProp {
  closeModal: () => void;
}

const UploadBanner: React.FC<UploadBannerProp> = ({ closeModal }) => {
  const reference = useRef<HTMLDivElement>();
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [banner, setBanner] = useState<"banners" | "sponsors">("banners");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image && !name)
      return toaster({
        icon: "error",
        message: "All files are required",
      });
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    try {
      setLoading(true);
      if (banner === "banners") {
        await addBanner({
          name: name as string,
          img: image as string,
          path: "banners",
          link: link as string,
        });

        closeModal();
        setImage("");
        setName("");
      }
      if (banner === "sponsors") {
        await addBanner({
          name: name as string,
          img: image as string,
          path: "sponsors",
          link: link as string,
        });
      }
      queryClient.invalidateQueries({ queryKey: "banners" });
    } catch (error) {
      throw new Error("Error while uploading banners");
    } finally {
      setLoading(false);
      toast.dismiss(toastLoader);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
  });

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Only image files are allowed");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setUploadProgress(0);
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);

    try {
      const imageUrl = await uploadImage(file, "banners", (progress) => {
        setUploadProgress(progress);
      });
      setImage(`${imageUrl?.data?.folderName}/${imageUrl?.data?.filename}`);
    } catch (error) {
      toast.error("Failed to upload image");
      setImage("");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImage("");
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative text-[var(--dark-text)] overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className="h-12 sticky text-[var(--dark-text)] overflow-hidden border-[var(--dark-border)] text-center w-full border-b-[1px] text-[20px]">
          Add an banner
        </h3>

        <form
          onSubmit={(event) => mutate(event)}
          action=""
          className="sm:w-[600px] w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <Selector
            categoryOption={[
              { label: "Banner", value: "banners" },
              { label: "Sponsor", value: "sponsors" },
            ]}
            setField={(value) => setBanner(value as "banners" | "sponsors")}
          />
          <div className="w-full flex flex-col items-baseline justify-center gap-0.5">
            <label
              className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
              htmlFor=""
            >
              Banner Name
            </label>
            <input
              required
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              value={name}
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
              Link
            </label>
            <input
              required
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setLink(event.target.value)
              }
              type="text"
              value={link}
              placeholder="https://..."
              className="w-full border-[1px] border-[var(--dark-border)] bg-[var(--light-foreground)] outline-none placeholder:text-sm py-2 px-4 rounded"
            />
          </div>
          {/* Image Upload Container */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() =>
              !image && !loading ? fileRef.current?.click() : null
            }
            className={`w-full h-[200px] transition-all relative border-dotted border-[2.5px] rounded ${
              isDragging
                ? "border-[var(--primary-color)] bg-[var(--primary-light)]"
                : "border-[var(--dark-border)]"
            } ${
              !image && !loading
                ? "hover:bg-[var(--light-foreground)] cursor-pointer"
                : ""
            }`}
          >
            <input
              required
              onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                const image = event.target.files && event.target.files[0];
                if (image) {
                  handleImageUpload(image);
                }
              }}
              ref={fileRef as any}
              type="file"
              accept="image/*"
              className="hidden"
            />
            {image ? (
              <div className="w-full h-full relative">
                <img
                  className="w-full h-full object-contain"
                  src={image}
                  alt="Uploaded banner"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="absolute w-full h-full flex flex-col items-center justify-center gap-1">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <MoonLoader size={24} color="var(--primary-color)" />
                    <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary-color)] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-sm text-[var(--dark-text)]">
                      Uploading... {uploadProgress}%
                    </span>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="size-7 text-[var(--dark-text)]" />
                    <span className="text-sm text-[var(--dark-text)]">
                      Upload a file or drag and drop
                    </span>
                    <span className="text-[var(--dark-secondary-text)] text-sm">
                      jpg, png upto 10 mb
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full tracking-wide text-[16px] flex justify-center items-center gap-3 text-white dark:text-[var(--dark-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
            {loading && <MoonLoader size={18} color="white" />}
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadBanner;
