import { atom } from "recoil";

export const currentDeckBodyInfoState = atom<number | undefined>({
    key: "currentDeckBodyInfoState",
    default: undefined,
  });