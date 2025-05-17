import { useEffect, useState } from "react";

export const useViewPort = () => {
  const [isVisible, setIsVisible] = useState<boolean>(window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth >= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isVisible };
};
