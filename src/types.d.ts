import { View } from "obsidian";
import StatsHandler from "./stats/StatsHandler";

export interface UserData {
	actualFileWordCount: number;
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
