import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import { useEffect, useRef, useState } from "react";

import { DateRange } from "react-date-range";

interface DatePickerProp {
  dateRangeFn: (startDate: Date, endDate: Date) => void;
}

export const DatePicker: React.FC<DatePickerProp> = ({ dateRangeFn }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const handleChange = (value: any) => {
    setStartDate(value.selection.startDate);
    setEndDate(value.selection.endDate);

    if (value.selection.startDate !== value.selection.endDate) {
      dateRangeFn(value.selection.startDate, value.selection.endDate);
    }
  };

  const reference = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reference.current && !reference.current.contains(event.target as any))
        setShow(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative">
      <span onClick={() => setShow(!show)} className=" text-[15px]">
        {" "}
        Pick a date
      </span>
      <div
        ref={reference as any}
        className={` absolute top-[-127px] right-[-42px] bg-slate-400 ${
          show ? "visible" : "invisible"
        } `}
      >
        <DateRange
          ranges={[
            { startDate: startDate, endDate: endDate, key: "selection" },
          ]}
          onChange={(value) => handleChange(value)}
        />
      </div>
    </div>
  );
};
