import { View } from "obsidian";
import statsHandler from "./utils/statsHandler";

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

export type ItemCategory = "Backgrounds" | "Accessories";

export type UserItem = {
	[K in ItemCategory]: string;
};

type UserItemsObtained = {
	[K in ItemCategory]: string[];
};

export interface UserItems {
	equiped: UserItem;
	obtained: UserItemsObtained;
}

type ItemJson = {
	name: string;
	price: number;
	url: string;
};

export type ItemsCategory = {
	category: ItemCategory;
	items: ItemJson[];
};

export type ItemsJson = ItemsCategory[];

export interface UserInfo {
	exp: number;
}

export type PetViewT = View & { statsHandler: statsHandler };

export interface PetState {
	userData: UserData;
	userStats: UserStats;
}

export interface PetAnimation {
	name: string;
	animation: number[][];
	speed: number;
	fps: number;
}

export interface AnimationsHandler {
	animation: PetAnimation;
	handleSleeping: () => void;
  handleDefaults: () => void;
	changeAnimation: (newAnimation: PetAnimation) => void;
	levelUpAnimation: () => void;
}

export type PetViewRef = {
	triggerChild: (action: string) => void;
};

export type UserActions = "file-open" | "editor-change";

export type Filter = {
  "category": string,
  "options": {
    [key: string]: boolean
  }
}
export type Filters = Filter[]
