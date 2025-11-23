import { App } from "obsidian";
import { memo, RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { PetAnimation, UserStats, UserItems, AnimationsHandler, HandleDefaults } from "src/types";

interface Props {
  isPluginActive: boolean;
	animation: PetAnimation;
  petSpritesheet: string;
  petAccessorySpritesheet: string;
	userLevel: number;
	userItems: UserItems;
  handleDefaults: HandleDefaults;
	onLevelUp: boolean;
}

export const Pet = memo(({ isPluginActive, animation, petSpritesheet, petAccessorySpritesheet, userLevel, userItems, handleDefaults, onLevelUp }: Props) => {
	// Refs
	const petRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petAccessoryRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petAnimationsContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

	const petScale = useRef<number>(1.5);
  const petDirecction = useRef<number>(1); // 1 = right, -1 = left

	const previousAnimationIdx = useRef<number>(0);
	const animationFrameId = useRef<number>(0);
	const actualAnimation = useRef<PetAnimation>(null);
  const isOutsideTimeoutRef = useRef<number>(0);

  const isOutside = useRef<boolean>(false);

  const checkIsInside = (windowWidth:number, actualLeft:number, petScale:number) => {
    if (petScale === 0) return; // Preventing bug on leaf open

    const petOuterRelWidth = ((petScale - 1) * 64) / 2
    const margin = petScale * 5;

    // Is left 
    if (actualLeft < petOuterRelWidth - margin) isOutside.current = true 
    // Is right
    else if ( windowWidth - actualLeft < 64 + petOuterRelWidth - margin) isOutside.current = true
    // Is inside
    else isOutside.current = false 

    if (isOutside.current && !isOutsideTimeoutRef.current) {
      isOutsideTimeoutRef.current = window.setTimeout(() => {
        handleDefaults("walk")
        isOutsideTimeoutRef.current = 0
      }, 1000); 
    }

  }

  // Main Loop
	const animate = (timestamp: number) => {
		// Pet animation
		if (!petRef.current || !petContainerRef.current || !petAccessoryRef.current || !petAnimationsContainerRef.current) return;

		const animationIdx =
			Math.floor(timestamp / (1000 / animation.fps)) %
			animation.animation.length;

    if (animationIdx !== previousAnimationIdx.current) {

      let actualLeft = parseInt(petContainerRef.current.style.left);
      const windowWidth = petAnimationsContainerRef.current.clientWidth;

			// Change sprite
			const newPos = `
			-${animation.animation[animationIdx][0] * 64}px
			-${animation.animation[animationIdx][1] * 64 + 2}px`// The +2 is for preventing that the sprite on top of the actual appears

			petRef.current.style.backgroundPosition = newPos; 
			petAccessoryRef.current.style.backgroundPosition = newPos

			// Change pet scale
			petScale.current = (windowWidth) / 200;
			petRef.current.style.scale = petScale.current.toString();

      const petOuterRelWidth = Math.floor(((petScale.current - 1) * 64) / 2);
      
			// Movement animation
			if (animation.speed !== 0) {
        actualLeft = actualLeft + animation.speed * petDirecction.current
				petContainerRef.current.style.left = `${
					actualLeft
				}px`;

				// Touched left border
				if (actualLeft <= petOuterRelWidth ) {
          petDirecction.current = 1;
					petRef.current.style.transform = "scaleX(1)";
				}
				// Touched right border
				if (windowWidth <= actualLeft + petOuterRelWidth + 64) {
          petDirecction.current = -1;
					petRef.current.style.transform = "scaleX(-1)";
				}
			}

      checkIsInside(windowWidth,actualLeft, petScale.current);
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

  if(isPluginActive) {
    animationFrameId.current = requestAnimationFrame(animate) 
  }; 

	return (
		<div
			className="pet-animations-container"
			ref={petAnimationsContainerRef}
		>
			{onLevelUp && <h1 className="animations-text">Level Up!</h1>}
			<div
				className="pet-container"
				ref={petContainerRef}
				style={{ left: "30px" }}
			>
				<p className="pet-level">Level: {userLevel}</p>
				<div
					className="pet"
					ref={petRef}
					style={{ background: `url(${petSpritesheet})` }}
				>
					<div 
					className="pet-accessory" 
					ref={petAccessoryRef} 
					style={{ background: userItems.equiped.Accessories !== '' ? `url(${petAccessorySpritesheet})`: '' }}
					></div>
				</div>
			</div>
		</div>
	);
});
