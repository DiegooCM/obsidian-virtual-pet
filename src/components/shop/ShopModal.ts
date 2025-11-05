import { App, Modal } from "obsidian";
import StatsHandler from "src/stats/StatsHandler";
import { UserItems, UserStats } from "src/types";
import { Root, createRoot } from "react-dom/client";
import { createElement } from "react";
import { Shop } from "./Shop";

export class ShopModal extends Modal {
	private userStats: UserStats;
	private userItems: UserItems;
	private statsHandler: StatsHandler;
	private headerEl: HTMLElement; // Idk why the modal class don't recognize headerEl. I declare it for removing the error on my editor
  private setUserItems: (value: React.SetStateAction<UserItems>) => void;
	private reactRoot: Root | null = null;

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

		this.reactRoot = createRoot(this.contentEl);
		this.reactRoot.render(
			createElement(Shop, 
        {
          userItems: this.userItems, 
          setUserItems: this.setUserItems,
          userStats: this.userStats,
          statsHandler: this.statsHandler,
          app: this.app
        }
      )
    );
  }
}
