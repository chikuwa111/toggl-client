import { useState } from "react";
import { startNewTimeEntry, updateCurrentTimeEntry } from "@/lib/toggl-api";
import { useStoreState } from "@/store/context";

export function PresetList() {
  const { apiToken, timeEntryPresets } = useStoreState();
  const [error, setError] = useState<Error | null>(null);

  if (apiToken === "") {
    return null;
  }

  return (
    <>
      <h2>Presets</h2>
      {error != null && <p>Failed to update time entry. {error.message}</p>}
      {timeEntryPresets.map((timeEntry) => {
        const start = () => {
          startNewTimeEntry(apiToken, timeEntry).catch(setError);
        };
        const update = () => {
          updateCurrentTimeEntry(apiToken, timeEntry).catch(setError);
        };

        return (
          <div key={timeEntry.description}>
            <p>{timeEntry.description}</p>
            <button onClick={start}>Start</button>
            <button onClick={update}>Update</button>
          </div>
        );
      })}
    </>
  );
}
