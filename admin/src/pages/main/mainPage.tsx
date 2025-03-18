import React from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "@/assets/Home.png";


interface WelcomePageProps {
  user: (role: Auth.UserRole
    
  ) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-[100vh]">
      <div className="flex bg-gradient-to-r from-[rgba(0,191,255,0.45)] to-[rgba(0,191,255,1)]  w-full h-[100vh] items-center justify-center">
        <div
          style={{
            backgroundImage: `url(${Welcome})`,
          }}
          className="w-full px-3 sm:pl-14 h-full justify-center bg-no-repeat bg-right bg-contain  flex flex-col items-start"
        >
          <div className="w-full flex flex-col items-start justify-center">
            <span className="w-full trackiwn\ text-[var(--dark-secondary-text)] text-[17px]">
              Welcome to FoodX Management
            </span>
            <h1 className="lg:text-[4rem] md:text-[3rem] text-[2rem] tracking-wider font-bold text-[var(--primary-color)]">
              Manage Your Dashboard
            </h1>
            <p className="pt-4 lg:w-[650px] sm:w-[500px] min-w-[200px] text-sm tracking-wide text-[var(--dark-text)]">
              Streamline your canteen processes with ease and improve efficiency
              in managing daily operations.{" "}
              <span className="sm:visible hidden ">
                Access the Admin or Chef dashboard to manage orders, update
                inventory, and track sales trends.
              </span>
            </p>
          </div>

          {/* Interaction and Info Section */}
          <div className="flex justify-start items-center gap-5 pt-8">
            <button
              className="sm:px-8 px-2 py-2 rounded-lg border-[1px] border-[var(--primary-color)] text-[var(--primary-color)] text-[14px] sm:text-[16px] tracking-wide hover:bg-[var(--primary-color)] hover:text-white transition ease-in-out duration-300"
              onClick={() => {
                user("admin");
                navigate("/admin");
              }}
            >
              Admin Dashboard
            </button>
            <button
              className="sm:px-8 px-2 py-2 rounded-lg border-[1px] border-[var(--secondary-color)] text-[var(--secondary-color)] text-[14px] sm:text-[16px] tracking-wide hover:bg-[var(--secondary-color)] hover:text-white transition ease-in-out duration-300"
              onClick={() => {
                user("chef");
                navigate("/chef");
              }}
            >
              Chef Dashboard
            </button>
          </div>

          {/* Additional Resources or Quick Stats */}
          <div className="mt-8 text-xs sm:text-sm tracking-wider flex flex-col items-start gap-1.5 text-[var(--dark-secondary-text)]">
            <p>Quick Tips:</p>
            <ul className="list-disc   list-inside ml-5">
              <li>Admin: Oversee orders, update menus, track revenue.</li>
              <li>
                Chef: Manage inventory, process tickets, update menu items.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
