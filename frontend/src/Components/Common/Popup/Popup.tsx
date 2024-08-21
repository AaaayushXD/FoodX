import { X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";

interface ModelProp {
  close: boolean;
  children: ReactNode;
  closeModal: () => void;
  disableScroll?: boolean;
}

const Modal: React.FC<ModelProp> = ({
  close,
  children,
  closeModal,
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
      className={`md:w-[600px] bg-[var(--popup-bg)] w-full py-9 overflow-hidden   min-w-[100vw] px-7 sm:min-h-[100vh] h-full   justify-center flex items-center fixed top-0 left-0 backdrop-blur-[9.5px] flex-grow-[1] duration-150 ease-in-out`}
      style={{
        opacity: !close ? 1 : 0,
        zIndex: !close ? 50 : -3,
      }}
    >
      <div
        className=" overflow-auto rounded py-4 bg-[var(--light-foreground)] text-[var(--primary-color)] hover:text-[var(--primary-light)] flex duration-150 sm:h-fit relative md:w-[800px] w-full shadow-[var(--dark-text)]    z-[60]  "
        ref={modalRef}
      >
        <div className="w-full z-[100]  overflow-auto">{children}</div>
        <X
          className=" text-red-500 right-5 z-[1000]  top-[15px] absolute  cursor-pointer hover:text-red-700"
          onClick={closeModal}
        />
      </div>
    </div>
  );
};

export default Modal;