import { Filters } from "./types";

export const VIEW_TYPE_VIRTUAL_PET = "virtual-pet";

export const defaultFilters: Filters = [
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
