import * as localforage from "localforage";
import throttle from "lodash.throttle";
import { useReducer, useEffect } from "react";
import { loadState as load } from "./action";
import { reducer, initialState } from "./reducer";
import { State } from "./types";

const STORE_KEY = "PERSISTED_STATE";
const loadState = (): Promise<State | null> => localforage.getItem(STORE_KEY);
const saveState = throttle(
  (state: State) => localforage.setItem(STORE_KEY, state),
  500
);

export function usePersistedReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    loadState().then((state) => {
      if (state != null) {
        dispatch(load({ ...initialState, ...state }));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, dispatch] as const;
}
