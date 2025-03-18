import { useState } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "@/hooks/useActions";
import { Icons } from "../../../utils";
import { deleteAccount } from "@/services";
import { authLogout } from "@/reducer";

export const AccountDelete = () => {
  const [confirm, setConfirm] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { auth } = useAppSelector();
  const dispatch = useAppDispatch();
  const confirmationText = `delete foodX.com.np/${auth?.userInfo.fullName}`;

  const handleSubmit = async () => {
    if (confirm !== confirmationText) {
      return toast.error("Incorrect confirmation text!");
    }
    if (!reason.trim()) {
      return toast.error("Please provide a reason for deletion.");
    }

    const toastLoader = toast.loading("Deleting account, please wait...");
    setLoading(true);

    try {
      await deleteAccount();
      toast.dismiss(toastLoader);
      toast.success("Account deleted successfully");
      dispatch(authLogout());
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Failed to delete account. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center  pb-20  px-2 pt-5 sm:p-6 bg-white justify-center">
      <div className="flex items-center justify-center bg-red-100 rounded-full p-5 mb-4">
        <Icons.frown className="size-12 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-red-600 text-center mb-2">
        Permanently Delete Your Account?
      </h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        This action is irreversible. Your data will be erased permanently, and
        you will not be able to recover your account.
      </p>
      <div className="flex flex-col items-center justify-center  rounded-2xl   bg-white w-full">
        <div className=" w-full  max-w-md">
          <div className="w-full bg-yellow-100 text-yellow-800 p-3 rounded-lg flex items-center gap-2 mb-4">
            <Icons.alertTraingle className="size-5" />
            <span>Make sure you really want to proceed!</span>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            To confirm, type{" "}
            <strong className="text-red-500">"{confirmationText}"</strong>
          </p>
          <input
            type="text"
            className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Enter confirmation text"
          />
          <p className="text-sm font-medium text-gray-700 mt-4 mb-2">
            Why are you deleting your account?
          </p>
          <textarea
            className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 transition resize-none h-24"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason (required)"
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`mt-5 h-12 w-full max-w-md bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-all duration-300 ease-in-out ${
            confirm !== confirmationText || !reason.trim()
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={confirm !== confirmationText || !reason.trim()}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ClipLoader color="white" size={20} />
              <span>Deleting...</span>
            </div>
          ) : (
            "Confirm Deletion"
          )}
        </button>
      </div>
    </div>
  );
};
