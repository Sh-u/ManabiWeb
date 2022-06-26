import { atom } from "recoil";

export const showCreateCardState = atom<boolean>({
    key: "showCreateCardState",
    default: false
  })
  