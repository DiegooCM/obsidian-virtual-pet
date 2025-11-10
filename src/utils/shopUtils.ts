import Items from "src/items.json";
import { Filter, Filters, ItemsJson, UserItems } from "src/types";

export function filterItems(filters: Filters, userItems: UserItems):ItemsJson {
  let itemsJsonFiltered= JSON.parse(JSON.stringify(Items)) as ItemsJson;

  const filterByCategory = ({filter}: { filter: Filter }) => {
    if (!Object.values(filter.options).contains(false)) return;
    // Gets the categories to filter (category: false), from the filter.
    const toFilter = Object.entries(filter.options).filter(([key, val]) => !val).map((f) => f[0])

    // Filter the itemsJson with the toFilter.
    toFilter.map((filterCategory) => {
      itemsJsonFiltered = itemsJsonFiltered.filter((itemsCategory) => itemsCategory.category !== filterCategory);
    })

  }
  const filterByPurchaseStatus = ({filter}: {filter: Filter}) => {
    if (!Object.values(filter.options).contains(false)) return;

    const toFilter = Object.entries(filter.options).filter(([key, val]) => !val).map((f) => f[0])

    itemsJsonFiltered.map((itemsCategory) => {
      return (
        itemsCategory.items = itemsCategory.items.filter((item) => {
          // Condition that checks if the item is obtained
          const condition = userItems.obtained[itemsCategory.category].includes(item.name) 
          // Depending of the filter it returns if is obtained or not
          return(toFilter.includes("Buyed") ? !condition : condition)
        }),
        {...itemsCategory}
      )
    }
    );
  }

  const filterByEquipmentStatus = ({filter} : {filter: Filter}) => {
    if (!Object.values(filter.options).contains(false)) return;

    const toFilter = Object.entries(filter.options).filter(([key, val]) => !val).map((f) => f[0])

    itemsJsonFiltered.map((itemsCategory) => {
      return (
        itemsCategory.items = itemsCategory.items.filter((item) => {
          // Condition that checks if the item is obtained
          const condition = userItems.equiped[itemsCategory.category] === (item.name) 
          // Depending of the filter it returns if is obtained or not
          return(toFilter.includes("Equiped") ? !condition : condition)
        }),
        {...itemsCategory}
      )
    }
    );
  }

  filterByCategory({filter: filters[0]})
  filterByPurchaseStatus({filter: filters[1]})
  filterByEquipmentStatus({filter: filters[2]})

  return itemsJsonFiltered
}
