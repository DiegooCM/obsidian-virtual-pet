import { memo, RefObject, useCallback, useEffect, useRef } from "react";
import { useAssets } from "src/contexts/AssetsContext";
import { AnimationsHandlerI, PetAnimation, UserItems } from "src/types";

interface Props {
  isPluginActive: boolean;
  animation: PetAnimation;
  userLevel: number;
  userItems: UserItems;
  toDefaults: AnimationsHandlerI["toDefaults"];
  triggerSleeping: AnimationsHandlerI["triggerSleeping"];
  mainRef: RefObject<HTMLDivElement | null>;
}

export const Pet = memo(function Pet({
  isPluginActive,
  animation,
  userLevel,
  userItems,
  toDefaults,
  triggerSleeping,
  mainRef,
}: Props) {
  // Refs
  const petRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petAccessoryRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const petAccessoryHiddenClassName = "vpet-pet__accessory_hidden";

  const petScaleRef = useRef<number>(1.5);
  const petDirecctionRef = useRef<number>(1); // 1 = right, -1 = left

  const previousAnimationIdxRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number>(0);
  const actualAnimationRef = useRef<PetAnimation>(null);
  const isOutsideTimeoutRef = useRef<number>(0);

  const isOutsideRef = useRef<boolean>(false);

  const { getAsset } = useAssets();

  const checkIsInside = useCallback(
    (windowWidth: number, actualLeft: number, petOuterRelWidth: number) => {
      if (petScaleRef.current === 0) return; // Preventing bug on leaf open

      const margin = petScaleRef.current * 5;

      // Is left
      if (actualLeft < petOuterRelWidth - margin) isOutsideRef.current = true;
      // Is right
      else if (windowWidth - actualLeft < 64 + petOuterRelWidth - margin)
        isOutsideRef.current = true;
      // Is inside
      else isOutsideRef.current = false;

      if (isOutsideRef.current && !isOutsideTimeoutRef.current) {
        // Stops sleeping and starts walking
        isOutsideTimeoutRef.current = window.setTimeout(() => {
          toDefaults("walk");
          triggerSleeping(() => toDefaults());
          isOutsideTimeoutRef.current = 0;
        }, 1000);
      }
    },
    [toDefaults, triggerSleeping],
  );

  // Main Loop
  const animate = useCallback(
    (timestamp: number) => {
      // Pet animation
      if (
        !petRef.current ||
        !petContainerRef.current ||
        !petAccessoryRef.current ||
        !mainRef.current
      )
        return;

      const animationIdx =
        Math.floor(timestamp / (1000 / animation.fps)) %
        animation.animation.length;

      if (animationIdx !== previousAnimationIdxRef.current) {
        let actualLeft = parseInt(petContainerRef.current.style.left);
        const windowWidth = mainRef.current.clientWidth;

        // Change sprite
        const newPos = `
			-${animation.animation[animationIdx][0] * 64}px
			-${animation.animation[animationIdx][1] * 64 + 0}px`;

        petRef.current.style.objectPosition = newPos;
        if (userItems.equiped.Accessories)
          petAccessoryRef.current.style.objectPosition = newPos; // Prevent that if there is no accessory dont change the img pos

        // Change pet scale
        const scaleCalc = windowWidth / 180;
        petScaleRef.current = scaleCalc < 1 ? 1 : scaleCalc; // Scale  = 1 (64px) is the minimum
        petContainerRef.current.style.scale = petScaleRef.current.toString();

        const petOuterRelWidth = Math.floor(
          ((petScaleRef.current - 1) * 64) / 2,
        );

        // Movement animation
        if (animation.speed !== 0) {
          const actualSpeed = (windowWidth * animation.speed) / 800; // Relative speed to the window size
          actualLeft = actualLeft + actualSpeed * petDirecctionRef.current;
          petContainerRef.current.style.left = `${actualLeft}px`;

          // Touched left border
          if (actualLeft <= petOuterRelWidth) {
            petDirecctionRef.current = 1;
            //petRef.current.style.transform = "scaleX(1)";
            petRef.current.setCssProps({ transform: "scaleX(1)" });
            petAccessoryRef.current.setCssProps({ transform: "scaleX(1)" });
          }
          // Touched right border
          if (windowWidth <= actualLeft + petOuterRelWidth + 64) {
            petDirecctionRef.current = -1;
            petRef.current.setCssProps({ transform: "scaleX(-1)" });
            petAccessoryRef.current.setCssProps({ transform: "scaleX(-1)" });
          }
        }

        checkIsInside(windowWidth, actualLeft, petOuterRelWidth);
      }

      previousAnimationIdxRef.current = animationIdx;

      // Start new loop
      animationFrameIdRef.current = requestAnimationFrame(animate);
    },
    [animation, checkIsInside, mainRef, userItems.equiped.Accessories],
  );

  useEffect(() => {
    // Animation frame loop
    if (actualAnimationRef.current !== animation) {
      actualAnimationRef.current = animation;
      // Cancel the current animation
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      // Start a new animation
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    cancelAnimationFrame(animationFrameIdRef.current);

    if (isPluginActive) {
      animationFrameIdRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [animate, animation, isPluginActive]);

  useEffect(() => {
    getAsset("Spritesheets", "Pet")
      .then((asset) => {
        if (petRef.current) petRef.current.src = asset;
      })
      .catch(() =>
        console.error("Virtual Pet: An error ocurred while loading assets"),
      );
  }, [getAsset]);

  useEffect(() => {
    if (!petAccessoryRef.current) return;
    // Add the user actual accessory
    if (userItems.equiped.Accessories) {
      petAccessoryRef.current.removeClass(petAccessoryHiddenClassName);
      getAsset("Spritesheets", userItems.equiped.Accessories)
        .then((asset) => {
          if (petAccessoryRef.current) petAccessoryRef.current.src = asset;
        })
        .catch(() =>
          console.error("Virtual Pet: An error ocurred while loading assets"),
        );
    } else {
      petAccessoryRef.current.addClass(petAccessoryHiddenClassName);
    }
  }, [getAsset, userItems.equiped.Accessories]);

  return (
    <div className="vpet-pet" ref={petContainerRef} style={{ left: "30px" }}>
      <p className="vpet-pet__level">Level: {userLevel}</p>
      <img className="vpet-pet__pet-sprite" ref={petRef} alt="Pet sprite" />
      <img
        className="vpet-pet__accessory"
        ref={petAccessoryRef}
        alt="Pet accessory sprites"
      />
    </div>
  );
});
