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
  private setUserItems: (value: React.SetStateAction<UserItems>) => void;
  private reactRoot: Root | null = null;
  private getAsset: GetAssetT;

  constructor(
    app: App,
    getAsset: GetAssetT,
    statsHandler: StatsHandler,
    setUserItems: (value: React.SetStateAction<UserItems>) => void,
  ) {
    super(app);
    this.statsHandler = statsHandler;
    this.userStats = this.statsHandler.getUserStats();
    this.userItems = this.statsHandler.getUserItems();
    this.setUserItems = setUserItems;
    this.getAsset = getAsset;
  }

  onOpen(): void {
    this.modalEl.addClass("vpet-shop-modal");
    this.createShop();
  }

  onClose(): void {
    this.setUserItems(this.userItems);
  }

  createShop = () => {
    this.reactRoot = createRoot(this.contentEl);
    this.reactRoot.render(
      createElement(Shop, {
        userItems: this.userItems,
        userStats: this.userStats,
        statsHandler: this.statsHandler,
        getAsset: this.getAsset,
      }),
    );
  };
}
