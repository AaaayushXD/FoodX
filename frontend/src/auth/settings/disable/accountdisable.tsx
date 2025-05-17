import { Frown } from "lucide-react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export const AccountDisable = () => {
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!reason.trim())
      return toast.error("Please provide a reason for disabling your account.");

    const toastLoader = toast.loading("Disabling..., Please wait!");
    setLoading(true);
    try {
      // API call to disable account here...
      toast.dismiss(toastLoader);
      toast.success(
        "Your account has been disabled. You can recover it within a month."
      );
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while disabling account.");
      throw new Error("Error while disabling account." + error);
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center  p-8 justify-center h-full gap-10 bg-white ">
      <div className="w-full flex flex-col items-center justify-start ">
        <div className="flex items-center justify-center bg-yellow-100 rounded-full p-7 mb-6">
          <Frown className="size-16 text-yellow-500" />
        </div>
        <p className="text-2xl font-semibold text-[var(--dark-text)] mb-2 text-center">
          Disable Your Account?
        </p>
        <p className="text-sm text-[var(--dark-secondary-text)] italic mb-4 text-center">
          Your account will be disabled, but you can recover it within **one
          month**. If not recovered, it will be **permanently deleted**.
        </p>
      </div>
      <div className="flex flex-col  justify-center rounded-xl w-full items-center ">
        <textarea
          className="p-3 w-full max-w-md border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] mb-4 transition duration-300"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Reason for disabling your account (required)"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          className={`h-12 w-full max-w-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white text-lg font-bold rounded shadow-lg transition-all duration-300 ease-in-out ${
            !reason.trim() ? "opacity-50 cursor-not-allowed" : "opacity-100 "
          }`}
          disabled={loading || !reason.trim()}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ClipLoader color="white" size={"20px"} />
              <span>Processing...</span>
            </div>
          ) : (
            "Confirm Disable"
          )}
        </button>
      </div>
    </div>
  );
};
