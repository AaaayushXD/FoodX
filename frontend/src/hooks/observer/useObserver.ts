import { useEffect, useState, useRef, useCallback } from "react";

export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
 
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    setIsIntersecting(entries[0].isIntersecting);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(observerCallback, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options, observerCallback]);

  return { ref, isIntersecting };
};
