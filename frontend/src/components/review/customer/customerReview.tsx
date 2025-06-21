import { useState } from "react";
import { StarRating } from "../star/starReview";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { delete_productFeedback, getUserById } from "@/services";
import { useAppSelector } from "@/hooks";
import { ApiError, Image } from "@/helpers";
import EmptyImage from "@/assets/empty.png";
import { Delete, Portal, Modal } from "@/common";
import { Icons, toaster } from "@/utils";
import toast from "react-hot-toast";
import { AddProductReview } from "@/features";

// Image Modal Component
const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageSrc, 
  alt 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageSrc: string; 
  alt: string; 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };


  return (
    <Modal close={!isOpen} closeModal={onClose}>
      <div className="max-w-4xl p-3 overflow-auto h-full sm:p-0 bg-white rounded-lg ">
        {/* Header */}
        <div className="flex items-center justify-start p-4 border-b border-gray-200">
          {/* <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Icons.eyeOpen className="size-5 text-blue-500" />
            Review Image
          </h2> */}
          <div className="flex items-center gap-2">
            {/* <button
              onClick={handleDownload}
              className="flex items-center ml-60 gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icons.download className="size-4" />
              Download
            </button> */}
            {/* <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.close className="size-5" />
            </button> */}
          </div>
        </div>

        {/* Image Container */}
        <div className="relative max-w-full  sm:h-[60vh] h-[40vh] overflow-auto  w-full bg-gray-100">
          <div className="h-[50vh] overflow-auto w-full">
          <div 
            className={`flex items-center justify-center transition-all duration-300 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            style={{ 
              minHeight: isZoomed ? '80vh' : '60vh',
              maxHeight: isZoomed ? '80vh' : '60vh'
            }}
          >
            <img
              src={imageSrc}
              alt={alt}
              onClick={handleImageClick}
              className={`transition-all duration-300 ${
                isZoomed 
                  ? 'max-w-none max-h-none scale-150' 
                  : 'max-w-full max-h-full object-contain'
              }`}
              style={{
                cursor: isZoomed ? 'zoom-out' : 'zoom-in'
              }}
            />
          </div>
          </div>
          
          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm">
            {isZoomed ? 'Click to zoom out' : 'Click to zoom in'}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Click image to {isZoomed ? 'zoom out' : 'zoom in'}</span>
            <span>Press ESC or click X to close</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const CustomerReview = ({
  review,
}: {
  review: Model.FeedbackDetail;
  }) => {
   const queryClient = useQueryClient()
  const [isDelete, setIsDelete] = useState<boolean>();
  const [open, setOpen] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const { auth } = useAppSelector();
  const { data } = useQuery({
    queryKey: ["get-user", review?.uid ?? review.userId],
    queryFn: async () => getUserById("customer", review?.uid ?? review.userId),
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
      queryClient.invalidateQueries({
        queryKey: ["product:review"],
      });
      setIsDelete(false);
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

  const handleImageClick = () => {
    if (review.image) {
      setShowImageModal(true);
    }
  };

  return (
    <div className="w-full border-dashed border-b pb-5 flex bg-[#fbfbfd] p-3 rounded-md flex-col items-start justify-start gap-2  ">
      <div className="w-full flex items-center justify-between">
        <StarRating rating={Number(review?.rating)} size="4" />
        <p className=" text-[14px] text-gray-600 ">
          {dayjs?.unix(review.createdAt._seconds).format("MMM D, YYYY")}
        </p>
      </div>
      {/* name */}
      <div className="flex mt-1 items-center justify-start gap-2">
        <p>{data?.data.fullName || "User"}</p>{" "}
        <p className="flex items-center   gap-1 justify-start   text-[11px]    font-semibold">
         {data?.data.isVerified ? <span className="flex items-center px-1.5 border py-0.5 rounded-full  gap-1  bg-green-100 text-green-600 border-green-200"><Icons.award className="size-4" /> Verified</span> : <span className="flex items-center px-1.5 border py-0.5 rounded-full  gap-1  bg-red-100 text-red-600 border-red-200 "><Icons.award className="size-4" /> Unverified</span>}
        </p>
      </div>
      {/* comment */}
      <span className="w-full -mt-1 text-[var(--secondary-text)] text-[14px] line-clamp-2 sm:text-[15px] ">
        {review?.message ||
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad voluptatum minima quaerat quam eligendi? Aperiam placeat optio adipisci voluptatibus fuga.  "}
      </span>
      <div className="w-full mt-1 flex items-end justify-between">
        <div 
          className={`size-10 rounded-md bg-slate-300 relative ${review.image ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}`}
          onClick={handleImageClick}
          title={review.image ? "Click to view full size" : ""}
        >
          <Image
            className="size-full object-cover rounded-md"
            lowResSrc={EmptyImage}
            highResSrc={import.meta.env.VITE_URI + "assets/" + review.image}
            alt={review.rating + ""}
          />
          {review.image && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 rounded-md flex items-center justify-center">
              <Icons.eyeOpen className="size-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>
        { auth?.success && auth?.userInfo?.uid === data?.data?.uid && (
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
            feedbackId={review.id}
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
      
      {/* Image Modal */}
      {showImageModal && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          imageSrc={import.meta.env.VITE_URI + "assets/" + review.image}
          alt={`Review image by ${data?.data.fullName || "User"}`}
        />
      )}
    </div>
  );
};
