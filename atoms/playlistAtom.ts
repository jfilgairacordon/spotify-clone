import { atom } from "recoil";

export const playlistState = atom<any>({
    key: "playlistState",
    default: null
})

export const playlistIdState = atom({
    key: "playlistIdState",
    default: "2rJzexpKWqVzUF5ju3cJX9",
})