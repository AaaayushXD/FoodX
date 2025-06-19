import * as React from 'react';
import { LocalizationProvider, TimePicker as MuiTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface TimePickerProp {
  action: (value: Dayjs | null) => void;
}

export const TimePicker: React.FC<TimePickerProp> = ({ action }) => {
  const [value, setValue] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiTimePicker
        label="Select Time"
        value={value}
        onChange={(newValue: Dayjs | null) => {
          setValue(newValue);
          action(newValue);
        }}
        ampm
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
};
