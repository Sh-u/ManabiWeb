import { atom } from "recoil";

export const showCreatePostState = atom<boolean>({
    key: "showCreatePostState",
    default: false
  })
  