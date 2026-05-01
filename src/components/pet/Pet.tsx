import { memo, RefObject, useContext, useEffect, useRef } from "react";
import { AssetsContext } from "src/contexts/AssetsContext";
import {
  PetAnimation,
  UserItems,
  AssetsContextI,
  AnimationsHandlerI,
} from "src/types";

interface Props {
  isPluginActive: boolean;
  animation: PetAnimation;
  userLevel: number;
  userItems: UserItems;
  animationsHandler: AnimationsHandlerI;
  mainRef: RefObject<HTMLDivElement | null>;
}

export const Pet = memo(function Pet({
  isPluginActive,
  animation,
  userLevel,
  userItems,
  animationsHandler,
  mainRef
}: Props) {
  // Refs
  const petRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petAccessoryRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const petAccessoryHiddenClassName = "vpet-pet__accessory_hidden";

  const petScale = useRef<number>(1.5);
  const petDirecction = useRef<number>(1); // 1 = right, -1 = left

  const previousAnimationIdx = useRef<number>(0);
  const animationFrameId = useRef<number>(0);
  const actualAnimation = useRef<PetAnimation>(null);
  const isOutsideTimeoutRef = useRef<number>(0);

  const isOutside = useRef<boolean>(false);

  const { getAsset } = useContext<AssetsContextI>(AssetsContext);

  const checkIsInside = (
    windowWidth: number,
    actualLeft: number,
    petOuterRelWidth: number,
  ) => {
    if (petScale.current === 0) return; // Preventing bug on leaf open

    const margin = petScale.current * 5;

    // Is left
    if (actualLeft < petOuterRelWidth - margin) isOutside.current = true;
    // Is right
    else if (windowWidth - actualLeft < 64 + petOuterRelWidth - margin)
      isOutside.current = true;
    // Is inside
    else isOutside.current = false;

    if (isOutside.current && !isOutsideTimeoutRef.current) {
      // Stops sleeping and starts walking
      isOutsideTimeoutRef.current = window.setTimeout(() => {
        animationsHandler.toDefaults("walk");
        animationsHandler.triggerSleeping(() => animationsHandler.toDefaults());
        isOutsideTimeoutRef.current = 0;
      }, 1000);
    }
  };

  // Main Loop
  const animate = (timestamp: number) => {
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

    if (animationIdx !== previousAnimationIdx.current) {
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
      petScale.current = scaleCalc < 1 ? 1 : scaleCalc; // Scale  = 1 (64px) is the minimum
      petContainerRef.current.style.scale = petScale.current.toString();

      const petOuterRelWidth = Math.floor(((petScale.current - 1) * 64) / 2);

      // Movement animation
      if (animation.speed !== 0) {
        const actualSpeed = (windowWidth * animation.speed) / 800; // Relative speed to the window size
        actualLeft = actualLeft + actualSpeed * petDirecction.current;
        petContainerRef.current.style.left = `${actualLeft}px`;

        // Touched left border
        if (actualLeft <= petOuterRelWidth) {
          petDirecction.current = 1;
          petRef.current.setCssProps({ transform: "scaleX(1)" });
          petAccessoryRef.current.setCssProps({ transform: "scaleX(1)" });
        }
        // Touched right border
        if (windowWidth <= actualLeft + petOuterRelWidth + 64) {
          petDirecction.current = -1;
          petRef.current.setCssProps({ transform: "scaleX(-1)" });
          petAccessoryRef.current.setCssProps({ transform: "scaleX(-1)" });
        }
      }

      checkIsInside(windowWidth, actualLeft, petOuterRelWidth);
    }

    previousAnimationIdx.current = animationIdx;

    // Start new loop
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Animation frame loop
  if (actualAnimation.current !== animation) {
    actualAnimation.current = animation;
    // Cancel the current animation
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
    // Start a new animation
    animationFrameId.current = requestAnimationFrame(animate);
  }

  // When the user doesn't have the leaf open it stops the animation
  cancelAnimationFrame(animationFrameId.current);

  if (isPluginActive) {
    animationFrameId.current = requestAnimationFrame(animate);
  }

  useEffect(() => {
    getAsset("Spritesheets", "Pet")
      .then((asset) => {
        if (petRef.current) petRef.current.src = asset;
      }).catch(() => console.error("Virtual Pet: An error ocurred while loading assets"));
  }, []);

  useEffect(() => {
    if (!petAccessoryRef.current) return;
    // Add the user actual accessory
    if (userItems.equiped.Accessories) {
      petAccessoryRef.current.removeClass(petAccessoryHiddenClassName);
      getAsset("Spritesheets", userItems.equiped.Accessories).then(
        (asset) => {
          if (petAccessoryRef.current) petAccessoryRef.current.src = asset;
        }).catch(() => console.error("Virtual Pet: An error ocurred while loading assets"));
    }
    else {
      petAccessoryRef.current.addClass(petAccessoryHiddenClassName);
    }
  }, [userItems.equiped.Accessories]);

  return (
    <div
      className="vpet-pet"
      ref={petContainerRef}
      style={{ left: "30px" }}
    >
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
