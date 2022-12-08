import { titleDelimiter, getBookmarks, removeBookmark } from './utils/bookmark';

async function sleep(msec: number) {
	return new Promise(resolve => setTimeout(resolve, msec));
}

async function openTab(bookmark: browser.bookmarks.BookmarkTreeNode) {
	return await browser.tabs.create({
		active: false,
		url: bookmark.url,
	})
}

async function discardTab(tab: browser.tabs.Tab) {
	if (tab.id) {
		return await browser.tabs.discard([tab.id]);
	} else {
		return [];
	}
}

async function notify(bookmarks: browser.bookmarks.BookmarkTreeNode[]) {
	if (bookmarks.length == 0) {
		return;
	}

	return await browser.notifications.create({
		type: "basic",
		message: `Open ${bookmarks.length} tabs.`,
		title: "RemindTabs",
	});
}

function narrowDownBookmarks(timestamp: number, bookmarks: browser.bookmarks.BookmarkTreeNode[]) {
	const filteredBookmarks = bookmarks.filter(bookmark => {
		const strTimestamp = bookmark.title.split(titleDelimiter)[0];
		return timestamp > parseInt(strTimestamp);
	});
	return filteredBookmarks;
}

(() => {
	const openTabs = async () => {
		console.log('open');
		const timestamp = Math.floor((new Date()).getTime() / 1000);
		const bookmarks = await getBookmarks();
		const filteredBookmarks = narrowDownBookmarks(timestamp, bookmarks);
		for (const bookmark of filteredBookmarks) {
			const tab = await openTab(bookmark);
			await discardTab(tab);
			await removeBookmark(bookmark);
			await sleep(100);
		}
		if (filteredBookmarks.length > 0) {
			await notify(filteredBookmarks);
		}
	}

	openTabs();
	setInterval(openTabs, 60 * 1000);
})();