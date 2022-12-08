import React from 'react';
import * as ReactDOM from 'react-dom/client';

import Button from '@mui/material/Button';

const PageAction = () => {
  const bookmarkDirName = '---RemindTabsBookmarkDir---';

  async function onClick() {
    let bookmarkDir = await getBookmarkDir();
    if (!bookmarkDir) {
      bookmarkDir = await createBookmarkDir();
    }

    const currentTab = await getCurrentTab();
    const bookmark = await createBookmark(currentTab.title as string, currentTab.url as string);
    browser.tabs.remove(currentTab.id as number);
  }

  async function getBookmarkDir() {
    return await browser.bookmarks.search({
      query: bookmarkDirName
    }).then((result) => {
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    });
  }

  async function createBookmarkDir() {
    return await browser.bookmarks.create({
      title: bookmarkDirName
    })
  }

  async function getCurrentTab() {
    return await browser.tabs.query({
      active: true,
      currentWindow: true,
    }).then((result) => {
      return result[0];
    });
  }

  async function createBookmark(title: string, url: string) {
    const bookmarkDir = await getBookmarkDir();
    return await browser.bookmarks.create({
      parentId: bookmarkDir?.id,
      title: title,
      url: url,
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
