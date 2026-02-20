import { AnimationsHandlerI, DefaultsNext, PetAnimation } from "src/types";
import animations from "../jsons/animations.json";
import animationsTimes from "../jsons/animationsTimes.json";
import { useEffect, useRef, useState } from "react";

export function useAnimationsHandler(): AnimationsHandlerI {
  const sleepingTimeoutId = useRef(0);
  const animationTimeoutId = useRef(0);
  const nextDefault = useRef<PetAnimation>(animations.walk);
  const [animation, setAnimation] = useState<PetAnimation>(animations.walk);
  const animationRef = useRef(animation);

  // Rotates defaults animations
  const toDefaults = (next?: DefaultsNext) => {
    if (next === "walk") nextDefault.current = animations.walk;

    if (animationRef.current === animations.sleep && !next) return;

    changeAnimation(nextDefault.current, animationsTimes.default);

    nextDefault.current === animations.stand
      ? (nextDefault.current = animations.walk)
      : (nextDefault.current = animations.stand);
  };

  const triggerSleeping = (ifSleeping: () => void) => {
    window.clearTimeout(sleepingTimeoutId.current);

    // Stops sleeping
    if (animationRef.current === animations.sleep) {
      ifSleeping();
    }

    sleepingTimeoutId.current = window.setTimeout(() => {
      changeAnimation(animations.sleep);
    }, animationsTimes.sleepingAfterInactive);
  };

  const changeAnimation = (newAnimation: PetAnimation, duration?: number) => {
    window.clearTimeout(animationTimeoutId.current);
    // Finished the duration of the animation is changed to default
    if (duration) {
      animationTimeoutId.current = window.setTimeout(() => {
        toDefaults();
      }, duration);
    }

    if (animationRef.current === newAnimation) return;
    setAnimation(newAnimation);
  };

  useEffect(() => {
    animationRef.current = animation;
  }, [animation]);

  return {
    animation,
    triggerSleeping,
    toDefaults,
    changeAnimation,
  };
}
