import { ArrowLeft, Frown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex sm:flex-row justify-center items-center flex-col-reverse sm:gap-52 gap-5 py-5 sm:py-16 px-3">
      <div className="flex flex-col items-baseline justify-center sm:gap-7 gap-4">
        <h3 className="text-[50px] sm:text-[100px]">404</h3>
        <h4 className=" text-[40px] sm:text-[50px]">Page Not Found</h4>
        <p className=" text-[17px] sm:text-[25px] text-[var(--dark-text)]">
          Sorry, The Page You are looking doest not exist
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex  items-center gap-3 justify-center bg-[var(--dark-background)] px-10 py-3 rounded-md  text-[var(--light-text)]"
        >
          <ArrowLeft />
          <span>Go Back</span>
        </button>
      </div>
      <div className="sm:w-[500px] sm:h-[400px] w-[300px] h-[200px]">
        <Frown className="w-full h-full text-[var(--secondary-color)]" />
      </div>
    </div>
  );
};

