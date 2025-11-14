import { App } from "obsidian";
import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { PetAnimation, UserStats, UserItems, AnimationsHandler } from "src/types";

interface Props {
	animation: PetAnimation;
	app: App;
	userStats: UserStats;
	userItems: UserItems;
  animationsHandler: AnimationsHandler;
	onLevelUp: boolean;
}

export default function Pet({ animation, app, userStats, userItems,animationsHandler, onLevelUp }: Props) {
	// Assets
	const petSpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/spritesheet.png"
			),
		[]
	);

	const petAccessorySpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				`./.obsidian/plugins/obsidian-virtual-pet/assets/${userItems.equiped.Accessories}Spritesheet.png`),
		[userItems.equiped.Accessories]
	);

	// Refs
	const petRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petAccessoryRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petAnimationsContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

	const petScale = useRef<number>(1.5);
  const petDirecction = useRef<number>(1); // 1 = right, -1 = left
	//const petVelocity = useRef<number>(animation.speed);
  const petVelocity = animation.speed;

	const previousAnimationIdx = useRef<number>(0);
	const animationFrameId = useRef<number>(0);
	const actualAnimation = useRef<PetAnimation>(null);
  const isOutsideTimeoutRef = useRef<number>(0);

  const isOutside = useRef<boolean>(false);

  const checkIsInside = (windowWidth:number, actualLeft:number, petScale:number) => {
    const petOuterRelWidth = ((petScale - 1) * 64) / 2
    const margin = petScale * 5;

    // Is left 
    if (actualLeft < petOuterRelWidth - margin) isOutside.current = true 
    // Is right
    else if ( windowWidth - actualLeft < 64 + petOuterRelWidth - margin) isOutside.current = true
    // Is inside
    else isOutside.current = false 

    //if (isOutsideTimeoutRef && isOutside.current) window.clearTimeout(isOutsideTimeoutRef.current);

    if (isOutside.current && !isOutsideTimeoutRef.current) {
      isOutsideTimeoutRef.current = window.setTimeout(() => {
        animationsHandler.handleDefaults("walk")
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
        actualLeft = actualLeft + petVelocity * petDirecction.current
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
				<p className="pet-level">Level: {userStats.level}</p>
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
}
