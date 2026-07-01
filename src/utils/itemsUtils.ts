import Items from "src/jsons/items.json";
import { ItemCategory } from "src/types";
import { Filter, Filters, ItemsJson, UserItems } from "src/types";

const accessoriesItems = Items.find(
  (itemsCategory) => itemsCategory.category === "Accessories",
)?.items.map((i) => i.name);
const backgroundsItems = Items.find(
  (itemsCategory) => itemsCategory.category === "Backgrounds",
)?.items.map((i) => i.name);

export function isValidItem(category: ItemCategory, item: string): boolean {
  if (category === "Accessories" && accessoriesItems)
    return accessoriesItems.contains(item);
  if (category === "Backgrounds" && backgroundsItems)
    return backgroundsItems.contains(item);
  return false;
}

export function filterItems(filters: Filters, userItems: UserItems): ItemsJson {
  const filterByCategory = (filter: Filter) => {
    if (!Object.values(filter.options).contains(false)) return;
    // Gets the categories to filter (category: false), from the filter.
    const toFilter = Object.entries(filter.options)
      .filter(([, val]) => !val)
      .map((f) => f[0]);
    console.log("toFilter: ", toFilter);

    // Filter the itemsJson with the toFilter.
    toFilter.map((filterCategory) => {
      itemsJsonFiltered = itemsJsonFiltered.filter(
        (itemsCategory) => itemsCategory.category !== filterCategory,
      );
    });
  };
  const filterByPurchaseStatus = (filter: Filter) => {
    if (!Object.values(filter.options).contains(false)) return;

    const toFilter = Object.entries(filter.options)
      .filter(([, val]) => !val)
      .map((f) => f[0]);

    itemsJsonFiltered.map((itemsCategory) => {
      return (
        (itemsCategory.items = itemsCategory.items.filter((item) => {
          // Condition that checks if the item is obtained
          const condition = userItems.obtained[itemsCategory.category].includes(
            item.name,
          );
          // Depending of the filter it returns if is obtained or not
          return toFilter.includes("Buyed") ? !condition : condition;
        })),
        { ...itemsCategory }
      );
    });
  };

  const filterByEquipmentStatus = (filter: Filter) => {
    if (!Object.values(filter.options).contains(false)) return;

    const toFilter = Object.entries(filter.options)
      .filter(([, val]) => !val)
      .map((f) => f[0]);

    itemsJsonFiltered.map((itemsCategory) => {
      return (
        (itemsCategory.items = itemsCategory.items.filter((item) => {
          // Condition that checks if the item is obtained
          const condition =
            userItems.equiped[itemsCategory.category] === item.name;
          // Depending of the filter it returns if is obtained or not
          return toFilter.includes("Equiped") ? !condition : condition;
        })),
        { ...itemsCategory }
      );
    });
  };

  let itemsJsonFiltered = JSON.parse(JSON.stringify(Items)) as ItemsJson;

  const [categoryFilter, purchaseFilter, equipmentFilter] = filters;

  const isEmpty = filters.map((f) => {
    if (Object.values(f.options).every((i) => i === false)) return true;
    else {
      return false;
    }
  });

  if (isEmpty.contains(true)) return [];

  filterByCategory(categoryFilter);
  filterByPurchaseStatus(purchaseFilter);
  filterByEquipmentStatus(equipmentFilter);

  return itemsJsonFiltered;
}
