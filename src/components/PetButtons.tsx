import type { petAnimation } from "../types";
import animations from "../animations.json";

type PetButtonsType = {
	animation: petAnimation;
	changeAnimation: (newAnimation: petAnimation) => void;
};

export default function PetButtons({
	animation,
	changeAnimation,
}: PetButtonsType) {
	return (
		<div className="pet-buttons">
			<button
				onClick={() => {
					changeAnimation(animations.standAnimation);
				}}
				className={
					animation === animations.standAnimation ? "active" : ""
				}
			>
				Stand
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.walkAnimation);
				}}
				className={
					animation === animations.walkAnimation ? "active" : ""
				}
			>
				Walk
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.celebrateAnimation);
				}}
				className={
					animation === animations.celebrateAnimation ? "active" : ""
				}
			>
				Celebrate
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.codingAnimation);
				}}
				className={
					animation === animations.codingAnimation ? "active" : ""
				}
			>
				Code
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.sleepingAnimation);
				}}
				className={
					animation === animations.sleepingAnimation ? "active" : ""
				}
			>
				Sleep
			</button>
		</div>
	);
}
