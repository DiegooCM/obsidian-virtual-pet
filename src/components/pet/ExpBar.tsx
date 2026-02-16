type ExpBar = {
  exp: number;
  expGoal: number;
};

export default function Expbar({ exp, expGoal }: ExpBar) {
  return (
    <div className="vpet-exp">
      <p className="vpet-exp__info">
        Exp: {exp} / {expGoal}
      </p>
      <div className="vpet-exp__bar">
        <div
          className="vpet-exp__bar-quantity"
          style={{ width: `${(exp / expGoal) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
