import React from 'react';
import * as ReactDOM from 'react-dom/client';

import Button from '@mui/material/Button';

import { getBookmarkDir, createBookmarkDir, createBookmark } from '../utils/bookmark';

const PageAction = () => {
  const bookmarkDirName = '---RemindTabsBookmarkDir---';

  async function onClick() {
    let bookmarkDir = await getBookmarkDir();
    if (!bookmarkDir) {
      bookmarkDir = await createBookmarkDir();
    }

    const currentTab = await getCurrentTab();
    const remindTimestamp = Math.floor((new Date()).getTime() / 1000) + 60;
    const bookmark = await createBookmark(currentTab.title as string, currentTab.url as string, remindTimestamp);
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
    <div>
      <Button onClick={async () => { await onClick(); }}>Primary</Button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.body);

root.render(<PageAction />);
