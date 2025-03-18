import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import ClipLoader from "react-spinners/HashLoader";

import toast from "react-hot-toast";
import { reAuthUser } from "../../firebase/utils";

interface ReAuthProp {
  isVerified: () => void;
}

const ReAuth: React.FC<ReAuthProp> = ({ isVerified }) => {
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

  const HandleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email && !password)
      return toast.error("Email or Password are required.");
    setLoading(true);
    try {
      await reAuthUser(email, password);
      isVerified();
    } catch (error) {
      toast.error("Invalid Email or Password");
      throw new Error("Error while verifying user" + error);
    }
    setLoading(false);
  };
  return (
    <div className={`w-full  flex justify-center items-center z-30`}>
      <div className="flex items-center justify-center max-w-[800px] min-w-[400px] w-[600px] px-3 py-8">
        <div className="w-full h-full bg-[var(--light-foreground)] flex flex-col gap-8 rounded-lg shadow-sm relative">
          <div className="w-full flex flex-col items-center gap-3 px-3   text-[30px] font-bold text-[var(--primary-color)] tracking-wide text-center">
            <h1 className="md:hidden">ReAuthenticate</h1>
            <h1 className="hidden md:block">ReAuthenticate</h1>
          </div>
          <div className="px-3 py-4">
            <form className="flex flex-col gap-3 p-2" onSubmit={HandleSubmit}>
              <div className="relative flex flex-col gap-2">
                <label
                  htmlFor="logEmail"
                  className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-[var(--dark-border)]  border-[1px] bg-[var(--light-foreground)] rounded-md h-[40px] outline-none px-5 py-4 text-[var(--dark-text)] text-md"
                />
              </div>
              <div className="relative flex flex-col gap-2">
                <label
                  htmlFor="logPassword"
                  className="font-semibold pl-0.5 text-[15px] text-[var(--dark-text)]"
                >
                  Password
                </label>
                <input
                  type={passwordType}
                  name="password"
                  autoComplete="off"
                  maxLength={25}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-[var(--dark-border)]  border-[1px] bg-[var(--light-foreground)] rounded-md h-[40px] outline-none px-5 py-4 text-[var(--dark-text)] text-md"
                />

                {show ? (
                  <div
                    className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                    onClick={showPassword}
                  >
                    <Eye size={23} />
                  </div>
                ) : (
                  <div
                    className="text-[var(--dark-secondary-text)] absolute top-[37px] right-[10px] cursor-pointer"
                    onClick={showPassword}
                  >
                    <EyeOff size={23} />
                  </div>
                )}
              </div>

              <p
                onClick={() => navigate("/forgot-password")}
                className="text-[var(--dark-secondary-text)] text-sm cursor-pointer hover:underline select-none"
              >
                Forgot Password?
              </p>
              <button
                className="h-[40px] rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-light)] text-white text-xl font-bold tracking-wide transition-colors duration-500 ease-in-out mt-5 "
                type="submit"
              >
                {!loading ? (
                  "Submit"
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Sending <ClipLoader color="white" size={"20px"} />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReAuth;

