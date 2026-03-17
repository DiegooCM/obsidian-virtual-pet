import { useCallback, useEffect, useRef } from "react";
import { UserStats } from "src/types";

interface Props {
  petChangeExp: (newAddExp: number) => UserStats;
  userStats: UserStats;
  levelUp: (newUserStats: UserStats) => void;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export default function ExpButtons({
  petChangeExp,
  userStats,
  levelUp,
  setUserStats,
}: Props) {
  const quantity = useRef(0);
  const toSum = useRef(false);
  const isButtonDown = useRef(false);

  const changeExp = useCallback(() => {
    toSum.current ? (quantity.current += 5) : (quantity.current -= 5);

    const newExp = userStats.exp + quantity.current;
    // Level upgrade
    if (newExp >= userStats.expGoal) {
      levelUp({ ...userStats, exp: newExp });
    }
    // Not level upgrade
    else {
      const newUserStats = petChangeExp(newExp <= 0 ? 0 : newExp);
      setUserStats(newUserStats);
    }
  }, [userStats.exp, levelUp]);

  const onButtonPress = useCallback(() => {
    if (!isButtonDown.current) return;
    changeExp();
  }, [changeExp]);

  useEffect(() => {
    setTimeout(() => onButtonPress(), 100);
  }, [userStats.exp, onButtonPress]);

  return (
    <>
      <h1>Change Exp Buttons</h1>
      <div className="vpet-debug__exp-buttons">
        <button
          onMouseDown={() => {
            isButtonDown.current = true;
            onButtonPress();
          }}
          onMouseUp={() => {
            quantity.current = 0;
            isButtonDown.current = false;
          }}
        >
          -
        </button>
        <button
          onMouseDown={() => {
            isButtonDown.current = true;
            toSum.current = true;
            onButtonPress();
          }}
          onMouseUp={() => {
            quantity.current = 0;
            toSum.current = false;
            isButtonDown.current = false;
          }}
        >
          +
        </button>
      </div>
    </>
  );
}
