import { PetAnimation } from "src/types";
import animations from "../animations.json";
import animationsTimes from "../animationsTimes.json";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAnimationsHandler() {
  const sleepingTimeoutId = useRef(0);
  const defaultTimeoutId = useRef(0);
  const nextDefault = useRef<PetAnimation>(animations.stand);
  const [animation, setAnimation] = useState<PetAnimation>(animations.stand);
  const animationRef = useRef(animation);

  // Rotates defaults animations
  const handleDefaults = useCallback(
    (next?: string) => {
      if (next === "walk") nextDefault.current = animations.walk;

      window.clearTimeout(defaultTimeoutId.current);

      if (animationRef.current === animations.sleep && !next) return;

      changeAnimation(nextDefault.current);

      nextDefault.current === animations.stand
        ? (nextDefault.current = animations.walk)
        : (nextDefault.current = animations.stand);

      defaultTimeoutId.current = window.setTimeout(
        () => handleDefaults(),
        animationsTimes.handleDefaults,
      ); // 20 seconds
    },
    [nextDefault.current],
  );

  const handleSleeping = (toWalk?: boolean) => {
    window.clearTimeout(sleepingTimeoutId.current);

    // Stops sleeping
    if (animationRef.current === animations.sleep) {
      if (toWalk) {
        handleDefaults("walk");
      } else {
        changeAnimation(animations.code);
        setTimeout(() => {
          handleDefaults();
        }, animationsTimes.coding);
      }
    }

    sleepingTimeoutId.current = window.setTimeout(() => {
      changeAnimation(animations.sleep);
    }, animationsTimes.sleepingAfterInactive);
  };

  const changeAnimation = (newAnimation: PetAnimation) => {
    if (animationRef.current === newAnimation) return;
    setAnimation(newAnimation);
  };

  const levelUpAnimation = () => {
    // Animation changes
    changeAnimation(animations.celebrate);
    window.setTimeout(() => {
      handleDefaults();
    }, animationsTimes.levelUp); // 3 seconds
  };

  useEffect(() => {
    animationRef.current = animation;
  }, [animation]);

  return {
    animation,
    handleSleeping,
    handleDefaults,
    changeAnimation,
    levelUpAnimation,
  };
}
