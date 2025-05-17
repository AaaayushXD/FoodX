import { useEffect, useRef, useState } from "react";
import { useThemeContext } from "@/contexts/context.theme";
import { Icons } from "@/utils";

const mode = [
  {
    name: "Dark",
    icon: <Icons.darkMode className="size-5 " />,
  },
  {
    name: "Light",
    icon: <Icons.lightMode className="size-5 " />,
  },
];

export const DarkMode = () => {
  const [open, setOpen] = useState<boolean>(false);

  const modeReference = useRef<HTMLDivElement | null>(null);

  const { setDisplay } = useThemeContext();
  function displayModeFn(type: "dark" | "light") {
    setDisplay(type);
    setOpen(false);
  }

  useEffect(() => {
    const closeModal = (event: MouseEvent) => {
      if (
        modeReference.current &&
        !modeReference.current.contains(event.target as Node)
      ) {
        setOpen(!open);
      }
    };
    if (open) {
      document.addEventListener("mousedown", closeModal);
    }

    return () => {
      document.removeEventListener("mousedown", closeModal);
    };
  }, [open]);

  return (
    <div ref={modeReference} className="w-full relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-start gap-5  cursor-pointer hover:bg-[#e8e8e8] dark:hover:bg-[#121b28]    w-full p-3 rounded duration-150 "
      >
        <Icons.displaySetting className="size-5" />
        <p> Mode</p>
        <span>
          <Icons.arrowDown
            className={`size-5 ${open ? "rotate-180" : ""}  duration-150`}
          />
        </span>
      </button>
      <div
        className={`w-full border-[1px] border-[var(--dark-border)] p-1 duration-150 ${
          open
            ? "visible translate-y-1 opacity-100 "
            : "invisible translate-y-0 opacity-0"
        } absolute bg-[var(--body-bg)] top-14  z-[1000]   flex flex-col rounded-lg items-start justify-center gap-3`}
      >
        {mode?.map((type, index) => (
          <button
            key={index}
            onClick={() =>
              displayModeFn(type.name.toLowerCase() as "dark" | "light")
            }
            className="text-[15.5px] rounded-lg duration-150 w-full py-2 text-[var(--dark-secondary-text)]  hover:bg-[var(--light-background)] px-5  gap-5   flex items-center justify-start "
          >
            {type.name}
            {type.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
