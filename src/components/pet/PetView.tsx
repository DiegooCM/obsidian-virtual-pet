import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { App } from "obsidian";
import StatsHandler from "src/utils/statsHandler";
import { Pet } from "src/components/pet/Pet";
import { PetViewRef, UserActions } from "src/types";
import { useAnimationsHandler } from "src/hooks/useAnimationsHandler";
import { useAssets } from "src/contexts/AssetsContext";
import { PetTopBar } from "./PetTopBar";
import animations from "src/jsons/animations.json";
import animationsTimes from "src/jsons/animationsTimes.json";

interface PetViewI {
  statsHandler: StatsHandler;
  app: App;
}

export const PetView = forwardRef<PetViewRef, PetViewI>(
  function PetView(props, ref) {
    const { statsHandler, app } = { ...props };

    const [isPluginActive, setIsPluginActive] = useState<boolean>(false);
    const [userItems, setUserItems] = useState(statsHandler.getUserItems());
    const mainRef: RefObject<HTMLDivElement> | null = useRef(null);
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
              return;
            }
          });
        },
      };
    });

    // Updates de stats and items, and set to default the animations
    useEffect(() => {
      toDefaults();
      triggerSleeping(() => toDefaults());
    }, []);

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
          />
          <Pet
            isPluginActive={isPluginActive}
            userItems={userItems}
            mainRef={mainRef}
            statsHandler={statsHandler}
            animation={animation}
            toDefaults={toDefaults}
            triggerSleeping={triggerSleeping}
            changeAnimation={changeAnimation}
          />
        </div>
        {/**
        <DebugTools
          userItems={userItems}
          statsHandler={statsHandler}
          animation={animation}
          toDefaults={toDefaults}
          changeAnimation={changeAnimation}
        />
         */}
      </>
    );
  },
);
