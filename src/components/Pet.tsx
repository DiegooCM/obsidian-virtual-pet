import { App } from "obsidian";
import { LegacyRef, useMemo, useRef } from "react";
import { petAnimation, UserStats } from "src/types";

interface Props {
	animation: petAnimation;
	setAnimation: React.Dispatch<React.SetStateAction<petAnimation>>;
	app: App;
	userStats: UserStats;
}

export default function Pet({
	animation,
	setAnimation,
	app,
	userStats,
}: Props) {
	// Assets
	const petSpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/spritesheet.png"
			),
		[]
	);

	// Refs
	const petRef: LegacyRef<HTMLDivElement> | null = useRef(null);
	const petContainerRef: LegacyRef<HTMLDivElement> | null = useRef(null);
	const petAnimationsContainerRef: LegacyRef<HTMLDivElement> | null =
		useRef(null);

	const previousAnimationIdx = useRef<number>(0);
	const animationFrameId = useRef<number>(0);
	const petVelocity = useRef<number>(animation.speed);
	const actualAnimation = useRef<petAnimation>();

	// Main Loop
	const animate = (timestamp: number) => {
		// Pet animation
		if (!petRef.current || !petContainerRef.current) return;

		const windowWidth =
			petAnimationsContainerRef.current?.clientWidth || 600;

		const animationIdx =
			Math.floor(timestamp / (1000 / animation.fps)) %
			animation.animation.length;

		if (animationIdx !== previousAnimationIdx.current) {
			petRef.current.style.backgroundPosition = `-${
				animation.animation[animationIdx][0] * 64
			}px
        -${animation.animation[animationIdx][1] * 64}px`;

			// Movement animation
			if (animation.speed > 0) {
				const actualLeft = parseInt(petContainerRef.current.style.left);
				petContainerRef.current.style.left = `${
					actualLeft + petVelocity.current
				}px`;

				// Touched left border
				if (actualLeft <= 64) {
					petVelocity.current = animation.speed;
					petRef.current.style.transform = "scaleX(1)";
				}
				// Touched right border
				if (actualLeft >= windowWidth - 128) {
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
			ref={petAnimationsContainerRef}
		>
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
