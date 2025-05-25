import React, { useState } from "react";
import "@/index.css";

export const RippleButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
  hover?: string;
  onClick?: () => void;
}> = ({ onClick, children, className, color, hover }) => {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  const createRipple = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const id = Date.now(); // Unique ID for each ripple

    setRipples([...ripples, { x, y, id }]);

    // Remove ripple after animation ends
    setTimeout(() => {
      setRipples((currentRipples) => currentRipples.filter((r) => r.id !== id));
    }, 600);
  };

  const buttonColor = `!text-${color}-500`;
  const rippleEffect = `!bg-${hover}-500 `;

  return (
    <button
      className={` ${className} ripple-button ${rippleEffect} `}
      onClick={(e) => {
        createRipple(e);
        onClick();
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`ripple ${buttonColor} `}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "100px",
            height: "100px",
          }}
        />
      ))}
    </button>
  );
};
