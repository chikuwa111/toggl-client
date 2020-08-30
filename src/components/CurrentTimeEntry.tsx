import { useEffect, useState } from "react";
import { makeWebSocketConnection, getCurrentTimeEntry } from "@/lib/toggl-api";
import { addTimeEntryPreset } from "@/store/action";
import { useStoreState, useDispatch } from "@/store/context";
import { CurrentTimeEntry as CurrentTimeEntryType } from "@/types";

export function CurrentTimeEntry() {
  const { apiToken } = useStoreState();
  const dispatch = useDispatch();

  const [
    currentTimeEntry,
    setCurrentTimeEntry,
  ] = useState<CurrentTimeEntryType | null>(null);

  const [
    currentTimeEntryError,
    setCurrentTimeEntryError,
  ] = useState<Error | null>(null);

  useEffect(() => {
    if (apiToken !== "") {
      getCurrentTimeEntry(apiToken)
        .then(setCurrentTimeEntry)
        .then(() => {
          makeWebSocketConnection(
            apiToken,
            setCurrentTimeEntryError,
            (currentTimeEntry) => {
              setCurrentTimeEntryError(null);
              setCurrentTimeEntry(currentTimeEntry);
            }
          );
        })
        .catch(setCurrentTimeEntryError);
    }
  }, [apiToken]);

  const onClickSave = () => {
    if (currentTimeEntry != null) {
      dispatch(
        addTimeEntryPreset({
          description: currentTimeEntry.description,
          wid: currentTimeEntry.wid,
          pid: currentTimeEntry.pid,
          tags: currentTimeEntry.tags,
        })
      );
    }
  };

  if (apiToken === "") {
    return null;
  }

  if (currentTimeEntryError != null) {
    return (
      <p>{`Failed to get current time entry. (${currentTimeEntryError.message})`}</p>
    );
  }

  return (
    <>
      <p>{JSON.stringify(currentTimeEntry)}</p>
      <button onClick={onClickSave}>Save preset</button>
    </>
  );
}
