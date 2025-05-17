import { FormEvent, useState, useEffect, useRef } from "react";
import { verifyAction } from "../../actions";
import { useAppDispatch, useAppSelector } from "../../hooks/useActions";
import { Icons, toaster } from "../../utils";
import { ApiError } from "@/helpers";
import { resendOtp } from "@/services";

export const VerificationPage = () => {
  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center sm:justify-evenly gap-8 sm:gap-16">
      <VerificationContainer />
    </div>
  );
};

export const VerificationContainer = ({
  closeModal,
}: {
  closeModal?: () => void;
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { auth } = useAppSelector();
  // Improved timer logic
  const [timer, setTimer] = useState(() => {
    const savedTime = localStorage.getItem("time");
    return savedTime ? parseInt(savedTime) : 30;
  });

  const inputs = useRef<HTMLInputElement[]>([]);
  const getVerifyType = localStorage?.getItem("verifyType") as "otp" | "reset";
  const uid = localStorage?.getItem("uid");
  const accessToken = localStorage?.getItem("accessToken");
  const dispatch = useAppDispatch();

  // Countdown timer for Resend button
  useEffect(() => {
    if (timer <= 0) {
      setIsResendAvailable(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const newTime = prevTimer - 1;
        localStorage.setItem("time", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input and focus movement
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Only allow numeric input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to the next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle backspace for moving focus to the previous box
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Submit OTP for verification
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate OTP
    if (otp.some((digit) => digit === "")) {
      toaster({
        message: "Please enter all 6 digits",
        icon: "error",
      });
      return;
    }

    setIsVerifying(true);

    const otpString = otp.join("");

    try {
      await dispatch(
        verifyAction({
          otp: otpString,
          uid: uid as string || auth?.userInfo?.uid as string,
          type: getVerifyType,
          accessToken: accessToken as string,
        })
      );
    } catch (error) {
      console.log(error);
      // if (error instanceof ApiError) {
      //   toaster({
      //     message: error?.message,
      //     icon: "error",
      //     className: "bg-red-50",
      //     title: "Error",
      //   });
      // }
    } finally {
      closeModal && closeModal();
      setIsVerifying(false);
    }
  }

  // Resend OTP function
  const handleResend = async () => {
    try {
      setOtp(new Array(6).fill(""));
      setTimer(30); // Reset the timer
      localStorage.setItem("time", "30");
      const response = await resendOtp({
        email: localStorage?.getItem("email") as string,
        type: "reset",
        uid: uid as string
      });
      toaster({
        className: "bg-success-50",
        icon: "success",
        message: response?.message,
        title: "Success",
      });
      setIsResendAvailable(false);

      // Focus on first input
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);

      // Add your resend OTP logic here
      // For example: await dispatch(resendOtpAction({ uid: localStorage.getItem("uid") }))
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          className: "bg-red-50",
          icon: "error",
          message: error?.message,
          title: "Error",
        });
      }
    }
  };

  return (
    <div className="w-full p-5 flex flex-col items-center justify-start gap-5">
      <div className="flex justify-center items-center bg-[var(--primary-color)] p-5 rounded-full transition-all duration-300 hover:scale-105">
        <Icons.send className="size-16 text-[var(--light-text)]" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-6 w-full max-w-md">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-[30px] text-[var(--dark-text)] font-bold mb-4">
            Enter your OTP
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-xl border border-[var(--dark-border)] rounded-md outline-none focus:ring-2 focus:ring-[var(--dark-border)] transition-all duration-150"
                  ref={(el) => (inputs.current[index] = el!)}
                  disabled={isVerifying}
                  autoFocus={index === 0 && otp[0] === ""}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isVerifying || otp.some((digit) => digit === "")}
              className={`text-white duration-150 py-2 px-10 mt-6 rounded-md bg-[var(--dark-text)] hover:opacity-90 transition-all w-full flex justify-center items-center ${
                isVerifying || otp.some((digit) => digit === "")
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {isVerifying ? (
                <>
                  <Icons.loading className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <h2 className="text-[15px] sm:text-[17px] text-[var(--dark-secondary-text)] mt-4 text-center">
            Please enter the 6-digit code sent to your email
          </h2>
        </div>

        {/* Resend OTP */}
        <div className="mt-4 w-full flex justify-center">
          {isResendAvailable ? (
            <button
              onClick={handleResend}
              disabled={isVerifying}
              className={`text-[var(--dark-text)] font-[500] duration-150 py-2 px-10 border-[1px] rounded-lg border-gray-200  transition-all ${
                isVerifying ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Resend OTP
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[var(--dark-secondary-text)]">
              <Icons.loading className="w-4 h-4 animate-spin" />
              Resend OTP in {timer} seconds
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
