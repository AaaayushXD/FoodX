import { ChangeEvent, FormEvent } from "react";

import toast from "react-hot-toast";
// import { reAuthUser } from "@/firebase/utils";
import { useHooks } from "@/hooks/useHooks";
import { Icons } from "@/utils";

interface ReAuthProp {
  isVerified: () => void;
}

export const ReAuth: React.FC<ReAuthProp> = ({ isVerified }) => {
  const {
    email,
    password,
    setPassword,
    setShow,
    setEmail,
    show,
    setLoading,
  } = useHooks<any, "reAuth">("reAuth");

  const HandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email && !password)
      return toast.error("Email or Password are required.");
    setLoading(true);
    try {
      // await reAuthUser(email, password);
      isVerified();
    } catch (error) {
      toast.error("Invalid Email or Password");
      throw new Error("Error while verifying user" + error);
    }
    setLoading(false);
  };
  return (
 
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Security Check
        </h1>

        <form
          onSubmit={(e) => HandleSubmit(e)}
          autoComplete="off"
          className="flex flex-col gap-6"
        >
          {/* New Password Field */}
          <div className="relative w-full">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="new-password"
            >
              Email
            </label>
            <div className="relative">
              <input
                autoComplete={"off"}
                aria-autocomplete={"none"}
                type={show ? "text" : "password"}
                id="new-password"
                name="new-password"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm transition duration-300 pr-10"
                placeholder="Enter new password"
              />
              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <Icons.eyeClose size={20} />
                ) : (
                  <Icons.eyeOpen size={20} />
                )}
              </button>
            </div>
            {/* Password Strength Indicator */}
          </div>

          {/* Confirm Password Field */}
          <div className="relative w-full">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="confirm-new-password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                id="confirm-new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm transition duration-300 pr-10"
                placeholder="Confirm new password"
              />
              {/* Toggle Password Visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <Icons.eyeClose size={20} />
                ) : (
                  <Icons.eyeOpen size={20} />
                )}
              </button>
            </div>
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
      </div>
  
  );
};

// export const ReAuthContainer = () => {
//   return (
//     <div className="w-[100vw] h-[80vh] bg-[#00000041] flex justify-center items-center px-5 z-30">
//       <ReAuth />
//     </div>
//   );
// };
