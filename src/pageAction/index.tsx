import React, { useState } from 'react';
import * as ReactDOM from 'react-dom/client';

import Box from '@mui/material/Box';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import { getBookmarkDir, createBookmarkDir, createBookmark } from '../utils/bookmark';
import { RemindSetterRow } from './remind-setter-row';

const PageAction = () => {
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
      <Box>
        <RemindSetterRow text="Specified Time" timestamp={nowTimestamp + 60 * 60} remindSetter={onClick} dateTimePicker></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="1 Hour later" timestamp={nowTimestamp + 60 * 60} remindSetter={onClick}></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="3 Hours later" timestamp={nowTimestamp + 60 * 60 * 3} remindSetter={onClick}></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="24 Hours later" timestamp={nowTimestamp + 60 * 60 * 24} remindSetter={onClick}></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="Tomorrow" timestamp={tomorrowTimestamp} remindSetter={onClick}></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="Next Week" timestamp={nextWeekTimestamp} remindSetter={onClick}></RemindSetterRow>
      </Box>
      <Box>
        <RemindSetterRow text="Next Month" timestamp={nextMonthTimestamp} remindSetter={onClick}></RemindSetterRow>
      </Box>
    </Box>
  );
}

const root = ReactDOM.createRoot(document.body);

root.render(<PageAction />);
