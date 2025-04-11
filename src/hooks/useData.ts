import { Plugin } from "obsidian";
import { UserStats } from "src/types";

// Si da problemas hacerlo una promesa
export function getUserStats(plugin: Plugin): Promise<UserStats | undefined> {
	return new Promise((resolve) => {
		try {
			plugin.loadData().then((data) => {
				// Checks if the user haves stats

				if (!data) resolve(undefined);
				if (data.userStats && Object.keys(data).length !== 0) {
					resolve(data.userStats);
				}
			});

			resolve(undefined);
		} catch (error) {
			console.error(error);
		}
	});
}

export function saveUserStats(
	plugin: Plugin,
	userStats: UserStats | undefined
): void {
	// TODO: change this method to check is the stats are the default ones
	if (userStats?.level !== 0) {
		// Checks that the userStats isn't default
		plugin.saveData({
			userStats: userStats,
		});
	}
}
