import { useEffect, useMemo, useRef } from "react";
import useAnimationsHandler from "src/hooks/useAnimationsHandler";
import { AnimationsHandlerT, PetViewT, UserStats } from "src/types";

interface PetProps {
	view: PetViewT;
	userStats: UserStats;
	onReady: (animationsHandler: AnimationsHandlerT) => void;
}

export const Pet: React.FC<PetProps> = ({ view, userStats, onReady }) => {
	const backgroundPath = useMemo(
		() =>
			view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/background2.png"
			),
		[]
	);
	const standingPath = useMemo(
		() =>
			view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/standing.gif"
			),
		[]
	);

	const petRef = useRef<HTMLDivElement | null>(null);
	const petImgRef = useRef<HTMLImageElement | null>(null);
	const animationRef = useRef<HTMLImageElement | null>(null);
	const petContainerRef = useRef<HTMLDivElement | null>(null);
	const animationsHandler = useAnimationsHandler({
		petContainerRef,
		petRef,
		petImgRef,
		animationRef,
		view,
	});
	useEffect(() => {
		onReady(animationsHandler);
	}, [onReady]);

	return (
		<div
			ref={petContainerRef}
			id="pet-container"
			style={{
				backgroundImage: `url(${backgroundPath})`,
			}}
		>
			<div id="pet" ref={petRef}>
				<p id="pet-level-info">Level: {userStats.level}</p>
				<img id="pet-img" ref={petImgRef} src={standingPath} />
				<img ref={animationRef} id="animation" />
			</div>
		</div>
	);
};
