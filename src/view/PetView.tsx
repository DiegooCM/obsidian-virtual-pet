import {
	Ref,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { App } from "obsidian";
import UserInfo from "src/components/UserInfo";
import StatsHandler from "src/stats/StatsHandler";
import Expbar from "../components/ExpBar";
import PetButtons from "src/components/PetButtons";
import Pet from "src/components/Pet";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { PetViewRef, UserActions, UserStats } from "src/types";
import ExpButtons from "src/components/ExpButtons";
import { ShopModal } from "src/components/ShopModal";
import items from "src/items.json";

interface PetView {
	statsHandler: StatsHandler;
	app: App;
	ref: Ref<PetViewRef>;
}

export default function PetView({ statsHandler, app, ref }: PetView) {
	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());
	const [userItems, setUserItems] = useState(statsHandler.getUserItems());
	const onLevelUp = useRef<boolean>(false);

	const {
		animation,
		handleSleeping,
		handleDefaults,
		changeAnimation,
		levelUpAnimation,
	} = useAnimationsHandler();

	const getActualBackground = () => {
		let actualBgUrl = items
			.find((i) => i.category === "background")
			?.items.find((i) => i.name === userItems.equiped.background)?.url;
		if (!actualBgUrl) actualBgUrl = "assets/background.png";
		return app.vault.adapter.getResourcePath(
			`./.obsidian/plugins/obsidian-virtual-pet/${actualBgUrl}`
		);
	};

	const levelUp = (newUserStats: UserStats) => {
		levelUpAnimation();
		onLevelUp.current = true;
		setTimeout(() => (onLevelUp.current = false), 3000);
		const newExp = newUserStats.exp - newUserStats.expGoal;
		setUserStats(statsHandler.petLevelUp(newExp));
	};

	const petBackground = useMemo(() => getActualBackground(), [userItems]);

	// Update User info
	const updateUserInfo = () => {
		const newUserData = statsHandler.getUserData();
		const newUserStats = statsHandler.getUserStats();
		const newUserItems = statsHandler.getUserItems();

		if (JSON.stringify(newUserData) !== JSON.stringify(userData)) {
			// Update the data
			setUserData(newUserData);
		}
		if (JSON.stringify(newUserStats) !== JSON.stringify(userStats)) {
			// Level up
			if (newUserStats.exp >= newUserStats.expGoal) {
				levelUp(newUserStats);
			}
			// Not level up
			else {
				setUserStats(newUserStats);
			}
		}
		if (JSON.stringify(newUserItems) !== JSON.stringify(userItems)) {
			setUserItems(newUserItems);
		}
	};

	// To expose the onUserAction function on the ref
	useImperativeHandle<PetViewRef, PetViewRef>(ref, () => {
		return {
			triggerChild(action: UserActions) {
				if (action === "editor-change") handleSleeping();
				updateUserInfo();
			},
		};
	});

	useEffect(() => {
		handleDefaults();
		window.setTimeout(() => updateUserInfo(), 100); // The timeout is for giving time to load the data from de data.json
	}, []);

	return (
		<>
			<div
				className="plugin"
				style={{
					background: `url(${petBackground}) 0% 0% / cover no-repeat`,
				}}
			>
				<button
					className="shop-btn"
					onClick={() =>
						new ShopModal(app, statsHandler, setUserItems).open()
					}
					style={{ position: "absolute", zIndex: 10 }}
				>
					Open shop
				</button>
				<Pet
					animation={animation}
					app={app}
					userStats={userStats}
					onLevelUp={onLevelUp.current}
				/>
				<Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
			</div>
			<div className="debug-tools">
				<UserInfo
					userData={userData}
					userStats={userStats}
					userItems={userItems}
				/>
				<h1>Change Pet Animation</h1>
				<PetButtons
					animation={animation}
					changeAnimation={changeAnimation}
					handleDefaults={handleDefaults}
				/>
				<ExpButtons
					petChangeExp={statsHandler.petChangeExp}
					userStats={userStats}
					levelUp={levelUp}
					setUserStats={setUserStats}
				/>
			</div>
		</>
	);
}
