import type { AnimationsHandlerI, PetAnimation } from "src/types";
import animations from "src/animations.json";

type PetButtonsType = {
  animation: PetAnimation;
  animationsHandler: AnimationsHandlerI;
};

export default function PetButtons({
  animation,
  animationsHandler,
}: PetButtonsType) {
  return (
    <div className="pet-buttons">
      <button
        onClick={() => {
          animationsHandler.toDefaults("next");
        }}
        className={
          animation === animations.stand || animation === animations.walk
            ? "active"
            : ""
        }
      >
        Default
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.celebrate);
        }}
        className={animation === animations.celebrate ? "active" : ""}
      >
        Celebrate
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.code);
        }}
        className={animation === animations.code ? "active" : ""}
      >
        Code
      </button>
      <button
        onClick={() => {
          animationsHandler.changeAnimation(animations.sleep);
        }}
        className={animation === animations.sleep ? "active" : ""}
      >
        Sleep
      </button>
    </div>
  );
}
