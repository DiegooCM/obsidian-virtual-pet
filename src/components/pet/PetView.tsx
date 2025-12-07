import {
	Ref,
	RefObject,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { App } from "obsidian";
import StatsHandler from "src/utils/statsHandler";
import Expbar from "src/components/pet/ExpBar";
import { Pet } from "src/components/pet/Pet";
import { AssetsContextI, PetViewRef, UserActions, UserStats } from "src/types";
import { DebugTools } from "src/components/debug-tools/DebugTools";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { AssetsContext } from "../contexts/AssetsContext";
import { ShopModal } from "../shop/ShopModal";

interface PetViewI {
	statsHandler: StatsHandler;
	app: App;
	ref: Ref<PetViewRef>;
}

export default function PetView({ statsHandler, app, ref }: PetViewI) {
  const [isPluginActive, setIsPluginActive] = useState<boolean>(false);
	const [userData, setUserData] = useState(statsHandler.getUserData());
	const [userStats, setUserStats] = useState(statsHandler.getUserStats());
	const [userItems, setUserItems] = useState(statsHandler.getUserItems());
	const onLevelUp = useRef<boolean>(false);
  const pluginRef: RefObject<HTMLDivElement | null> = useRef(null);
  const coinRef: RefObject<HTMLImageElement | null> = useRef(null)
  const { getAsset } = useContext<AssetsContextI>(AssetsContext)

  const animationsHandler = useAnimationsHandler()

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

    const getItem = async () => {
      if (coinRef.current) {
        coinRef.current.src = await getAsset("Others", "coin")
      }
    }
    getItem()

	}, []);

  useEffect(() => {
    const getBg = async() => {
      if(pluginRef.current) {
        userItems.equiped.Backgrounds ? 
          pluginRef.current.style.background = `url(${await getAsset("Backgrounds", userItems.equiped.Backgrounds)}) 0% 0% / cover no-repeat` :
          pluginRef.current.style.background = `url(${await getAsset("Backgrounds", "01")}) 0% 0% / cover no-repeat`
      }
    }
    getBg();
  }, [userItems.equiped.Backgrounds])

  return (
    <>
      <div
        className="plugin"
        ref={pluginRef}
      >
        <div
          className="top-bar"
        >
          <div 
            onClick={() =>
              new ShopModal(app, getAsset, statsHandler, setUserItems).open()
            }
            style={{display: "flex", cursor: "pointer"}}
          >
            <img className="top-bar-coin" ref={coinRef}/>
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
