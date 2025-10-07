import { App, Modal } from "obsidian";
import StatsHandler from "src/stats/StatsHandler";
import { ItemCategory, ItemsJson, UserItems, UserStats } from "src/types";
import items from "src/items.json";

export class ShopModal extends Modal {
	private userStats: UserStats;
	private userItems: UserItems;
	private statsHandler: StatsHandler;

	constructor(app: App, statsHandler: StatsHandler) {
		super(app);
		this.statsHandler = statsHandler;
		this.userStats = this.statsHandler.getUserStats();
		this.userItems = this.statsHandler.getUserItems();
	}
	onOpen(): void {
		this.modalEl.addClass("virtual-pet-shop");
		this.createShop();
	}

	createShop = () => {
		// Header
		this.titleEl.createEl("h1", { text: "Shop" });
		this.headerEl.createDiv("coins-container").createEl("span", {
			text: `Coins: ${this.userStats.coins}`,
		});
		// Shop Content
		const shopContainer = this.contentEl.createDiv("shop-container");

		// Filter
		const filter = shopContainer.createDiv("filter");
		filter.createEl("p", { text: "All" });
		// Items
		const itemsContainer = shopContainer.createDiv("items-container");
		items.map((itemsCategory: ItemsJson) => {
			itemsContainer.createEl("h2", { text: itemsCategory.name });
			const shopItems = itemsContainer.createDiv("items");
			itemsCategory.items.map((item) => {
				const itemState = this.checkItem(
					item.name,
					itemsCategory.category
				);
				const cardItem = shopItems.createDiv("shop-item");
				cardItem.createEl("img", {
					attr: {
						src: this.app.vault.adapter.getResourcePath(
							"./.obsidian/plugins/obsidian-virtual-pet" +
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
							this.equipItem(item.name, itemsCategory.category)
						);
				} else if (itemState === "obtained") {
					itemInfo
						.createEl("button", {
							cls: "item-obtained",
							text: "Equip",
						})
						.onClickEvent(() =>
							this.equipItem(item.name, itemsCategory.category)
						);
				} else {
					itemInfo
						.createEl("button", {
							cls: "item-price",
							text: `Price: ${item.price}`,
						})
						.onClickEvent(() =>
							this.buyItem(item.name, itemsCategory.category)
						);
				}
			});
		});
	};

	checkItem = (itemName: string, itemCategory: ItemCategory) => {
		const isEquiped = this.userItems.equiped[itemCategory] === itemName;
		if (isEquiped) return "equiped";

		const isObtained =
			this.userItems.obtained[itemCategory].includes(itemName);
		if (isObtained) return "obtained";

		return;
	};

	buyItem = (itemName: string, itemCategory: ItemCategory) => {
		const itemPrice = items
			.find((categoryGroup) => categoryGroup.category === itemCategory)
			?.items.find((item) => item.name === itemName)?.price;

		if (itemPrice && this.userStats.coins > itemPrice) {
			this.statsHandler.addNewItem(itemName, itemCategory, itemPrice);
		}
	};

	equipItem = (itemName: string, itemCategory: ItemCategory) => {
		this.statsHandler.equipItem(itemName, itemCategory);
	};

	unequipItem = (itemName: string, itemCategory: ItemCategory) => {
		this.statsHandler.unequipItem(itemName, itemCategory);
	};
}
