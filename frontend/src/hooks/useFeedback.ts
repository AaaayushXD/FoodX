import axios from "axios";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";

export const useFeedbackFn = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");
  const user = useSelector((state: RootState) => state.root.auth);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user.success) throw new Error("Only FoodX users can submit feedback. Please log in.");
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
    const toastLoader = toast.loading("Loading...");
    try {
      await axios({
        method: "post",
        url: "https://api.emailjs.com/api/v1.0/email/send-form",
        data: form,
      });
    } catch (error) {
      throw new Error("Error while submit feedback " + error);
    } finally {
      toast.dismiss(toastLoader);
      setFeedback("")
      setFeedbackType("")
      setRating(0)
    }
  };

  const { mutate, isLoading } = useMutation(handleSubmit, {
    onSuccess: () => {
      toast.success("Thank you for your review.");
    },
    onError: (error: any) => {
      if (error instanceof Error) toast.error(error.message);
    },
  });

  return {
    mutate,
    isLoading,
    rating,
    setRating,
    feedback,
    setFeedback,
    feedbackType,
    setFeedbackType,
  };
};
