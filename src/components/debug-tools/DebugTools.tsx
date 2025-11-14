import UserInfo from "src/components/debug-tools/UserInfo";
import PetButtons from "src/components/debug-tools/PetButtons";
import ExpButtons from "src/components/debug-tools/ExpButtons";
import { AnimationsHandler, UserData, UserItems, UserStats } from "src/types";
import StatsHandler from "src/utils/statsHandler";

interface DebugToolsI {
  userData: UserData;
  userStats: UserStats;
  userItems: UserItems;
  animationsHandler: AnimationsHandler;
  statsHandler: StatsHandler;
  levelUp: (newUserStats: UserStats) => void;
	setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export function DebugTools({userData, userStats, userItems, animationsHandler,statsHandler, levelUp, setUserStats}:DebugToolsI) {

  return (
    <div className="debug-tools">
      <h1>Change Pet Animation</h1>
      <PetButtons
        animation={animationsHandler.animation}
        animationsHandler={animationsHandler}
      />
      <ExpButtons
        petChangeExp={statsHandler.petChangeExp}
        userStats={userStats}
        levelUp={levelUp}
        setUserStats={setUserStats}
      />
      <UserInfo
        userData={userData}
        userStats={userStats}
        userItems={userItems}
      />
    </div>
  )
}
