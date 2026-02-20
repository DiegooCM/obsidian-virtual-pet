import { View } from "obsidian";
import statsHandler from "./utils/statsHandler";

export interface UserDataJson {
  userData: UserData;
  userStats: UserStats;
}

export interface UserData {
  fileWordCount: number;
  filesCount: number;
}

export interface UserStats {
  exp: number;
  expGoal: number;
  level: number;
  coins: number;
}

export interface UserItems {
  equiped: UserItem;
  obtained: UserItemsObtained;
}

export type UserItem = {
  [K in ItemCategory]: string;
};

export type ItemCategory = "Backgrounds" | "Accessories";

type UserItemsObtained = {
  [K in ItemCategory]: string[];
};

type ItemJson = {
  name: string;
  price: number;
  url: string;
  urlShop?: string;
};

export type ItemsCategory = {
  category: ItemCategory;
  items: ItemJson[];
};

export type ItemsJson = ItemsCategory[];

export type PetViewT = View & { statsHandler: statsHandler };

export interface PetAnimation {
  name: string;
  animation: number[][];
  speed: number;
  fps: number;
}

export type DefaultsNext = "walk" | "stand" | "next";

export interface AnimationsHandlerI {
  animation: PetAnimation;
  triggerSleeping: (ifSleeping: () => void) => void;
  toDefaults: (next?: DefaultsNext) => void;
  changeAnimation: (newAnimation: PetAnimation, duration?: number) => void;
}

export type PetViewRef = {
  triggerChild: (actions: UserActions) => void;
};

export type UserActions = ("check-width" | "handle-sleep" | "update-info")[];

export type Filter = {
  category: string;
  options: {
    [key: string]: boolean;
  };
  isOpen: boolean;
};
export type Filters = Filter[];

export type AssetCategoriesT =
  | "Backgrounds"
  | "Accessories"
  | "Spritesheets"
  | "Others";

export type AssetsT = {
  [Category in AssetCategoriesT]: Record<string, string>;
};

export type GetAssetT = (
  assetCategory: AssetCategoriesT,
  name: string,
) => Promise<string>;

export interface AssetsContextI {
  getAsset: GetAssetT;
}
