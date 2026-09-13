import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { UserStats } from "src/types";
import StatsHandler from "src/utils/statsHandler";

interface Props {
  statsHandler: StatsHandler;
}

export default function ExpButtons({ statsHandler }: Props) {
  const userStats = useSyncExternalStore<UserStats>(
    statsHandler.subscribeUserStats,
    statsHandler.getUserStats,
  );
  const quantityRef = useRef(0);
  const toSumRef = useRef(false);
  const isButtonDownRef = useRef(false);

  const changeExp = useCallback(() => {
    quantityRef.current = toSumRef.current
      ? quantityRef.current + 5
      : quantityRef.current - 5;

    statsHandler.addUserExp(quantityRef.current);
  }, [statsHandler]);

  const onButtonPress = useCallback(() => {
    if (!isButtonDownRef.current) return;
    changeExp();
  }, [changeExp]);

  useEffect(() => {
    const btnTimeout = window.setTimeout(() => onButtonPress(), 100);

    return () => {
      window.clearTimeout(btnTimeout);
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
