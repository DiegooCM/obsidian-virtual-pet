import {
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { App } from "obsidian";
import StatsHandler from "src/utils/statsHandler";
import { Pet } from "src/components/pet/Pet";
import { PetViewRef, UserActions, UserStats } from "src/types";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { useAssets } from "src/contexts/AssetsContext";
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
  const { getAsset } = useAssets();

  const { animation, triggerSleeping, toDefaults, changeAnimation } =
    useAnimationsHandler();

  // Checks if the plugin is open, and if is not it stops the animation
  const checkWidth = () => {
    if (!mainRef.current) {
      setIsPluginActive(false);
      return;
    }

    const actualWidth = mainRef.current.clientWidth;

    if (actualWidth > 0 && !isPluginActive) setIsPluginActive(true);
    if (actualWidth < 0 && isPluginActive) setIsPluginActive(false);
  };

  const levelUp = useCallback(
    (newUserStats: UserStats) => {
      // Change the pet animation to celebrate
      changeAnimation(animations.celebrate, animationsTimes.levelUp);

      // Activate the "Level Up" text, waits 3s and desactivate it
      if (animationsTextRef.current)
        //animationsTextRef.current.style.display = "block";
        animationsTextRef.current.setCssProps({ display: "block" });

      window.setTimeout(() => {
        if (animationsTextRef.current)
          animationsTextRef.current.setCssProps({ display: "none" });
      }, 3000);

      const newExp = newUserStats.exp - newUserStats.expGoal;
      setUserStats(statsHandler.petLevelUp(newExp));
    },
    [changeAnimation, statsHandler],
  );

  const updateUserStats = useCallback(() => {
    const newUserStats = statsHandler.getUserStats();

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
  }, [levelUp, statsHandler, userStats]);

  const updateUserItems = useCallback(() => {
    const newUserItems = statsHandler.getUserItems();

    if (JSON.stringify(newUserItems) !== JSON.stringify(userItems)) {
      setUserItems(newUserItems);
    }
  }, [statsHandler, userItems]);

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
            triggerSleeping(() => {
              changeAnimation(animations.code, animationsTimes.coding);
            });
            return;
          }
          if (action === "update-stats") {
            updateUserStats();
            return;
          }
        });
      },
    };
  });

  // Obtains the data from data.json and set to default the animations
  useEffect(() => {
    statsHandler
      .getUserDataFromJson()
      .then(() => {
        updateUserStats();
        updateUserItems();
      })
      .catch(() => console.error("Virtual Pet: Error while getting user data"));
    toDefaults();
    triggerSleeping(() => toDefaults());
  }, [statsHandler]);

  useEffect(() => {
    // Add the user actual background or the default one to the mainRef
    getAsset("Backgrounds", userItems.equiped.Backgrounds || "Light Default")
      .then((asset) => {
        if (mainRef.current)
          mainRef.current.style.backgroundImage = `url(${asset})`;
      })
      .catch(() =>
        console.error("Virtual Pet: An error ocurred while loading assets"),
      );
  }, [getAsset, userItems.equiped.Backgrounds]);

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
          animation={animation}
          userLevel={userStats.level}
          userItems={userItems}
          mainRef={mainRef}
          toDefaults={toDefaults}
          triggerSleeping={triggerSleeping}
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
        statsHandler={statsHandler}
        levelUp={levelUp}
        setUserStats={setUserStats}
        animation={animation}
        toDefaults={toDefaults}
        changeAnimation={changeAnimation}
      />
*/}
    </>
  );
}
