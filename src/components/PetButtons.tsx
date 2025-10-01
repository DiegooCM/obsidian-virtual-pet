import type { PetAnimation } from "../types";
import animations from "../animations.json";

type PetButtonsType = {
	animation: PetAnimation;
	changeAnimation: (newAnimation: PetAnimation) => void;
	handleDefaults: () => void;
};

export default function PetButtons({
	animation,
	changeAnimation,
	handleDefaults,
}: PetButtonsType) {
	return (
		<div className="pet-buttons">
			<button
				onClick={() => {
					handleDefaults();
				}}
				className={
					animation === animations.stand ||
					animation === animations.walk
						? "active"
						: ""
				}
			>
				Default
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.celebrate);
				}}
				className={animation === animations.celebrate ? "active" : ""}
			>
				Celebrate
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.code);
				}}
				className={animation === animations.code ? "active" : ""}
			>
				Code
			</button>
			<button
				onClick={() => {
					changeAnimation(animations.sleep);
				}}
				className={animation === animations.sleep ? "active" : ""}
			>
				Sleep
			</button>
		</div>
	);
}
