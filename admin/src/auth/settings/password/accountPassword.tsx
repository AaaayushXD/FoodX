import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { updateUserPassword } from "../../../firebase/utils";
import { Store } from "../../../store";
import { authLogout } from "../../../reducer/user";
import { ClipLoader } from "react-spinners";


export const PasswordChange: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    if (!newPassword && !confirmNewPassword)
      return toast.error("All fields are required.");
    if (newPassword !== confirmNewPassword)
      return toast.error("Password not match.");

    event.preventDefault();
    setLoading(true);
    const toastLoader = toast.loading("Changing..., Please wait!");
    try {
      await updateUserPassword(newPassword);
      toast.dismiss(toastLoader);
      toast.success("Your password changed, successfully! ");
      Store.dispatch(authLogout());
    } catch (error) {
      toast.dismiss(toastLoader);
      toast.error("Error while change password");
      throw new Error("Error while change user password" + error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12  rounded-xl max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-[var(--dark-text)] tracking-wider mb-8">
        Change Your Password
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full px-8 py-6 flex flex-col gap-8"
      >
        <div className="w-full flex flex-col items-start">
          <label
            className="text-lg font-medium text-[var(--dark-text)] mb-2"
            htmlFor="new-password"
          >
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full border border-[var(--dark-border)] rounded-lg py-3 px-4 text-[var(--dark-text)] bg-[var(--light-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] placeholder:text-sm transition duration-300"
            placeholder="Enter new password"
          />
        </div>

        <div className="w-full flex flex-col items-start">
          <label
            className="text-lg font-medium text-[var(--dark-text)] mb-2"
            htmlFor="confirm-new-password"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-new-password"
            onChange={(event) => setConfirmNewPassword(event.target.value)}
            className="w-full border border-[var(--dark-border)] rounded-lg py-3 px-4 text-[var(--dark-text)] bg-[var(--light-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] placeholder:text-sm transition duration-300"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          className={`h-12 w-full bg-[var(--primary-color)] ${
            newPassword === confirmNewPassword ? "opacity-100" : "opacity-50"
          } text-white text-lg font-bold rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={newPassword === confirmNewPassword ? false : true}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <ClipLoader color="white" size="20px" />
              <span>Processing...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};
