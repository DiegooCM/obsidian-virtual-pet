import { PetAnimation } from "src/types";
import animations from "../jsons/animations.json";
import animationsTimes from "../jsons/animationsTimes.json";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_ANIMATIONS } from "src/constants";

type DefaultAnimations = (typeof DEFAULT_ANIMATIONS)[number];

export interface AnimationsHandlerI {
  animation: PetAnimation;
  triggerSleeping: (ifSleeping: () => void) => void;
  toDefaults: (next?: DefaultAnimations | "next") => void;
  changeAnimation: (newAnimation: PetAnimation, duration?: number) => void;
}

export function useAnimationsHandler(): AnimationsHandlerI {
  const sleepingTimeoutIdRef = useRef(0);
  const animationTimeoutIdRef = useRef(0);
  const nextDefaultRef = useRef<PetAnimation>(animations.walk);
  const [animation, setAnimation] = useState<PetAnimation>(animations.walk);
  const animationRef = useRef(animation);

  /**
   * Returns the next animation on the list of defaults animations.
   */
  const rotateDefaults = (): PetAnimation => {
    const currentAnimationIdx = DEFAULT_ANIMATIONS.findIndex(
      (i) => i === nextDefaultRef.current.name,
    );

    if (currentAnimationIdx === DEFAULT_ANIMATIONS.length - 1)
      return animations[DEFAULT_ANIMATIONS[0]];

    return animations[DEFAULT_ANIMATIONS[currentAnimationIdx + 1]];
  };

  /**
   * Set one of the defaults animations (ex. walking and standing) without repeating animation
   * @param next - Optional. Forces which animation is going next.
   */
  const toDefaults = (next?: DefaultAnimations | "next") => {
    if (next === "walk") nextDefaultRef.current = animations.walk;

    if (animationRef.current === animations.sleep && !next) return;

    changeAnimation(nextDefaultRef.current, animationsTimes.default);

    nextDefaultRef.current = rotateDefaults();
  };

  /**
   * Sets a timer to changing the animation to sleep
   * @param ifSleeping - A function that is executed in case that the pet is already sleeping.
   * Useful for choosing the next animation.
   */
  const triggerSleeping = (ifSleeping: () => void) => {
    // Clean the previous timer
    window.clearTimeout(sleepingTimeoutIdRef.current);

    // Stops sleeping
    if (animationRef.current === animations.sleep) {
      ifSleeping();
    }

    // Sets the timer
    sleepingTimeoutIdRef.current = window.setTimeout(() => {
      changeAnimation(animations.sleep);
    }, animationsTimes.sleepingAfterInactive);
  };

  /**
   * Changes the animation to the choosing one.
   * @param newAnimation - New animation to be set
   * @param duration - Optional. Sets how long will last the animation
   */
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

  /**
   * Updates the state of the animation
   */
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
