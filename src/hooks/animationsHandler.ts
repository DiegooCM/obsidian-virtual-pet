import { RefObject, useMemo } from "react";
import { PetViewT } from "src/types";

type Animations = "default" | "walk" | "sit" | "code" | "celebrate";

interface Props {
	petContainerRef: RefObject<HTMLDivElement | null>;
	petRef: RefObject<HTMLImageElement | null>;
	animationRef: RefObject<HTMLImageElement | null>;
	view: PetViewT;
}

export class AnimationsHandler {
	// Refs
	private petContainerRef;
	private petRef;
	private animationRef;
	// Animations states
	private isInProcess: boolean;
	private isFinished: boolean;
	// Timeouts Ids
	private mainTimeoutId: number;
	private sleepTimeoutId: number;
	// Assets
	private walkingPath: string;
	private standingPath: string;
	private codingPath: string;
	private celebratingPath: string;
	private sleepingPath: string;
	private backgroundPath: string;

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
		this.animationRef = props.animationRef;
		this.isInProcess = false;
		this.isFinished = false;
		this.mainTimeoutId = 0;
		this.sleepTimeoutId = 0;
	}

	// Checks if the user hasn't written for a while, and if so it sets the pet to the sleeps animation
	handleSleeping = () => {
		if (this.sleepTimeoutId !== 0) clearTimeout(this.sleepTimeoutId);
		if (this.petRef.current?.src === this.sleepingPath)
			this.petRef.current.src = this.standingPath;

		this.sleepTimeoutId = window.setTimeout(() => {
			if (this.petRef.current)
				this.petRef.current.src = this.sleepingPath;
			this.sleepTimeoutId = 0;
		}, 30000); // 30secs
	};

	// I could make a function of the check is in process and ommit this function
	handleAnimation = (animation: Animations, time: number) => {
		if (this.isInProcess) {
			clearTimeout(this.mainTimeoutId);
			this.isFinished = true;
		}

		const setAnimation = () => {
			if (animation === "walk") {
				this.sideWalks(time);
			} else if (animation === "code") {
				this.codes(time);
			} else if (animation === "celebrate") {
				this.celebrates(time);
			}
		};
		setAnimation();
	};

	private handleFinishAnimation = () => {
		this.isFinished = false;
		this.isInProcess = false;

		if (this.petRef.current) this.petRef.current.src = this.standingPath;
	};

	private sideWalks(time: number) {
		this.isInProcess = true;
		let position = 0;
		if (this.petRef.current) {
			const leftValueString = window.getComputedStyle(
				this.petRef.current
			)["left"];
			position = parseFloat(leftValueString);
		}

		let reqId = 0;
		const speed = 6; //3

		if (this.petRef.current) this.petRef.current.src = this.walkingPath;

		// Moves the pet to the left, cheking if he reaches the limit (petContainer width)
		const moveRight = () => {
			const pageWidth = this.petContainerRef?.current?.offsetWidth;
			const elWidth = this.petRef?.current?.offsetWidth; // 64?
			if (
				position <
				(pageWidth && elWidth !== undefined ? pageWidth - elWidth : 180)
			) {
				position += speed;
				if (this.petRef?.current)
					this.petRef.current.style.left = position + "px";

				handleState("right");
			} else {
				if (this.petRef?.current)
					this.petRef.current.style.transform = "scaleX(1)";

				moveLeft();
			}
		};

		// Moves the pet to the left, cheking if he reaches the limit (0)
		const moveLeft = () => {
			if (position !== 0) {
				position -= speed;
				if (this.petRef?.current)
					this.petRef.current.style.left = position + "px";
				handleState("left");
			} else {
				if (this.petRef?.current)
					this.petRef.current.style.transform = "scaleX(-1)";

				moveRight();
			}
		};

		const handleState = (side: string) => {
			setTimeout(() => {
				cancelAnimationFrame(reqId);

				if (!this.isFinished)
					reqId = requestAnimationFrame(
						side === "right" ? moveRight : moveLeft
					);
				else this.handleFinishAnimation();
			}, 220);
		};

		moveRight(); // TODO: Make something to see if the pet has to go to de right or to the left
		this.mainTimeoutId = window.setTimeout(
			() => (this.isFinished = true),
			time
		); // Make a function?
	}

	private codes(time: number) {
		this.isInProcess = true;
		if (this.petRef.current) this.petRef.current.src = this.codingPath;

		this.mainTimeoutId = window.setTimeout(
			() => this.handleFinishAnimation(),
			time
		);
	}

	private celebrates(time: number) {
		this.isInProcess = true;
		if (this.petRef.current) this.petRef.current.src = this.celebratingPath;

		this.mainTimeoutId = window.setTimeout(
			() => this.handleFinishAnimation(),
			time
		);
	}
}
