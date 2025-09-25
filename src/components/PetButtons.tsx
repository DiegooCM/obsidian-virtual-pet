import type { petAnimation } from "../types";
import animations from "../animations.json";

type PetButtonsType = {
	actualAnimation: petAnimation;
	changeAnimation: (newAnimation: petAnimation) => void;
};

export default function PetButtons({
	actualAnimation,
	changeAnimation,
}: PetButtonsType) {
	return (
		<div className="pet-buttons">
			<button
				onClick={() => {
					changeAnimation(animations.standAnimation);
				}}
				className={
					actualAnimation === animations.standAnimation
						? "active"
						: ""
				}
			>
				Stand
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.walkAnimation);
				}}
				className={
					actualAnimation === animations.walkAnimation ? "active" : ""
				}
			>
				Walk
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.celebrateAnimation);
				}}
				className={
					actualAnimation === animations.celebrateAnimation
						? "active"
						: ""
				}
			>
				Celebrate
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.codingAnimation);
				}}
				className={
					actualAnimation === animations.codingAnimation
						? "active"
						: ""
				}
			>
				Code
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.sleepingAnimation);
				}}
				className={
					actualAnimation === animations.sleepingAnimation
						? "active"
						: ""
				}
			>
				Sleep
			</button>
		</div>
	);
}
