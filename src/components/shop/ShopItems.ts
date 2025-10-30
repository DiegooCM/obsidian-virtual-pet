import { App } from "obsidian";
import items from "src/items.json";
import StatsHandler from "src/stats/StatsHandler";
import { ItemCategory, ItemsJson, UserItems, UserStats } from "src/types";

interface shopItemsI {
  contentEl: HTMLElement;
  userItems: UserItems;
  userStats: UserStats;
  statsHandler: StatsHandler;
  modalRerender: () => void;
  app: App;
}

export function ShopItems({contentEl, userItems, userStats, statsHandler, modalRerender, app}: shopItemsI) {
	const checkItem = (itemName: string, itemCategory: ItemCategory) => {
		const isEquiped = userItems.equiped[itemCategory] === itemName;
		if (isEquiped) return "equiped";

		const isObtained =
			userItems.obtained[itemCategory].includes(itemName);
		if (isObtained) return "obtained";

		return;
	};

	const buyItem = (itemName: string, itemCategory: ItemCategory) => {
		const itemPrice = items
			.find((categoryGroup) => categoryGroup.category === itemCategory)
			?.items.find((item) => item.name === itemName)?.price;

		if (itemPrice && userStats.coins > itemPrice) {
			statsHandler.addNewItem(itemName, itemCategory, itemPrice);
		}

		modalRerender();
	};

	const equipItem = (itemName: string, itemCategory: ItemCategory) => {
		statsHandler.equipItem(itemName, itemCategory);
		modalRerender();
	};

	const unequipItem = (itemName: string, itemCategory: ItemCategory) => {
		statsHandler.unequipItem(itemName, itemCategory);
		modalRerender();
	};

  const itemsContainer = contentEl.createDiv("items-container");

  items.map((itemsCategory: ItemsJson) => {
    itemsContainer.createEl("h2", { text: itemsCategory.name });
    const shopItems = itemsContainer.createDiv("items");
    itemsCategory.items.map((item) => {
      const itemState = checkItem(
        item.name,
        itemsCategory.category
      );
      const cardItem = shopItems.createDiv("shop-item");
      const itemImg = cardItem.createDiv("item-img")
      itemImg.createEl("img", {
        attr: {
          src: app.vault.adapter.getResourcePath(
            "./.obsidian/plugins/obsidian-virtual-pet/" +
              item.url
          ),
        },
      });
      const itemInfo = cardItem.createDiv("item-info");
      itemInfo.createEl("p", { cls: "item-name", text: item.name });

      if (itemState === "equiped") {
        itemInfo
          .createEl("button", {
            cls: "item-equiped",
            text: "Unequip",
          })
          .onClickEvent(() =>
            unequipItem(item.name, itemsCategory.category)
          );
      } else if (itemState === "obtained") {
        itemInfo
          .createEl("button", {
            cls: "item-obtained",
            text: "Equip",
          })
          .onClickEvent(() =>
            equipItem(item.name, itemsCategory.category)
          );
      } else {
        itemInfo
          .createEl("button", {
            cls: "item-price",
            text: `Price: ${item.price}`,
          })
          .onClickEvent(() =>
            buyItem(item.name, itemsCategory.category)
          );
      }
    });
  });
}
