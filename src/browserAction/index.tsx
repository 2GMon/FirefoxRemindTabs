import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom/client';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import { getBookmarks, removeBookmark, titleDelimiter } from '../utils/bookmark';
import { getRemindTabsStatus, setRemindTabsStatus } from '../utils/settings';

const BrowserAction = () => {
  const [bookmarks, setBookmarks] = useState<browser.bookmarks.BookmarkTreeNode[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [statusChanged, setStatauChanged] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const bookmarks = await getBookmarks();
      bookmarks.sort((a, b) => getTimestamp(a) - getTimestamp(b));
      setBookmarks(bookmarks);
      setLoaded(true)
    })();
  },[loaded]);

  useEffect(() => {
    (async () => {
      const disabled = await getRemindTabsStatus();
      setDisabled(disabled)
      setStatauChanged(false);
    })()
  }, [statusChanged]);

  const getTimestamp = (bookmark: browser.bookmarks.BookmarkTreeNode) => {
    return parseInt(bookmark.title.split(titleDelimiter)[0]);
  }

  const getTitle = (bookmark: browser.bookmarks.BookmarkTreeNode) => {
    return bookmark.title.split(titleDelimiter)[1];
  }

  const openBookmark = async (url: string) => {
    return await browser.tabs.create({
      url: url,
    })
  }

  const _removeBookmark = async (bookmark: browser.bookmarks.BookmarkTreeNode) => {
    await removeBookmark(bookmark);
    setLoaded(false);
  }

  const toggleDisableRemindTabs = async () => {
    const disabled = await getRemindTabsStatus();
    setRemindTabsStatus(!disabled);
    setStatauChanged(true);
  }

  const label = { inputProps: { 'aria-label': 'disable RemindTabs' } };

  const items = bookmarks.map(bookmark =>{
    const timestamp = getTimestamp(bookmark);
    const title = getTitle(bookmark);
    const timeStr = new Date(timestamp * 1000).toLocaleString();

    return (
      <Box key={bookmark.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box
          sx={{
            cursor: "pointer"
          }}
          onClick={ async () => { openBookmark(bookmark.url as string) } }
        >
          {title}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ fontSize: "12px" }}>{timeStr}</Box>
          <Box
            sx={{ cursor: "pointer" }}
            onClick={ async () => { _removeBookmark(bookmark) } }
          >
            <DeleteIcon/>
          </Box>
        </Box>
      </Box>
    )
  });

  return (
    <Box sx={{ width: "max-content", height: "max-content" }}>
      <Box sx={{ width: "max-content", minWidth: "330px", maxWidth: "500px", height: "max-content" }}>
        <Switch {...label} checked={!disabled}
        onChange={ async () => { toggleDisableRemindTabs() } } />
      </Box>
      <Divider />
      <Box sx={{ width: "max-content", minWidth: "330px", maxWidth: "500px", height: "max-content", maxHeight: "400px" }}>
        <Stack divider={<Divider flexItem />} spacing={1}>
          {items}
        </Stack>
      </Box>
    </Box>
  );
}

const root = ReactDOM.createRoot(document.body);

root.render(<BrowserAction />);
