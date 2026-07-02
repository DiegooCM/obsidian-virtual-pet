import { Filters } from "./types";

export const VIEW_TYPE_VIRTUAL_PET = "virtual-pet";

export const DEFAULT_FILTERS: Filters = [
  {
    category: "Category",
    options: {
      Backgrounds: true,
      Accessories: true,
    },
    isOpen: false,
  },
  {
    category: "Purchase Status",
    options: {
      Buyed: true,
      "Not Buyed": true,
    },
    isOpen: false,
  },
  {
    category: "Equipment Status",
    options: {
      Equiped: true,
      "Not Equiped": true,
    },
    isOpen: false,
  },
];

export const DEFAULT_USER_STATS = {
  exp: 0,
  expGoal: 100,
  level: 1,
  coins: 0,
};

export const DEFAULT_USER_ITEMS = {
  equiped: {
    Backgrounds: "Light Default",
    Accessories: "",
  },
  obtained: {
    Backgrounds: ["Light Default"],
    Accessories: [""],
  },
};

export const DEFAULT_ANIMATIONS = ["walk", "stand"] as const;
