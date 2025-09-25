import UserInfo from "src/components/UserInfo";
import StatsHandler from "src/stats/StatsHandler";

import { useMemo, useRef, useState } from "react";
import animations from "../animations.json";
import type { petAnimation } from "../types";
import Expbar from "../components/ExpBar";
import PetButtons from "src/components/PetButtons";
import { App } from "obsidian";
import Pet from "src/components/Pet";

type PetView = {
	statsHandler: StatsHandler;
	app: App;
};

export default function PetView({ statsHandler, app }: PetView) {
	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());

	// Assets
	const petBackground = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/background.png"
			),
		[]
	);

	// States
	const [animation, setAnimation] = useState<petAnimation>(
		animations.walkAnimation
	);

	// Refs
	const intervalId = useRef(0);

	// Change Animation
	const changeAnimation = (newAnimation: petAnimation) => {
		if (animation === newAnimation) return;

		setAnimation(newAnimation);
	};

	// Update User info
	const updateUserInfo = () => {
		const newUserData = statsHandler.getUserData();
		const newUserStats = statsHandler.getUserStats();

		if (JSON.stringify(newUserData) !== JSON.stringify(userData)) {
			// Update the data
			setUserData(newUserData);
		}
		if (JSON.stringify(newUserStats) !== JSON.stringify(userStats)) {
			if (newUserStats.exp >= newUserStats.expGoal) {
				levelUp();
			} else {
				setUserStats(newUserStats);
			}
		}
	};
	// Level up function
	const levelUp = () => {
		// Animation changes
		setAnimation(animations.celebrateAnimation);
		setTimeout(() => setAnimation(animations.walkAnimation), 2000);

		setUserStats(statsHandler.petLevelUp());
	};

	//
	if (intervalId.current) {
		clearInterval(intervalId.current);
	}
	intervalId.current = window.setInterval(() => {
		updateUserInfo();
	}, 200);

	return (
		<>
			<div
				className="plugin"
				style={{
					background: `url(${petBackground}) 0% 0% / cover no-repeat`,
				}}
			>
				<Pet
					animation={animation}
					setAnimation={setAnimation}
					app={app}
					userStats={userStats}
				/>
				<Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
			</div>
			<div className="debug-tools">
				<UserInfo userData={userData} userStats={userStats} />
				<h1>Change Pet Animation</h1>
				<PetButtons
					animation={animation}
					changeAnimation={changeAnimation}
				/>
			</div>
		</>
	);
}
