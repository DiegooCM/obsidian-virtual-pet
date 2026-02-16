import { UserItems, UserStats } from "src/types";

interface UserInfo {
  userStats: UserStats;
  userItems: UserItems;
}

export default function UserInfo({ userStats, userItems }: UserInfo) {
  return (
    <>
      <div className="user-stats">
        <h1>User Stats</h1>
        <p>Exp: {userStats.exp}</p>
        <p>Exp Goal: {userStats.expGoal}</p>
        <p>Level:{userStats.level}</p>
        <p>Coins: {userStats.coins}</p>
      </div>
      <div className="div user-items">
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
