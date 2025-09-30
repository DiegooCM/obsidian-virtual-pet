import { Ref, useImperativeHandle, useMemo, useState } from "react";
import { App } from "obsidian";
import UserInfo from "src/components/UserInfo";
import StatsHandler from "src/stats/StatsHandler";
import Expbar from "../components/ExpBar";
import PetButtons from "src/components/PetButtons";
import Pet from "src/components/Pet";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { PetViewRef, UserActions } from "src/types";

interface PetView {
	statsHandler: StatsHandler;
	app: App;
	ref: Ref<PetViewRef>;
}

export default function PetView({ statsHandler, app, ref }: PetView) {
	const petBackground = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/background.png"
			),
		[]
	);

	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());

	const { animation, handleSleeping, changeAnimation, levelUp } =
		useAnimationsHandler();

	// Update User info
	const updateUserInfo = () => {
		const newUserData = statsHandler.getUserData();
		const newUserStats = statsHandler.getUserStats();

		if (JSON.stringify(newUserData) !== JSON.stringify(userData)) {
			// Update the data
			setUserData(newUserData);
		}
		if (JSON.stringify(newUserStats) !== JSON.stringify(userStats)) {
			// Level up
			if (newUserStats.exp >= newUserStats.expGoal) {
				levelUp();
				setUserStats(statsHandler.petLevelUp());
			}
			// Not level up
			else {
				setUserStats(newUserStats);
			}
		}
	};

	// To expose the onUserAction function on the ref
	useImperativeHandle<PetViewRef, PetViewRef>(ref, () => {
		return {
			triggerChild(action: UserActions) {
				if (action === "editor-change") handleSleeping();
				updateUserInfo();
			},
		};
	});

	return (
		<>
			<div
				className="plugin"
				style={{
					background: `url(${petBackground}) 0% 0% / cover no-repeat`,
				}}
			>
				<Pet animation={animation} app={app} userStats={userStats} />
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
