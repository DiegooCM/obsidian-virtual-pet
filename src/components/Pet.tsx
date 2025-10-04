import { App } from "obsidian";
import { RefObject, useMemo, useRef } from "react";
import { PetAnimation, UserStats } from "src/types";

interface Props {
	animation: PetAnimation;
	app: App;
	userStats: UserStats;
	onLevelUp: boolean;
}

export default function Pet({ animation, app, userStats, onLevelUp }: Props) {
	console.log(onLevelUp);
	// Assets
	const petSpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/spritesheet.png"
			),
		[]
	);

	// Refs
	const petRef: RefObject<HTMLDivElement | null> = useRef(null);
	const petContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
	const PetAnimationsContainerRef: RefObject<HTMLDivElement | null> =
		useRef(null);
	const petScale = useRef<number>(1.5);
	const petVelocity = useRef<number>(animation.speed);

	const previousAnimationIdx = useRef<number>(0);
	const animationFrameId = useRef<number>(0);
	const actualAnimation = useRef<PetAnimation>(null);

	// Main Loop
	const animate = (timestamp: number) => {
		// Pet animation
		if (!petRef.current || !petContainerRef.current) return;

		const windowWidth =
			PetAnimationsContainerRef.current?.clientWidth || 600;

		const animationIdx =
			Math.floor(timestamp / (1000 / animation.fps)) %
			animation.animation.length;

		if (animationIdx !== previousAnimationIdx.current) {
			// Change sprite
			petRef.current.style.backgroundPosition = `-${
				animation.animation[animationIdx][0] * 64
			}px
        -${animation.animation[animationIdx][1] * 64 + 2}px`; // The +2 is for preventing that the sprite on top of the actual appears

			// Change pet styles
			petScale.current = (windowWidth * 2) / 400;
			petRef.current.style.scale = petScale.current.toString();

			// Movement animation
			if (animation.speed > 0) {
				const actualLeft = parseInt(petContainerRef.current.style.left);
				petContainerRef.current.style.left = `${
					actualLeft + petVelocity.current
				}px`;

				// Touched left border
				if (actualLeft <= Math.floor(64 * (petScale.current - 1))) {
					petVelocity.current = animation.speed;
					petRef.current.style.transform = "scaleX(1)";
				}
				// Touched right border
				if (
					actualLeft >=
					Math.floor(windowWidth - 64 * petScale.current)
				) {
					petVelocity.current = animation.speed * -1;
					petRef.current.style.transform = "scaleX(-1)";
				}
			}
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
			ref={PetAnimationsContainerRef}
		>
			{onLevelUp && <h1 className="animations-text">Level Up!</h1>}
			<div
				className="pet-container"
				ref={petContainerRef}
				style={{ left: "0px" }}
			>
				<p className="pet-level">Level: {userStats.level}</p>
				<div
					className="pet"
					ref={petRef}
					style={{ background: `url(${petSpritesheet})` }}
				></div>
			</div>
		</div>
	);
}
