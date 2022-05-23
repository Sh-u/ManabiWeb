import { atom } from "recoil";

export const showDeckBodyState = atom<boolean>({
  key: "showDeckBodyState",
  default: false,
});

export const currentDeckBodyInfoState = atom<number | undefined>({
  key: "currentDeckBodyInfoState",
  default: undefined,
});

export const createPostState = atom<boolean>({
  key: "createPostState",
  default: false
})
