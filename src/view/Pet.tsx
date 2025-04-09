import { useEffect, useMemo, useRef } from "react";
import { PetViewT } from "src/types";

interface PetProps {
	view: PetViewT;
}

export const Pet: React.FC<PetProps> = (props) => {
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

	const heartsPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/hearts.gif"
			),
		[]
	);
	const backgroundPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/background.png"
			),
		[]
	);

	let isStand = false;

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
			if (isStand && petRef.current && animationRef.current) {
				petRef.current.src = standingPath;
				animationRef.current.src = heartsPath;
				animationRef.current.style.left = position - 64 + "px";

				await wait(3000);
				petRef.current.src = walkingPath;
				animationRef.current.removeAttribute("src");
				isStand = false;
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
		<div
			ref={petContainerRef}
			id="pet-container"
			style={{
				backgroundImage: `url(${backgroundPath})`,
				backgroundPosition: "center",
			}}
		>
			<img
				ref={petRef}
				id="pet"
				src={walkingPath}
				onClick={() => (isStand = true)}
			/>
			<img ref={animationRef} id="animation" />
		</div>
	);
};
