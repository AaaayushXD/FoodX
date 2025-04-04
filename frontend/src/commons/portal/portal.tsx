// AddProductPortal.tsx
import ReactDOM from "react-dom";

export const Portal = ({ openReview, children }: { openReview: boolean; children: React.ReactNode }) => {
  if (typeof window === "undefined") return null; // for SSR

  return ReactDOM.createPortal(
    <div
      className={`fixed z-[2000] top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-transparent to-black/60 backdrop-blur-lg w-screen h-screen duration-150 flex flex-col items-center md:justify-center justify-between ${
        openReview ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {children}
    </div>,
    document.body
  );
};


