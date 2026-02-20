import type { AnimationsHandlerI, PetAnimation } from "src/types";
import animations from "src/jsons/animations.json";

type PetButtonsType = {
  animation: PetAnimation;
  animationsHandler: AnimationsHandlerI;
};

export default function PetButtons({
  animation,
  animationsHandler,
}: PetButtonsType) {
  const activeClassName = "vpet-debug__animations-buttons_active";
  return (
    <div className="vpet-debug__animations-buttons">
      <button
        onClick={() => {
          animationsHandler.toDefaults("next");
        }}
        className={
          animation === animations.stand || animation === animations.walk
            ? activeClassName
            : ""
        }
      >
        Default
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.celebrate);
        }}
        className={animation === animations.celebrate ? activeClassName : ""}
      >
        Celebrate
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.code);
        }}
        className={animation === animations.code ? activeClassName : ""}
      >
        Code
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.sleep);
        }}
        className={animation === animations.sleep ? activeClassName : ""}
      >
        Sleep
      </button>
    </div>
  );
}
