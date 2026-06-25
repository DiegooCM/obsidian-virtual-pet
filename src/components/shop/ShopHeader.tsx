import { useEffect, useRef } from "react";
import { GetAssetT, UserStats } from "src/types";

interface ShopHeaderI {
  getAsset: GetAssetT;
  userStats: UserStats;
}

export function ShopHeader({ userStats, getAsset }: ShopHeaderI) {
  const coinIconRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    getAsset("Others", "coin")
      .then((asset) => {
        if (coinIconRef.current) coinIconRef.current.src = asset;
      })
      .catch(() =>
        console.error("Virtual Pet: An error ocurred while loading assets"),
      );
  }, [getAsset]);

  return (
    <div className="vpet-shop-header">
      <h1>Shop</h1>
      <div className="vpet-shop-header__coins">
        <img ref={coinIconRef} alt="Coin icon" />
        <span>{userStats.coins.toString()}</span>
      </div>
    </div>
  );
}
