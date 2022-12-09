import React, { useState } from 'react';
import * as ReactDOM from 'react-dom/client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import { getBookmarkDir, createBookmarkDir, createBookmark } from '../utils/bookmark';

const PageAction = () => {
  const [remindDate, setRemindDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const nowTimestamp = Math.floor(now.getTime() / 1000);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0)
  const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);
  const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 9, 0)
  const nextWeekTimestamp = Math.floor(nextWeek.getTime() / 1000);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate(), 9, 0)
  const nextMonthTimestamp = Math.floor(nextMonth.getTime() / 1000);

  async function onClick(timestamp: number) {
    let bookmarkDir = await getBookmarkDir();
    if (!bookmarkDir) {
      bookmarkDir = await createBookmarkDir();
    }

    const currentTab = await getCurrentTab();
    const bookmark = await createBookmark(currentTab.title as string, currentTab.url as string, timestamp);
    browser.tabs.remove(currentTab.id as number);
  }

  async function getCurrentTab() {
    return await browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((result) => {
      return result[0];
    });
  }

  return (
    <Box sx={{ width: "330px", height: "350px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(Math.floor(remindDate.getTime() / 1000)); }}>Specified Time</Button>
        </Box>
        <Box>
          <DatePicker
            selected={remindDate}
            onChange={(date: Date) => setRemindDate(date)}
            timeInputLabel="Time:"
            showTimeInput
            dateFormat="yyyy-MM-dd'T'HH:mm"
            timeIntervals={1}
            />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(nowTimestamp + 60 * 60); }}>1 hour later</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date((nowTimestamp + 60 * 60) * 1000).toLocaleString()}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(nowTimestamp + 60 * 60 * 3); }}>3 hours later</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date((nowTimestamp + 60 * 60 * 3) * 1000).toLocaleString()}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(nowTimestamp + 60 * 60 * 24); }}>24 hours later</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date((nowTimestamp + 60 * 60 * 24) * 1000).toLocaleString()}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(tomorrowTimestamp); }}>Tomorrow</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date(tomorrowTimestamp * 1000).toLocaleString()}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(nextWeekTimestamp); }}>Next Week</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date(nextWeekTimestamp * 1000).toLocaleString()}</Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%" }}>
          <Button sx={{ width: "100%" }} onClick={async () => { await onClick(nextMonthTimestamp); }}>Next Month</Button>
        </Box>
        <Box sx={{ width: "100%" }}>{new Date(nextMonthTimestamp * 1000).toLocaleString()}</Box>
      </Box>
    </Box>
  );
}

const root = ReactDOM.createRoot(document.body);

root.render(<PageAction />);
