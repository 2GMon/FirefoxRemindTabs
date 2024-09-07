import { titleDelimiter, getBookmarks, removeBookmark } from './utils/bookmark';
import { getDiscardStatus } from './utils/settings';

async function isBrowserIdle(sec: number) {
	const idleState = await browser.idle.queryState(sec);
	if (idleState === "active") {
		return false;
	} else {
		return true;
	}
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
	let idleLastTime = new Date().getTime() / 1000.0;
	const openTabs = async () => {
		const idled = await isBrowserIdle(600);
		if (idled) {
			console.log("Idle")
			idleLastTime = new Date().getTime() / 1000.0;
			return;
		}
		const now = new Date().getTime() / 1000.0;
		if (now - idleLastTime < 120) {
			console.log("waking up")
			return;
		}
		console.log('open');
		const timestamp = Math.floor((new Date()).getTime() / 1000);
		const bookmarks = await getBookmarks();
		const filteredBookmarks = narrowDownBookmarks(timestamp, bookmarks);
		for (const bookmark of filteredBookmarks) {
			const tab = await openTab(bookmark);
			const isDiscard = await getDiscardStatus();
			if (isDiscard) {
				await discardTab(tab);
			}
			await removeBookmark(bookmark);
		}
		if (filteredBookmarks.length > 0) {
			await notify(filteredBookmarks);
		}
	}

	openTabs();
	setInterval(openTabs, 15 * 1000);
})();
