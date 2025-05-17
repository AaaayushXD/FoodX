import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { CalendarCheck } from "lucide-react";

import dayjs, { Dayjs } from "dayjs";

interface ButtonProp {
  selectedCheck?: string[];
  selectedTypes?: string[];
  selectedAction?: string[];
  action?: { label: string; value: string; id: string }[];
  parentStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  parent: React.ReactNode;
  sort?: { label: ReactNode | string; value: string; id: string }[];
  types?: { label: ReactNode | string; value: string; id: string }[];
  sortFn?: (type: "asc" | "desc") => void;
  checkFn?: {
    checkTypeFn?: (isChecked: boolean, type: any, id: string) => void;
    checkSortFn?: (isChecked: boolean, type: any, id: string) => void;
    checkActionFn?: (isChecked: boolean, type: any, id: string) => void;
    dateActionFn?: (from: Dayjs, to: Dayjs) => void;
  };
}

export const Button: React.FC<ButtonProp> = ({
  parent,
  bodyStyle,
  sort,
  types,
  checkFn,
  sortFn,
  action,
  selectedCheck,
  selectedTypes,
  selectedAction,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [isShowTo, setIsShowTo] = useState<boolean>(false);
  const [isShowFrom, setIsShowFrom] = useState<boolean>(false);
  const reference = useRef<HTMLInputElement>();

  //date
  const [from, setFrom] = useState<dayjs.Dayjs>();
  const [to, setTo] = useState<dayjs.Dayjs>();

  const handleTypeCheckBox = (
    id: string,
    value: string,
    isChecked: boolean
  ) => {
    if (checkFn?.checkTypeFn) {
      checkFn.checkTypeFn(isChecked, value, id);
    }
  };

  const firstCalenderReference = useRef<HTMLDivElement>();
  const secondCalenderReference = useRef<HTMLDivElement>();

  useEffect(() => {
    if (to && from) {
      to && from && checkFn?.dateActionFn && checkFn.dateActionFn(from, to);
    }
  }, [from, to]);

  const handleSortCheckBox = (
    id: string,
    value: string,
    isChecked: boolean
  ) => {
    if (checkFn?.checkSortFn) {
      checkFn.checkSortFn(isChecked, value, id);
    }
  };
  const handleActionBox = (id: string, value: string, isChecked: boolean) => {
    if (checkFn?.checkActionFn) {
      checkFn.checkActionFn(isChecked, value, id);
    }
  };

  useEffect(() => {
    const handleClose = (event: Event) => {
      if (
        reference.current &&
        !reference.current.contains(event.target as any)
      ) {
        setShow(false);
      }
    };
    const closeModalFirst = (event: Event) => {
      if (
        firstCalenderReference.current &&
        !firstCalenderReference.current.contains(event.target as any)
      ) {
        setIsShowFrom(false);
      }
    };
    const closeModalSecond = (event: Event) => {
      if (
        secondCalenderReference.current &&
        !secondCalenderReference.current.contains(event.target as any)
      ) {
        setIsShowTo(false);
      }
    };

    if (isShowFrom) {
      window.addEventListener("mousedown", closeModalFirst);
    }
    if (isShowTo) {
      window.addEventListener("mousedown", closeModalSecond);
    }

    if (show) {
      window.addEventListener("mousedown", handleClose);
    }

    return () => {
      window.removeEventListener("mousedown", handleClose);
    };
  }, [show, isShowFrom, isShowTo]);

  return (
    <div ref={reference as any} className="relative ">
      <div
        className=" cursor-pointer flex justify-end"
        onClick={() => setShow(!show)}
      >
        {parent}
      </div>
      <div
        style={bodyStyle}
        className={`flex border-[1px] border-[var(--dark-border)]     flex-col items-start gap-5  px-4 py-3 duration-100 absolute ${
          show
            ? "visible translate-y-0 z-50 opacity-100 "
            : " invisible  z-0   -translate-y-2 opacity-0  "
        } flex-col shadow-sm w-full  shadow-[#0000000e] items-start justify-center gap-1 bg-[var(--light-foreground)]  rounded `}
      >
        {types && (
          <div
            className={`flex text-[var(--dark-text)]  flex-col w-full items-start justify-center  gap-4`}
          >
            <h1 className="text-[18px] tracking-wider ">Types</h1>
            <div className="w-full  flex  flex-wrap items-center justify-start gap-5">
              {types?.map(
                (data) =>
                  checkFn?.checkTypeFn &&
                  data.value && (
                    <div
                      key={data.id}
                      className="   flex items-center justify-start gap-2 cursor-pointer"
                    >
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          handleTypeCheckBox(
                            data.id,
                            data.value,
                            event.target.checked
                          );
                        }}
                        id={data.id}
                        checked={selectedTypes?.includes(data?.id) || false}
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer accent-black"
                        ref={reference as any}
                      />
                      <label
                        htmlFor={data.id}
                        className=" text-[17px] cursor-pointer tracking-wide "
                      >
                        {" "}
                        {data.label}
                      </label>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        {sort && (
          <div className="flex  text-[var(--dark-text)]   w-full flex-col items-start justify-start  gap-7">
            <div className="w-full flex items-center justify-between ">
              <h1 className="text-[18px] tracking-wider ">Sort By</h1>
              <div className="w-[130px]">
                <Selector
                  data={[
                    { label: "Low to High", value: "asc" },
                    { label: "High to Low", value: "desc" },
                  ]}
                  onSelect={(type) => sortFn && sortFn(type as "asc" | "desc")}
                />
              </div>
            </div>
            <div className=" flex  flex-wrap items-center justify-start gap-10">
              {sort?.map(
                (data) =>
                  checkFn?.checkSortFn &&
                  data.value && (
                    <div
                      key={data.id}
                      className="flex items-center  justify-start gap-2"
                    >
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          handleSortCheckBox(
                            data.id,
                            data.value,
                            event.target.checked
                          );
                        }}
                        id={data.id}
                        checked={selectedCheck?.includes(data.id)}
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer accent-slate-950  "
                      />
                      <label
                        htmlFor={data.id}
                        className=" text-[17px] cursor-pointer tracking-wide "
                      >
                        {" "}
                        {data.label}
                      </label>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        {action && (
          <div
            className={`flex  text-[var(--dark-text)]   flex-col w-full items-start justify-center  gap-4`}
          >
            <h1 className="text-[18px] tracking-wider ">Actions</h1>
            <div className="w-full flex-wrap flex-row  flex items-center justify-start gap-5">
              {action?.map(
                (data) =>
                  checkFn?.checkActionFn &&
                  data.value && (
                    <div
                      key={data.id}
                      className="   flex items-center justify-start gap-2 cursor-pointer"
                    >
                      <input
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          handleActionBox(
                            data.id,
                            data.value,
                            event.target.checked
                          );
                        }}
                        id={data.id}
                        checked={selectedAction?.includes(data.id) || false}
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer accent-black"
                      />
                      <label
                        htmlFor={data.id}
                        className=" text-[17px] cursor-pointer tracking-wide "
                      >
                        {" "}
                        {data.label}
                      </label>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        {checkFn?.dateActionFn && (
          <div className="flex  text-[var(--dark-text)]   flex-col  w-full items-start gap-5">
            <h1 className="text-[18px] tracking-wider ">Date</h1>
            <div className="flex justify-start items-center gap-3">
              <span className="text-[16px] tracking-wide">From</span>
              <div
                ref={firstCalenderReference as any}
                className="w-full flex items-center justify-start"
              >
                <div className="flex items-center justify-start gap-2">
                  <div
                    onClick={() => setIsShowFrom(!isShowFrom)}
                    className="flex cursor-pointer px-2 py-1.5 rounded-lg border-[1px] border-[var(--dark-border)] items-center justify-start gap-2"
                  >
                    <input
                      className="text-[16px] bg-[var(--light-foreground)] cursor-pointer tracking-wide w-full outline-none"
                      type="text"
                      readOnly
                      value={from?.format("YYYY-MM-DD")}
                    />
                    <CalendarCheck className="size-6" />
                  </div>
                  <div
                    className={`w-[200px] right-0-[0rem] duration-150 bg-[var(--light-foreground)] top-52 absolute ${
                      isShowFrom && !isShowTo
                        ? "visible opacity-100 z-10"
                        : "invisible opacity-0 z-[-1]"
                    }`}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        onChange={(value) => value && setFrom(value)}
                        sx={{
                          color: "white",
                          ".MuiTypography-root": { color: "white" },
                          ".MuiPickersDay-root": { color: "white" },
                          ".MuiPickersDay-today": { borderColor: "white" },
                          ".MuiPickersDay-dayOutsideMonth": {
                            color: "rgba(255, 255, 255, 0.5)",
                          },
                          ".MuiIconButton-root": { color: "white" },
                        }}
                        className="bg-[#121212] rounded-md text-white"
                        showDaysOutsideCurrentMonth
                        fixedWeekNumber={6}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className=" flex items-center justify-start gap-2">
                  <span className="tracking-wide text-[16px] pl-2 ">To</span>
                  <div className="w-full" ref={secondCalenderReference as any}>
                    <div
                      onClick={() => setIsShowTo(!isShowTo)}
                      className="flex text-[16px] px-2 rounded-lg tracking-wide border-[1px] border-[var(--dark-border)] items-center justify-start gap-2"
                    >
                      <input
                        className=" py-1.5 cursor-pointer bg-[var(--light-foreground)]  w-full outline-none"
                        type="text"
                        readOnly
                        value={dayjs(to)?.format("YYYY-MM-DD")}
                      />
                      <CalendarCheck className="size-5" />
                    </div>
                    <div
                      className={`w-[200px]   left-[0rem] duration-150 bg-[var(--light-foreground)] top-52 absolute ${
                        isShowTo
                          ? "visible opacity-100 z-10"
                          : "invisible opacity-0 z-[-1] "
                      } `}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          onChange={(value) => setTo(value)}
                          sx={{
                            color: "white",
                            ".MuiTypography-root": {
                              color: "white", // This targets the text color within the calendar
                            },
                            ".MuiPickersDay-root": {
                              color: "white", // This targets the individual day numbers
                            },
                            ".MuiPickersDay-today": {
                              borderColor: "white", // This changes the border color of today's date
                            },
                            ".MuiPickersDay-dayOutsideMonth": {
                              color: "rgba(255, 255, 255, 0.5)", // This changes the color for days outside the current month
                            },
                            ".MuiIconButton-root": {
                              color: "white", // This changes the color of the icons (like arrows for navigating months)
                            },
                          }}
                          className="bg-[#121212]  rounded-md text-white "
                          showDaysOutsideCurrentMonth
                          fixedWeekNumber={6}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
//////////////////////////////
interface SelectorProp {
  data: { label: string; value: "asc" | "desc" }[];
  onSelect: (value: "asc" | "desc") => void;
}
const Selector: React.FC<SelectorProp> = ({ data, onSelect }) => {
  const [show, setShow] = useState<boolean>(false);
  const [showField, setShowField] = useState<string>("High to Low");
  return (
    <div className="w-full relative group/selector border-[1px]  border-[var(--dark-border)] rounded px-2 ">
      <div
        onClick={() => setShow(!show)}
        className="flex items-center cursor-pointer  justify-between"
      >
        <input
          type="text"
          className="w-full text-[var(--dark-secondary-text)] bg-transparent  outline-none cursor-pointer "
          readOnly
          value={showField}
        />
        <IoMdArrowDropdown className="size-7 text-[var(--dark-secondary-text)] " />
      </div>
      <div
        className={` p-0.5 bg-[var(--light-foreground)] overflow-auto left-0 top-7 z-[1000] shadow shadow-[#0000003a] rounded-b-lg absolute flex flex-col  gap-1 w-full transition-all duration-300  ${
          show
            ? "max-h-64 opacity-100"
            : "max-h-0 opacity-0 transform -translate-y-2"
        }`}
      >
        {data?.map((option) => (
          <p
            onClick={() => {
              onSelect(option.value);
              setShowField(option.label);
              setShow(false);
            }}
            key={option.label}
            className="text-[var(--dark-secondary-text)]  text-start text-[16px] p-1 cursor-pointer hover:bg-[var(--light-background)] w-full rounded"
          >
            {option.label}
          </p>
        ))}
      </div>
    </div>
  );
};
