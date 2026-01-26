import { memo, RefObject, useContext, useEffect, useRef } from "react";
import { AssetsContext } from "src/contexts/AssetsContext";
import {
  PetAnimation,
  UserItems,
  HandleDefaults,
  AssetsContextI,
} from "src/types";

interface Props {
  isPluginActive: boolean;
  animation: PetAnimation;
  userLevel: number;
  userItems: UserItems;
  handleDefaults: HandleDefaults;
}

export const Pet = memo(function Pet({
  isPluginActive,
  animation,
  userLevel,
  userItems,
  handleDefaults,
}: Props) {
  // Refs
  const petRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petAccessoryRef: RefObject<HTMLImageElement | null> = useRef(null);
  const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const petAnimationsContainerRef: RefObject<HTMLDivElement | null> =
    useRef(null);

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
      isOutsideTimeoutRef.current = window.setTimeout(() => {
        handleDefaults("walk");
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
      !petAnimationsContainerRef.current
    )
      return;

    const animationIdx =
      Math.floor(timestamp / (1000 / animation.fps)) %
      animation.animation.length;

    if (animationIdx !== previousAnimationIdx.current) {
      let actualLeft = parseInt(petContainerRef.current.style.left);
      const windowWidth = petAnimationsContainerRef.current.clientWidth;

      // Change sprite
      const newPos = `
			-${animation.animation[animationIdx][0] * 64}px
			-${animation.animation[animationIdx][1] * 64 + 2}px`; // The +2 is for preventing that the sprite on top of the actual appears

      petRef.current.style.objectPosition = newPos;
      if (userItems.equiped.Accessories)
        petAccessoryRef.current.style.objectPosition = newPos; // Prevent that if there is no accessorie dont change the img pos

      // Change pet scale
      petScale.current = windowWidth / 200;
      petContainerRef.current.style.scale = petScale.current.toString();

      const petOuterRelWidth = Math.floor(((petScale.current - 1) * 64) / 2);

      // Movement animation
      if (animation.speed !== 0) {
        actualLeft = actualLeft + animation.speed * petDirecction.current;
        petContainerRef.current.style.left = `${actualLeft}px`;

        // Touched left border
        if (actualLeft <= petOuterRelWidth) {
          petDirecction.current = 1;
          petRef.current.style.transform = "scaleX(1)";
          if (userItems.equiped.Accessories)
            petAccessoryRef.current.style.transform = "scaleX(1)";
        }
        // Touched right border
        if (windowWidth <= actualLeft + petOuterRelWidth + 64) {
          petDirecction.current = -1;
          petRef.current.style.transform = "scaleX(-1)";
          if (userItems.equiped.Accessories)
            petAccessoryRef.current.style.transform = "scaleX(-1)";
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
    getAsset("Spritesheets", "pet").then((asset) => {
      if (petRef.current) petRef.current.src = asset;
    });
  }, []);

  useEffect(() => {
    if (!petAccessoryRef.current) return;
    // Add the user actual accesory
    userItems.equiped.Accessories
      ? (petAccessoryRef.current.removeClass("pet-accessory-hidden"),
        getAsset("Spritesheets", userItems.equiped.Accessories).then(
          (asset) => {
            if (petAccessoryRef.current) petAccessoryRef.current.src = asset;
          },
        ))
      : petAccessoryRef.current.addClass("pet-accessory-hidden");
  }, [userItems.equiped.Accessories]);

  return (
    <div className="pet-animations-container" ref={petAnimationsContainerRef}>
      <div
        className="pet-container"
        ref={petContainerRef}
        style={{ left: "30px" }}
      >
        <p className="pet-level">Level: {userLevel}</p>
        <img className="pet" ref={petRef} alt="Pet sprites" />
        <img className="pet-accessory" ref={petAccessoryRef} alt="Pet accessory sprites" />
      </div>
    </div>
  );
});
