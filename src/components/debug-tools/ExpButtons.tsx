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
  const quantityRef = useRef(0);
  const toSumRef = useRef(false);
  const isButtonDownRef = useRef(false);

  const changeExp = useCallback(() => {
    quantityRef.current = toSumRef.current
      ? quantityRef.current + 5
      : quantityRef.current - 5;

    const newExp = userStats.exp + quantityRef.current;
    // Level upgrade
    if (newExp >= userStats.expGoal) {
      levelUp({ ...userStats, exp: newExp });
    }
    // Not level upgrade
    else {
      const newUserStats = petChangeExp(newExp <= 0 ? 0 : newExp);
      setUserStats(newUserStats);
    }
  }, [userStats, levelUp, petChangeExp, setUserStats]);

  const onButtonPress = useCallback(() => {
    if (!isButtonDownRef.current) return;
    changeExp();
  }, [changeExp]);

  useEffect(() => {
    const btnTimeout = activeWindow.setTimeout(() => onButtonPress(), 100);

    return () => {
      activeWindow.clearTimeout(btnTimeout);
    };
  }, [userStats.exp, onButtonPress]);

  return (
    <>
      <h1>Change Exp Buttons</h1>
      <div className="vpet-debug__exp-buttons">
        <button
          onMouseDown={() => {
            isButtonDownRef.current = true;
            onButtonPress();
          }}
          onMouseUp={() => {
            quantityRef.current = 0;
            isButtonDownRef.current = false;
          }}
        >
          -
        </button>
        <button
          onMouseDown={() => {
            isButtonDownRef.current = true;
            toSumRef.current = true;
            onButtonPress();
          }}
          onMouseUp={() => {
            quantityRef.current = 0;
            toSumRef.current = false;
            isButtonDownRef.current = false;
          }}
        >
          +
        </button>
      </div>
    </>
  );
}
