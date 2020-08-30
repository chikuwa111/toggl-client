import { useState } from "react";
import { startNewTimeEntry, updateCurrentTimeEntry } from "@/lib/toggl-api";
import { removeTimeEntryPreset } from "@/store/action";
import { useStoreState, useDispatch } from "@/store/context";

export function PresetList() {
  const { apiToken, timeEntryPresets } = useStoreState();
  const dispatch = useDispatch();
  const [error, setError] = useState<Error | null>(null);

  if (apiToken === "") {
    return null;
  }

  return (
    <>
      <h2>Presets</h2>
      {error != null && <p>Failed to update time entry. {error.message}</p>}
      {timeEntryPresets.map((timeEntry, index) => {
        const start = () => {
          startNewTimeEntry(apiToken, timeEntry).catch(setError);
        };
        const update = () => {
          updateCurrentTimeEntry(apiToken, timeEntry).catch(setError);
        };
        const remove = () => {
          dispatch(removeTimeEntryPreset(index));
        };

        return (
          <div key={timeEntry.description}>
            <p>{timeEntry.description}</p>
            <button onClick={start}>Start</button>
            <button onClick={update}>Update</button>
            <button onClick={remove}>Delete</button>
          </div>
        );
      })}
    </>
  );
}
