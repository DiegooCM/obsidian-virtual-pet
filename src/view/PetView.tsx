import { View } from "obsidian";
import * as React from "react";
// import { useEffect } from "react";
import { UserData } from "src/types";
import StatsHandler from "src/stats/StatsHandler";

interface Props {
	view: View & { statsHandler: StatsHandler };
}

interface State {
	initialUserData: UserData;
	userData: UserData;
}

export class PetView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			initialUserData: {
				filesCount: -1,
				actualFileWordCount: -1,
			},
			userData: {
				filesCount: -1,
				actualFileWordCount: -1,
			},
		};
	}

	componentDidMount(): void {}

	setUserData(newUserData: UserData) {
		this.setState({
			userData: newUserData,
		});
	}

	setInitialUserData(newUserData: UserData) {
		this.setState({
			initialUserData: newUserData,
			userData: newUserData,
		});
	}

	render() {
		return (
			<>
				<div className="intial-stats">
					<h1> Initial Stats</h1>
					<p>Files Count: {this.state.initialUserData.filesCount}</p>
					<p>
						Actual File Word Count:
						{this.state.initialUserData.actualFileWordCount}
					</p>
				</div>
				<div className="actual-stats">
					<h1> Actual Stats</h1>

					<p>Files Count: {this.state.userData.filesCount}</p>
					<p>
						Actual File Word Count:{" "}
						{this.state.userData.actualFileWordCount}
					</p>
				</div>
			</>
		);
	}
}
