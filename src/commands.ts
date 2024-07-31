export const COMMAND = {
  PLAY: "play",
  SKIP: "skip",
  QUEUE: "queue",
  CLEAR: "clear",
} as const;
export type COMMAND = (typeof COMMAND)[keyof typeof COMMAND];

export const isCommand = (test: string): test is COMMAND => {
  return Object.values(COMMAND).includes(test as COMMAND);
};
