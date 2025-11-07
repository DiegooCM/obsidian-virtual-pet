import { App } from "obsidian";
import { useState } from "react";
import { defaultFilters } from "src/constants";
import StatsHandler from "src/utils/statsHandler";
import { UserItems, UserStats } from "src/types";
import { ShopFilter } from "./ShopFilter";
import { ShopItems } from "./ShopItems";
import { filterItems } from "src/utils/shopUtils";

interface ShopI {
  userItems: UserItems;
  setUserItems: (value: React.SetStateAction<UserItems>) => void;
  userStats: UserStats;
  statsHandler: StatsHandler;
  app: App;
}

export function Shop({userItems, setUserItems, userStats, statsHandler, app}: ShopI) {
  const [filters, setFilters] = useState(defaultFilters)
  const [shopUserItems, setShopUserItems] = useState(userItems)

  const itemsJsonFiltered = filterItems(filters, userItems);

  return (
    <>
      <ShopFilter filters={filters} setFilters={setFilters}/>
      <ShopItems userItems={shopUserItems} setUserItems={setShopUserItems} userStats={userStats} statsHandler={statsHandler} app={app} items={itemsJsonFiltered} />
    </>
  )
}

