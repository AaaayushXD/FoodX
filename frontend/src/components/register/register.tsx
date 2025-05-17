import React, {
  ChangeEvent,
  FormEvent,
  
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  checkValidNumber,
  validateEmail,
  validatePasswordOnChange,
  allFieldsRequired,
} from "./registerHandler";
import { userUpload } from "@/services";
import { AuthFooter } from "@/components";
import logo from "@/assets/logo/Fx.png";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/HashLoader";
import { ApiError, compressImage } from "@/helpers";
import { Icons } from "@/utils";
import { signUpAction } from "@/actions";
import { useAppDispatch } from "@/hooks";

export const RegisterContainer: React.FC = () => {
  const navigate = useNavigate();

  const [RegisterValue, setRegisterValue] = useState<Auth.ValidationType>({
    avatar: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [ValidateError, setValidateError] = useState<Record<string, string>>(
    {}
  );

  const uploadRef = useRef<HTMLInputElement | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
  };

  const imageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      throw new Error("Uploading failed...");
    }
    try {
      const file = event.target.files[0];
      const compressedImg = await compressImage(file, {
        maxWidth: 150,
        maxHeight: 150,
        quality: 0.6,
      });

      setRegisterValue({
        ...RegisterValue,
        avatar: URL.createObjectURL(compressedImg as Blob),
      });
      const imageUrl = await userUpload(file, "users");
      console.log(imageUrl);
      setRegisterValue({
        ...RegisterValue,
        avatar: `${imageUrl?.data?.folderName}/${imageUrl?.data?.filename} `,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error?.message);
      }
    }
  };

  function Validation(error: Record<string, string>) {
    allFieldsRequired(RegisterValue, error);
    validateEmail(RegisterValue, error);
    checkValidNumber(RegisterValue, error);

    validatePasswordOnChange(RegisterValue, error);

    if (Object.keys(error).length === 0) {
      return null;
    } else {
      return error;
    }
  }

  const dispatch = useAppDispatch();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error: Record<string, string> = {};
    Validation(error);
    setValidateError(error);

    try {
      const validatedRegister = Validation(error);
      if (validatedRegister === null || undefined) {
        setLoading(true);
        await dispatch(
          signUpAction({
            data: { ...RegisterValue, role: "customer" },
            navigate: navigate,
          })
        );
      }
    } catch (error) {
      toast.error(`User already logged in`);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center bg-white w-full  lg:py-10 lg:flex-row lg:gap-3 gap-6  justify-between lg:items-center lg:justify-evenly ">
      <div className="flex lg:w-auto w-full flex-col items-center justify-start  ">
        <div className="bg-[#fbfbfb] sm:static fixed z-50 shadow sm:shadow-none lg:bg-transparent w-full lg:w-auto py-2 mb-4 flex justify-start">
          <img
            src={logo}
            alt="FoodX Logo"
            className="lg:w-[500px] w-[120px] sm:h-auto h-[60px] transition-transform duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
        <h1 className="text-center text-[20px] px-2 sm:mt-0 mt-24  sm:text-[28px] md:text-[36px] font-semibold text-[var(--primary-color)] leading-tight sm:mb-6">
          Join FoodX Today & Taste the Best!
        </h1>
        <p className="sm:flex hidden text-center text-[16px] text-[#202020] mb-4">
          Discover a world of flavor and convenience – Sign up now and
          experience food like never before.
        </p>
      </div>

      <div className=" flex items-center justify-center px-2">
        <form
          action=""
          onSubmit={handleFormSubmit}
          className=" flex flex-col    sm:w-[550px] w-full  items-center gap-4 bg-[#fbfbfb] p-2 sm:p-6 rounded-lg text-[#202020] "
        >
          <div className="relative flex flex-col sm:mb-6 mb-2 items-center justify-center gap-1 duration-150 group/image">
            {RegisterValue.avatar ? (
              <img
                src={
                  import.meta.env.VITE_URI + "assets/" + RegisterValue.avatar
                }
                alt=""
                className="rounded-full w-[100px] h-[100px] border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[#f4f6f8] outline-none"
              />
            ) : (
              <img
                src={
                  "https://res.cloudinary.com/dhnvpzxt6/image/upload/v1731246336/avatar_gqze8g.png"
                }
                alt=""
                className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[#f4f6f8] outline-none"
              />
            )}

            <input
              type="file"
              accept="image/*"
              className=" hidden rounded-full  w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[#f4f6f8] outline-none  "
              ref={uploadRef as any}
              onChange={imageChange}
            />
            <div
              className="absolute p-2  border-[var(--primary-color)] border  w-[100px] h-[100px] rounded-full flex justify-end items-end cursor-pointer text-[white]  px-[5px] pr-0  font-Poppins text-[14px] "
              onClick={() => uploadRef.current && uploadRef.current.click()}
            >
              {RegisterValue.avatar && RegisterValue.avatar.length <= 0 && (
                <div className="bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] duration-150 text-white rounded-full p-2 ">
                  <Icons.userEdit className="size-3" />
                </div>
              )}
            </div>
          </div>
          {/* fullname */}
          <div className="flex  items-center gap-[10px] justify-between w-full">
            <div className="flex w-full flex-col tracking-wide items-start h-[65px] lg:h-[73px]">
              <label htmlFor={"firstName"}>First Name</label>
              <input
                id="firstName"
                type="text"
                value={RegisterValue["firstName"]}
                onChange={(e) => handleInputChange(e, "firstName")}
                className=" w-full  outline-none py-[7px] px-[8px] bg-[#fbfbfb] border-[#5d50772d] rounded-md border-[1px]"
              />
              {
                <div className="text-[12px] text-[#af2e2e]">
                  {ValidateError.firstName}
                </div>
              }
            </div>
            <div className="flex w-full flex-col items-start h-[65px] tracking-wide lg:h-[73px]">
              <label htmlFor={"lastName"}>Last Name</label>
              <input
                id="lastName"
                type="text"
                value={RegisterValue["lastName"]}
                onChange={(e) => handleInputChange(e, "lastName")}
                className=" w-full bg-[#fbfbfb] border-[#5d50772d] outline-none  py-[7px] px-[8px] rounded-md border-[1px]"
              />
              {ValidateError && (
                <div className="text-[12px] text-[#af2e2e] ">
                  {ValidateError.lastName}
                </div>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="flex w-full tracking-wide  flex-col  h-[65px] lg:h-[73px]  items-start ">
            Email
            <label htmlFor="email" className="font-Poppins text-[15px]"></label>
            <input
              type="email"
              id="email"
              value={RegisterValue.email}
              onChange={(e) =>
                handleInputChange(e, "email" as keyof Auth.ValidationType)
              }
              className="outline-none py-[7px] px-[8px] bg-[#fbfbfb] border-[#5d50772d] rounded-md border-[1px] w-full"
            />
            {ValidateError["email"] && (
              <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                {ValidateError["email"]}
              </div>
            )}
          </div>
          {/* phoneNumber */}
          <div className="flex w-full tracking-wide  flex-col h-[65px] lg:h-[73px]  items-start ">
            Phone Number
            <label
              htmlFor="phoneNumber"
              className="font-Poppins text-[15px]"
            ></label>
            <input
              type="text"
              id="phoneNumber"
              value={RegisterValue.phoneNumber}
              onChange={(e) =>
                handleInputChange(e, "phoneNumber" as keyof Auth.ValidationType)
              }
              className="outline-none py-[7px] px-[8px] bg-[#fbfbfb] border-[#5d50772d] rounded-md border-[1px] w-full "
            />
            {ValidateError["email"] && (
              <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                {ValidateError["phoneNumber"]}
              </div>
            )}
          </div>
          {/* passwords */}
          <div className="w-full flex sm:flex-row flex-col justify-center items-center gap-[10px]">
            <div className="flex  tracking-wide w-full flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
              <label htmlFor="password" className="font-Poppins text-[15px]">
                Password
              </label>
              <input
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                id="password"
                value={RegisterValue.password}
                onChange={(e) =>
                  handleInputChange(e, "password" as keyof Auth.ValidationType)
                }
                className="outline-none py-[7px] px-[8px] bg-[#fbfbfb] border-[#5d50772d] rounded-md border-[1px] w-full"
              />

              <div
                className="absolute top-[33px] text-[#646168]  right-[14px] w-[15px] h-[15px]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Icons.eyeClose className=" size-5 sm:size-6  " />
                ) : (
                  <Icons.eyeOpen className=" size-5 sm:size-6  " />
                )}
              </div>

              {ValidateError["password"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["password"]}
                </div>
              )}
            </div>
            <div className="flex tracking-wide  w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
              <label htmlFor="confirmPassword" className=" text-[15px]">
                Confirm Password
              </label>
              <input
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={RegisterValue.confirmPassword}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    "confirmPassword" as keyof Auth.ValidationType
                  )
                }
                className="outline-none  relative py-[7px] px-[8px] bg-[#fbfbfb] border-[#5d50772d] rounded-md border-[1px] w-full"
              />

              <div
                className="absolute  top-[33px]  right-[14px] w-[15px] h-[15px] text-[#646168] "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Icons.eyeOpen className=" size-5 sm:size-6  " />
                ) : (
                  <Icons.eyeClose className=" size-5 sm:size-6  " />
                )}
              </div>
              {ValidateError["confirmpassword"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["confirmpassword"]}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center w-full gap-3 ">
            <button
              aria-label="signup-button"
              disabled={loading}
              type="submit"
              className="sm:h-[40px] h-[37px] w-full rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white  text-lg sm:text-xl  tracking-wider font-semibold transition-colors duration-500 ease-in-out mt-5"
            >
              {!loading ? (
                "Submit"
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sending <ClipLoader color="white" size={"20px"} />
                </div>
              )}
            </button>
            <p
              className="text-sm text-[#646168]  font-Poppins hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Already have an account?{" "}
              <a className="hover:text-[var(--primary-color)]">SignIn</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Register = () => {
  return (
    <div className="flex bg-white flex-col items-center justify-between w-full h-screen 2xl:justify-center lg:py-5">
      <RegisterContainer />
      <div className="w-full bg-white pt-10 ">
        <AuthFooter />
      </div>
    </div>
  );
};
