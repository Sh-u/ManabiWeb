import { atom } from "recoil";

export const showDeckBodyState = atom<boolean>({
  key: "showDeckBodyState",
  default: false,
});
