import { atom } from "recoil";


export const showDeckBodyState = atom<boolean>({
    key: 'showDeckBodyState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
  });