import React from "react";
import { useNavigate } from "react-router-dom";

interface EmptyProp {
  title: string;
  icons?: React.ReactNode;
  image?: string;
  description?: string;
  action?: () => void;
  actionTitle?: string;
}
export const Empty: React.FC<EmptyProp> = ({
  title,
  action,
  description,
  icons,
  image,
  actionTitle,
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
      {image && <img src={image} alt="No orders found" className="size-44" />}
      {icons && icons}
      <h4 className="sm:text-xl text-lg  text-black mt-4">{title}</h4>
      {description && (
        <p className="text-sm text-[var(--dark-secondary-text)]">
          {description}
        </p>
      )}

      {action && actionTitle && (
        <button
          onClick={() => navigate("/#categories")}
          className="mt-4 bg-[var(--primary-light)] text-white py-2 px-4 rounded hover:bg-[var(--primary-dark)]"
        >
          Browse Categories
        </button>
      )}
    </div>
  );
};
