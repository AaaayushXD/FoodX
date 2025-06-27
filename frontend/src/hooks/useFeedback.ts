import axios from "axios";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { toaster } from "@/utils";

export const useFeedbackFn = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const user = useSelector((state: RootState) => state.root.auth);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user.success)
      throw new Error("Only FoodX users can submit feedback. Please log in.");
    const form = new FormData(this);
    form.append("service_id", import.meta.env.VITE_SERVICE_ID);
    form.append("template_id", import.meta.env.VITE_TEMPLATE_ID);
    form.append("user_id", import.meta.env.VITE_PUBLIC_KEY);
    form.append("user_name", user?.userInfo.fullName as string);
    form.append("user_email", user.userInfo.email as string);
    form.append("user_phone", JSON.stringify(user.userInfo.phoneNumber));
    form.append(
      "rating_stars",
      JSON.stringify([...Array(rating)].map(() => "⭐").join(""))
    );
    form.append("feedback_type", feedbackType);
    form.append("feedback", feedback);
    const toastLoader = toaster({
      icon: "loading",
      message: "Sending feedback...",
    });
    try {
      await axios({
        method: "post",
        url: "https://api.emailjs.com/api/v1.0/email/send-form",
        data: form,
      });
      toaster({
        className: "bg-green-50",
        icon: "success",
        message: "Thank you for your feedback.",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: "Something went wrong",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
      setFeedback("");
      setFeedbackType("");
      setRating(0);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
  });

  return {
    mutate,
    isPending,
    rating,
    setRating,
    feedback,
    setFeedback,
    feedbackType,
    setFeedbackType,
  };
};
