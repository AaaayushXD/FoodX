import { Trash, Trash2 } from "lucide-react";
import React from "react";

interface DeleteProp {
  id: string;
  path?: "banners" | "sponsors" | string;
  type?: "specials" | "products";
  isClose: boolean;
  setDelete: (id: string, type: "specials" | "products") => void;
  closeModal: () => void;
}

export const Delete: React.FC<DeleteProp> = ({
  id,
  setDelete,
  type,
  closeModal,
}) => {
  return (
    <div className="md:w-[600px] bg-[var(--popup-bg)] w-full py-9 overflow-hidden   min-w-[100vw] px-7 sm:min-h-[100vh] h-full  z-[20] justify-center flex items-center fixed top-0 left-0 backdrop-blur-[9.5px] flex-grow-[1] duration-150 ease-in-out">
      <div className=" fixed flex flex-col items-center justify-center min-w-[500px]  py-14 rounded-lg bg-[var(--light-foreground)] shadow gap-4">
        <div className="p-6 rounded-full bg-[#ff3f3f41]  ">
          <Trash className="size-14 text-[var(--danger-bg)] " />
        </div>
        <div className="w-full flex-col gap-1 items-center justify-center flex">
          <h2 className="text-[23px] tracking-wide text-[var(--dark-text)] ">
            Delete
          </h2>
          <p className="text-[17px] tracking-wide text-[var(--dark-secondary-text)] ">
            Are you sure want to delete ?
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-5">
          <button
            onClick={closeModal}
            className="text-[var(--dark-text)] hover:bg-[var(--light-background)] duration-150 border-[var(--dark-secondary-text)] text-[17px] tracking-wide px-7 py-2 rounded-lg  "
          >
            Cancel
          </button>
          <button
            onClick={() => setDelete(id, type as "specials" | "products")}
            className="text-[var(--dark-text)] border-[var(--danger-text)] hover:bg-[var(--danger-text)] duration-150 text-[17px] tracking-wide px-7 py-2 rounded-lg bg-[var(--danger-bg)] "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteButtonProp {
  dataLength: number;
  deleteFn: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProp> = ({
  deleteFn,
  dataLength,
}) => {
  return (
    <button
      disabled={dataLength < 1}
      className={`hover:bg-[var(--light-background)] ${
        dataLength > 0 ? "cursor-pointer" : "cursor-not-allowed"
      } rounded-lg duration-150 p-2`}
      onClick={deleteFn}
    >
      <Trash2
        strokeWidth={3}
        className="size-[25px] duration-150 text-[var(--dark-secondary-text)]   "
      />
    </button>
  );
};