import { ChevronDown } from "lucide-react";
import React, { useState } from "react";


interface SelectorPop {
  action: (value: string) => void;
  children: Ui.Category[];
}

export const Selector: React.FC<SelectorPop> = ({ action, children }) => {
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>(children[0]?.name);
  const [haveScroll, setHaveScroll] = useState<boolean>(false);
  return (
    <div className="sm:w-[350px]  w-full rounded-t-xl relative group/selector py-1 gap-2 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
      <div
        onClick={() => setShow(!show)}
        className="flex items-center  justify-between"
      >
        <input
          
          type="text"
          className="w-full text-[var(--dark-text)] bg-[var(--light-foreground)] py-2.5 tracking-wider  outline-none cursor-pointer "
          readOnly
          value={showField || ""}
          placeholder="Select option"
        />
        <ChevronDown className="text-[var(--dark-secondary-text)] cursor-pointer " />
      </div>
      <div
        onMouseEnter={() => setHaveScroll(true)}
        onMouseLeave={() => setHaveScroll(false)}
        className={` bg-[var(--light-foreground)]  ${
          haveScroll ? "scrollbar-custom  " : ""
        } rounded-t-sm p-1 overflow-auto left-0 top-[57px] z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex flex-col  gap-1 scroll-smooth w-full transition-all duration-300  ${
          show
            ? "max-h-64 z-[100] opacity-100"
            : "max-h-0 opacity-0 z-0 transform -translate-y-2"
        }`}
      >
        {children?.map((option) => (
          <div
            onClick={() => {
              action(option?.id as string);
              setShowField(option?.name);
              setShow(false);
            }}
            key={option.id}
            className="flex cursor-pointer items-center hover:bg-[var(--light-background)] py-1.5 px-1.5 rounded-lg justify-start gap-3"
          >
            <img
              className="w-[40px] rounded-full h-[40px]"
              src={option.image}
              alt=""
            />
            <p className="text-[var(--dark-text)] text-start text-[16px] tracking-wider w-full rounded">
              {option.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
