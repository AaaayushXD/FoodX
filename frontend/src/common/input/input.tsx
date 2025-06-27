import React, { ReactNode } from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  rightIcon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  type = "text",
  rightIcon
}) => {
  return (
    <label htmlFor={label} className="relative flex w-full flex-col gap-1">
      <h1 className="text-[15px]">{label}</h1>
      <div className="relative">
        <input
          name={label}
          type={type}
          autoComplete="off"
          value={value}
          onChange={onChange}
          
          className="w-full logPassword border-[#5d50772d] border-[1px] sm:text-[16px] text-[14px] bg-transparent rounded-md h-[35px] sm:h-[40px] outline-none px-5 py-5 text-md"
        />
        <div className="absolute right-2 cursor-pointer top-0 bottom-0 flex items-center justify-center">
        {rightIcon && rightIcon}
        </div>

      </div>
    </label>
  );
};
