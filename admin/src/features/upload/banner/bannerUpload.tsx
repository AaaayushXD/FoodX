import { UploadIcon } from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { storeImageInFirebase } from "@/firebase/storage";
import toast from "react-hot-toast";
import { addLogs, addBanner } from "@/services";
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

  const [banner, setBanner] = useState<"banners" | "sponsors">("banners");

  const fileRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!image && !name) return toast.error("All files are required");
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
        await addLogs({
          action: "create",
          date: new Date(),
          detail: `Banner : ${name} `,
        });
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
        await addLogs({
          action: "create",
          date: new Date(),
          detail: `sponsor : ${name} `,
        });
      }
      queryClient.invalidateQueries({ queryKey: "banners" });
    } catch (error) {
      throw new Error("Error while uploading banners");
    } finally {
      setLoading(false);
      setImage("");
      setName("");
      setLink("");
      closeModal();
      toast.dismiss(toastLoader);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
  });

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setLoading(true);
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);

      storeImageInFirebase(file, {
        folder: (banner as "banners") || "sponsors",
      }).then((url) => setImage(url));
    } else {
      toast.error("Only image files are allowed");
    }
    setLoading(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <div
        ref={reference as any}
        className="w-full relative text-[var(--dark-text)] overflow-auto h-full flex-col gap-5 items-center justify-center flex"
      >
        <h3 className=" h-12 sticky  text-[var(--dark-text)] overflow-hidden border-[var(--dark-border)]  text-center  w-full border-b-[1px]  text-[20px]">
          Add an banner
        </h3>

        <form
          onSubmit={(event) => mutate(event)}
          action=""
          className="sm:w-[600px]   w-full px-5 min-w-full py-7 gap-5 flex flex-col items-start justify-center"
        >
          {/* First Row */}
          <Selector
            categoryOption={[
              { label: "Banner", value: "banners" },
              { label: "Sponsor", value: "sponsors" },
            ]}
            setField={(value) => setBanner(value as "banners" | "sponsors")}
          />
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
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
          <div className=" w-full flex flex-col items-baseline justify-center gap-0.5">
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
          {/* Third Row */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => (image ? "" : fileRef.current?.click())}
            className="w-full h-[400px] transition-all hover:bg-[var(--light-foreground)] cursor-pointer relative border-dotted border-[2.5px] rounded border-[var(--dark-border)]  stroke-[1px] py-20"
          >
            <input
              required
              onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                const image = event.target.files && event.target.files[0];
                setLoading(true);
                // const compressedImg = await compressImage(image as File, {
                //   maxHeight: 600,
                //   maxWidth: 1440,
                //   quality: 0.85,
                // });

                setImage(URL.createObjectURL(image as File));
                storeImageInFirebase(image as File, {
                  folder: "banners",
                })
                  .then((response) => {
                    setImage(response);
                  })
                  .finally(() => setLoading(false));
              }}
              ref={fileRef as any}
              type="file"
              className="hidden"
            />
            {image ? (
              <div className="w-full h-full absolute top-0">
                {" "}
                <img className="w-full h-full  " src={image as string} />
              </div>
            ) : (
              <div className="absolute  w-full flex flex-col items-center bottom-24 justify-center gap-1">
                <UploadIcon className="size-7 text-[var(--dark-text)] " />
                <span className="text-sm text-[var(--dark-text)] ">
                  Upload a file or drag and drop
                </span>
                <span className="text-[var(--dark-secondary-text)] text-sm ">
                  jpg,png upto 10 mb
                </span>
              </div>
            )}
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full tracking-wide text-[16px] flex justify-center items-center gap-3 text-white dark:text-[var(--dark-text)] transition-all rounded py-2.5 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] "
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
