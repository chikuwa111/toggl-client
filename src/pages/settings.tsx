import Link from "next/link";
import { useEffect, useState, FormEvent, useCallback } from "react";
import { getAPIToken, setAPIToken as setAPITokenStorage } from "@/lib/storage";
import { getCurrentTimeEntry } from "@/lib/toggl-api";
import { usePromise } from "@/lib/usePromise";

export default function Settings() {
  const [apiToken, setAPIToken] = useState<string | null>(null);

  const [
    isGetAPITokenPending,
    getAPITokenError,
    ,
    invokeGetAPIToken,
  ] = usePromise<void>();
  useEffect(() => {
    invokeGetAPIToken(getAPIToken().then(setAPIToken));
  }, []);

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

        const apiToken = await setAPITokenStorage(apiTokenInput);
        setAPIToken(apiToken);
        setAPITokenInput("");
      };

      invokeSetAPIToken(promise());
    },
    [apiTokenInput]
  );

  return (
    <>
      <h1>Settings</h1>
      <div>
        <h2>API Token</h2>
        {isGetAPITokenPending ? (
          <p>Loading...</p>
        ) : getAPITokenError != null ? (
          <p>{`Failed to get API Token. ${getAPITokenError.message}`}</p>
        ) : apiToken == null ? (
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
      <p>
        <Link href="/">
          <a>Back to Home</a>
        </Link>
      </p>
    </>
  );
}
