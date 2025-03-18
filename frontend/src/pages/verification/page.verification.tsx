import { FormEvent, useState, useEffect, useRef } from "react";
import { verifyAction } from "../../actions";
import { useAppDispatch } from "../../hooks/useActions";
import { Icons } from "../../utils";

export const VerificationPage = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  const resendTime = localStorage.getItem("time");
  const [timer, setTimer] = useState(parseInt(resendTime as string) || 0); // Timer for 30 seconds for resend
  const inputs = useRef<HTMLInputElement[]>([]);

  // Countdown timer for Resend button
  useEffect(() => {
    if (!resendTime || timer <= 0) {
      localStorage.setItem("time", JSON.stringify(30));
    }

    if (timer) {
      const interval = setInterval(() => {
        const time = parseInt(resendTime as string) - 1;
        setTimer((prev) => prev - 1);
        localStorage.setItem("time", JSON.stringify(time));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      setIsResendAvailable(true);
    }
  }, [timer]);

  const dispatch = useAppDispatch();

  // Handle OTP input and focus movement
  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Only allow numeric input

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to the next input
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle backspace for moving focus to the previous box
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Submit OTP for verification
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const uid = localStorage.getItem("uid");
    const otpString = otp.join("");
    await dispatch(
      verifyAction({ otp: parseInt(otpString), uid: uid as string })
    );
  }

  // Resend OTP function
  const handleResend = () => {
    setOtp(new Array(6).fill(""));
    setTimer(30); // Reset the timer
    setIsResendAvailable(false);
    // Logic to resend OTP (e.g., call a service)
  };

  return (
    <div className="flex flex-col w-full h-[100vh] items-center justify-center sm:justify-evenly gap-8 sm:gap-16">
      <div className="flex justify-center items-center bg-[var(--secondary-color)] p-5 rounded-full">
        <Icons.send className="w-20 h-20 text-[var(--light-text)]" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 px-6">
        <div className="flex flex-col items-center">
          <h1 className="text-[30px] text-[var(--dark-text)] font-bold">
            Enter your OTP
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-12 text-center text-xl border border-[var(--secondary-color)] rounded-md outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
                  ref={(el) => (inputs.current[index] = el!)}
                />
              ))}
            </div>
            <button
              type="submit"
              className="text-[var(--dark-text)] duration-150 py-2 px-10 mt-6 rounded-md bg-[var(--primary-color)] hover:bg-[var(--primary-color)]"
            >
              Verify OTP
            </button>
          </form>
          <h2 className="text-[15px] sm:text-[17px] text-[var(--dark-secondary-text)] mt-4">
            Please enter the 6-digit code sent to your email
          </h2>
        </div>

        {/* Resend OTP */}
        <div className="mt-4">
          {isResendAvailable ? (
            <button
              onClick={handleResend}
              className="text-[var(--dark-text)] duration-150 py-2 px-10 rounded-md bg-[var(--secondary-color)] hover:bg-[var(--primary-color)]"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-[var(--dark-secondary-text)]">
              Resend OTP in {parseInt(resendTime as string)} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
