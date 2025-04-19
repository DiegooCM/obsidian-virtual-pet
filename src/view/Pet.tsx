import { useMemo, useRef } from "react";
import { AnimationsHandler } from "src/hooks/animationsHandler";
import { PetViewT } from "src/types";

interface PetProps {
	view: PetViewT;
	onReady: (animationsHandler: AnimationsHandler) => void;
}

export const Pet: React.FC<PetProps> = (props) => {
	const backgroundPath = useMemo(
		() =>
			props.view.app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/images/background.png"
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

	const petRef = useRef<HTMLImageElement>(null);
	const animationRef = useRef<HTMLImageElement>(null);
	const petContainerRef = useRef<HTMLDivElement>(null);

	const animationsHandler = new AnimationsHandler({
		petRef,
		animationRef,
		petContainerRef,
		view: props.view,
	});

	props.onReady(animationsHandler);

	return (
		<div
			ref={petContainerRef}
			id="pet-container"
			style={{
				backgroundImage: `url(${backgroundPath})`,
				backgroundPosition: "center",
			}}
		>
			<img ref={petRef} id="pet" src={standingPath} />
			<img ref={animationRef} id="animation" />
		</div>
	);
};
