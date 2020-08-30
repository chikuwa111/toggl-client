import * as localforage from "localforage";

const STORAGE_KEYS = {
  API_TOKEN: "api-token",
  TIME_ENTRY_PRESETS: "presets",
};

export const getAPIToken = () =>
  localforage.getItem<string>(STORAGE_KEYS.API_TOKEN);

export const setAPIToken = (apiToken: string) =>
  localforage.setItem(STORAGE_KEYS.API_TOKEN, apiToken);

export const clearStorage = () => localforage.clear();
