import { Action } from "./action";
import { State } from "./types";

export const initialState: State = {
  apiToken: "",
  timeEntryPresets: [],
};

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "LOAD":
      return action.payload.state;
    case "CLEAR":
      return initialState;
    case "API_TOKEN__UPDATE":
      return {
        ...state,
        apiToken: action.payload.apiToken,
      };
    case "TIME_ENTRY_PRESETS__ADD":
      return {
        ...state,
        timeEntryPresets: [
          action.payload.timeEntryPreset,
          ...state.timeEntryPresets,
        ],
      };
    case "TIME_ENTRY_PRESETS__REMOVE":
      return {
        ...state,
        timeEntryPresets: state.timeEntryPresets.filter(
          (_, index) => index !== action.payload.index
        ),
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = action;
      return state;
    }
  }
}
