import { View } from "obsidian";
import * as React from "react";
// import { useEffect } from "react";
import { UserStats } from "src/stats/Stats";
import StatsHandler from "src/stats/StatsHandler";

interface Props {
	view: View & { statsHandler: StatsHandler };
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
		// const initialStats = this.props.app.getUserStats();
		const initialStats: UserStats =
			this.props.view.statsHandler.getAllUserStats();

		this.setState({
			userStats: initialStats,
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
				<p>Files Count: {this.state.userStats.filesCount}</p>
				<p>
					Actual File Word Count:{" "}
					{this.state.userStats.actualFileWordCount}
				</p>
			</>
		);
	}
}
