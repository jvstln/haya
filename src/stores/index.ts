import { create } from "zustand";

type GlobalStore = {};

export const useGlobalStore = create<GlobalStore>()((set) => ({}));
