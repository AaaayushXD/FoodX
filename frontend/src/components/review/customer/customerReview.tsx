import { useState } from "react";
import { StarRating } from "../star/starReview";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { delete_productFeedback, getUserById } from "@/services";
import { useAppSelector } from "@/hooks";
import { ApiError, Image } from "@/helpers";
import EmptyImage from "@/assets/empty.png";
import { Delete, Portal } from "@/commons";
import { Icons, toaster } from "@/utils";
import toast from "react-hot-toast";
import { AddProductReview } from "@/features";

export const CustomerReview = ({
  review,
}: {
  review: Model.FeedbackDetail;
}) => {
  const [isDelete, setIsDelete] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);

  const { auth } = useAppSelector();
  const { data } = useQuery({
    queryKey: ["get-user", review.userId],
    queryFn: async () => getUserById("customer", review.userId),
    staleTime: 15 * 60 * 60,
    gcTime: 15 * 60 * 60,
  });

  async function handleDelete(id: string) {
    const loader = toaster({
      icon: "loading",
      message: "Loading...",
    });
    try {
      const response = await delete_productFeedback(id);
      toaster({
        className: " bg-green-50",
        icon: "success",
        message: response.message,
        title: "Your review successfully removed!",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          title: "Delete failed",
          message: error.message,
        });
      }
    } finally {
      toast.dismiss(loader);
    }
  }

  const { mutate } = useMutation({
    mutationFn: async (id: string) => await handleDelete(id),
  });

  return (
    <div className="w-full border-dashed border-b pb-5 flex bg-[#fbfbfd] p-3 rounded-md flex-col items-start justify-start gap-2  ">
      <div className="w-full flex items-center justify-between">
        <StarRating rating={4} size="4" />
        <p className=" text-[14px] text-gray-600 ">
          {dayjs?.unix(review.createdAt._seconds).format("MMM D, YYYY")}
        </p>
      </div>
      {/* name */}
      <div className="flex mt-1 items-center justify-start gap-2">
        <p>{data?.data.fullName || "User"}</p>{" "}
        <p className="flex items-center  px-1.5 gap-1 justify-start p-0.5 border border-green-200 text-[11px] bg-green-100 rounded-full text-green-600 font-semibold">
          <Icons.award className="size-4" /> Verified
        </p>
      </div>
      {/* comment */}
      <span className="w-full -mt-1 text-[var(--secondary-text)] text-[14px] line-clamp-2 sm:text-[15px] ">
        {review?.message ||
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad voluptatum minima quaerat quam eligendi? Aperiam placeat optio adipisci voluptatibus fuga.  "}
      </span>
      <div className="w-full mt-1 flex items-end justify-between">
        <div className="size-10 rounded-md bg-slate-300 ">
          <Image
            className="size-full object-cover rounded-md "
            lowResSrc={EmptyImage}
            highResSrc={import.meta.env.VITE_URI + "assets/" + review.image}
            alt={review.rating + ""}
          />
        </div>
        {auth?.userInfo?.uid === data?.data?.uid && (
          <div className="flex items-center justify-start gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="text-xs font-semibold  hover:underline "
            >
              Edit
            </button>
            <button
              className="text-xs bg-red-600 rounded-2xl px-3 text-white font-semibold p-1 hover:bg-red-500 duration-150 "
              onClick={() => setIsDelete(!isDelete)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <Portal isOpen={open} onClose={() => setOpen(false)}>
        <div className="bg-white rounded-lg p-6 max-w-[90%] w-[500px] relative">
          <AddProductReview
            action="update"
            openReview={open}
            productId={review.productId}
            setOpenReview={() => setOpen(!open)}
          />
        </div>
      </Portal>
      {isDelete && (
        <Delete
          closeModal={() => setIsDelete(!isDelete)}
          id={review.id}
          setDelete={(id) => mutate(id)}
        />
      )}
    </div>
  );
};
