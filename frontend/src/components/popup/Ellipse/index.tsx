import React, { useEffect, useRef } from "react";

interface EllipsePopupProp {
  className: string;
  action: () => void;
  children: React.ReactNode;
  isOpen: boolean;
}
export const EllipsePopup: React.FC<EllipsePopupProp> = ({
  action,
  className,
  children,
}) => {
  const ellipseReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleCloseModal(event: MouseEvent) {
      if (
        ellipseReference.current &&
        !ellipseReference.current.contains(event.target as Node)
      ) {
        action();
      }
    }

    document.addEventListener("mousedown", handleCloseModal);

    return () => {
      document.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);

  return (
    <div
      ref={ellipseReference}
      className={` max-w-sm bg-black p-1.5 rounded-2xl shadow absolute  ${className}`}
    >
      {children}
    </div>
  );
};
