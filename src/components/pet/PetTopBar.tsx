import { App } from "obsidian";
import { RefObject, useEffect, useRef } from "react";
import { useAssets } from "src/contexts/AssetsContext";
import { UserItems, UserStats } from "src/types";
import { ShopModal } from "../shop/ShopModal";
import StatsHandler from "src/utils/statsHandler";
import Expbar from "./ExpBar";

type PetTopBarT = {
  app: App;
  statsHandler: StatsHandler;
  setUserItems: React.Dispatch<React.SetStateAction<UserItems>>;
  userStats: UserStats;
};

export function PetTopBar({
  app,
  statsHandler,
  setUserItems,
  userStats,
}: PetTopBarT) {
  const coinRef: RefObject<HTMLImageElement | null> = useRef(null);
  const { getAsset } = useAssets();

  useEffect(() => {
    // Add the coin asset to the coinRef
    getAsset("Others", "coin")
      .then((asset) => {
        if (coinRef.current) coinRef.current.src = asset;
      })
      .catch(() =>
        console.error("Virtual Pet: An error ocurred while loading assets"),
      );
  }, [getAsset]);

  return (
    <div className="vpet-top-bar">
      <Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
      <div
        className="vpet-top-bar-coins"
        onClick={() =>
          new ShopModal(app, getAsset, statsHandler, setUserItems).open()
        }
      >
        <img ref={coinRef} alt="Coin icon" />
        <span className="vpet-top-bar-coins__count">{userStats.coins}</span>
      </div>
    </div>
  );
}
