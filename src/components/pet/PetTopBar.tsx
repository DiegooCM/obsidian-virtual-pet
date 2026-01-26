import { App } from "obsidian";
import { RefObject, useContext, useEffect, useRef } from "react";
import { AssetsContext } from "src/contexts/AssetsContext";
import { AssetsContextI, UserItems, UserStats } from "src/types";
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
  const { getAsset } = useContext<AssetsContextI>(AssetsContext);

  useEffect(() => {
    // Add the coin asset to the coinRef
    getAsset("Others", "coin").then((asset) => {
      if (coinRef.current) coinRef.current.src = asset;
    });
  }, []);

  return (
    <div className="top-bar">
      <Expbar exp={userStats.exp} expGoal={userStats.expGoal} />
      <div
        className="top-bar-coins"
        onClick={() =>
          new ShopModal(app, getAsset, statsHandler, setUserItems).open()
        }
      >
        <img ref={coinRef} alt="Coin icon" />
        <p className="coins-count">{userStats.coins}</p>
      </div>
    </div>
  );
}
