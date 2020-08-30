import { State } from "./types";
import { TimeEntry } from "@/types";

export const loadState = (state: State) => ({
  type: "LOAD" as const,
  payload: { state },
});

export const clearState = () => ({
  type: "CLEAR" as const,
});

export const updateAPIToken = (apiToken: string) => ({
  type: "API_TOKEN__UPDATE" as const,
  payload: { apiToken },
});

export const addTimeEntryPreset = (timeEntryPreset: TimeEntry) => ({
  type: "TIME_ENTRY_PRESETS__ADD" as const,
  payload: { timeEntryPreset },
});

export const removeTimeEntryPreset = (index: number) => ({
  type: "TIME_ENTRY_PRESETS__REMOVE" as const,
  payload: { index },
});

export type Action =
  | ReturnType<typeof loadState>
  | ReturnType<typeof clearState>
  | ReturnType<typeof updateAPIToken>
  | ReturnType<typeof addTimeEntryPreset>
  | ReturnType<typeof removeTimeEntryPreset>;
