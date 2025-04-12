import { Plugin } from "obsidian";
import { UserStats } from "src/types";

// Si da problemas hacerlo una promesa
export async function getUserStats(
	plugin: Plugin
): Promise<UserStats | undefined> {
	try {
		const data = await plugin.loadData();

		// Checks if the user has stats
		if (data.userStats && Object.keys(data).length !== 0) {
			return data.userStats;
		}

		return undefined;
	} catch (error) {
		console.error(error);
	}
}

export async function saveUserStats(
	plugin: Plugin,
	userStats: UserStats | undefined
): Promise<void> {
	if (userStats?.exp) {
		plugin.saveData({
			userStats: userStats,
		});
	}
}
