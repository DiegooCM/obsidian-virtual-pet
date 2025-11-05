import { Filters } from "./types";

export const VIEW_TYPE_VIRTUAL_PET = "virtual-pet";


export const defaultFilters:Filters = [
  {
    "category": "Category",
    "options": {
      "Backgrounds": true,
      "Accessories": true,
    }
  },
  {
    "category": "Purchase Status",
    "options" : {
      "Buyed": true,
      "Not Buyed": true,
    }
  },
  {
    "category": "Equipment Status",
    "options" : {
      "Equiped": true,
      "Not Equiped": true
    }
  } 
]

