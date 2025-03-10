import React, { useState } from "react";
import Logo from "../../assets/logo/Fx.png";
import {AuthFooter, AuthNavbar } from "../../components"
import { useNavigate } from "react-router-dom";

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center w-full h-full px-5 py-8">
      <div className="w-full h-full bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm">
        <div className="w-full px-5 py-6 text-5xl font-bold text-[var(--primary-color)] tracking-wide text-center">
          <h1 className="md:hidden">Reset</h1>
          <h1 className="hidden md:block">Reset Your Password</h1>
        </div>
        <div className="px-3 py-4">
          <form className="flex flex-col gap-4 p-2">
            <div className="relative flex flex-col gap-2">
              <label htmlFor="logEmail" className="text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="logEmail"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-[var(--light-border)] focus:border-transparent focus:bg-[var(--light-border)] border bg-transparent rounded-md h-[40px] outline-none px-5 py-3 text-md"
              />
            </div>

            <p
              onClick={() => navigate("/login")}
              className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline select-none"
            >
              Have an Account?
            </p>
            <button className="h-[40px] sm:text-[16px] text-[14px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-[var(--light-text)] text-md font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 ">
              Send For Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ForgotPassword: React.FC = () => {
  return (
    <div className=" min-w-[100vw] w-full max-w-[1800px] min-h-[100vh] h-full bg-[var(--light-background)] overflow-x-hidden">
      {/* Mobile */}
      <div className="flex items-center flex-col w-full h-full md:hidden min-h-[90vh] gap-8">
        <AuthNavbar />
        <div className="flex items-center justify-center sm:w-[600px] w-full h-full">
          <LoginContainer />
        </div>
      </div>
      {/* Tablet and Desktop */}
      <div className="items-center justify-around hidden min-h-[90vh] w-full gap-5 px-3 py-4 overflow-x-hidden md:flex">
        <div className=" items-center justify-center hidden lg:flex">
          <img src={Logo} className="w-full h-full " alt="logo" />
        </div>
        <div className=" max-w-[700px] w-full pr-8">
          <LoginContainer />
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};
