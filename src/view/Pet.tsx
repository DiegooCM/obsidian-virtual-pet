import { useMemo, useRef } from "react";
import { AnimationsHandler } from "src/hooks/animationsHandler";
import { PetViewT, UserStats } from "src/types";

interface PetProps {
	view: PetViewT;
	userStats: UserStats;
	onReady: (animationsHandler: AnimationsHandler) => void;
}

export const Pet: React.FC<PetProps> = (props) => {
	const backgroundPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/background2.png"
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

	const petRef = useRef<HTMLDivElement>(null);
	const petImgRef = useRef<HTMLImageElement>(null);
	const animationRef = useRef<HTMLImageElement>(null);
	const petContainerRef = useRef<HTMLDivElement>(null);

	const animationsHandler = new AnimationsHandler({
		petContainerRef,
		petRef,
		petImgRef,
		animationRef,
		view: props.view,
	});

	props.onReady(animationsHandler);

	return (
		<div
			ref={petContainerRef}
			id="pet-container"
			style={{
				backgroundImage: `url(${backgroundPath})`,
			}}
		>
			<div id="pet" ref={petRef}>
				<p id="pet-level-info">Level: {props.userStats.level}</p>
				<img id="pet-img" ref={petImgRef} src={standingPath} />
				<img ref={animationRef} id="animation" />
			</div>
		</div>
	);
};
