import { View } from "obsidian";
import * as React from "react";
// import { useEffect } from "react";
import { UserStats } from "src/types";
import StatsHandler from "src/stats/StatsHandler";

interface Props {
	view: View & { statsHandler: StatsHandler };
}

interface State {
	initialUserStats: UserStats;
	userStats: UserStats;
}

export class PetView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			initialUserStats: {
				filesCount: -1,
				actualFileWordCount: -1,
			},
			userStats: {
				filesCount: -1,
				actualFileWordCount: -1,
			},
		};
	}

	componentDidMount(): void {}

	setUserStats(newUserStats: UserStats) {
		this.setState({
			userStats: newUserStats,
		});
	}

	setInitialUserStats(newUserStats: UserStats) {
		this.setState({
			initialUserStats: newUserStats,
			userStats: newUserStats,
		});
	}

	render() {
		return (
			<>
				<div className="intial-stats">
					<h1> Initial Stats</h1>
					<p>Files Count: {this.state.initialUserStats.filesCount}</p>
					<p>
						Actual File Word Count:
						{this.state.initialUserStats.actualFileWordCount}
					</p>
				</div>
				<div className="actual-stats">
					<h1> Actual Stats</h1>

					<p>Files Count: {this.state.userStats.filesCount}</p>
					<p>
						Actual File Word Count:{" "}
						{this.state.userStats.actualFileWordCount}
					</p>
				</div>
			</>
		);
	}
}
