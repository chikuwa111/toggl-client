import { createContext, Dispatch, useContext } from "react";
import { Action } from "./action";
import { initialState } from "./reducer";
import { State } from "./types";

const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<Dispatch<Action>>(() => {
  // do nothing
});

export const StateContextProvider = StateContext.Provider;
export const DispatchContextProvider = DispatchContext.Provider;

export const useStoreState = () => useContext(StateContext);
export const useDispatch = () => useContext(DispatchContext);
