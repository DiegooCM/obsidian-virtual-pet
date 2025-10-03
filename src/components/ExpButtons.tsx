import { useCallback, useEffect, useRef } from "react";
import { UserStats } from "src/types";

interface Props {
	petChangeExp: (newAddExp: number) => UserStats;
	userStats: UserStats;
	levelUp: (newUserStats: UserStats) => void;
	setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}
// Podría pasarle el setUserStats. IMPORTANTE
export default function ExpButtons({
	petChangeExp,
	userStats,
	levelUp,
	setUserStats,
}: Props) {
	const quantity = useRef(0);
	const isButtonDown = useRef(false);
	// Meter una variable o algo para saber si se está sumando o restando
	const changeExp = useCallback(() => {
		const newExp = userStats.exp + quantity.current;
		// Level upgrade
		if (newExp >= userStats.expGoal) {
			levelUp({ ...userStats, exp: newExp });
		}
		// Not level upgrade
		else {
			const newUserStats = petChangeExp(newExp <= 0 ? 0 : newExp);
			setUserStats(newUserStats);
		}
	}, [userStats.exp, levelUp]);

	const onButtonPress = useCallback(() => {
		if (!isButtonDown.current) return;
		changeExp();
	}, [changeExp]);

	useEffect(() => {
		setTimeout(() => onButtonPress(), 100);
	}, [userStats.exp, onButtonPress]);

	return (
		<>
			<h1>Change Exp Buttons</h1>
			<div className="exp-buttons">
				<button
					onClick={() => changeExp()}
					onMouseDown={() => {
						isButtonDown.current = true;
						quantity.current = -5;
						onButtonPress();
					}}
					onMouseUp={() => (isButtonDown.current = false)}
				>
					-
				</button>
				<button
					onClick={() => changeExp()}
					onMouseDown={() => {
						isButtonDown.current = true;
						quantity.current = 5;
						onButtonPress();
					}}
					onMouseUp={() => (isButtonDown.current = false)}
				>
					+
				</button>
			</div>
		</>
	);
}
