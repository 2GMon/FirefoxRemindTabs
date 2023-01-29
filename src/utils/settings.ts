const key = 'RemindTabsIsDisabled';

export const getRemindTabsStatus: () => Promise<boolean> = async () => {
  const disabled = await browser.storage.local.get({
    [key]: false
  });
  return disabled[key] as boolean;
}

export const setRemindTabsStatus = (disabled: boolean) => {
  browser.storage.local.set({ [key]: disabled });
}
