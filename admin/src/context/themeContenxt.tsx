import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface ThemeContextProp {
  display: "dark" | "light";
  setDisplay: (mode: "dark" | "light") => void;
}

interface ThemeContextProviderProp {
  children: React.ReactNode;
}

const themeContext = React.createContext<ThemeContextProp>({
  display: "light",
  setDisplay: () => {},
});

export const useThemeContext = () => {
  return React.useContext(themeContext);
};

export const ThemeContextProvider: React.FC<ThemeContextProviderProp> = ({
  children,
}) => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const getThemeMode = localStorage.getItem("display") as "dark" | "light";
 const user = useSelector((state:RootState)=> state.root.user)
  const [mode, setMode] = React.useState<"dark" | "light">(getThemeMode);



  useEffect(() => {
    if (isDarkMode && mode !== "light" && user.success) {
      localStorage.setItem("display", "dark");
      document.body.classList.add("dark");
      setMode("dark");
    }
  }, [isDarkMode, getThemeMode, user.success]);

  useEffect(() => {
    if (mode === "dark") {
      localStorage.setItem("display", "dark");
      document.body.classList.add("dark");
    } else if (mode === "light") {
      localStorage.setItem("display", "light");
      document.body.classList.remove("dark");
    }
  }, [mode]);

  return (
    <themeContext.Provider
      value={{ display: mode, setDisplay: (modeType) => setMode(modeType) }}
    >
      {children}
    </themeContext.Provider>
  );
};
