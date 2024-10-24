import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ValidationType } from "../../models/register.model";
import { Eye, EyeOff, Pencil } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../Store";
import { useNavigate } from "react-router-dom";
import { checkValidNumber, validatePasswordOnChange } from "./RegisterHandler";
import { allFieldsRequired } from "./RegisterHandler";
import { storeImageInFirebase } from "../../firebase/storage";
import { AuthFooter } from "../Footer/AuthFooter";
import avatar from "../../assets/logo/avatar.png";
import logo from "../../assets/logo/Fx.png";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/HashLoader";
import { signUp } from "../../Services/user.services";
import { UserRole } from "../../models/user.model";

export const RegisterContainer: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const [RegisterValue, setRegisterValue] = useState<ValidationType>({
    avatar: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [ValidateError, setValidateError] = useState<Record<string, string>>(
    {}
  );
  const [SelectedImage, setSelectedImage] = useState<File | null>(null);

  const uploadRef = useRef<HTMLInputElement | null>(null);

  const [ShowPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
  };

  const imageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      throw new Error("Uploading failed...");
    }
    const file = event.target.files[0];
    setRegisterValue({ ...RegisterValue, avatar: file });
    setSelectedImage(file);
  };
  function Validation(error: Record<string, string>) {
    allFieldsRequired(RegisterValue, error);
    // validateEmail(RegisterValue, error);
    checkValidNumber(RegisterValue, error);
    validatePasswordOnChange(RegisterValue, error);

    if (Object.keys(error).length === 0) {
      return null;
    } else {
      return error;
    }
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error: Record<string, string> = {};
    Validation(error);
    setValidateError(error);

    try {
      const validatedRegister = Validation(error);
      if (validatedRegister === null || undefined) {
        setLoading(true);
        const { avatar, password, email, lastName, firstName, phoneNumber } =
          RegisterValue;

        const imageUrl = await storeImageInFirebase(avatar, {
          folder: "users",
        });

        const convertedForm = {
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          avatar: imageUrl,
          role: "customer" as UserRole["role"],
        };
        await signUp({ ...convertedForm });
        navigate("/email-verification");
      }
    } catch (error) {
      toast.error(`User already logged in`);
    }
    console.log(error);
    RegisterValue.avatar = "";
    RegisterValue.firstName = "";
    RegisterValue.lastName = "";
    RegisterValue.password = "";
    RegisterValue.confirmpassword = "";
    RegisterValue.email = "";
    RegisterValue.phoneNumber = "";
    setLoading(false);
  };

  useEffect(() => {
    document.body.classList.remove("dark");
  }, []);
  
  return (
    <div className="flex flex-col items-start w-full px-3 lg:py-10 lg:flex-row lg:gap-3 gap-6  justify-between lg:items-center lg:justify-evenly ">
      <div className="bg-[var(--light-foreground)] lg:bg-transparent w-full lg:w-auto py-2  mb-4 ">
        <img src={logo} alt="" className="lg:w-[500px]  w-[150px]  " />
      </div>
      <div className="flex flex-col items-center justify-center w-full  lg:w-auto ">
        <h1 className=" px-5 pb-7 text-[25px] font-bold text-[var(--primary-color)]  text-center">
          <span className="md:hidden text-[var(--dark-text)] ">Sign in</span>
          <span className="hidden md:block text-[var(--dark-text)] ">
            Sign in with email
          </span>
        </h1>

        <form
          action=""
          onSubmit={handleFormSubmit}
          className=" flex flex-col  sm:w-[550px] w-full  items-center gap-3 bg-[var(--light-foreground)] p-6 rounded-lg text-[var(--dark-text)] "
        >
          <div className="relative flex flex-col sm:mb-6 mb-2 items-center justify-center gap-1 duration-150 group/image">
            {SelectedImage ? (
              <img
                src={URL.createObjectURL(SelectedImage)}
                alt=""
                className="rounded-full w-[100px] h-[100px] border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[var(--light-background)] outline-none"
              />
            ) : (
              <img
                src={avatar}
                alt=""
                className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none"
              />
            )}
            {ValidateError["avatar"] && (
              <div className="text-[12px] text-[#af2e2e] ">
                {ValidateError["avatar"]}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className=" hidden rounded-full  w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none  "
              ref={uploadRef as any}
              onChange={imageChange}
            />
            <div
              className="absolute p-2  group-hover/image:visible invisible w-[100px] h-[100px] rounded-full flex justify-end items-end cursor-pointer bg-[#86b1e75e]  text-[white] py-[3px] px-[5px] font-Poppins text-[14px] "
              onClick={() => uploadRef.current && uploadRef.current.click()}
            >
              <div className="bg-[var(--light-foreground)] rounded-full p-[4px] ">
                <Pencil
                  fill="#2c398d"
                  className="  text-[var(--dark-text)] size-[19px] "
                />
              </div>
            </div>
          </div>
          {/* fullname */}
          <div className="flex sm:flex-row flex-col items-center gap-[10px] justify-between w-full">
            <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
              <label htmlFor={RegisterValue["firstName"]}>First Name</label>
              <input
                type="text"
                value={RegisterValue["firstName"]}
                onChange={(e) => handleInputChange(e, "firstName")}
                className=" w-full outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px]"
              />
              {
                <div className="text-[12px] text-[#af2e2e]">
                  {ValidateError.firstname}
                </div>
              }
            </div>
            <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
              <label htmlFor={RegisterValue["lastName"]}>Last Name</label>
              <input
                type="text"
                value={RegisterValue["lastName"]}
                onChange={(e) => handleInputChange(e, "lastName")}
                className=" w-full bg-[var(--light-foreground)] border-[var(--dark-border)] outline-none py-[5px] lg:py-[7px] px-[8px] rounded-md border-[1px]"
              />
              {ValidateError && (
                <div className="text-[12px] text-[#af2e2e] ">
                  {ValidateError.lastname}
                </div>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
            Email
            <label htmlFor="email" className="font-Poppins text-[15px]"></label>
            <input
              type="email"
              id="email"
              value={RegisterValue.email}
              onChange={(e) =>
                handleInputChange(e, "email" as keyof ValidationType)
              }
              className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
            />
            {ValidateError["email"] && (
              <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                {ValidateError["email"]}
              </div>
            )}
          </div>
          {/* phoneNumber */}
          <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
            Phone Number
            <label
              htmlFor="phoneNumber"
              className="font-Poppins text-[15px]"
            ></label>
            <input
              type="text"
              id="text"
              value={RegisterValue.phoneNumber}
              onChange={(e) =>
                handleInputChange(e, "phoneNumber" as keyof ValidationType)
              }
              className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full "
            />
            {ValidateError["email"] && (
              <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                {ValidateError["number"]}
              </div>
            )}
          </div>
          {/* passwords */}
          <div className="w-full flex sm:flex-row flex-col justify-center items-center gap-[10px]">
            <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
              <label htmlFor="password" className="font-Poppins text-[15px]">
                Password
              </label>
              <input
                type={ShowPassword ? "text" : "password"}
                id="password"
                value={RegisterValue.password}
                onChange={(e) =>
                  handleInputChange(e, "password" as keyof ValidationType)
                }
                className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
              />

              <div
                className="absolute top-[30px] lg:top-[33px] text-[var(--dark-secondary-text)]  right-[14px] w-[15px] h-[15px]"
                onClick={() => setShowPassword(!ShowPassword)}
              >
                {ShowPassword ? (
                  <Eye className=" size-5 sm:size-6  " />
                ) : (
                  <EyeOff className=" size-5 sm:size-6  " />
                )}
              </div>

              {ValidateError["password"] && (
                <div className="text-[12px] text-[#af2e2e] flex flex-col ">
                  {ValidateError["password"]}
                </div>
              )}
            </div>
            <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
              <label htmlFor="confirmpassword" className=" text-[15px]">
                Confirm Password
              </label>
              <input
                type={ShowPassword ? "text" : "password"}
                id="confirmpassword"
                value={RegisterValue.confirmpassword}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    "confirmpassword" as keyof ValidationType
                  )
                }
                className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
              />

              <div
                className="absolute  top-[29px] lg:top-[33px]  right-[14px] w-[15px] h-[15px] text-[var(--dark-secondary-text)] "
                onClick={() => setShowPassword(!ShowPassword)}
              >
                {ShowPassword ? (
                  <Eye className=" size-5 sm:size-6  " />
                ) : (
                  <EyeOff className=" size-5 sm:size-6  " />
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
              className="text-sm text-[var(--dark-secondary-text)]  font-Poppins hover:underline cursor-pointer"
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
    <div className="flex flex-col items-center justify-between w-full h-screen 2xl:justify-center lg:py-5">
      <RegisterContainer />
      <div className="w-full pt-10 ">
        <AuthFooter />
      </div>
    </div>
  );
};
