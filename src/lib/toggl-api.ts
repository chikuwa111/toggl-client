import { CurrentTimeEntry, TimeEntry } from "@/types";

const TOGGL_API_BASE_URL = "https://www.toggl.com/api/v8";

const getAuthHeader = (apiToken: string) => ({
  Authorization: `Basic ${btoa(`${apiToken}:api_token`)}`,
});

export const getCurrentTimeEntry = (
  apiToken: string
): Promise<CurrentTimeEntry> =>
  fetch(`${TOGGL_API_BASE_URL}/time_entries/current`, {
    headers: getAuthHeader(apiToken),
  })
    .then((res) => {
      if (200 <= res.status && res.status < 400) {
        return res.json();
      }
      return Promise.reject(new Error("Invalid token"));
    })
    .then((json) => json.data);

export const makeWebSocketConnection = (
  apiToken: string,
  onError: (error: Error) => void,
  onFetchCurrentTimeEntry: (currentTimeEntry: CurrentTimeEntry) => void
) => {
  try {
    const ws = new WebSocket("wss://stream.toggl.com/ws");

    ws.onerror = (e) => {
      onError(new Error(`Error occurred. (${e})`));
    };
    ws.onclose = () => {
      onError(new Error("Closed websocket connection."));
    };
    ws.onopen = () => {
      try {
        const authMsg = {
          type: "authenticate",
          api_token: apiToken,
        };
        ws.send(JSON.stringify(authMsg));
      } catch (error) {
        onError(error);
      }
    };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.model === "time_entry") {
          onFetchCurrentTimeEntry(data.data);
        } else {
          const pongMsg = {
            type: "pong",
          };
          ws.send(JSON.stringify(pongMsg));
        }
      } catch (error) {
        onError(error);
      }
    };
  } catch (error) {
    onError(error);
  }
};

export const startNewTimeEntry = (apiToken: string, timeEntry: TimeEntry) =>
  fetch(`${TOGGL_API_BASE_URL}/time_entries/start`, {
    method: "POST",
    headers: {
      ...getAuthHeader(apiToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time_entry: {
        ...timeEntry,
        created_with: "toggl-client.chikuwa111.com",
      },
    }),
  });

export const updateCurrentTimeEntry = (
  apiToken: string,
  timeEntry: TimeEntry
) =>
  getCurrentTimeEntry(apiToken)
    .then((currentTimeEntry) => currentTimeEntry.id)
    .then((id) =>
      fetch(`${TOGGL_API_BASE_URL}/time_entries/${id}`, {
        method: "POST",
        headers: {
          ...getAuthHeader(apiToken),
          "Content-Type": "applicataion/json",
        },
        body: JSON.stringify({ time_entry: timeEntry }),
      })
    );
