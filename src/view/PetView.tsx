import * as React from "react";
import { AnimationsHandlerT, PetViewT, UserData, UserStats } from "src/types";
import { Pet } from "./Pet";

interface Props {
	view: PetViewT;
}

interface State {
	userData: UserData;
	userStats: UserStats;
}

export class PetView extends React.Component<Props, State> {
	private animationsHandler: AnimationsHandlerT;
	constructor(props: Props) {
		super(props);

		this.state = {
			userData: {
				filesCount: -1,
				actualFileWordCount: -1,
				isActualFile: true,
			},
			userStats: {
				exp: 0,
				expGoal: 10,
				level: 0,
			},
		};
	}

	handlePetReady = (animationsHandler: AnimationsHandlerT) => {
		this.animationsHandler = animationsHandler;
		animationsHandler.handleSleeping();
	};
	// It calculate and update the userStats
	setUserData(updatedUserData: UserData) {
		// Checks if the updatedUserData belongs to the same file that the user is making changes

		if (updatedUserData.isActualFile) {
			this.animationsHandler.handleSleeping();
			const updatedUserStats = this.calcUserStats(updatedUserData);

			this.setState({
				userStats: updatedUserStats,
			});
		}
		this.setState({
			userData: updatedUserData,
		});
	}

	// In statsHandler?
	calcUserStats(updatedUserData: UserData): UserStats {
		if (
			Object.values(updatedUserData).includes(-1) ||
			Object.values(this.state.userData).includes(-1)
		) {
			return this.state.userStats;
		}

		// Experience calculation
		const filesDif =
			updatedUserData.filesCount - this.state.userData.filesCount;
		const fileWordsDif =
			updatedUserData.actualFileWordCount -
			this.state.userData.actualFileWordCount;

		const newExp = filesDif * 50 + fileWordsDif + this.state.userStats.exp;

		// Checks if the user reach the exp goal
		if (newExp >= this.state.userStats.expGoal) {
			const newExpGoal = Math.floor(this.state.userStats.expGoal * 1.5);
			const newLevel = this.state.userStats.level + 1;
			this.animationsHandler.handleAnimation("celebrate", 2150);
			return {
				exp: 0,
				expGoal: newExpGoal,
				level: newLevel,
			};
		}

		return {
			...this.state.userStats,
			exp: newExp < 0 ? 0 : newExp, // The exp cannot be lower than 0
		};
	}

	ExpBar = () => {
		const [expPercentage, setExpPercentage] = React.useState(0);

		React.useEffect(() => {
			setExpPercentage(
				100 -
					(this.state.userStats.exp / this.state.userStats.expGoal) *
						100
			);
		}, [this.state.userStats.exp]);

		return (
			<div id="exp-bar-container">
				<p id="exp-info">
					{this.state.userStats.exp} / {this.state.userStats.expGoal}
				</p>
				<div id="exp-bar-border">
					<div
						id="exp-bar"
						style={{
							right: `${expPercentage}%`,
						}}
					/>
				</div>
			</div>
		);
	};

	userDataNStats = () => {
		return (
			<>
				<div className="actual-Data">
					<h1> Actual Data</h1>
					<p>Files Count: {this.state.userData.filesCount}</p>
					<p>
						Actual File Word Count:
						{this.state.userData.actualFileWordCount}
					</p>
					<p>
						Is Actual File:{" "}
						{this.state.userData.isActualFile ? "true" : "false"}
					</p>
				</div>
				<div className="user-stats">
					<h1> User Stats</h1>
					<p>Exp: {this.state.userStats.exp}</p>
					<p>Exp Goal: {this.state.userStats.expGoal}</p>
					<p>Level: {this.state.userStats.level}</p>
				</div>
			</>
		);
	};

	render() {
		return (
			<>
				<Pet
					view={this.props.view}
					userStats={this.state.userStats}
					onReady={this.handlePetReady}
				/>
				<this.ExpBar />
				<this.userDataNStats />
			</>
		);
	}
}
