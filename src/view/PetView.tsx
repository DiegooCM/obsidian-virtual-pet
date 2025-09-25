import UserInfo from "src/components/UserInfo";
import StatsHandler from "src/stats/StatsHandler";

import { LegacyRef, useMemo, useRef, useState } from "react";
import animations from "../animations.json";
import type { petAnimation } from "../types";
import Expbar from "../components/ExpBar";
import PetButtons from "src/components/PetButtons";
import { App } from "obsidian";

type PetView = {
	statsHandler: StatsHandler;
	app: App;
};

export default function PetView({ statsHandler, app }: PetView) {
	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());

	// Assets
	const petSpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/spritesheet.png"
			),
		[]
	);
	const petBackground = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/background.png"
			),
		[]
	);

	// States
	const [actualAnimation, setActualAnimation] = useState<petAnimation>(
		animations.walkAnimation
	);

	// Refs
	const petRef: LegacyRef<HTMLDivElement> | null = useRef(null);
	const petContainerRef: LegacyRef<HTMLDivElement> | null = useRef(null);
	const petAnimationsContainerRef: LegacyRef<HTMLDivElement> | null =
		useRef(null);
	const intervalId = useRef(0);

	const previousAnimationIdx = useRef<number>(0);
	const animationFrameId = useRef<number>(0);
	const petVelocity = useRef<number>(actualAnimation.speed);

	const fpsAnimation = actualAnimation.fps; // Not all the frames of each animations last the same, this const says to the loop how much has the frame to last

	// Change ActualAnimation
	const changeAnimation = (newAnimation: petAnimation) => {
		if (actualAnimation === newAnimation) return;

		// cancelAnimationFrame(animationFrameId.current);
		// animationFrameId.current = 0;
		setActualAnimation(newAnimation);
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
		setActualAnimation(animations.celebrateAnimation);
		setTimeout(() => setActualAnimation(animations.walkAnimation), 2000);

		setUserStats(statsHandler.petLevelUp());
	};

	// Main Loop
	const animate = (timestamp: number) => {
		// Pet animation
		if (!petRef.current || !petContainerRef.current) return;

		const windowWidth =
			petAnimationsContainerRef.current?.clientWidth || 600;

		const animationIdx =
			Math.floor(timestamp / (1000 / fpsAnimation)) %
			actualAnimation.animation.length;

		if (animationIdx !== previousAnimationIdx.current) {
			petRef.current.style.backgroundPosition = `-${
				actualAnimation.animation[animationIdx][0] * 64
			}px
        -${actualAnimation.animation[animationIdx][1] * 64}px`;

			// Movement animation
			if (actualAnimation.speed > 0) {
				const actualLeft = parseInt(petContainerRef.current.style.left);
				petContainerRef.current.style.left = `${
					actualLeft + petVelocity.current
				}px`;

				// Touched left border
				if (actualLeft <= 64) {
					petVelocity.current = actualAnimation.speed;
					petRef.current.style.transform = "scaleX(1)";
				}
				// Touched right border
				if (actualLeft >= windowWidth - 128) {
					petVelocity.current = actualAnimation.speed * -1;
					petRef.current.style.transform = "scaleX(-1)";
				}
			}
		}

		previousAnimationIdx.current = animationIdx;

		// Start new loop
		animationFrameId.current = requestAnimationFrame(animate);
	};

	//
	if (intervalId.current) {
		clearInterval(intervalId.current);
	}
	intervalId.current = window.setInterval(() => {
		updateUserInfo();
	}, 500);

	// Animation frame loop
	if (animationFrameId.current)
		cancelAnimationFrame(animationFrameId.current);
	animationFrameId.current = requestAnimationFrame(animate);

	return (
		<>
			<div
				className="plugin"
				style={{
					background: `url(${petBackground}) 0% 0% / cover no-repeat`,
				}}
			>
				<div
					className="pet-animations-container"
					ref={petAnimationsContainerRef}
				>
					<div
						className="pet-container"
						ref={petContainerRef}
						style={{ left: "0px" }}
					>
						<p className="pet-level">Level: {userStats.level}</p>
						<div
							className="pet"
							ref={petRef}
							style={{ background: `url(${petSpritesheet})` }}
						></div>
					</div>
				</div>

				<Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
			</div>
			<div className="debug-tools">
				<UserInfo userData={userData} userStats={userStats} />
				<h1>Change Pet Animation</h1>
				<PetButtons
					actualAnimation={actualAnimation}
					changeAnimation={changeAnimation}
				/>
			</div>
		</>
	);
}
