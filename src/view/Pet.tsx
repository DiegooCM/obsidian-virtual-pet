import { useEffect, useRef, useState } from "react";
import { PetViewT } from "src/types";

interface PetProps {
	view: PetViewT;
}

export const Pet: React.FC<PetProps> = (props) => {
	const walkingPath = props.view.app.vault.adapter.getResourcePath(
		"./.obsidian/plugins/obsidian-virtual-pet/images/walking.gif"
	);
	const standingPath = props.view.app.vault.adapter.getResourcePath(
		"./.obsidian/plugins/obsidian-virtual-pet/images/standing.gif"
	);
	const heartsPath = props.view.app.vault.adapter.getResourcePath(
		"./.obsidian/plugins/obsidian-virtual-pet/images/hearts.gif"
	);

	const [isStand, setIsStand] = useState(false);

	const petRef = useRef<HTMLImageElement>(null);
	const animationRef = useRef<HTMLImageElement>(null);
	const petContainerRef = useRef<HTMLDivElement>(null);

	async function sideWalks() {
		let position = 0;
		const speed = 6; //3

		function moveRight() {
			const pageWidth = petContainerRef.current?.offsetWidth;
			const elWidth = petRef.current?.offsetWidth; // 64?
			if (
				position <
				(pageWidth && elWidth !== undefined ? pageWidth - elWidth : 180)
			) {
				position += speed;

				if (petRef.current) petRef.current.style.left = position + "px";

				handleState("right");
			} else {
				if (petRef.current)
					petRef.current.style.transform = "scaleX(1)";

				moveLeft();
			}
		}

		function moveLeft() {
			if (position !== 0) {
				position -= speed;
				if (petRef.current) petRef.current.style.left = position + "px";

				handleState("left");
			} else {
				if (petRef.current)
					petRef.current.style.transform = "scaleX(-1)";

				moveRight();
			}
		}

		async function handleState(side: string) {
			// console.log(isStand);
			// console.log(petRef.current);
			// console.log(animationRef.current);
			if (isStand && petRef.current && animationRef.current) {
				console.log("standing");
				petRef.current.src = standingPath;
				animationRef.current.src = heartsPath;
				animationRef.current.style.left = position + "px";

				await wait(3000);
				petRef.current.src = walkingPath;
				animationRef.current.removeAttribute("src");
				setIsStand(false);
			}

			setTimeout(
				() =>
					requestAnimationFrame(
						side === "right" ? moveRight : moveLeft
					),
				220
			);
		}

		moveRight();
	}

	function wait(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	useEffect(() => {
		if (petRef.current) {
			sideWalks();
		} else {
			console.error("No pet finded");
		}
	}, []);

	return (
		<div ref={petContainerRef} id="pet-container">
			<img
				ref={petRef}
				id="pet"
				src={walkingPath}
				onClick={() => setIsStand(true)}
			/>
			<img ref={animationRef} id="animation" />
		</div>
	);
};
