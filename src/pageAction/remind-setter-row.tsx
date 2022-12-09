import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";

export function RemindSetterRow({ timestamp, text, remindSetter, dateTimePicker }: {
  timestamp: number;
  text: string;
  remindSetter: (timestamp: number) => Promise<void>;
  dateTimePicker?: any
}) {
  const [remindDate, setRemindDate] = useState(new Date(timestamp * 1000));

  const datetimeItem = dateTimePicker
    ? (<Box sx={{ width: "100%" }}>
      <DatePicker
        selected={remindDate}
        onChange={(date: Date) => setRemindDate(date)}
        timeInputLabel="Time:"
        showTimeInput
        dateFormat="yyyy-MM-dd'T'HH:mm"
        timeIntervals={1}
      />
    </Box>)
    : (<Box sx={{ width: "100%" }}>{new Date(timestamp * 1000).toLocaleString()}</Box>);

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%" }}>
        <Button sx={{ width: "100%" }} onClick={async () => { await remindSetter(Math.floor(remindDate.getTime() / 1000)); }}>{text}</Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        {datetimeItem}
      </Box>
    </Box>
  );
}