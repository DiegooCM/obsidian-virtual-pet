import { App, Modal } from "obsidian";
import StatsHandler from "src/utils/statsHandler";
import { GetAssetT, UserItems, UserStats } from "src/types";
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
	private getAsset: GetAssetT;

	constructor(
    app: App,
		getAsset: GetAssetT,
		statsHandler: StatsHandler,
		setUserItems: (value: React.SetStateAction<UserItems>) => void
  ) {
    super(app);
    this.statsHandler = statsHandler;
    this.userStats = this.statsHandler.getUserStats();
    this.userItems = this.statsHandler.getUserItems();
    this.setUserItems = setUserItems;
    this.getAsset = getAsset;
  }

	onOpen(): void {
		this.modalEl.addClass("virtual-pet-shop-modal");
		this.createShop();
	}

	onClose(): void {
		this.setUserItems(this.userItems);
	}

	createShop = () => {
		// Header
		this.headerEl.createEl("h1", { text: "Shop" });

		const coinsContainer = this.headerEl.createDiv("coins-container")
    // When the coin asset is fetched then it creates the content in the coins-container
    this.getAsset("Others", "coin").then((blob) => {
      coinsContainer.createEl("img", {attr: {src: blob}})
      coinsContainer.createEl("span", {
        text: this.userStats.coins.toString(),
      });
    })

		this.reactRoot = createRoot(this.contentEl);
		this.reactRoot.render(
			createElement(Shop, 
        {
          userItems: this.userItems, 
          userStats: this.userStats,
          statsHandler: this.statsHandler,
          getAsset: this.getAsset
        }
      )
    );
  }
}
