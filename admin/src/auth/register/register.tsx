// import React, { ChangeEvent, FormEvent, useRef, useState } from "react";

// import { Eye, EyeOff, Pencil } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { checkValidNumber, validatePasswordOnChange } from "./RegisterHandler";
// import { allFieldsRequired } from "./RegisterHandler";
// import { AuthFooter } from "../../components/footer/authFooter";
// import avatar from "../../assets/logo/avatar.png";
// import logo from "../../assets/logo/Fx.png";
// import toast from "react-hot-toast";
// import ClipLoader from "react-spinners/HashLoader";

// import { signUp } from "../../services/user";
// import { uploadImage } from "@/services";

// export const RegisterContainer: React.FC<LoginProp> = ({ role }) => {
//   const navigate = useNavigate();
//   const [RegisterValue, setRegisterValue] = useState<Auth.ValidationType>({
//     avatar: "",
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [ValidateError, setValidateError] = useState<Record<string, string>>(
//     {}
//   );
//   const [SelectedImage, setSelectedImage] = useState<File | null>(null);

//   const uploadRef = useRef<HTMLInputElement | null>(null);

//   const [ShowPassword, setShowPassword] = useState(false);
//   const [DataSend, SetDataSend] = useState<boolean>(true);

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement>,
//     inputField: string
//   ) => {
//     setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
//   };

//   const imageChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (!event.target.files) {
//       throw new Error("Uploading failed...");
//     }
//     const file = event.target.files[0];
//     setRegisterValue({ ...RegisterValue, avatar: file });
//     setSelectedImage(file);
//   };

//   function Validation(error: Record<string, string>) {
//     allFieldsRequired(RegisterValue, error);
//     // validateEmail(RegisterValue, error);
//     checkValidNumber(RegisterValue, error);
//     validatePasswordOnChange(RegisterValue, error);

//     if (Object.keys(error).length === 0) {
//       return null;
//     } else {
//       return error;
//     }
//   }

//   const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const error: Record<string, string> = {};
//     Validation(error);
//     setValidateError(error);

//     try {
//       const validatedRegister = Validation(error);
//       if (validatedRegister === null || undefined) {
//         const { avatar, password, email, lastName, firstName, phoneNumber } =
//           RegisterValue;
//         SetDataSend(false);
//         const imageUrl = await uploadImage(avatar, "users");
//         const ConvertedForm: Auth.ValidationType = {
//           firstName,
//           lastName,
//           phoneNumber,
//           email,
//           password,
//           avatar: `${imageUrl?.data?.folderName}/${imageUrl?.data?.filename}`,
//           role: role as Auth.UserRole,
//         };
       
//         navigate("/email-verification");
//       }
//     } catch (error) {
//       toast.error(`User already logged in`);
//     }
//     RegisterValue.avatar = "";
//     RegisterValue.firstName = "";
//     RegisterValue.lastName = "";
//     RegisterValue.password = "";
//     RegisterValue.confirmPassword = "";
//     RegisterValue.email = "";
//     RegisterValue.phoneNumber = "";
//     SetDataSend(false);
//   };

//   return (
//     <div className="flex lg:flex-row w-full  items-start flex-col lg:items-center    lg:justify-evenly   ">
//       <div className="bg-[var(--light-foreground)] lg:bg-transparent w-full lg:w-auto py-2  mb-4 ">
//         <img src={logo} alt="" className="lg:w-[500px]  w-[150px]  " />
//       </div>
//       <div className="w-full lg:w-auto  flex sm:px-3 px-5 flex-col items-center justify-center ">
//         <div className=" px-5 pb-[10px] text-[25px] font-bold text-[var(--primary-color)]  text-center">
//           <h1 className="md:hidden">Sign In</h1>
//           <h1 className="hidden md:block">Sign In With Email</h1>
//         </div>

//         <form
//           action=""
//           onSubmit={handleFormSubmit}
//           className=" flex flex-col  sm:w-[550px] w-full  items-center gap-3 bg-[var(--light-foreground)] p-6 rounded-lg text-[var(--dark-text)] "
//         >
//           <div className="relative duration-150 group/image  flex flex-col items-center justify-center gap-1">
//             {SelectedImage ? (
//               <img
//                 src={URL.createObjectURL(SelectedImage)}
//                 alt=""
//                 className="rounded-full w-[100px] h-[100px] border-[2px] border-[var(--primary-color)] opacity-[0px] bg-[var(--light-background)] outline-none"
//               />
//             ) : (
//               <img
//                 src={avatar}
//                 alt=""
//                 className="rounded-full w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none"
//               />
//             )}
//             {ValidateError["avatar"] && (
//               <div className="text-[12px] text-[#af2e2e] ">
//                 {ValidateError["avatar"]}
//               </div>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               className=" hidden rounded-full  w-[100px] h-[100px] border-[1px] opacity-[0px] bg-[var(--light-background)] outline-none  "
//               ref={uploadRef as any}
//               onChange={imageChange}
//             />
//             <div
//               className="absolute p-2  group-hover/image:visible invisible w-[100px] h-[100px] rounded-full flex justify-end items-end cursor-pointer bg-[#86b1e75e]  text-[white] py-[3px] px-[5px] font-Poppins text-[14px] "
//               onClick={() => uploadRef.current && uploadRef.current.click()}
//             >
//               <div className="bg-[var(--light-foreground)] rounded-full p-[4px] ">
//                 <Pencil
//                   fill="#2c398d"
//                   className="  text-[var(--dark-text)] size-[19px] "
//                 />
//               </div>
//             </div>
//           </div>
//           {/* fullname */}
//           <div className="flex items-center gap-[10px] justify-between w-full">
//             <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
//               <label htmlFor={RegisterValue["firstName"]}>First Name</label>
//               <input
//                 type="text"
//                 value={RegisterValue["firstName"]}
//                 onChange={(e) => handleInputChange(e, "firstName")}
//                 className=" w-full outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px]"
//               />
//               {
//                 <div className="text-[12px] text-[#af2e2e]">
//                   {ValidateError.firstname}
//                 </div>
//               }
//             </div>
//             <div className="flex w-full flex-col items-start h-[65px] lg:h-[73px]">
//               <label htmlFor={RegisterValue["lastName"]}>Last Name</label>
//               <input
//                 type="text"
//                 value={RegisterValue["lastName"]}
//                 onChange={(e) => handleInputChange(e, "lastName")}
//                 className=" w-full bg-[var(--light-foreground)] border-[var(--dark-border)] outline-none py-[5px] lg:py-[7px] px-[8px] rounded-md border-[1px]"
//               />
//               {ValidateError && (
//                 <div className="text-[12px] text-[#af2e2e] ">
//                   {ValidateError.lastname}
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Email */}
//           <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
//             Email
//             <label htmlFor="email" className="font-Poppins text-[15px]"></label>
//             <input
//               type="email"
//               id="email"
//               value={RegisterValue.email}
//               onChange={(e) =>
//                 handleInputChange(e, "email" as keyof RegisterModal)
//               }
//               className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
//             />
//             {ValidateError["email"] && (
//               <div className="text-[12px] text-[#af2e2e] flex flex-col ">
//                 {ValidateError["email"]}
//               </div>
//             )}
//           </div>
//           {/* phoneNumber */}
//           <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start ">
//             Phone Number
//             <label
//               htmlFor="phoneNumber"
//               className="font-Poppins text-[15px]"
//             ></label>
//             <input
//               type="text"
//               id="text"
//               value={RegisterValue.phoneNumber}
//               onChange={(e) =>
//                 handleInputChange(e, "phoneNumber" as keyof RegisterModal)
//               }
//               className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full "
//             />
//             {ValidateError["email"] && (
//               <div className="text-[12px] text-[#af2e2e] flex flex-col ">
//                 {ValidateError["number"]}
//               </div>
//             )}
//           </div>
//           {/* passwords */}
//           <div className="w-full flex justify-center items-center gap-[10px]">
//             <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start  relative cursor-pointer">
//               <label htmlFor="password" className="font-Poppins text-[15px]">
//                 Password
//               </label>
//               <input
//                 type={ShowPassword ? "text" : "password"}
//                 id="password"
//                 value={RegisterValue.password}
//                 onChange={(e) =>
//                   handleInputChange(e, "password" as keyof RegisterModal)
//                 }
//                 className="outline-none py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
//               />

