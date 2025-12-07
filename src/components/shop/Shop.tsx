import { useState } from "react";
import { defaultFilters } from "src/constants";
import StatsHandler from "src/utils/statsHandler";
import { GetAssetT, UserItems, UserStats } from "src/types";
import { ShopFilter } from "./ShopFilter";
import { ShopItems } from "./ShopItems";
import { filterItems } from "src/utils/shopUtils";

interface ShopI {
  userItems: UserItems;
  userStats: UserStats;
  statsHandler: StatsHandler;
  getAsset: GetAssetT;
}

export function Shop({userItems, userStats, statsHandler, getAsset}: ShopI) {
  const [filters, setFilters] = useState(defaultFilters)

  const itemsJsonFiltered = filterItems(filters, userItems);

  return (
    <>
      <ShopFilter filters={filters} setFilters={setFilters}/>
      <ShopItems userItems={userItems} userStats={userStats} statsHandler={statsHandler} getAsset={getAsset} items={itemsJsonFiltered} />
    </>
  )
}

