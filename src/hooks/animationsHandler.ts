import { MutableRefObject, RefObject, useMemo, useRef } from "react";
import { PetViewT } from "src/types";

type Animations = "default" | "walk" | "sit" | "code" | "celebrate";

interface Props {
	petContainerRef: RefObject<HTMLDivElement | null>;
	petRef: RefObject<HTMLDivElement | null>;
	petImgRef: RefObject<HTMLImageElement | null>;
	animationRef: RefObject<HTMLImageElement | null>;
	view: PetViewT;
}

export class AnimationsHandler {
	// Refs
	private petContainerRef;
	private petImgRef;
	private petRef;
	private animationRef;
	// Animations states
	private defaultAnimationNumber: number;
	private isInProcess: boolean;
	private isFinished: boolean;
	// Timeouts Ids
	private mainTimeoutId: number;
	private sleepTimeoutRef: MutableRefObject<number | null>;
	// Assets
	private walkingPath: string;
	private standingPath: string;
	private codingPath: string;
	private celebratingPath: string;
	private sleepingPath: string;

	constructor(props: Props) {
		this.walkingPath = useMemo(
			() =>
				props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/walking.gif"
				),
			[]
		);
		this.standingPath = useMemo(
			() =>
				props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/standing.gif"
				),
			[]
		);

		this.codingPath = useMemo(
			() =>
				props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/coding.gif"
				),
			[]
		);
		this.celebratingPath = useMemo(
			() =>
				props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/celebrating.gif"
				),
			[]
		);
		this.sleepingPath = useMemo(
			() =>
				props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/sleeping.gif"
				),
			[]
		);

		this.petContainerRef = props.petContainerRef;
		this.petRef = props.petRef;
		this.petImgRef = props.petImgRef;
		this.animationRef = props.animationRef;
		this.isInProcess = false;
		this.isFinished = false;
		this.mainTimeoutId = 0;
		this.sleepTimeoutRef = useRef(null);
	}

	// Rotates default animations
	handleDefaultAnimations = (): void => {
		if (this.defaultAnimationNumber === 0) {
			this.defaultAnimationNumber = 1;
			if (this.petImgRef.current)
				this.petImgRef.current.src = this.standingPath;
		} else {
			this.defaultAnimationNumber = 0;
			this.handleAnimation("walk", 10000); // 10 secs
		}
	};

	// Checks if the user hasn't written for a while, and if so it sets the pet to the sleeps animation
	handleSleeping = () => {
		if (this.petImgRef.current?.src === this.sleepingPath)
			this.handleAnimation("code", 7000); // 7 secs
		if (this.sleepTimeoutRef.current !== null) {
			clearTimeout(this.sleepTimeoutRef.current);
		}
		this.sleepTimeoutRef.current = window.setTimeout(() => {
			if (this.petImgRef.current)
				this.petImgRef.current.src = this.sleepingPath;
		}, 30000);
	};

	handleAnimation = async (animation: Animations, time: number) => {
		if (this.isInProcess) {
			this.handleFinishAnimation();
			clearTimeout(this.mainTimeoutId);
		}

		this.isInProcess = true;
		if (animation === "walk") {
			this.sideWalks(time);
		} else if (animation === "code") {
			this.codes(time);
		} else if (animation === "celebrate") {
			this.celebrates(time);
		}
	};

	private handleFinishAnimation = () => {
		this.isFinished = true;
		this.isInProcess = false;

		this.handleDefaultAnimations();
	};

	private sideWalks(time: number) {
		this.isFinished = false;
		let position = 0;
		if (this.petRef.current) {
			const leftValueString = window.getComputedStyle(
				this.petRef.current
			)["left"];
			position = parseFloat(leftValueString);
		}

		let reqId = 0; // Useref?
		const speed = 6; //3

		if (this.petImgRef.current)
			this.petImgRef.current.src = this.walkingPath;

		// Moves the pet to the left, cheking if he reaches the limit (petContainer width)
		const moveRight = () => {
			const pageWidth = this.petContainerRef?.current?.offsetWidth;
			const elWidth = this.petImgRef?.current?.offsetWidth;
			if (
				position <
				(pageWidth && elWidth !== undefined ? pageWidth - elWidth : 180)
			) {
				position += speed;
				if (this.petRef?.current)
					this.petRef.current.style.left = position + "px";

				handleState("right");
			} else {
				if (this.petImgRef?.current)
					this.petImgRef.current.style.transform = "scaleX(1)";

				handleState("left");
			}
		};

		// Moves the pet to the left, cheking if he reaches the limit (0)
		const moveLeft = () => {
			if (position >= 0) {
				position -= speed;
				if (this.petRef?.current)
					this.petRef.current.style.left = position + "px";
				handleState("left");
			} else {
				if (this.petImgRef?.current)
					this.petImgRef.current.style.transform = "scaleX(-1)";

				handleState("right");
			}
		};

		const handleState = (side: string) => {
			cancelAnimationFrame(reqId);
			setTimeout(() => {
				if (!this.isFinished)
					reqId = requestAnimationFrame(
						side === "right" ? moveRight : moveLeft
					);
			}, 220);
		};

		if (this.petImgRef.current?.style.transform === "scaleX(1)") moveLeft();
		else moveRight();

		this.mainTimeoutId = window.setTimeout(() => {
			this.isFinished = true;
			this.handleFinishAnimation();
		}, time);
	}

	private codes(time: number) {
		this.isInProcess = true;
		if (this.petImgRef.current)
			this.petImgRef.current.src = this.codingPath;

		this.mainTimeoutId = window.setTimeout(
			() => this.handleFinishAnimation(),
			time
		);
	}

	private celebrates(time: number) {
		this.isInProcess = true;
		if (this.petImgRef.current)
			this.petImgRef.current.src = this.celebratingPath;

		this.mainTimeoutId = window.setTimeout(
			() => this.handleFinishAnimation(),
			time
		);
	}
}
