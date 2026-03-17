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
import animations from "src/jsons/animations.json";
import animationsTimes from "src/jsons/animationsTimes.json";

interface PetViewI {
  statsHandler: StatsHandler;
  app: App;
  ref: Ref<PetViewRef>;
}

export default function PetView({ statsHandler, app, ref }: PetViewI) {
  const [isPluginActive, setIsPluginActive] = useState<boolean>(false);
  const [userStats, setUserStats] = useState(statsHandler.getUserStats());
  const [userItems, setUserItems] = useState(statsHandler.getUserItems());
  const animationsTextRef = useRef<HTMLHeadingElement>(null);
  const mainRef: RefObject<HTMLDivElement | null> = useRef(null);
  const { getAsset } = useContext<AssetsContextI>(AssetsContext);

  const animationsHandler = useAnimationsHandler();

  // Checks if the plugin is open, and if is not it stops the animation
  const checkWidth = () => {
    if (!mainRef.current) {
      setIsPluginActive(false);
      return;
    }

    const actualWidth = mainRef.current.clientWidth;

    actualWidth > 0
      ? !isPluginActive && setIsPluginActive(true)
      : isPluginActive && setIsPluginActive(false);
  };

  const levelUp = (newUserStats: UserStats) => {
    // Change the pet animation to celebrate
    animationsHandler.changeAnimation(animations.celebrate, animationsTimes.levelUp);

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
    const newUserStats = statsHandler.getUserStats();
    const newUserItems = statsHandler.getUserItems();

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
          if (action === "check-width") {
            checkWidth();
            return;
          }
          if (action === "handle-sleep") {
            animationsHandler.triggerSleeping(() => {
              animationsHandler.changeAnimation(animations.code, animationsTimes.coding);
            });
            return;
          }
          if (action === "update-info") {
            updateUserInfo();
            return;
          }
        });
      },
    };
  });

  useEffect(() => {
    statsHandler.getUserDataFromJson().then(() => {
      updateUserInfo();
    });
    animationsHandler.toDefaults();
    animationsHandler.triggerSleeping(() => animationsHandler.toDefaults());
  }, []);

  useEffect(() => {
    // Add the user actual background or the default one to the mainRef
    getAsset("Backgrounds", userItems.equiped.Backgrounds || "Light Default").then(
      (asset) => {
        if (mainRef.current)
          mainRef.current.style.backgroundImage = `url(${asset})`;
      },
    );
  }, [userItems.equiped.Backgrounds]);

  return (
    <>
      <div className="vpet-main" ref={mainRef}>
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
          animationsHandler={animationsHandler}
          mainRef={mainRef}
        />
        <span
          className="vpet-main__level-up-text"
          ref={animationsTextRef}
          style={{ display: "none" }}
        >
          LEVEL UP!
        </span>
      </div>

      {/*
      <DebugTools
        userStats={userStats}
        userItems={userItems}
        animationsHandler={animationsHandler}
        statsHandler={statsHandler}
        levelUp={levelUp}
        setUserStats={setUserStats}
      />
      */}
    </>
  );
}
