import { AnimationsHandlerI, DefaultsNext, PetAnimation } from "src/types";
import animations from "../jsons/animations.json";
import animationsTimes from "../jsons/animationsTimes.json";
import { useEffect, useRef, useState } from "react";

export function useAnimationsHandler(): AnimationsHandlerI {
  const sleepingTimeoutIdRef = useRef(0);
  const animationTimeoutIdRef = useRef(0);
  const nextDefaultRef = useRef<PetAnimation>(animations.walk);
  const [animation, setAnimation] = useState<PetAnimation>(animations.walk);
  const animationRef = useRef(animation);

  // Rotates defaults animations
  const toDefaults = (next?: DefaultsNext) => {
    if (next === "walk") nextDefaultRef.current = animations.walk;

    if (animationRef.current === animations.sleep && !next) return;

    changeAnimation(nextDefaultRef.current, animationsTimes.default);

    nextDefaultRef.current =
      nextDefaultRef.current === animations.stand
        ? animations.walk
        : animations.stand;
  };

  const triggerSleeping = (ifSleeping: () => void) => {
    window.clearTimeout(sleepingTimeoutIdRef.current);

    // Stops sleeping
    if (animationRef.current === animations.sleep) {
      ifSleeping();
    }

    sleepingTimeoutIdRef.current = window.setTimeout(() => {
      changeAnimation(animations.sleep);
    }, animationsTimes.sleepingAfterInactive);
  };

  const changeAnimation = (newAnimation: PetAnimation, duration?: number) => {
    window.clearTimeout(animationTimeoutIdRef.current);
    // Finished the duration of the animation is changed to default
    if (duration) {
      animationTimeoutIdRef.current = window.setTimeout(() => {
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
