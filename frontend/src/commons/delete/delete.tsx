import { Icons } from "@/utils";

interface DeleteProp {
  id: string;
  setDelete: (id: string) => void;
  closeModal: () => void;
}



export const Delete: React.FC<DeleteProp> = ({ id, setDelete, closeModal }) => {
  return (
    <div className="md:w-[600px] bg-[var(--popup-bg)] w-full py-9 overflow-hidden   min-w-[100vw] px-7 sm:min-h-[100vh] h-full  z-[20] justify-center flex items-center fixed top-0 left-0 backdrop-blur-[9.5px] flex-grow-[1] duration-150 ease-in-out">
      <div className="  flex flex-col items-center justify-center   sm:px-5 min-w-full left-5 right-5 sm:min-w-[500px]  sm:py-14 py-8 rounded-lg bg-[var(--light-foreground)] shadow  gap-2.5 sm:gap-4">
        <div className="p-6 rounded-full bg-[#ff3f3f41]  ">
          <Icons.delete className="sm:size-14 size-7 text-[var(--danger-bg)] " />
        </div>
        <div className="w-full flex-col gap-1 items-center justify-center flex">
          <h2 className="sm:text-[23px] text-[16px] tracking-wide text-[var(--dark-text)] ">
            Delete
          </h2>
          <p className="sm:text-[18px] text-[17px] tracking-wide text-[var(--dark-secondary-text)] ">
            Are you sure want to delete ?
          </p>
        </div>
        <div className="w-full flex items-center justify-center gap-5">
          <button
            onClick={closeModal}
            className="text-[var(--dark-text)] border font-semibold border-gray-200 hover:bg-[var(--light-background)] duration-150 border-[var(--dark-secondary-text)] text-[17px] tracking-wide px-7 py-2 rounded-lg  "
          >
            Cancel
          </button>
          <button
            onClick={() => setDelete(id)}
            className="text-white font-semibold border-[var(--danger-text)] hover:bg-[var(--danger-text)] duration-150 text-[17px] tracking-wide px-7 py-2 rounded-lg bg-[var(--danger-bg)] "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
