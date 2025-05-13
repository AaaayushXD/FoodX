
import { ApiError, checkPassword } from "@/helpers";
import { changePassword } from "@/services";
import { RootState } from "@/store";
import { Icons, toaster } from "@/utils";
import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";


export function PasswordChange({setIsOpen}: {setIsOpen: (isOpen: boolean) => void}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
 const { user } = useSelector((state: RootState) => state.root);
  const [showPassword, setShowPassword] = useState(false);
  
  const [validationError, setValidationError] =
    useState<Record<keyof Auth.ValidationType, string>>();

  const handlePassword = async (e: FormEvent) => {
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
      isVerified: "",
      oldPassword: "",
    };
    checkPassword(
      { password, confirmPassword },
      error as Record<keyof Auth.ValidationType, string>
    );
    if (error.password !== "" || error.confirmPassword !== "")
      return setValidationError(error); 
    try {
       const response = await changePassword({
        oldPassword,
        newPassword: password,
        uid: user?.userInfo?.uid as string,
        role: user?.userInfo?.role,
       })
       toaster({
        icon: "success",
        message: response.message,
        className: "bg-green-50",
       })
       setIsOpen(false);
       setOldPassword("");
       setPassword("");
      setConfirmPassword("");
      
    } catch (error) {
       if (error instanceof ApiError) {
         toaster({
          icon: "error",
          message: error.message,
          className: "bg-red-50",
        })
       }
    }
    finally {
      setValidationError({ confirmPassword: "", password: "", oldPassword: "" } as any);

    }
 
 
  };

  const {mutate,isLoading} = useMutation({
    mutationFn: handlePassword,
    mutationKey: ["updatePassword"],
    
  })
  return (
    <div className="flex flex-col items-center   w-full justify-center bg-[var(--light-foreground)] px-4">
      <div className="bg-[var(--light-foreground)]  rounded-xl p-8  w-full">
        <h1 className="text-2xl font-bold text-[var(--dark-secondary-text)] text-center mb-6">
          Change Your Password
        </h1>

        <form
          onSubmit={(e) => mutate(e)}
          autoComplete="off"
          className="flex  w-full flex-col gap-6"
        >
             {/* Old Password Field */}
             <div className="relative w-full">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="old-password"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                autoComplete={"off"}
                aria-autocomplete={"none"}
                type={showPassword ? "text" : "password"}
                id="old-password"
                name="old-password"
                value={oldPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setOldPassword(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm transition duration-300 pr-10"
                placeholder="Enter old password"
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
            {validationError?.oldPassword && (
              <p
                className={`text-sm mt-1 
                  text-red-500
                }`}
              >
                <>
                  <Icons.alert size={16} className="inline-block mr-1" />{" "}
                  {validationError.oldPassword}
                </>
              </p>
            )}
          </div>
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
                type={showPassword ? "text" : "password"}
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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
            {isLoading ? "Updating..." : "Submit"}
          </button>
        </form>
 
      </div>
    </div>
  );
}

