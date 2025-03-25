import { View } from "obsidian";
import * as React from "react";
// import { useEffect } from "react";
import { UserStats } from "src/types";
import StatsHandler from "src/stats/StatsHandler";

interface Props {
	view: View & { statsHandler: StatsHandler };
	initialUserStats: UserStats;
}

interface State {
	userStats: UserStats;
}

export class PetView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			userStats: { filesCount: 0, actualFileWordCount: 0 },
		};
	}

	componentDidMount(): void {
		this.setState({
			userStats: this.props.initialUserStats,
		});
	}

	setUserStats(newUserStats: UserStats) {
		this.setState({
			userStats: newUserStats,
		});
	}

	render() {
		return (
			<>
				<div className="intial-stats">
					<h1> Initial Stats</h1>
					<p>Files Count: {this.props.initialUserStats.filesCount}</p>
					<p>
						Actual File Word Count:
						{this.props.initialUserStats.actualFileWordCount}
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
