import type { AnimationsHandlerI, PetAnimation } from "src/types";
import animations from "src/jsons/animations.json";

type PetButtonsType = {
  animation: PetAnimation;
  toDefaults: AnimationsHandlerI["toDefaults"];
  changeAnimation: AnimationsHandlerI["changeAnimation"];
};

export default function PetButtons({
  animation,
  toDefaults,
  changeAnimation,
}: PetButtonsType) {
  const activeClassName = "vpet-debug__animations-buttons_active";
  return (
    <div className="vpet-debug__animations-buttons">
      <button
        onClick={() => {
          toDefaults("next");
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
          changeAnimation(animations.celebrate);
        }}
        className={animation === animations.celebrate ? activeClassName : ""}
      >
        Celebrate
      </button>
      <button
        onClick={() => {
          changeAnimation(animations.code);
        }}
        className={animation === animations.code ? activeClassName : ""}
      >
        Code
      </button>
      <button
        onClick={() => {
          changeAnimation(animations.sleep);
        }}
        className={animation === animations.sleep ? activeClassName : ""}
      >
        Sleep
      </button>
    </div>
  );
}
