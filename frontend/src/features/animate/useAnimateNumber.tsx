import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1 });
    const unsubscribe = rounded.on("change", (latest) => setDisplay(latest));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return <motion.span className=" text-[16px] font-bold ">{ display }</motion.span>

};
