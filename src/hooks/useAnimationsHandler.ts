import { PetAnimation } from "src/types";
import animations from "../animations.json";
import { useRef, useState } from "react";

export function useAnimationsHandler() {
	const sleepingTimeoutId = useRef(0);
	const defaultTimeoutId = useRef(0);
	const nextDefault = useRef(animations.stand); // no tiene q ver
	const [animation, setAnimation] = useState<PetAnimation>(animations.stand);

	// Rotates defaults animations
	const handleDefaults = () => {
		nextDefault.current === animations.stand
			? (nextDefault.current = animations.walk)
			: (nextDefault.current = animations.stand);

		setAnimation(nextDefault.current);

		defaultTimeoutId.current = window.setTimeout(
			() => handleDefaults(),
			20000
		); // 20 seconds
	};

	const handleSleeping = () => {
		if (sleepingTimeoutId.current) {
			clearTimeout(sleepingTimeoutId.current);
		}

		// Checks if it sleeping makes it coding during 10 seconds
		if (animation === animations.sleep) {
			changeAnimation(animations.code);
			setTimeout(() => handleDefaults(), 10000); // 10 seconds
		}

		sleepingTimeoutId.current = window.setTimeout(() => {
			changeAnimation(animations.sleep);
		}, 60000); // 1 min
	};

	const changeAnimation = (newAnimation: PetAnimation) => {
		if (defaultTimeoutId.current) {
			clearTimeout(defaultTimeoutId.current);
			defaultTimeoutId.current = 0;
		}

		setAnimation(newAnimation);
	};

	const levelUpAnimation = () => {
		// Animation changes
		changeAnimation(animations.celebrate);
		window.setTimeout(() => {
			handleDefaults();
		}, 3000); // 3 seconds
	};

	return {
		animation,
		handleSleeping,
		handleDefaults,
		changeAnimation,
		levelUpAnimation,
	};
}
