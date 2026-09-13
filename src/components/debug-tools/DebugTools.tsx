import UserInfo from "src/components/debug-tools/UserInfo";
import PetButtons from "src/components/debug-tools/PetButtons";
import ExpButtons from "src/components/debug-tools/ExpButtons";
import { UserItems } from "src/types";
import StatsHandler from "src/utils/statsHandler";
import { AnimationsHandlerI } from "src/hooks/useAnimationsHandler";

interface DebugToolsI {
  userItems: UserItems;
  animation: AnimationsHandlerI["animation"];
  toDefaults: AnimationsHandlerI["toDefaults"];
  changeAnimation: AnimationsHandlerI["changeAnimation"];
  statsHandler: StatsHandler;
}

export function DebugTools({
  userItems,
  animation,
  toDefaults,
  changeAnimation,
  statsHandler,
}: DebugToolsI) {
  return (
    <div className="vpet-debug">
      <h1>Change Pet Animation</h1>
      <PetButtons
        animation={animation}
        toDefaults={toDefaults}
        changeAnimation={changeAnimation}
      />
      <ExpButtons statsHandler={statsHandler} />
      <UserInfo statsHandler={statsHandler} userItems={userItems} />
    </div>
  );
}
