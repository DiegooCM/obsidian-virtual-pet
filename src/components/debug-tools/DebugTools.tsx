import UserInfo from "src/components/debug-tools/UserInfo";
import PetButtons from "src/components/debug-tools/PetButtons";
import ExpButtons from "src/components/debug-tools/ExpButtons";
import { UserItems, UserStats } from "src/types";
import StatsHandler from "src/utils/statsHandler";
import { AnimationsHandlerI } from "src/hooks/useAnimationsHandler";

interface DebugToolsI {
  userStats: UserStats;
  userItems: UserItems;
  animation: AnimationsHandlerI["animation"];
  toDefaults: AnimationsHandlerI["toDefaults"];
  changeAnimation: AnimationsHandlerI["changeAnimation"];
  statsHandler: StatsHandler;
  levelUp: (newUserStats: UserStats) => void;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function DebugTools({
  userStats,
  userItems,
  animation,
  toDefaults,
  changeAnimation,
  statsHandler,
  levelUp,
  setUserStats,
}: DebugToolsI) {
  return (
    <div className="vpet-debug">
      <h1>Change Pet Animation</h1>
      <PetButtons
        animation={animation}
        toDefaults={toDefaults}
        changeAnimation={changeAnimation}
      />
      <ExpButtons
        petChangeExp={statsHandler.petChangeExp}
        userStats={userStats}
        levelUp={levelUp}
        setUserStats={setUserStats}
      />
      <UserInfo userStats={userStats} userItems={userItems} />
    </div>
  );
}
