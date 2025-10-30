import { App, Modal } from "obsidian";
import StatsHandler from "src/stats/StatsHandler";
import { UserItems, UserStats } from "src/types";
import { ShopItems } from "./ShopItems";

export class ShopModal extends Modal {
	private userStats: UserStats;
	private userItems: UserItems;
	private statsHandler: StatsHandler;
	private headerEl: HTMLElement; // Idk why the modal class don't recognize headerEl. I declare it for removing the error on my editor
  private setUserItems: (value: React.SetStateAction<UserItems>) => void;
	constructor(
		app: App,
		statsHandler: StatsHandler,
		setUserItems: (value: React.SetStateAction<UserItems>) => void
	) {
		super(app);
		this.statsHandler = statsHandler;
		this.userStats = this.statsHandler.getUserStats();
		this.userItems = this.statsHandler.getUserItems();
		this.setUserItems = setUserItems;
	}

	onOpen(): void {
		this.modalEl.addClass("virtual-pet-shop");
		this.createShop();
	}

	onClose(): void {
		this.setUserItems(this.userItems);
	}

	createShop = () => {
		// Header
		this.headerEl.createEl("h1", { text: "Shop" });
		const coinsContainer = this.headerEl.createDiv("coins-container")
    coinsContainer.createEl("img", {attr: {
      src: this.app.vault.adapter.getResourcePath(
        "./.obsidian/plugins/obsidian-virtual-pet/assets/coin.png" 
      )}
    })
    coinsContainer.createEl("span", {
			text: this.userStats.coins.toString(),
		});
		// Filter
		const filter = this.contentEl.createDiv("filter");
		filter.createEl("p", { text: "All" });
		// Items
    ShopItems({
      contentEl: this.contentEl,
      userItems: this.userItems, 
      userStats: this.userStats,
      statsHandler: this.statsHandler,
      modalRerender: this.modalRerender,
      app: this.app
    });
	};

	modalRerender = () => {
		this.contentEl.innerHTML = "";
		this.headerEl.innerHTML = "";
		this.createShop();
	};

}
