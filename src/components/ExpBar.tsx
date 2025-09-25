type ExpBar = {
	exp: number;
	expGoal: number;
};

export default function Expbar({ exp, expGoal }: ExpBar) {
	return (
		<div className="exp-bar-container">
			<p className="exp-info">
				Experience: {exp} / {expGoal}
			</p>
			<div className="exp-bar">
				<div
					className="exp-quantity"
					style={{ width: `${(exp / expGoal) * 100}%` }}
				></div>
			</div>
		</div>
	);
}
