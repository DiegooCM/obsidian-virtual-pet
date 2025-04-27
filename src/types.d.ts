import { View } from "obsidian";
import StatsHandler from "./stats/StatsHandler";

export interface UserData {
	actualFileWordCount: number;
	filesCount: number;
	isActualFile: boolean;
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

export type Animations = "default" | "walk" | "sit" | "code" | "celebrate";

export interface AnimationsHandlerT {
	handleAnimation: (animation: Animations, time: number) => void;
	handleSleeping: () => void;
}
