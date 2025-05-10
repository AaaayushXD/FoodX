import { ChangeEvent, FormEvent, useState } from "react";
import { checkPassword } from "@/helpers";
import { Icons } from "@/utils";
import { Modal } from "@/commons";
import { ReAuth } from "@/auth";

export function PasswordChange() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] =
    useState<Record<keyof Auth.ValidationType, string>>();
  const [verifyingUser, setVerifyingUser] = useState<boolean>(false);

  const handlePassword = (e: FormEvent) => {
    e.preventDefault();
    const error: Record<keyof Auth.ValidationType, string> = {
      password: "",
      confirmPassword: "",
      uid: "",
      avatar: "",
      email: "",
      phoneNumber: "",
      role: "",
      refreshToken: "",
      totalOrder: "",
      totalSpent: "",
      createdAt: "",
      updatedAt: "",
      firstName: "",
      lastName: "",
      isVerified: ""
    };
    checkPassword(
      { password, confirmPassword },
      error as Record<keyof Auth.ValidationType, string>
    );
    if (error.password !== "" || error.confirmPassword !== "")
      return setValidationError(error);
    setValidationError({ confirmPassword: "", password: "" } as any);
    setVerifyingUser(true);
  };

  return (
    <div className="flex flex-col items-center   w-full justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white  rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Change Your Password
        </h1>

        <form
          onSubmit={(e) => handlePassword(e)}
          autoComplete="off"
          className="flex max-w-xl w-full flex-col gap-6"
        >
          {/* New Password Field */}
          <div className="relative w-full">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="new-password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                autoComplete={"off"}
                aria-autocomplete={"none"}
                type={showPassword ? "text" : "password"}
                id="new-password"
                name="new-password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm transition duration-300 pr-10"
                placeholder="Enter new password"
              />
              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Icons.eyeClose size={20} />
                ) : (
                  <Icons.eyeOpen size={20} />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {validationError?.password && (
              <p
                className={`text-sm mt-1 
                  text-red-500
                }`}
              >
                <>
                  <Icons.alert size={16} className="inline-block mr-1" />{" "}
                  {validationError.password}
                </>
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative w-full">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="confirm-new-password"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm transition duration-300 pr-10"
                placeholder="Confirm new password"
              />
              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Icons.eyeClose size={20} />
                ) : (
                  <Icons.eyeOpen size={20} />
                )}
              </button>
            </div>
            {/* Password Match Indicator */}
            {validationError?.confirmPassword && (
              <p
                className={`text-sm mt-1 
                  text-red-500
                }`}
              >
                <>
                  <Icons.alert size={16} className="inline-block mr-1" />{" "}
                  {validationError.confirmPassword}
                </>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`h-12 w-full rounded-lg font-bold text-lg shadow-md transition-all duration-300 
           
                 bg-blue-600 hover:bg-blue-700 text-white
             
            
              `}
          >
            Submit
          </button>
        </form>
        {verifyingUser && (
          <Modal
            close={!verifyingUser}
            closeModal={() => setVerifyingUser(!verifyingUser)}
          >
            <ReAuth isVerified={() => setVerifyingUser(!verifyingUser)} />
          </Modal>
        )}
      </div>
    </div>
  );
}
