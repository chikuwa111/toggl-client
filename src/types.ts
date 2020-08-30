export type TimeEntry = {
  description: string;
  wid: number;
  pid: number;
  tags: string[];
};

export type CurrentTimeEntry = TimeEntry & {
  id: number;
  start: string;
};
