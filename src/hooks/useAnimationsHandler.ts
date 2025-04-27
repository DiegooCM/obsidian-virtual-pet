import { MutableRefObject, RefObject, useMemo, useRef } from "react";
import { Animations, AnimationsHandlerT, PetViewT } from "src/types";

interface Props {
	petContainerRef: RefObject<HTMLDivElement | null>;
	petRef: RefObject<HTMLDivElement | null>;
	petImgRef: RefObject<HTMLImageElement | null>;
	animationRef: RefObject<HTMLImageElement | null>;
	view: PetViewT;
}

const useAnimationsHandler = (props: Props): AnimationsHandlerT => {
	// Refs
	const petContainerRef: RefObject<HTMLDivElement | null> =
		props.petContainerRef;
	const petImgRef: RefObject<HTMLImageElement | null> = props.petImgRef;
	const petRef: RefObject<HTMLDivElement | null> = props.petRef;
	// const animationRef: RefObject<HTMLImageElement | null>= props.animationRef;
	// Animations states
	const isInProcess = useRef(false); // If is giving problems change this two to a refObj
	const isFinished = useRef(false);
	const defaultAnimationNumber = useRef(0);
	// Timeouts Ids
	const sleepTimeoutRef: MutableRefObject<number | null> = useRef(null);
	const mainTimeoutId: MutableRefObject<number> = useRef(0); //Change to ref
	// Assets
	const walkingPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/walking.gif"
			),
		[]
	);
	const standingPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/standing.gif"
			),
		[]
	);

	const codingPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/coding.gif"
			),
		[]
	);
	const celebratingPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/celebrating.gif"
			),
		[]
	);
	const sleepingPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/sleeping.gif"
			),
		[]
	);

	// Rotates default animations
	const handleDefaultAnimations = (): void => {
		if (defaultAnimationNumber.current < 2) {
			defaultAnimationNumber.current++;
			if (petImgRef.current) petImgRef.current.src = standingPath;
		} else {
			defaultAnimationNumber.current = 0;
			handleAnimation("walk", 10000); // 10 secs
		}
	};

	// Checks if the user hasn't written for a while, and if so it sets the pet to the sleeps animation
	const handleSleeping = (): void => {
		if (petImgRef.current?.src === sleepingPath)
			handleAnimation("code", 7000); // 7 secs
		if (sleepTimeoutRef.current !== null) {
			clearTimeout(sleepTimeoutRef.current);
		}
		sleepTimeoutRef.current = window.setTimeout(() => {
			if (petImgRef.current) petImgRef.current.src = sleepingPath;
		}, 30000);
	};

	const handleAnimation = async (animation: Animations, time: number) => {
		// console.log(
		// 	"Animation: ",
		// 	animation,
		// 	"\nIs in process: ",
		// 	isInProcess.current
		// );
		if (isInProcess.current) {
			handleFinishAnimation();
			clearTimeout(mainTimeoutId.current);
		}

		isInProcess.current = true;
		if (animation === "walk") {
			sideWalks(time);
		} else if (animation === "code") {
			codes(time);
		} else if (animation === "celebrate") {
			celebrates(time);
		}
	};

	const handleFinishAnimation = (): void => {
		isFinished.current = true;
		isInProcess.current = false;

		handleDefaultAnimations();
	};

	const sideWalks = (time: number): void => {
		isFinished.current = false;
		let position = 0;
		if (petRef.current) {
			const leftValueString = window.getComputedStyle(petRef.current)[
				"left"
			];
			position = parseFloat(leftValueString);
		}

		let reqId = 0; // Useref?
		const speed = 4;

		if (petImgRef.current) petImgRef.current.src = walkingPath;

		// Moves the pet to the left, cheking if he reaches the limit (petContainer width)
		const moveRight = (): void => {
			const pageWidth = petContainerRef?.current?.offsetWidth;
			const elWidth = petImgRef?.current?.offsetWidth;
			if (
				position <
				(pageWidth && elWidth !== undefined ? pageWidth - elWidth : 180)
			) {
				position += speed;
				if (petRef?.current)
					petRef.current.style.left = position + "px";

				handleState("right");
			} else {
				if (petImgRef?.current)
					petImgRef.current.style.transform = "scaleX(1)";

				handleState("left");
			}
		};

		// Moves the pet to the left, cheking if he reaches the limit (0)
		const moveLeft = (): void => {
			if (position >= 0) {
				position -= speed;
				if (petRef?.current)
					petRef.current.style.left = position + "px";
				handleState("left");
			} else {
				if (petImgRef?.current)
					petImgRef.current.style.transform = "scaleX(-1)";

				handleState("right");
			}
		};

		const handleState = (side: string): void => {
			cancelAnimationFrame(reqId);
			setTimeout(() => {
				if (!isFinished.current)
					reqId = requestAnimationFrame(
						side === "right" ? moveRight : moveLeft
					);
			}, 220);
		};

		if (petImgRef.current?.style.transform === "scaleX(1)") moveLeft();
		else moveRight();

		mainTimeoutId.current = window.setTimeout(() => {
			isFinished.current = true;
			handleFinishAnimation();
		}, time);
	};

	const codes = (time: number): void => {
		isInProcess.current = true;
		if (petImgRef.current) petImgRef.current.src = codingPath;

		mainTimeoutId.current = window.setTimeout(() => {
			handleFinishAnimation();
		}, time);
	};

	const celebrates = (time: number): void => {
		isInProcess.current = true;
		if (petImgRef.current) petImgRef.current.src = celebratingPath;

		mainTimeoutId.current = window.setTimeout(
			() => handleFinishAnimation(),
			time
		);
	};

	return {
		handleAnimation,
		handleSleeping,
	};
};

export default useAnimationsHandler;
