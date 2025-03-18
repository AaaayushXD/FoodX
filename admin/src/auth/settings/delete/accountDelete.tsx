import { Frown } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, Store } from "../../../store";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { deleteAccount } from "../../../firebase/utils";
import { authLogout } from "../../../reducer/user";
import { deleteAccount as Account } from "../../../services/user";

export const AccountDelete = () => {
  const [confirm, setConfirm] = useState<string>("");

  const user = useSelector((state: RootState) => state.root.user.userInfo);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (confirm !== `delete foodX.com.np/${user.fullName}`)
      return toast.error("Please write the correct!");
    const toastLoader = toast.loading("Deleting..., Please wait!");
    setLoading(true);
    try {
      await deleteAccount();
      await Account();
      toast.dismiss(toastLoader);
      toast.success("Deleted successfully");
      Store.dispatch(authLogout());
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while disable account");
      throw new Error("Error while disable account." + error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8  rounded-xl  max-w-lg mx-auto">
      <div className="flex items-center justify-center bg-red-100 rounded-full p-7 mb-6">
        <Frown className="size-16 text-red-500" />
      </div>
      <p className="text-2xl  font-semibold text-[var(--dark-text)] mb-2 text-center">
        Delete Your Account?
      </p>
      <p className="text-sm text-[var(--dark-secondary-text)] italic mb-6 text-center">
        To confirm, type "delete foodX.com.np/{user.fullName}"
      </p>
      <input
        type="text"
        className="p-3 w-full max-w-md border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] mb-4 transition duration-300"
        value={confirm}
        onChange={(event) => setConfirm(event.target.value)}
        placeholder="Enter confirmation text"
      />
      <button
        onClick={handleSubmit}
        className={`h-12 w-full max-w-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)]  text-white text-lg font-bold rounded shadow-lg transition-all duration-300 ease-in-out ${
          confirm !== `delete foodX.com.np/${user.fullName}`
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 "
        }`}
        disabled={confirm !== `delete foodX.com.np/${user.fullName}`}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <ClipLoader color="white" size={"20px"} />
            <span>Sending...</span>
          </div>
        ) : (
          "Confirm Delete"
        )}
      </button>
    </div>
  );
};
