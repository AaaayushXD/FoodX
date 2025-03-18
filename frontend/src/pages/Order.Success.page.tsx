import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Success from "@/assets/success.png";

import { Check } from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  //   const [initialData, setInitialData] = useState<Product[]>([]);
  const { state } = useLocation();
  const products =
    state?.products ||
    useSelector((state: RootState) => state.root.cart.products);
  return products?.length > 0 ? (
    <div className="w-full flex flex-col px-5 py-10 items-center justify-center gap-5 ">
      {/* Success Icon and Message */}
      <div className="w-full flex flex-col items-center">
        <div className="flex  size-20 items-center rounded-full bg-green-100 justify-center mb-6">
          <Check strokeWidth={"2"} className=" text-green-500 size-14  " />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We’ve got it and will start processing right away. You’ll receive a
          confirmation soon. Stay tuned!
        </p>
      </div>

      {/* Order Summary */}
      <div className="min-w-[250px]   w-[400px] min-h-[230px] h-[350px] ">
        <img
          className="w-full scale-[1.1] sm:scale-[1.3] h-full"
          src={Success}
          alt="Success"
        />
      </div>

      <button
        onClick={() => navigate("/orders/")}
        className=" mt-5 px-4 cursor-pointer bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        View your orders
      </button>
    </div>
  ) : (
    <Navigate to={"/"} replace />
  );
};

