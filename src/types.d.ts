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
