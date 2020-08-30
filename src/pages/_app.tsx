import { AppProps } from "next/app";
import { StateContextProvider, DispatchContextProvider } from "@/store/context";
import { usePersistedReducer } from "@/store/usePersistedReducer";

export default function App({ Component, pageProps }: AppProps) {
  const [state, dispatch] = usePersistedReducer();
  return (
    <StateContextProvider value={state}>
      <DispatchContextProvider value={dispatch}>
        <Component {...pageProps} />
      </DispatchContextProvider>
    </StateContextProvider>
  );
}
