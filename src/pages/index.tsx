import Link from "next/link";
import { useEffect, useState } from "react";
import { makeWebSocketConnection, getCurrentTimeEntry } from "@/lib/toggl-api";
import { useStoreState } from "@/store/context";
import { CurrentTimeEntry } from "@/types";

export default function Index() {
  const { apiToken } = useStoreState();

  const [
    currentTimeEntry,
    setCurrentTimeEntry,
  ] = useState<CurrentTimeEntry | null>(null);
  const [
    currentTimeEntryError,
    setCurrentTimeEntryError,
  ] = useState<Error | null>(null);

  useEffect(() => {
    if (apiToken !== "") {
      getCurrentTimeEntry(apiToken).then(setCurrentTimeEntry);
    }
  }, [apiToken]);

  useEffect(() => {
    if (apiToken === "") return;

    makeWebSocketConnection(
      apiToken,
      setCurrentTimeEntryError,
      (currentTimeEntry) => {
        setCurrentTimeEntryError(null);
        setCurrentTimeEntry(currentTimeEntry);
      }
    );
  }, [apiToken]);

  return (
    <>
      <h1>Home</h1>
      {apiToken === "" && (
        <p>
          Not setting API Token. Please set from{" "}
          <Link href="/settings">
            <a>settings</a>
          </Link>{" "}
          page
        </p>
      )}
      {apiToken !== "" &&
        (currentTimeEntryError != null ? (
          <p>{`Failed to get current time entry. (${currentTimeEntryError.message})`}</p>
        ) : (
          <p>{JSON.stringify(currentTimeEntry)}</p>
        ))}
    </>
  );
}
