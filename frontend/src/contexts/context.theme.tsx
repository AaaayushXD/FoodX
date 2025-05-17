import React, { useEffect } from "react";

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
  const getThemeMode = (localStorage.getItem("display") as "dark" | "light") || "light";
  const [mode, setMode] = React.useState<"dark" | "light">(getThemeMode);
  
  useEffect(() => {
    localStorage.setItem("display", mode);
    document.body.classList.toggle("dark", mode === "dark");
  }, [mode]);
  

  return (
    <themeContext.Provider
      value={{ display: mode, setDisplay: (modeType) => setMode(modeType) }}
    >
      {children}
    </themeContext.Provider>
  );
};
