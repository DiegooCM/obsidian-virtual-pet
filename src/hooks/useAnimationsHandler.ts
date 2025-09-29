import { PetAnimation } from "src/types";
import animations from "../animations.json";
import { useRef, useState } from "react";

export function useAnimationsHandler() {
	const sleepingTimeoutId = useRef(0);
	const [animation, setAnimation] = useState<PetAnimation>(
		animations.walkAnimation
	);

	const handleDefaults = () => {
		setAnimation(animations.standAnimation);
	};

	const handleSleeping = () => {
		if (sleepingTimeoutId.current) {
			clearTimeout(sleepingTimeoutId.current);
		}

		// Checks if it sleeping makes it coding during 5 seconds
		if (animation === animations.sleepingAnimation) {
			setAnimation(animations.codingAnimation);
			setTimeout(() => handleDefaults(), 5000); // 5 seconds
		}

		sleepingTimeoutId.current = window.setTimeout(() => {
			setAnimation(animations.sleepingAnimation);
		}, 30000); // 30 seconds
	};

	// This function is only use in the devtools
	const changeAnimation = (newAnimation: PetAnimation) => {
		if (animation === newAnimation) return;

		setAnimation(newAnimation);
	};

	const levelUp = () => {
		// Animation changes
		setAnimation(animations.celebrateAnimation);
		setTimeout(() => setAnimation(animations.walkAnimation), 2000);
	};

	return {
		animation,
		handleSleeping,
		changeAnimation,
		levelUp,
	};
}
