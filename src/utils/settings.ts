const key = 'RemindTabsIsDisabled';
const discardKey = 'RemindTabsDiscard';

export const getRemindTabsStatus: () => Promise<boolean> = async () => {
  const disabled = await browser.storage.local.get({
    [key]: false
  });
  return disabled[key] as boolean;
}

export const setRemindTabsStatus = (disabled: boolean) => {
  browser.storage.local.set({ [key]: disabled });
}

export const getDiscardStatus: () => Promise<boolean> = async () => {
  const discard = await browser.storage.local.get({
    [discardKey]: true
  });
  return discard[discardKey] as boolean;
}

export const setDiscardStatus = (discard: boolean) => {
  browser.storage.local.set({ [discardKey]: discard });
}
