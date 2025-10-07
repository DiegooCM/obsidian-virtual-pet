import { View } from "obsidian";
import StatsHandler from "./stats/StatsHandler";

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

export type ItemCategory = "background" | "accessory";

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

export interface ItemsJson {
	name: string;
	category: ItemCategory;
	items: ItemJson[];
}
export interface UserInfo {
	exp: number;
}

export type PetViewT = View & { statsHandler: StatsHandler };

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
	changeAnimation: (newAnimation: PetAnimation) => void;
	levelUp: () => void;
}

export type PetViewRef = {
	triggerChild: (action: string) => void;
};

export type UserActions = "file-open" | "editor-change";
