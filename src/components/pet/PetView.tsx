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
import { Pet } from "src/components/pet/Pet";
import { AssetsContextI, PetViewRef, UserActions, UserStats } from "src/types";
import { DebugTools } from "src/components/debug-tools/DebugTools";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { AssetsContext } from "src/contexts/AssetsContext";
import { PetTopBar } from "./PetTopBar";

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
  const animationsTextRef = useRef<HTMLHeadingElement>(null);
  const pluginRef: RefObject<HTMLDivElement | null> = useRef(null);
  const { getAsset } = useContext<AssetsContextI>(AssetsContext);

  const animationsHandler = useAnimationsHandler();

  // Checks if the plugin is open, and if is not it stops the animation
  const checkWidth = () => {
    if (!pluginRef.current) {
      setIsPluginActive(false);
      return;
    }

    const actualWidth = pluginRef.current.clientWidth;

    actualWidth > 0
      ? !isPluginActive && setIsPluginActive(true)
      : isPluginActive && setIsPluginActive(false);

  };

  const levelUp = (newUserStats: UserStats) => {
    // Change the pet animation to celebrate
    animationsHandler.levelUpAnimation();

    // Activate the "Level Up" text, waits 3s and desactivate it
    if (animationsTextRef.current)
      animationsTextRef.current.style.display = "block";
    setTimeout(() => {
      if (animationsTextRef.current)
        animationsTextRef.current.style.display = "none";
    }, 3000);

    const newExp = newUserStats.exp - newUserStats.expGoal;
    setUserStats(statsHandler.petLevelUp(newExp));
  };

  /*
   * If changed, stores the user data, stats and items in the useStates
   */
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
      triggerChild(actions: UserActions) {
        actions.forEach((action) => {
          if (action === "check-width") { checkWidth(); return; };
          if (action === "handle-sleep") { animationsHandler.handleSleeping(); return; };
          if (action === "update-info") { updateUserInfo(); return; };
        });
      },
    };
  });

  useEffect(() => {
    animationsHandler.handleDefaults();
    animationsHandler.handleSleeping();
    window.setTimeout(() => updateUserInfo(), 100); // The timeout is for giving time to load the data from de data.json
  }, []);

  useEffect(() => {
    // Add the user actual background or the default one to the pluginRef
    getAsset("Backgrounds", userItems.equiped.Backgrounds || "01").then(
      (asset) => {
        if (pluginRef.current)
          pluginRef.current.style.backgroundImage = `url(${asset})`;
      },
    );
  }, [userItems.equiped.Backgrounds]);

  return (
    <>
      <div className="main" ref={pluginRef}>
        <PetTopBar
          app={app}
          statsHandler={statsHandler}
          setUserItems={setUserItems}
          userStats={userStats}
        />
        <Pet
          isPluginActive={isPluginActive}
          animation={animationsHandler.animation}
          userLevel={userStats.level}
          userItems={userItems}
          handleDefaults={animationsHandler.handleDefaults}
        />
        <h1
          className="animations-text"
          ref={animationsTextRef}
          style={{ display: "none" }}
        >
          Level Up!
        </h1>
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
