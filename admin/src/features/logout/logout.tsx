import { Icons } from "@/utils";
import React from "react";

interface LogoutProp {
  logout: () => void;
}

const Logout: React.FC<LogoutProp> = ({ logout }) => {
  return (
    <React.Fragment>
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-start gap-5 py-3 px-3 text-[var(--dark-text)] rounded dark:hover:bg-[#121b28] hover:bg-[#e8e8e8]"
      >
        <Icons.logout className="size-5" />
        <span className="text-[15px]">Logout</span>
      </button>
    </React.Fragment>
  );
};

export default Logout;
