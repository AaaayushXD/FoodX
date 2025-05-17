import { useState } from "react";
import { TimePicker as Component } from "rsuite";
import "rsuite/TimePicker/styles/index.css";

interface TimePickerProp {
  action: (value: Date) => void;
}
export const TimePicker: React.FC<TimePickerProp> = ({ action }) => {
  const [time, setTime] = useState<Date | null>(null);
  return (
    <Component
      format="HH:mm"
      value={time}
      onChange={(value) => {
        setTime(value);
        action(value);
      }}
      cleanable
      placeholder="Select Time"
    />
  );
};