//               <div
//                 className="absolute top-[29px] lg:top-[33px] text-[var(--dark-secondary-text)]  right-[14px] w-[15px] h-[15px]"
//                 onClick={() => setShowPassword(!ShowPassword)}
//               >
//                 {ShowPassword ? (
//                   <Eye className="size-5 text-[var(--dark-secondary-text)] " />
//                 ) : (
//                   <EyeOff className="size-5 text-[var(--dark-secondary-text)] " />
//                 )}
//               </div>

//               {ValidateError["password"] && (
//                 <div className="text-[12px] text-[#af2e2e] flex flex-col ">
//                   {ValidateError["password"]}
//                 </div>
//               )}
//             </div>
//             <div className="flex w-full flex-col h-[65px] lg:h-[73px]  items-start relative  cursor-pointer">
//               <label htmlFor="confirmpassword" className=" text-[15px]">
//                 Confirm Password
//               </label>
//               <input
//                 type={ShowPassword ? "text" : "password"}
//                 id="confirmpassword"
//                 value={RegisterValue.confirmpassword}
//                 onChange={(e) =>
//                   handleInputChange(e, "confirmpassword" as keyof RegisterModal)
//                 }
//                 className="outline-none  relative py-[5px] lg:py-[7px] px-[8px] bg-[var(--light-foreground)] border-[var(--dark-border)] rounded-md border-[1px] w-full"
//               />

//               <div
//                 className="absolute  top-[29px] lg:top-[33px]  right-[14px] w-[15px] h-[15px] text-[var(--dark-secondary-text)] "
//                 onClick={() => setShowPassword(!ShowPassword)}
//               >
//                 {ShowPassword ? (
//                   <Eye className="size-5 text-[var(--dark-secondary-text)] " />
//                 ) : (
//                   <EyeOff className="size-5 text-[var(--dark-secondary-text)] " />
//                 )}
//               </div>
//               {ValidateError["confirmpassword"] && (
//                 <div className="text-[12px] text-[#af2e2e] flex flex-col ">
//                   {ValidateError["confirmpassword"]}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="w-full flex flex-col items-center gap-3 ">
//             <button
//               type="submit"
//               className=" w-full h-[40px] text-lg  rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white sm:text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5"
//             >
//               {DataSend ? (
//                 "Submit"
//               ) : (
//                 <div className="flex items-center justify-center gap-2">
//                   Sending <ClipLoader color="white" size={"20px"} />
//                 </div>
//               )}
//             </button>
//             <p
//               className="text-sm text-[var(--dark-secondary-text)]  font-Poppins hover:underline cursor-pointer"
//               onClick={() => navigate("/login")}
//             >
//               Already have an account?{" "}
//               <a className="hover:text-[var(--primary-color)]">SignIn</a>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export const Register: React.FC<LoginProp> = ({ role }) => {
//   return (
//     <div className="flex w-full h-screen flex-col items-center justify-between 2xl:justify-center lg:py-5">
//       <RegisterContainer role={role} />
//       <div className="w-full pt-10 ">
//         <AuthFooter />
//       </div>
//     </div>
//   );
// };
