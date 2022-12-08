import { getBookmarks, removeBookmark } from './utils/bookmark';

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

(() => {
	const openTabs = async () => {
		const bookmarks = await getBookmarks();
		for (const bookmark of bookmarks) {
			const tab = await openTab(bookmark);
			await discardTab(tab);
			await removeBookmark(bookmark);
			await sleep(100);
		}
		await notify(bookmarks);
	}

	openTabs();
	setInterval(openTabs, 60 * 1000);
})();