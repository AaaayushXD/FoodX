import React, { FormEvent, useState } from "react";
import Logo from "@/assets/logo/Fx.png";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/HashLoader";
import { signInAction } from "@/actions";
import { AuthFooter, AuthNavbar } from "@/components";
import { useAppDispatch } from "@/hooks";
import { Icons, toaster } from "@/utils";
import { validateEmail } from "../register/registerHandler";
import {  checkPasswordValidation } from "@/helpers";

//Login container
export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const showPassword = () => {
    setShow((show) => !show);
    setPasswordType(passwordType === "text" ? "password" : "text");
  };

  const dispatch = useAppDispatch();

  const LoginFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const error: Partial<Record<keyof Auth.ValidationType, string>> = {};
    const emailCheck = validateEmail({ email: email }, error);
    const passwordCheck = checkPasswordValidation(
      { password: password },
      error
    );

    console.log(error, emailCheck, passwordCheck);
    if (error.email || error.password) {
      return toaster({
        className: "bg-red-50",
        icon: "error",
        title: "Error",
        message: error.email || error.password,
      });
    }
    if (error)
      try {
        setLoading(true);
        await dispatch(signInAction({ email, password, userRole: "customer" ,navigate: navigate}));
      } catch (error) {
        throw new Error("Error while loging" + error);
      }
    setLoading(false);
  };

  return (
    <div className="flex bg-white items-center justify-center w-full h-full px-3 py-5">
      <div className="w-full  bg-white flex flex-col gap-4 rounded-lg shadow-sm">
        <div className="w-full flex flex-col items-center gap-3 px-3 py-6  text-[25px] sm:text-[30px] font-bold text-[var(--primary-color)] tracking-wide text-center">
          <h1>Welcome Back to FoodX</h1>
        </div>
        <div className="px-3 py-4">
          <form
            autoComplete="off"
            className="flex  text-[#202020] flex-col gap-4 p-2"
            onSubmit={LoginFormSubmit}
          >
            <label className="relative flex flex-col gap-1">
              <h1 className="text-[15px]">Email</h1>
              <input
                name="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" logPassword border-[#5d50772d] border-[1px] sm:text-[16px] text-[14px]  bg-transparent rounded-md  h-[35px] sm:h-[40px] outline-none px-5 py-5 text-md"
              />
            </label>
            <label className="relative flex flex-col gap-1">
              <h1 className="text-[15px]">Password</h1>
              <input
                name="password"
                type={passwordType}
                autoComplete="off"
                maxLength={25}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-[#5d50772d] sm:text-[16px] text-[14px] border-[1px] bg-transparent rounded-md h-[35px] sm:h-[40px] outline-none px-5 py-5 text-md"
              />

              {show ? (
                <div
                  className="text-[#646168] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <Icons.eyeOpen className=" size-5 sm:size-6" />
                </div>
              ) : (
                <div
                  className="text-[#646168] absolute top-[37px] right-[10px] cursor-pointer"
                  onClick={showPassword}
                >
                  <Icons.eyeClose className=" size-5 sm:size-6" />
                </div>
              )}
            </label>

            <p
              onClick={() => navigate("/forgot-password")}
              className="text-[#646168] text-sm cursor-pointer hover:underline select-none"
            >
              Forgot Password?
            </p>
            <button
              type="submit"
              aria-label="login-button"
              disabled={loading}
              className="sm:h-[40px] h-[37px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white  text-lg sm:text-xl  tracking-wider font-semibold transition-colors duration-500 ease-in-out mt-5 "
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  Sending <ClipLoader color="white" size={"20px"} />
                </div>
              ) : (
                "Submit"
              )}
            </button>
            <p
              className="text-[#646168] text-sm cursor-pointer hover:underline text-center mt-2 select-none"
              onClick={() => navigate("/register")}
            >
              Don't have an account?{" "}
              <span className="hover:text-[var(--primary-color)]">
                Register Here.
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Login: React.FC = () => {
  return (
    <div className=" min-w-[100vw] w-full  h-full bg-white overflow-x-hidden">
      {/* Mobile */}
      <div className="flex flex-col items-center w-full h-full lg:hidden min-h-[90vh] gap-8">
        <AuthNavbar />
        <div className="flex items-center justify-center w-full sm:w-[600px] h-full">
          <LoginContainer />
        </div>
      </div>
      {/* Tablet and Desktop */}
      <div className="items-center justify-around hidden min-h-[90vh] w-full gap-5 px-3 py-4 overflow-x-hidden lg:flex">
        <div className="flex items-center justify-center">
          <img src={Logo} className="w-full max-w-[800px]  " alt="logo" />
        </div>
        <div className=" max-w-[700px] w-full pr-8">
          <LoginContainer />
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
