import { X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

interface ModelProp {
  isExport?: boolean;
  close: boolean;
  children: ReactNode;
  closeModal: () => void;
  disableScroll?: boolean;
}

export const Modal: React.FC<ModelProp> = ({
  close,
  children,
  closeModal,
  isExport
}: ModelProp) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        modalRef.current &&
        !modalRef.current?.contains(event.target as any)
      ) {
        closeModal();
      }
    };
    if (!close) {
      document.body.style.overflowY = "hidden";
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflowY = "unset";
    };
  }, [close, closeModal]);

  return (
    <div
      className={`md:w-[600px] bg-[var(--popup-bg)] w-full  overflow-hidden   min-w-[100vw] px-7 sm:min-h-[100vh] h-full   justify-center flex items-center fixed top-0 left-0 backdrop-blur-[9.5px] flex-grow-[1] duration-150 ease-in-out`}
      style={{
        opacity: !close ? 1 : 0,
        zIndex: !close ? 50 : -3,
      }}
    >
      <div
        className={` overflow-auto ${
          isExport ? "pt-16" : "p-4"
        } rounded  bg-[var(--light-foreground)] text-[var(--primary-color)] hover:text-[var(--primary-light)] duration-150  relative md:w-[800px] w-full shadow-[var(--dark-text)]    z-[60]  `}
        ref={modalRef}
      >
        <div className="w-full z-[1000] overflow-auto">{children}</div>
        <button
          className="absolute top-[7px] rounded right-[30px] p-3 hover:cursor-pointer duration-150 ease-in-out text-red-500 hover:text-red-600"
          onClick={closeModal}
        >
          <X />
        </button>
      </div>
    </div>
  );
};


