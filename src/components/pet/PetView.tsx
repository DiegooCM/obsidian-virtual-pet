import {
	Ref,
	RefObject,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import { App } from "obsidian";
import StatsHandler from "src/utils/statsHandler";
import Expbar from "src/components/pet/ExpBar";
import { Pet } from "src/components/pet/Pet";
import { PetViewRef, UserActions, UserStats } from "src/types";
import { ShopModal } from "src/components/shop/ShopModal";
import items from "src/items.json";
import { DebugTools } from "src/components/debug-tools/DebugTools";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";

interface PetView {
	statsHandler: StatsHandler;
	app: App;
	ref: Ref<PetViewRef>;
}

export default function PetView({ statsHandler, app, ref }: PetView) {
  const [isPluginActive, setIsPluginActive] = useState<boolean>(false);
	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());
	const [userItems, setUserItems] = useState(statsHandler.getUserItems());
	const onLevelUp = useRef<boolean>(false);
  const pluginRef: RefObject<HTMLDivElement | null> = useRef(null);

  // Assets
  const coinUrl = useMemo(() => 
    app.vault.adapter.getResourcePath(
      "./.obsidian/plugins/obsidian-virtual-pet/assets/coin.png"
    )
    ,[])
  

  const petSpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				"./.obsidian/plugins/obsidian-virtual-pet/assets/spritesheet.png"
			),
		[]
	);

	const petAccessorySpritesheet = useMemo(
		() =>
			app.vault.adapter.getResourcePath(
				`./.obsidian/plugins/obsidian-virtual-pet/assets/${userItems.equiped.Accessories}Spritesheet.png`),
		[userItems.equiped.Accessories]
	);

  const animationsHandler = useAnimationsHandler()

	const getActualBackground = () => {
		let actualBgUrl = items
			.find((i) => i.category === "Backgrounds")
			?.items.find((i) => i.name === userItems.equiped.Backgrounds)?.url;
		if (!actualBgUrl) actualBgUrl = "assets/background.png";
		return app.vault.adapter.getResourcePath(
			`./.obsidian/plugins/obsidian-virtual-pet/${actualBgUrl}`
		);
	};

  const checkWidth = () => {
    if (!pluginRef.current) {
      setIsPluginActive(false)
      return;
    }
    
    const actualWidth = pluginRef.current.clientWidth 

    actualWidth > 0 ? 
      !isPluginActive && setIsPluginActive(true) :
      isPluginActive && setIsPluginActive(false);
  }

	const levelUp = (newUserStats: UserStats) => {
		animationsHandler.levelUpAnimation();
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
				if (action === "editor-change") animationsHandler.handleSleeping();
        if (action === "active-leaf-change") checkWidth();
				updateUserInfo();
			},
		};
	});

	useEffect(() => {
		animationsHandler.handleDefaults();
    animationsHandler.handleSleeping();
		window.setTimeout(() => updateUserInfo(), 100); // The timeout is for giving time to load the data from de data.json
	}, []);

  return (
    <>
      <div
        className="plugin"
        ref={pluginRef}
        style={{
          background: `url(${petBackground}) 0% 0% / cover no-repeat`,
        }}
      >
        <div
          className="top-bar"
        >
          <div 
            onClick={() =>
              new ShopModal(app, statsHandler, setUserItems).open()
            }
            style={{display: "flex", cursor: "pointer"}}
          >
            <img className="top-bar-coin"src={coinUrl}/>
            <p
              className="coins-count"
            >
              {userStats.coins}
            </p>
          </div>
        </div>
        
        <Pet
          isPluginActive={isPluginActive}
          animation={animationsHandler.animation}
          petSpritesheet={petSpritesheet}
          petAccessorySpritesheet={petAccessorySpritesheet}
          userLevel={userStats.level}
          userItems={userItems}
          handleDefaults={animationsHandler.handleDefaults}
          onLevelUp={onLevelUp.current}
        />
        <Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
      </div>
      <DebugTools 
        userData={userData}
        userStats={userStats}
        userItems={userItems}
        animationsHandler={animationsHandler} 
        statsHandler={statsHandler}
        levelUp={levelUp}
        setUserStats={setUserStats}
      />

    </>
  );
}
