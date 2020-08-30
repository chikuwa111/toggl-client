import Link from "next/link";
import { useState, FormEvent, useCallback } from "react";
import { getCurrentTimeEntry } from "@/lib/toggl-api";
import { usePromise } from "@/lib/usePromise";
import { updateAPIToken, clearState } from "@/store/action";
import { useStoreState, useDispatch } from "@/store/context";

export default function Settings() {
  const { apiToken } = useStoreState();
  const dispatch = useDispatch();

  const [apiTokenInput, setAPITokenInput] = useState("");
  const [
    isSetAPITokenPending,
    setAPITokenError,
    ,
    invokeSetAPIToken,
  ] = usePromise<void>();
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const promise = async () => {
        // Call API to validate token
        await getCurrentTimeEntry(apiTokenInput);

        dispatch(updateAPIToken(apiTokenInput));
        setAPITokenInput("");
      };

      invokeSetAPIToken(promise());
    },
    [apiTokenInput]
  );

  const onClickDelete = () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      dispatch(clearState());
    }
  };

  return (
    <>
      <h1>Settings</h1>
      <div>
        <h2>API Token</h2>
        {apiToken === "" ? (
          <p>No setting.</p>
        ) : (
          <p>{`${apiToken.slice(0, 3)}*******`}</p>
        )}
        <form onSubmit={onSubmit}>
          <input
            value={apiTokenInput}
            onChange={(e) => {
              setAPITokenInput(e.target.value);
            }}
          />
          <button type="submit" disabled={isSetAPITokenPending}>
            Save
          </button>
        </form>
        {isSetAPITokenPending ? (
          <p>Loading...</p>
        ) : (
          setAPITokenError != null && (
            <p>{`Failed to save. (${setAPITokenError.message})`}</p>
          )
        )}
      </div>
      <div>
        <h2>Delete data</h2>
        <button onClick={onClickDelete}>Delete</button>
      </div>
      <p>
        <Link href="/">
          <a>Back to Home</a>
        </Link>
      </p>
    </>
  );
}
