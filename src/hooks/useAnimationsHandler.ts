import { PetAnimation } from "src/types";
import animations from "../animations.json";
import { useEffect, useRef, useState } from "react";

export function useAnimationsHandler() {
	const sleepingTimeoutId = useRef(0);
	const defaultTimeoutId = useRef(0);
	const nextDefault = useRef<PetAnimation>(animations.stand);
	const [animation, setAnimation] = useState<PetAnimation>(animations.stand);
  const animationRef = useRef(animation)

  // Rotates defaults animations
  const handleDefaults = () => {
    window.clearTimeout(defaultTimeoutId.current);

    if(animationRef.current === animations.sleep) {
      return;
    }

    changeAnimation(nextDefault.current);

    nextDefault.current === animations.stand ? 
      (nextDefault.current = animations.walk) :
      (nextDefault.current = animations.stand);

    defaultTimeoutId.current = window.setTimeout(
      () => handleDefaults() ,
      20000
    ); // 20 seconds
  };

	const handleSleeping = () => {
    clearTimeout(sleepingTimeoutId.current);

		// Checks if it sleeping makes it coding during 10 seconds
		if (animation === animations.sleep) {
			changeAnimation(animations.code);
			setTimeout(() => {
        handleDefaults()}, 10000); // 10 seconds
		}

		sleepingTimeoutId.current = window.setTimeout(() => {
			changeAnimation(animations.sleep);
		}, 30000); // 30 secs
	};

	const changeAnimation = (newAnimation: PetAnimation) => {
    if (animation === newAnimation) return;
		setAnimation(newAnimation);
	};

	const levelUpAnimation = () => {
		// Animation changes
		changeAnimation(animations.celebrate);
		window.setTimeout(() => {
			handleDefaults();
		}, 3000); // 3 seconds
	};

  useEffect(() => {
    animationRef.current = animation
  },[animation])

  return {
    animation,
		handleSleeping,
		handleDefaults,
		changeAnimation,
		levelUpAnimation,
	};
}
