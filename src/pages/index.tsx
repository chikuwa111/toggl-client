import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAPIToken } from "@/lib/storage";
import { makeWebSocketConnection, getCurrentTimeEntry } from "@/lib/toggl-api";
import { usePromise } from "@/lib/usePromise";
import { CurrentTimeEntry } from "@/types";

export default function Index() {
  const [
    isGetAPITokenPending,
    getAPITokenError,
    apiToken,
    invokeGetAPIToken,
  ] = usePromise<string | null>();

  const [
    currentTimeEntry,
    setCurrentTimeEntry,
  ] = useState<CurrentTimeEntry | null>(null);
  const [
    currentTimeEntryError,
    setCurrentTimeEntryError,
  ] = useState<Error | null>(null);

  useEffect(() => {
    const promise = async () => {
      const apiToken = await getAPIToken();
      if (apiToken == null) {
        return null;
      }
      await getCurrentTimeEntry(apiToken).then(setCurrentTimeEntry);
      return apiToken;
    };
    invokeGetAPIToken(promise());
  }, []);

  const hasValidToken = useMemo(
    () => getAPITokenError == null && apiToken != null,
    [getAPITokenError, apiToken]
  );

  useEffect(() => {
    if (!hasValidToken || apiToken == null) return;

    makeWebSocketConnection(
      apiToken,
      setCurrentTimeEntryError,
      (currentTimeEntry) => {
        setCurrentTimeEntryError(null);
        setCurrentTimeEntry(currentTimeEntry);
      }
    );
  }, [hasValidToken, apiToken]);

  return (
    <>
      <h1>Home</h1>
      {isGetAPITokenPending ? (
        <p>Loading...</p>
      ) : getAPITokenError != null ? (
        <p>{`Failed to get API Token. (${getAPITokenError.message})`}</p>
      ) : (
        apiToken == null && (
          <p>
            Not setting API Token. Please set from{" "}
            <Link href="/settings">
              <a>settings</a>
            </Link>{" "}
            page
          </p>
        )
      )}
      {hasValidToken &&
        (currentTimeEntryError != null ? (
          <p>{`Failed to get current time entry. (${currentTimeEntryError.message})`}</p>
        ) : (
          <p>{JSON.stringify(currentTimeEntry)}</p>
        ))}
    </>
  );
}
