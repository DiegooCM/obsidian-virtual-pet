import * as React from "react";
import { PetViewT, UserData, UserStats } from "src/types";
import { Pet } from "./Pet";

interface Props {
	view: PetViewT;
}

interface State {
	userData: UserData;
	userStats: UserStats;
}

export class PetView extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			userData: {
				filesCount: -1,
				actualFileWordCount: -1,
			},
			userStats: {
				exp: 0,
				expGoal: 10,
				level: 0,
			},
		};
	}

	// Cambiar el nombre a handleChange o algo del estilo
	setUserData(updatedUserData: UserData) {
		const updatedUserStats = this.calcUserStats(updatedUserData);

		this.setState({
			userData: updatedUserData,
			userStats: updatedUserStats,
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

		// console.log("newExp: ", newExp);
		// console.log("filesWordDif: ", fileWordsDif);

		// Checks if the user reach the exp goal
		if (newExp >= this.state.userStats.expGoal) {
			const newExpGoal = Math.floor(this.state.userStats.expGoal * 1.5);
			const newLevel = this.state.userStats.level + 1;
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
		const bgPath = React.useMemo(
			() =>
				this.props.view.app.vault.adapter.getResourcePath(
					"./.obsidian/plugins/obsidian-virtual-pet/images/exp-bar-bg.png"
				),
			[]
		);
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
				<p id="exp-info"></p>
				<div id="exp-bar-border">
					<div
						id="exp-bar"
						style={{
							backgroundImage: `url(${bgPath})`,
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
						Actual File Word Count:{" "}
						{this.state.userData.actualFileWordCount}
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
				<Pet view={this.props.view} />
				<this.ExpBar />
				<this.userDataNStats />
			</>
		);
	}
}
