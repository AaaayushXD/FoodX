import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface SelectorPop {
  setField: (value: string) => void;
  categoryOption?: { value: string; label: string }[];
}

export const Selector: React.FC<SelectorPop> = ({
  categoryOption,
  setField,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>();
  return (
    <div className="w-full text-[var(--dark-text)] relative group/selector py-1 gap-2 border-[1px] border-[var(--dark-border)] rounded px-2 bg-[var(--light-foreground)]">
      <div
        onClick={() => setShow(!show)}
        className="flex items-center  justify-between"
      >
        <input
          required
          type="text"
          className="w-full py-1 bg-[var(--light-foreground)]  outline-none cursor-pointer "
          readOnly
          value={showField}
          placeholder="Select option"
        />
        <ChevronDown className="text-[var(--dark-text)] cursor-pointer " />
      </div>
      <div
        className={` bg-[var(--light-foreground)] ${
          categoryOption!.length >= 4 ? "h-[130px] " : ""
        } scrollbar-custom overflow-auto left-0 top-14 z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex flex-col  gap-1 w-full transition-all duration-300  ${
          show
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0 transform -translate-y-2"
        }`}
      >
        {categoryOption?.map((option) => (
          <p
            onClick={() => {
              setField(option.value ? option.value : (option as any));
              setShowField(option.label ? option.label : (option as any));
              setShow(false);
            }}
            key={option.label}
            className="text-[var(--dark-text)] text-start text-[16px] p-2 hover:bg-[var(--light-background)] w-full rounded"
          >
            {typeof option.label === "string"
              ? option?.label
              : typeof option === "string"
              ? option
              : ""}
          </p>
        ))}
      </div>
    </div>
  );
};
