const discardKey = 'RemindTabsDiscard';

export const getDiscardStatus: () => Promise<boolean> = async () => {
  const discard = await browser.storage.local.get({
    [discardKey]: true
  });
  return discard[discardKey] as boolean;
}

export const setDiscardStatus = (discard: boolean) => {
  browser.storage.local.set({ [discardKey]: discard });
}
