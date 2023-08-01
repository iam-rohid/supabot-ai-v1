import type { Dispatch, SetStateAction } from "react";

export type UseModalReturning = [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  () => JSX.Element,
];
