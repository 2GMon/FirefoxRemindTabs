const bookmarkDirName = '---RemindTabsBookmarkDir---';

export const titleDelimiter = '*|-|-|-|*';

export async function getBookmarkDir() {
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

export async function createBookmarkDir() {
	return await browser.bookmarks.create({
		title: bookmarkDirName
	})
}

export async function createBookmark(title: string, url: string, remindTimestamp: number) {
	const bookmarkDir = await getBookmarkDir();
	return await browser.bookmarks.create({
		parentId: bookmarkDir?.id,
		title: `${remindTimestamp} ${titleDelimiter} ${title}`,
		url: url,
	});
}

export async function getBookmarks() {
	const bookmarkDir = await getBookmarkDir()
	if (bookmarkDir) {
		return await browser.bookmarks.getChildren(bookmarkDir.id)
	} else {
		return [];
	}
}

export async function removeBookmark(bookmark: browser.bookmarks.BookmarkTreeNode) {
	return await browser.bookmarks.remove(bookmark.id);
}