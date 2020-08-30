import { useState, useCallback } from "react";

export const usePromise = <T>() => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const invoke = useCallback(
    (promise: Promise<T>) => {
      setIsPending(true);
      setError(null);
      promise
        .then((result) => {
          setResult(result);
          setIsPending(false);
        })
        .catch((error) => {
          setError(error);
          setIsPending(false);
        });
    },
    [setIsPending, setResult, setError]
  );
  return [isPending, error, result, invoke] as const;
};
