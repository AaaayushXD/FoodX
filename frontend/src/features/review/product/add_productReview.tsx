import { ApiError } from "@/helpers";
import { useAppSelector } from "@/hooks";
import {
  add_productFeedback,
  update_productFeedback,
  userUpload,
} from "@/services";
import { Icons, toaster } from "@/utils";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface AddProductReviewProp {
  action: "add" | "update";
  openReview: boolean;
  setOpenReview: React.Dispatch<React.SetStateAction<boolean>>;
  productId: string;
}

export const AddProductReview: React.FC<AddProductReviewProp> = ({
  openReview,
  setOpenReview,
  productId,
  action,
}) => {
  const { auth } = useAppSelector();
  const [data, setData] = useState<Partial<Ui.FeedbackInfo>>({});

  const handleAdd = async () => {
    if (!auth?.success) {
      return toaster({
        title: "Please login!",
        className: "bg-red-50",
        icon: "error",
        message: "You have to access account to add feedback",
      });
    }
    const toastLoader = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      const response = await add_productFeedback({
        message: description,
        productId: productId,
        rating: rating,
        uid: auth?.userInfo?.uid,
        image: image,
      });
      toaster({
        className: "bg-green-50 ",
        icon: "success",
        message: response?.message,
        title: "Thank you for review!",
      });
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
      toast.dismiss(toastLoader);
    }
  };

  const handleUpdate = async () => {
    if (!auth?.success) {
      return toaster({
        title: "Please login!",
        className: "bg-red-50",
        icon: "error",
        message: "You have to access account to add feedback",
      });
    }
    const toastLoader = toaster({
      title: "Please wait...",
      icon: "loading",
    });
    try {
      Object.keys(data).forEach(async (key: keyof Model.FeedbackDetail) => {
        if (data[key] !== "") {
          const response = await update_productFeedback(
            productId,
            key,
            data[key]
          );
          toaster({
            className: "bg-green-50 ",
            icon: "success",
            message: response?.message,
            title: "Your review updated!",
          });
        }
      });
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
      toast.dismiss(toastLoader);
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const response = await userUpload(event.target.files[0], "reviews");
      setData((prev) => ({
        ...prev,
        image: `${response?.data?.folderName}/${response?.data?.filename}`,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: "Error",
          className: "bg-red-50 ",
          icon: "error",
          message: error?.message,
        });
      }
    }
  };

  // useEffect(() => {
  //   if (openReview) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [openReview]);

  return (
    <div
      className={` duration-150 fixed top-0 z-[100] flex flex-col items-start justify-between bg-gradient-to-t from-black/65 backdrop-blur-lg  left-0 right-0 bottom-0 w-screen h-screen ${
        openReview ? "opacity-100 visible " : "opacity-0 invisible"
      } `}
    >
      <div className="w-full flex  p-2  items-center justify-between">
        <button
          onClick={() => setOpenReview(!openReview)}
          className=" p-1.5 rounded-full bg-white "
        >
          <Icons.close className="text-[var(--secondary-text)] size-4 font-semibold " />
        </button>
        <h1 className=" text-white text-[18px] sm:text-[22px]  ">
          Reviews and Ratings
        </h1>
        <div></div>
      </div>
      <div
        className={`w-full duration-150 ${
          openReview
            ? "bottom-0 visible opacity-100"
            : "-bottom-96 invisible opacity-0 "
        } bg-slate-100  rounded-xl p-5 flex flex-col items-start justify-start gap-7`}
      >
        <Rating
          action={(rate) => setData((prev) => ({ ...prev, rating: rate }))}
        />
        <Rating_description
          description={data.message}
          setDesription={(value) =>
            setData((prev) => ({ ...prev, message: value }))
          }
        />
        <Rating_addImage
          remove={() => setData((prev) => ({ ...prev, image: "" }))}
          image={data.image}
          setImage={handleUpload}
        />
        <button
          onClick={action === "add" ? handleAdd : handleUpdate}
          className=" bg-green-600 hover:bg-green-700 duration-150 w-full p-2 flex items-center justify-center rounded-full text-white font-semibold text-[16px] "
        >
          {action === "add" ? "Submit your review" : "Update your review"}
        </button>
      </div>
    </div>
  );
};

const Rating = ({ action }: { action: (rate: number) => void }) => {
  const [index, setIndex] = useState<number>(0);
  return (
    <div className="w-full flex items-center justify-start gap-4 flex-col">
      <h1 className="text-lg font-semibold ">Share your experience</h1>
      <div className="flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4, 5]?.map((star) => (
          <button
            onClick={() => {
              action(star);
              setIndex(star);
            }}
            key={star}
          >
            <Icons.tomato
              className={`size-8 transition-transform  duration-300 ease-in-out ${
                index >= star
                  ? "fill-red-500 scale-110"
                  : "fill-gray-400 group-hover:fill-red-500 group-hover:scale-125" // Hover: Red & bigger
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const Rating_description = ({
  description,
  setDesription,
}: {
  description: string;
  setDesription: (value: string) => void;
}) => {
  return (
    <div className="w-full flex flex-col items-start justify-start  gap-4">
      <h1 className="text-lg font-semibold ">Write your review</h1>
      <textarea
        value={description}
        onChange={(event) => setDesription(event.target.value)}
        draggable={false}
        cols={6}
        role="6"
        placeholder="eg.This product is fantastic"
        className=" h-[100px] w-full p-2 rounded-md bg-slate-200  "
      />
    </div>
  );
};

const Rating_addImage = ({
  image,
  setImage,
  remove,
}: {
  image: string;
  setImage: (image: ChangeEvent<HTMLInputElement>) => void;
  remove: () => void;
}) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <h1 className="text-[16px] font-semibold ">Share photo</h1>
      <div className="w-full h-full  rounded-md">
        {image ? (
          <div className="size-14 relative ">
            <img
              className=" size-full object-cover rounded-md "
              src={import.meta.env.VITE_URI + "assets/" + image}
              alt=""
            />
            <button
              onClick={() => remove()}
              className="p-1.5 bg-white absolute -right-2 -top-2 rounded-full "
            >
              <Icons.minus className=" text-black size-3 " />
            </button>
          </div>
        ) : (
          <div
            onClick={() => imageRef?.current?.click()}
            className="  border cursor-pointer p-2 border-dashed rounded-md flex flex-col items-center justify-start gap-2"
          >
            <Icons.download className="size-4 text-slate-500 " />
            <span className=" text-xs text-slate-500 ">Upload a image</span>
          </div>
        )}
      </div>
      <input
        onChange={(event: ChangeEvent<HTMLInputElement>) => setImage(event)}
        type="file"
        ref={imageRef}
        className=" hidden"
      />
    </div>
  );
};
