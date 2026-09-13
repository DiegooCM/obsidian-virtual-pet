import { useSyncExternalStore } from "react";
import { UserItems, UserStats } from "src/types";
import StatsHandler from "src/utils/statsHandler";

interface UserInfo {
  userItems: UserItems;
  statsHandler: StatsHandler;
}

export default function UserInfo({ statsHandler, userItems }: UserInfo) {
  const userStats = useSyncExternalStore<UserStats>(
    statsHandler.subscribeUserStats,
    statsHandler.getUserStats,
  );
  const userLevel = useSyncExternalStore(
    statsHandler.subscribeUserLevel,
    statsHandler.getUserLevel,
  );
  return (
    <>
      <div>
        <h1>User Stats</h1>
        <p>Exp: {userStats.exp}</p>
        <p>Exp Goal: {userStats.expGoal}</p>
        <p>Level:{userLevel}</p>
        <p>Coins: {userStats.coins}</p>
      </div>
      <div>
        <h2>Equiped</h2>
        <p>Background: {userItems.equiped.Backgrounds}</p>
        <p>Accesory: {userItems.equiped.Accessories}</p>
        <h2>Obtained</h2>
        <p>Backgrounds: {userItems.obtained.Backgrounds}</p>
        <p>Accessory: {userItems.obtained.Accessories}</p>
      </div>
    </>
  );
}
